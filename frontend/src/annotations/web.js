import React from "react";
import {Callout} from "react-foundation";

export class Web extends React.Component {
    render() {
        if (this.props.annotations.hasOwnProperty('webDetection')) {
            const annotations = this.props.annotations.webDetection
            const pages = []

            if (annotations.hasOwnProperty('pagesWithMatchingImages')) {
                for (let page in annotations.pagesWithMatchingImages) {
                    if (annotations.pagesWithMatchingImages.hasOwnProperty(page)) {
                        page = annotations.pagesWithMatchingImages[page]
                        if (page.hasOwnProperty('pageTitle') && page.hasOwnProperty('url')) {
                            pages.push(
                                <Callout key={'web-' + pages.length}>
                                    <p>{page.pageTitle}</p>
                                    <a href={page.url}>{page.url}</a>
                                </Callout>
                            )
                        }
                    }
                }
            }

            if (pages.length !== 0) {
                return pages
            } else {
                return "No annotation data found"
            }
        } else {
            return null
        }
    }
}
