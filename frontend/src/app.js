import axios from 'axios';
import React from 'react';
import './app.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
                .catch(err => alert(err.response.status + ': ' + err.response.data));
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.submit}>
                    <h1>Upload an image</h1>
                    <img alt="preview" className="preview" src={this.state.image_preview} /><br/>
                    <input type='file' onChange={this.setImage} />
                    <input type='submit' value='Upload'/>
                </form>
            </div>
        )
    }
}