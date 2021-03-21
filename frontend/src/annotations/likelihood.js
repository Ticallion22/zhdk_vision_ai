import React from "react";
import {capitalizeFirstLetter} from "../utils";
import {Progress} from "react-foundation";
import {BadgeColors as Colors} from "react-foundation/lib/enums";

export const likelihoodEnum = Object.freeze({
    4: 'Likely',
    3: 'Possible',
    0: 'Unknown',
    2: 'Unlikely',
    5: 'Very Likely',
    1: 'Very Unlikely'
})

export function getLikelihoodPercentage(likelihood) {
    let percentage = Math.round((likelihood/6*100))
    if (likelihood > 5 || isNaN(percentage)) {
        console.log("Invalid likelihood: " + likelihood)
        return 0
    } else {
        return percentage
    }
}

export class Likelihood extends React.Component {
    render() {
        return (
            <div>
                {capitalizeFirstLetter(this.props.description)}: {likelihoodEnum[this.props.likelihood]}
                <Progress color={Colors.SUCCESS} value={getLikelihoodPercentage(this.props.likelihood)}/>
            </div>
        )
    }
}