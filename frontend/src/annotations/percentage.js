import {Progress} from "react-foundation";
import {BadgeColors as Colors} from "react-foundation/lib/enums";
import React from "react";

export class PercentageAnnotation extends React.Component {
    getPercentages(annotations) {
        const percentages = []

        for (let i in annotations) {
            if (
                annotations.hasOwnProperty(i)
                && annotations[i].hasOwnProperty(this.props.name_key)
                && annotations[i].hasOwnProperty("score")
            ) {
                percentages.push(
                    <Percentage key={"percentage-" + this.props.annotations_key + annotations[i][this.props.name_key]}
                                description={annotations[i][this.props.name_key]}
                                score={annotations[i].score}
                    />
                )
            } else {
                return ["Invalid annotation data found"]
            }
        }

        return percentages
    }
    render() {
        if (this.props.annotations.hasOwnProperty(this.props.annotations_key)) {
            const percentages = this.getPercentages(this.props.annotations[this.props.annotations_key])

            if (percentages.length !== 0) {
                return percentages
            } else {
                return "No annotation data found"
            }
        } else {
            return null
        }
    }
}


export class Percentage extends React.Component {
    get_percentage() {
        return Math.round(this.props.score * 100)
    }

    render() {
        let details = ''
        if (this.props.details) {
            details = (<p>{this.props.details}</p>)
        }
        return (
            <div>
                <h5>{this.props.description}</h5>
                {details}
                <Progress color={Colors.SUCCESS} value={this.get_percentage()} meter={{ text: this.get_percentage() + '%'}}/>
            </div>
        )
    }
}