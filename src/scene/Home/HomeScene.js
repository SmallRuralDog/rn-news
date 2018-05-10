import React, { Component, PureComponent } from 'react';
import { View, Text, NetInfo, DeviceEventEmitter } from 'react-native';
import ScrollableTabView from "react-native-scrollable-tab-view"
import TopBar from '../../widget/TopBar'
import HomeList from './HomeList'
import platform from '../../common/platform'
import HTTPUtil from '../../common/http'
import MoreModal from './More'
import color from '../../widget/color';
import value from '../../widget/value';

export default class HomeScene extends Component {
    homelists = [];
    state = {
        init: false,
        net_type: "",
        navCategory: [],
        show_index: 0,
    };

    componentDidMount() {
        HTTPUtil.post("/v1/channel", {}).then(res => {
            if (res.code === 200) {
                this.setState({
                    navCategory: res.data,
                    init: true
                })
            } else {

            }
        }, err => {

        })
        DeviceEventEmitter.addListener("HOME_LIST_RELOAD", () => {
            if (this.homelists.length > 0) {
                this.homelists[this.state.show_index].goTop()
            }

        })
        NetInfo.addEventListener(
            'connectionChange',
            this._handleConnectionInfoChange
        );
    }
    componentWillUnmount() {
        NetInfo.removeEventListener(
            'connectionChange',
            this._handleConnectionInfoChange
        );
    }
    _handleConnectionInfoChange = (isConnected) => {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            this.setState({
                net_type: connectionInfo.type
            })
        });
    }
    handleChangeTab = ({ i, ref, from }) => {
        this.setState({
            show_index: i
        })
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.init ?
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
                        onChangeTab={this.handleChangeTab}
                        renderTabBar={() => <TopBar moreClick={() => {
                            this.refs.moreModal.open()
                        }} />}>
                        {this
                            .state
                            .navCategory
                            .map((item, index) => {
                                return <HomeList
                                    ref={ref => { this.homelists[index] = ref }}
                                    key={index}
                                    tabLabel={item.title}
                                    item={item}
                                    net_type={this.state.net_type}
                                    navigation={this.props.navigation} />
                            })}

                    </ScrollableTabView> : null}

                <MoreModal ref="moreModal" />
            </View>
        );
    }
}