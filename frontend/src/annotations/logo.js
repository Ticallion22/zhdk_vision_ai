import React from "react";
import {Percentage} from "./percentage";

export class Logo extends React.Component {
    render() {
        if (this.props.annotations.hasOwnProperty('logoAnnotations')) {
            const annotations = this.props.annotations.logoAnnotations
            const logos = []


            for (let i in annotations) {
                if (
                    annotations.hasOwnProperty(i)
                    && annotations[i].hasOwnProperty("description")
                    && annotations[i].hasOwnProperty("score")
                ) {
                    logos.push(
                        <Percentage key={"logo-" + annotations[i].description}
                                    description={annotations[i].description}
                                    score={annotations[i].score}
                        />
                    )
                } else {
                    return "Invalid logo annotation data found"
                }
            }

            if (logos.length !== 0) {
                return logos
            } else {
                return "No logo annotation data found"
            }
        } else {
            return null
        }
    }
}
