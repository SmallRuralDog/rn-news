import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, NetInfo } from 'react-native';
import { Tabs } from 'antd-mobile'
import ScrollableTabView from "react-native-scrollable-tab-view"
import VideoTopBar from './VideoTopBar'
import platform from '../../common/platform';
import VideoPlayer from '../../component/VideoPlayer'
import color from '../../widget/color';
import http from '../../common/http';
import StateView from '../../widget/StateView'

import VideoList from './VideoList'
import value from '../../widget/value';
export default class VideoScene extends Component {
    state = {
        init: false,
        navCategory: []
    };
    componentDidMount() {
        http.post("/v1/channel", {}).then(res => {
            if (res.code === 200) {
                this.setState({
                    navCategory: res.data,
                    init: true
                })
            } else {

            }
        }, err => {

        })
    }


    render() {
        const width = platform.deviceWidth;
        return (
            this.state.init ?
                <View style={{ flex: 1 }}>
                    <ScrollableTabView
                        tabBarUnderlineStyle={{
                            height: 9,
                            backgroundColor: color.theme,
                            borderRadius: 1,
                            bottom: value.top_class_unline_bottom
                        }}
                        tabBarInactiveTextColor="#999999"
                        tabBarActiveTextColor="#000000"
                        tabBarBackgroundColor="#ffffff"
                        tabBarTextStyle={{
                            backgroundColor: "transparent"
                        }}
                        scrollWithoutAnimation={true}
                        renderTabBar={() => <VideoTopBar moreClick={() => {
                            this.refs.moreModal.open()
                        }} />}>
                        {this
                            .state
                            .navCategory
                            .map((item, index) => {
                                return <VideoList
                                    key={index}
                                    tabLabel={item.title}
                                    item={item}
                                    net_type={"wifi"}
                                    navigation={this.props.navigation} />
                            })}

                    </ScrollableTabView>
                </View>
                : <StateView />
        );
    }
}
