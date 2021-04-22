import React from 'react';
import {Button, TabItem, TabPanel, Tabs, TabsContent} from 'react-foundation';
import 'foundation-sites/dist/css/foundation.min.css';
import {SafeSearch} from "./annotations/safe_search";
import {Face} from "./annotations/face";
import {Landmark} from "./annotations/landmark";
import {Text} from "./annotations/text";
import {PercentageAnnotation} from "./annotations/percentage";
import {Web} from "./annotations/web";
import {BadgeColors as Colors} from "react-foundation/lib/enums";

export class Image extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			activeIndex: 1
		}
	}

    render() {
        let webEntities = null
        if (this.props.annotations.hasOwnProperty('webDetection')) {
            webEntities = (<PercentageAnnotation annotations={this.props.annotations.webDetection} annotations_key={'webEntities'} name_key={'description'}/>)
        }

        return (
              <div className="grid-after">
                <div className="img-area">
                    <h3 >{this.props.image_name}</h3>
                    <Button
                        color={Colors.ALERT}
                        onClick={this.props.deleteImage}
                        style={{display: this.props.display_admin}}
                    >
                        Delete
                    </Button>
                    <img alt="After choosing an IMAGE,&ensp; Please click the CAMERA button" className="img-preview" src={this.props.preview} /><br/>
                </div>

                <div className="elements">
                    <div>
                        <Tabs>
                          <TabItem isActive={this.state.activeIndex === 6} onClick={(e) => {this.setState({activeIndex: 6})}}>
                              <a href={"#web-entities"}><strong>Web Entities</strong></a>
                          </TabItem>
                            <TabItem isActive={this.state.activeIndex === 1} onClick={(e) => {this.setState({activeIndex: 1})}}>
                                <a href={"#labels"}>Labels</a>
                            </TabItem>
                            <TabItem isActive={this.state.activeIndex === 2} onClick={(e) => {this.setState({activeIndex: 2})}}>
                                <a href={"#objects"}>Objects</a>
                            </TabItem>
                            <TabItem isActive={this.state.activeIndex === 3} onClick={(e) => {this.setState({activeIndex: 3})}}>
                                <a href={"#faces"}>Faces</a>
                            </TabItem>
                            <TabItem isActive={this.state.activeIndex === 4} onClick={(e) => {this.setState({activeIndex: 4})}}>
                                <a href={"#logos"}>Logos</a>
                            </TabItem>
                            <TabItem isActive={this.state.activeIndex === 5} onClick={(e) => {this.setState({activeIndex: 5})}}>
                                <a href={"#landmarks"}>Landmarks</a>
                            </TabItem>

                            <TabItem isActive={this.state.activeIndex === 7} onClick={(e) => {this.setState({activeIndex: 7})}}>
                                <a href={"#matching-images"}>Matching Images</a>
                            </TabItem>
                            <TabItem isActive={this.state.activeIndex === 8} onClick={(e) => {this.setState({activeIndex: 8})}}>
                                <a href={"#text"}>Text</a>
                            </TabItem>
                            <TabItem isActive={this.state.activeIndex === 9} onClick={(e) => {this.setState({activeIndex: 9})}}>
                                <a href={"#safe-search"}>Safe Search</a>
                            </TabItem>
                        </Tabs>
                        <TabsContent>
                            <TabPanel isActive={this.state.activeIndex === 1} id={"labels"}>
                                <PercentageAnnotation annotations={this.props.annotations} annotations_key={'labelAnnotations'} name_key={'description'}/>
                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 2} id={"objects"}>
                                <PercentageAnnotation annotations={this.props.annotations} annotations_key={'localizedObjectAnnotations'} name_key={'name'}/>
                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 3} id={"faces"}>
                                <Face annotations={this.props.annotations}/>
                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 4} id={"logos"}>
                                <PercentageAnnotation annotations={this.props.annotations} annotations_key={'logoAnnotations'} name_key={'description'}/>
                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 5} id={"landmarks"}>
                                <Landmark annotations={this.props.annotations}/>
                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 6} id={"web-entities"}>
                                {webEntities}
                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 7} id={"matching-images"}>
                                <Web annotations={this.props.annotations}/>
                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 8} id={"text"}>
                                <Text annotations={this.props.annotations}/>
                            </TabPanel>
                            <TabPanel isActive={this.state.activeIndex === 9} id={"safe-search"}>
                                <SafeSearch annotations={this.props.annotations}/>
                            </TabPanel>
                        </TabsContent>
                    </div>
                </div>
              </div>

        )
    }
}
