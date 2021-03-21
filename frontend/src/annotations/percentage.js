import {Progress} from "react-foundation";
import {BadgeColors as Colors} from "react-foundation/lib/enums";
import React from "react";

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