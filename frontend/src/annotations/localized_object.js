import React from "react";
import {Percentage} from "./percentage";

// TODO draw

export class LocalizedObject extends React.Component {
    render() {
        if (this.props.annotations.hasOwnProperty('localizedObjectAnnotations')) {
            const annotations = this.props.annotations.localizedObjectAnnotations
            const localized_objects = []

            for (let i in annotations) {
                if (annotations.hasOwnProperty(i)) {

                    if (annotations[i].hasOwnProperty('name') && annotations[i].hasOwnProperty('score')) {
                        localized_objects.push(
                            <Percentage key={"label-annotation-" + annotations[i].name}
                                        description={annotations[i].name}
                                        score={annotations[i].score}
                            />
                        )

                    } else {
                        console.log("Invalid object annotation data found")
                        console.log(annotations)
                        return "Invalid object annotation data found"
                    }
                }
            }

            return localized_objects
        } else {
            return "No object annotation data found"
        }
    }
}