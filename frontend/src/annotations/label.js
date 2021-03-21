import React from "react";
import {Percentage} from "./percentage";

export class Label extends React.Component {
    render() {
        if (this.props.annotations.hasOwnProperty('labelAnnotations')) {
            const annotations = this.props.annotations.labelAnnotations
            const labels = []

            for (let i in annotations) {
                if (annotations.hasOwnProperty(i)) {

                    if (annotations[i].hasOwnProperty('description') && annotations[i].hasOwnProperty('score')) {
                        labels.push(
                            <Percentage
                                key={"label-annotation-" + annotations[i].description}
                                description={annotations[i].description}
                                score={annotations[i].score}/>
                            )

                    } else {
                        console.log(annotations[i])
                        return "Invalid label annotation data found"
                    }
                }
            }

            return labels
        } else {
            return "No label annotation data found"
        }
    }
}
