import axios from 'axios';
import React from 'react';
import './app.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            image_url: ''
        }

        this.setImage = this.setImage.bind(this)
        this.setImageUrl = this.setImageUrl.bind(this)
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

    setImageUrl(event) {
        this.setState({
            image_url: event.target.value
        })
    }

    submit(event) {
        event.preventDefault()

        if (this.state.image && this.state.image_url) {
            alert("Either provide image or URL, not both!")
        } else if (this.state.image || this.state.image_url) {
            let postData = {image: this.state.image, image_url: this.state.image_url};
            axios.post('/image', postData)
                .catch(err => alert('Failed saving image (' + err.statusText + ')'));
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.submit}>
                    <h1>Upload an image</h1>
                    <img className="preview" src={this.state.image_preview} /><br/>
                    <input type='file' onChange={this.setImage} />
                    <h1>or insert a URL</h1>
                    <input type='text' onChange={this.setImageUrl} value={this.state.image_url} />
                    <br/>
                    <input type='submit' value='Upload'/>
                </form>
            </div>
        )
    }
}