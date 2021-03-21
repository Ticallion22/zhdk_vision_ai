import React from "react";
import {Likelihood} from "./likelihood";
import {capitalizeFirstLetter, insertStringBeforeCapital} from "../utils";

// TODO draw

export class Face extends React.Component {
    render() {
        if (this.props.annotations.hasOwnProperty('faceAnnotations')) {
            const annotations = this.props.annotations.faceAnnotations
            const faces = []
            let display_name = ''
            let key
            let face_properties

            for (let i in annotations) {
                if (annotations.hasOwnProperty(i)) {
                    face_properties = []
                    for (key in annotations[i]) {
                        if (key.endsWith('Likelihood') && annotations[i].hasOwnProperty(key)) {
                            display_name = insertStringBeforeCapital(
                                capitalizeFirstLetter(key.replace('Likelihood', ''))
                            )
                            face_properties.push(
                                <Likelihood key={"face-" + display_name}
                                            description={display_name}
                                            likelihood={annotations[i][key]}
                                />
                            )
                        }
                    }
                    faces.push(
                        <div>
                            <h5>Face {parseInt(i)+1}</h5>
                            {face_properties}
                        </div>
                    )
                }
            }

            return faces
        } else {
            return "No safe search annotation data found"
        }
    }
}
