import axios from 'axios';
import React from 'react';
import {Image} from './image';
import './app.css';
import 'foundation-sites/dist/css/foundation.min.css';
import ReactPaginate from 'react-paginate';
import searchIcon from './asset/search.png';
import cameraIcon from './asset/camera.png';
import menuIcon from './asset/menu.png';

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
            display_admin: 'none',
            current_page: -1
        }

        this.deleteImage = this.deleteImage.bind(this)
        this.getAllImages = this.getAllImages.bind(this)
        this.hide_admin = this.hide_admin.bind(this)
        this.login = this.login.bind(this)
        this.onPageChange = this.onPageChange.bind(this)
        this.setImageFromStorage = this.setImageFromStorage.bind(this)
        this.setImageFromUploaded = this.setImageFromUploaded.bind(this)
        this.upload_image = this.upload_image.bind(this)

        this.inputRef = React.createRef()
    }

    // TODO function for init state and always reset when necessary
    // TODO upload button disabled if no image selected
    // TODO images should have fixed order, after upload show the one uploaded, not just any
    deleteImage() {
        if (this.state.image_id) {
            axios.delete('/api/image', {params: {image_id: this.state.image_id}})
                .then(response => {
                    this.getAllImages()
                })
                .catch(err => console.log(err))
        }
    }

    getAllImages() {
        axios.get('/api/images')
            .then(response => response.data)
            .then(data => {
                this.setState({all_images: data.images})
                let selected
                if (this.state.current_page >= 1) selected = this.state.current_page - 1
                else selected = 0
                this.onPageChange({selected: selected})
            })
            .catch(err => alert(err.response.status + ': ' + err.response.data));
    }

    hide_admin() {
        this.setState({display_admin: 'none'})
    }

    login() {
        axios.get('/api/login')
            .then(response => {
                this.setState({display_admin: 'block'})
                this.getAllImages()
            })
    }

    onPageChange(data) {
        let selected = data.selected
        let image = this.state.all_images[selected]

        const image_id = image.image_id
        const image_filename = image.image_filename
        this.setImageFromStorage(image_id, image_filename)
        this.setState({current_page: selected})
    }

    setImageFromStorage(image_id, image_filename) {
        axios.get('/api/image', {
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

        axios.get('/api/annotation', {params: {image_id: image_id}})
            .then(response => response.data)
            .then(data => this.setState({annotations: JSON.parse(data.annotation)}))
    }

    setImageFromUploaded(event) {
        if (event.target.files && event.target.files[0]) {
            this.setState({
                annotations: {},
                image: event.target.files[0],
                image_filename: event.target.files[0].name,
                image_preview: URL.createObjectURL(event.target.files[0]),
                image_id: '',
                current_page: -1
            })
        }
    }

    upload_image() {
        if (this.state.image) {
            const data = new FormData();
            data.append('image', this.state.image);
            axios.post('/api/image', data, {headers: { 'content-type': this.state.image.type }})
                .then(response => response.data)
                .then(data => {
                    axios.post('/api/annotation', {'image_id': data.image_id, 'filename': data.filename})
                        .then(response => response.data)
                        .then(data => {
                            this.setState({annotations: JSON.parse(data.annotation)})
                            if (this.state.display_admin === 'block') this.getAllImages()
                        })
                        .catch(err => console.log(err));

                })
                .catch(err => console.log(err));
            }
    }

    render() {
        return (
           <div>
                   <div className="nav">
                     <div className="icon square">
                       <a href="#"><img alt="contact us" src={menuIcon}/></a>
                     </div>
                     <div className="icon round">
                       <a className="z-icon" href="https://www.zhdk.ch/">Z</a>
                     </div>
                   </div>


                   <div className="grid-top">
                     <div className="logo">
                       <span className="text blue">W</span>
                       <span className="text red">h</span>
                       <span className="text yellow">o</span>
                       &ensp;
                       <span className="text blue">A</span>
                       <span className="text green">r</span>
                       <span className="text red">e</span>
                       &ensp;
                       <span className="text yellow">Y</span>
                       <span className="text green">o</span>
                       <span className="text red">u</span>
                       <span className="text blue">?</span>

                     </div>
                     <div className="rectangle">
                       <img className="file search" src={searchIcon} />
                       <div className="file choose">
                         <a onClick={() => this.inputRef.current?.click()}>
                           <div class="portrait">Upload your portrait here</div>
                         </a>
                         <input className="file-btn" type='file' onChange={this.setImageFromUploaded} ref={this.inputRef} style={{display: 'none'}}/>
                       </div>
                       <div clasNames="file text">
                       </div>
                       <a className="file-upload" onClick={this.upload_image}>
                        <img className="file camera" src={cameraIcon} />
                       </a>

                    </div>
                  </div>


                  <div className="grid-bottom">

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
                            onPageChange={this.onPageChange}
                            forcePage={this.state.current_page}
                            containerClassName={'pagination text-center'}
                            activeClassName={'current'}
                            previousClassName={'pagination-previous'}
                            nextClassName={'pagination-next'}
                            disabledClassName={'disabled'}
                            breakClassName={'ellipsis'}
                        />
                      </div>
                 </div> 

                  <div className="footer">
                    <div className="foots about">PROJECT
                      <span className="tooltip hello">
                       <p><strong>Hello,</strong></p>
                       <p>We are Spectacle Spectre and we want to help you help yourselves. </p>
                       <p>Upload an image of yourself, your pet, your avatar, anything that describes you. Our API will then tell you what it can gather about you, whether you know it or not. </p>
                       <p>This is the first stage of an on-going artistic research project. All participation is welcomed.</p>
                      </span>
                    </div>
                    <div className="foots us">ABOUT
                      <span className="tooltip spec">
                       <p><strong>Spectacle Spectre</strong></p>
                       <p>Yumna Al-Arashi, Sara Rutz, Daeun Park, TaeHwan Jeon, Rodrigo Toro Madrid, and Vincent Graf</p>
                      </span>
                    </div>
                    <div className="foots legal"> LEGAL / DISCLAIMER
                      <span className="tooltip as">
                      <p><strong>Legal / Disclaimer</strong></p>
                      <p>As this is part of an artistic research project, we do not plan to do anything commercial with the imagery you share with us. 
                        You must own the copyright to any imagery you upload. There is also a possibility that any imagery you use will be reproduced in an artistic research and experiment in the future, 
                        but, you will always retain your copyright. The data we keep from this research will be held for one year only and discarded responsibly thereafter.</p>
                      </span>
                    </div>
                    <a className="foots browse" onClick={this.login}>Browse</a>
                    <a className="foots hide" onClick={this.hide_admin} style={{display: this.state.display_admin}}>Hide</a>
                  </div>
            </div>
        )
    }
}
