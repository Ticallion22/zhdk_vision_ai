import React from 'react';
import {Cell, Grid, TabItem, TabPanel, Tabs, TabsContent} from 'react-foundation';
import 'foundation-sites/dist/css/foundation.min.css';
import {SafeSearch} from "./annotations/safe_search";
import {Face} from "./annotations/face";
import {Landmark} from "./annotations/landmark";
import {Text} from "./annotations/text";
import {PercentageAnnotation} from "./annotations/percentage";

export class Image extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			activeIndex: 1
		}
	}

    render() {
        console.log(this.props.annotations) // TODO remove
        return (
            <Grid className="display">
                <Cell large={4}>
                    <img alt="Preview once uploaded" className="preview" src={this.props.preview} /><br/>
                </Cell>
                <Cell large={8}>
                    <div>
                        <Tabs>
                            <TabItem isActive={this.state.activeIndex === 1} onClick={(e) => {this.setState({activeIndex: 1})}}>
                                <a href={"#image-tabs-labels"}>Labels</a>
                            </TabItem>
                            <TabItem isActive={this.state.activeIndex === 2} onClick={(e) => {this.setState({activeIndex: 2})}}>
                                <a href={"#image-tabs-objects"}>Objects</a>
                            </TabItem>
                            <TabItem isActive={this.state.activeIndex === 3} onClick={(e) => {this.setState({activeIndex: 3})}}>
                                <a href={"#image-tabs-faces"}>Faces</a>
                            </TabItem>
                            <TabItem isActive={this.state.activeIndex === 4} onClick={(e) => {this.setState({activeIndex: 4})}}>
                                <a href={"#image-tabs-logos"}>Logos</a>
                            </TabItem>
                            <TabItem isActive={this.state.activeIndex === 5} onClick={(e) => {this.setState({activeIndex: 5})}}>
                                <a href={"#image-tabs-landmarks"}>Landmarks</a>
                            </TabItem>
                            <TabItem isActive={this.state.activeIndex === 6} onClick={(e) => {this.setState({activeIndex: 6})}}>
                                <a href={"#image-tabs-web"}>Web</a>
                            </TabItem>
                            <TabItem isActive={this.state.activeIndex === 7} onClick={(e) => {this.setState({activeIndex: 7})}}>
                                <a href={"#image-tabs-text"}>Text</a>
                            </TabItem>
                            <TabItem isActive={this.state.activeIndex === 8} onClick={(e) => {this.setState({activeIndex: 8})}}>
                                <a href={"#image-tabs-safesearch"}>Safe Search</a>
                            </TabItem>
                        </Tabs>
                        <TabsContent>
                            <TabPanel isActive={this.state.activeIndex === 1} id={"image-tabs-labels"}>
                                <PercentageAnnotation annotations={this.props.annotations} annotations_key={'labelAnnotations'} name_key={'description'}/>
                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 2} id={"image-tabs-objects"}>
                                <PercentageAnnotation annotations={this.props.annotations} annotations_key={'localizedObjectAnnotations'} name_key={'name'}/>
                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 3} id={"image-tabs-faces"}>
                                <Face annotations={this.props.annotations}/>
                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 4} id={"image-tabs-logos"}>
                                <PercentageAnnotation annotations={this.props.annotations} annotations_key={'logoAnnotations'} name_key={'description'}/>
                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 5} id={"image-tabs-landmarks"}>
                                <Landmark annotations={this.props.annotations}/>
                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 6} id={"image-tabs-web"}>

                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 7} id={"image-tabs-text"}>
                                <Text annotations={this.props.annotations}/>
                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 8} id={"image-tabs-safesearch"}>
                                <SafeSearch annotations={this.props.annotations}/>
                            </TabPanel>
                        </TabsContent>
                    </div>
                </Cell>
            </Grid>

        )
    }
}