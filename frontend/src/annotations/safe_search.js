import React from "react";
import {Likelihood} from "./likelihood";

export class SafeSearch extends React.Component {
    render() {
        if (this.props.annotations.hasOwnProperty('safeSearchAnnotation')) {
            const annotations = this.props.annotations.safeSearchAnnotation
            const safe_searches = []

            for (let key in annotations) {
                if (! key.endsWith('Confidence') && annotations.hasOwnProperty(key)) {
                    safe_searches.push(
                        <Likelihood key={"safe-search-" + key} description={key} likelihood={annotations[key]}/>
                    )
                }
            }

            return safe_searches
        } else {
            return "No safe search annotation data found"
        }
    }
}
