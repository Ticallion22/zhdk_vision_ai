import axios from 'axios';
import React from 'react';
import {Image} from './image';
import './app.css';
import {Button, Cell, Grid} from "react-foundation";
import 'foundation-sites/dist/css/foundation.min.css';
import ReactPaginate from 'react-paginate';
import {BadgeColors as Colors} from "react-foundation/lib/enums";

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            annotations: {},
            all_images: [],
            image: null,
            image_filename: '',
            image_preview: null,
            image_id: '',
            display_admin: 'none'
        }

        this.deleteImage = this.deleteImage.bind(this)
        this.getAllImages = this.getAllImages.bind(this)
        this.hide_admin = this.hide_admin.bind(this)
        this.login = this.login.bind(this)
        this.onPageChange = this.onPageChange.bind(this)
        this.setImageFromStorage = this.setImageFromStorage.bind(this)
        this.setImageFromUploaded = this.setImageFromUploaded.bind(this)
        this.upload_image = this.upload_image.bind(this)
    }

    componentDidMount() {
        this.getAllImages()
    }

    deleteImage() {
        if (this.state.image_id) {
            axios.delete('/image', {params: {image_id: this.state.image_id}})
                .then(response => {
                    console.log(response)
                    this.getAllImages()
                })
                .catch(err => console.log(err))
        }
    }

    getAllImages() {
        axios.get('/images')
            .then(response => response.data)
            .then(data => {this.setState({
                all_images: data.images
            })})
            .catch(err => alert(err.response.status + ': ' + err.response.data));
    }

    hide_admin() {
        this.setState({display_admin: 'none'})
    }

    login() {
        axios.get('/login')
            .then(response => {
                console.log('user authenticated, displaying browsing stuff..')
                this.setState({display_admin: 'block'})
            })
    }

    onPageChange(data) {
        let selected = data.selected

        if (this.state.all_images.length !== 0) {
            let image = this.state.all_images[selected]

            const image_id = image.image_id
            const image_filename = image.image_filename
            this.setImageFromStorage(image_id, image_filename)
        }
    }

    setImageFromStorage(image_id, image_filename) {
        axios.get('/image', {
            params: {image_id: image_id, image_filename: image_filename},
            responseType: 'blob'
        })
            .then(response => {
                let blob = new Blob([response.data], {type: response.headers['content-type']})
                this.setState({
                    image_preview: URL.createObjectURL(blob),
                    image: null,
                    image_filename: image_filename,
                    image_id: image_id
                })
            })

        axios.get('/annotation', {params: {image_id: image_id}})
            .then(response => response.data)
            .then(data => this.setState({annotations: JSON.parse(data.annotation)}))
    }

    setImageFromUploaded(event) {
        if (event.target.files && event.target.files[0]) {
            this.setState({
                image: event.target.files[0],
                image_filename: event.target.files[0].name,
                image_preview: URL.createObjectURL(event.target.files[0]),
                image_id: ''
            })
        }
    }

    upload_image() {
        if (this.state.image) {
            const data = new FormData();
            data.append('image', this.state.image);

            axios.post('/image', data, {headers: { 'content-type': this.state.image.type }})
                .then(response => response.data)
                .then(data => {

                    axios.post('/annotation', {'image_id': data.image_id, 'filename': data.filename})
                        .then(response => response.data)
                        .then(data => {
                            this.setState({annotations: JSON.parse(data.annotation)})
                            this.getAllImages() // TODO improve
                        })
                        .catch(err => console.log(err));

                })
                .catch(err => console.log(err));
        }
    }

    render() {
        return (
            <Grid className="grid-container">
                <Cell>
                    <Image
                        annotations={this.state.annotations}
                        image_name={this.state.image_filename}
                        preview={this.state.image_preview}
                        deleteImage={this.deleteImage}
                        display_admin={this.state.display_admin}
                    />

                    <div style={{display: this.state.display_admin}}>
                        <ReactPaginate
                            pageCount={this.state.all_images.length}
                            pageRangeDisplayed={5}
                            marginPagesDisplayed={2}
                            breakClasName={'ellipsis'}
                            onPageChange={this.onPageChange}
                            disableInitialCallback={false}
                            containerClassName={'pagination'}
                            activeClassName={'current'}
                            previousClassName={'pagination-previous'}
                            nextClassName={'pagination-next'}
                            disabledClassName={'disabled'}
                        />
                    </div>
                </Cell>

                <Cell>
                    <h1>Choose an image</h1>
                    <input type='file' onChange={this.setImageFromUploaded} />
                    <Button color={Colors.PRIMARY} onClick={this.upload_image}>Upload</Button>
                    <Button color={Colors.SUCCESS} onClick={this.login}>Browse</Button>
                    <Button color={Colors.ALERT} onClick={this.hide_admin} style={{display: this.state.display_admin}}>Hide</Button>
                </Cell>
            </Grid>
        )
    }
}