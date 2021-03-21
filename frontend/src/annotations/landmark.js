import React from "react";
import {Percentage} from "./percentage";

// TODO draw
// TODO multiple locations?

export class Landmark extends React.Component {
    roundCoordinates(coordinate) {
        return coordinate.to
    }
    render() {
        if (this.props.annotations.hasOwnProperty('landmarkAnnotations')) {
            const annotations = this.props.annotations.landmarkAnnotations
            const landmarks = []
            let details
            let latitude
            let longitude

            for (let i in annotations) {
                if (
                    annotations.hasOwnProperty(i)
                    && annotations[i].hasOwnProperty("description")
                    && annotations[i].hasOwnProperty("locations")
                    && annotations[i].locations[0].hasOwnProperty("latLng")
                    && annotations[i].locations[0].latLng.hasOwnProperty("latitude")
                    && annotations[i].locations[0].latLng.hasOwnProperty("longitude")
                ) {
                    latitude = annotations[i].locations[0].latLng.latitude.toFixed(4)
                    longitude = annotations[i].locations[0].latLng.longitude.toFixed(4)
                    details = latitude + String.fromCharCode(176) + " N, " + longitude + String.fromCharCode(176) + " E"
                    landmarks.push(
                        <div>
                            <Percentage key={"landmark-" + annotations[i].description}
                                        description={annotations[i].description}
                                        details={details}
                                        score={annotations[i].score}
                            />
                        </div>
                    )
                } else {
                    return "Invalid landmark annotation data found"
                }
            }

            return landmarks
        } else {
            return "No landmark annotation data found"
        }
    }
}
