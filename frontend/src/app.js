import axios from 'axios';
import React from 'react';
import {Image} from './image';
import './app.css';
import {Cell, Grid} from "react-foundation";
import 'foundation-sites/dist/css/foundation.min.css';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            annotations: {},
            image: null,
            image_preview: null
        }

        this.setImage = this.setImage.bind(this)
        this.submit = this.submit.bind(this)
    }

    setImage(event) {
        if (event.target.files && event.target.files[0]) {
            this.setState({
                image: event.target.files[0],
                image_preview: URL.createObjectURL(event.target.files[0])
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
                .then(data => {this.setState({annotations: JSON.parse(data.annotations)})})
                .catch(err => alert(err.response.status + ': ' + err.response.data));
        }
    }

    render() {
        return (
            <Grid className="grid-container">
                <Cell>
                    <Image annotations={this.state.annotations} preview={this.state.image_preview} />
                </Cell>

                <Cell>
                    <form onSubmit={this.submit}>
                        <h1>Choose an image</h1>
                        <input type='file' onChange={this.setImage} />
                        <input type='submit' value='Annotate'/>
                    </form>
                </Cell>
            </Grid>
        )
    }
}