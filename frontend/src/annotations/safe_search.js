import React from "react";
import {BadgeColors as Colors} from "react-foundation/lib/enums";
import {Progress} from "react-foundation";
import {getLikelihoodPercentage, likelihoodEnum} from "./likelihood";
import {capitalizeFirstLetter} from "../utils";

export class SafeSearches extends React.Component {
    render() {
        if (this.props.annotations.hasOwnProperty('safeSearchAnnotation')) {
            const annotations = []
            let likelihood;

            for (let key in this.props.annotations.safeSearchAnnotation) {
                if (! key.endsWith('Confidence') && this.props.annotations.safeSearchAnnotation.hasOwnProperty(key)) {
                    likelihood = this.props.annotations.safeSearchAnnotation[key]
                    annotations.push(<SafeSearch key={"safe-search-" + key} description={key} likelihood={likelihood}/>)
                }
            }

            return annotations
        } else {
            return "No safe search annotation data found"
        }
    }
}

class SafeSearch extends React.Component {
    render() {
        return (
            <div>
                {capitalizeFirstLetter(this.props.description)}: {likelihoodEnum[this.props.likelihood]}
                <Progress color={Colors.SUCCESS} value={getLikelihoodPercentage(this.props.likelihood)}/>
            </div>
        )
    }
}