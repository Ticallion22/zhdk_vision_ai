import React from "react";
import {Callout} from "react-foundation";

export class Text extends React.Component {
    render() {
        if (this.props.annotations.hasOwnProperty('textAnnotations')) {
            const annotations = this.props.annotations.textAnnotations
            const texts = []

            for (let i in annotations) {
                if (annotations.hasOwnProperty(i) && annotations[i].hasOwnProperty("description")) {
                    texts.push(
                        <Callout key={"text-annotation-" + i}>{annotations[i].description}</Callout>
                    )
                } else {
                    return "Invalid texts annotation data found"
                }
            }

            if (texts.length !== 0) {
                return texts
            } else {
                return "No texts annotation data found"
            }
        } else {
            return null
        }
    }
}
