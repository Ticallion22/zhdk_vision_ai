import axios from 'axios';
import React from 'react';
import {Image} from './image';
import './app.css';
import {Cell, Grid} from "react-foundation";
import 'foundation-sites/dist/css/foundation.min.css';
import ReactPaginate from 'react-paginate';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            annotations: {},
            all_images: [],
            image: null,
            image_filename: '',
            image_preview: null,
            image_id: ''
        }

        this.deleteImage = this.deleteImage.bind(this)
        this.getAllImages = this.getAllImages.bind(this)
        this.onPageChange = this.onPageChange.bind(this)
        this.setImageFromStorage = this.setImageFromStorage.bind(this)
        this.setImageFromUploaded = this.setImageFromUploaded.bind(this)
        this.submit = this.submit.bind(this)
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
                    this.onPageChange({selected: 1})
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

    submit(event) {
        event.preventDefault()

        if (this.state.image) {
            const data = new FormData();
            const image = this.state.image;

            data.append('image', image);
            axios.post('/image', data, {headers: { 'content-type': image.type }})
                .then(response => response.data)
                .then(data => {
                    this.setState({annotations: JSON.parse(data.annotations)})
                    this.getAllImages()
                })
                .catch(err => alert(err.response.status + ': ' + err.response.data));
        }
    }

    render() {
        return (
            <Grid className="grid-container">
                <Cell>
                    <Image annotations={this.state.annotations} image_name={this.state.image_filename} preview={this.state.image_preview} deleteImage={this.deleteImage}/>
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
                </Cell>

                <Cell>
                    <form onSubmit={this.submit}>
                        <h1>Choose an image</h1>
                        <input type='file' onChange={this.setImageFromUploaded} />
                        <input type='submit' value='Annotate'/>
                    </form>
                </Cell>
            </Grid>
        )
    }
}