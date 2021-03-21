import React from "react";
import {BadgeColors as Colors} from "react-foundation/lib/enums";
import {Progress} from "react-foundation";

export default class Labels extends React.Component {
    render() {
        if (this.props.annotations.hasOwnProperty('labelAnnotations')) {
            const labels = []
            let label;

            for (let i in this.props.annotations.labelAnnotations) {
                if (this.props.annotations.labelAnnotations.hasOwnProperty(i)) {
                    label = this.props.annotations.labelAnnotations[i]

                    if (label.hasOwnProperty('description') && label.hasOwnProperty('score')) {
                        labels.push(<Label key={"label-annotation-" + label.description} description={label.description}
                                           score={label.score}/>)

                    } else {
                        console.log(this.props.annotations.labelAnnotations)
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

class Label extends React.Component {
    get_percentage() {
        return Math.round(this.props.score * 100)
    }
    render() {
        return (
            <div>
                {this.props.description} {this.get_percentage()}%
                <Progress color={Colors.SUCCESS} value={this.get_percentage()}/>
            </div>
        )
    }
}