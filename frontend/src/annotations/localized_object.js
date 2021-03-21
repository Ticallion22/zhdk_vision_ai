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
                            <Percentage key={"label-annotation-" + annotations[i].name + "-" + i}
                                        description={annotations[i].name}
                                        score={annotations[i].score}
                            />
                        )

                    } else {
                        console.log("Invalid object annotation data found")
                        console.log(annotations)
                        return "Invalid localized object annotation data found"
                    }
                }
            }

            if (localized_objects.length !== 0) {
                return localized_objects
            } else {
                return "No localized objects annotation data found"
            }
        } else {
            return null
        }
    }
}
