import {Progress} from "react-foundation";
import {BadgeColors as Colors} from "react-foundation/lib/enums";
import React from "react";

export class Percentage extends React.Component {
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