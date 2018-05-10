import React, { Component, PureComponent } from 'react';
import { Text, TouchableOpacity, View, Animated, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import platform from '../../common/platform'
import UltimateListView from '../../component/listview/ultimateListView'
import HTTPUtil from '../../common/http'
import ItemVideo from './ItemVideo'
import ListLoadView from './ListLoadView'
const tipOut = {
    from: {
        height: 35,
        //lineHeight:35,
        fontSize: 13,
        opacity: 1,
    },
    to: {
        height: 0,
        //lineHeight:0,
        fontSize: 0,
        opacity: 0,
    },
};
Animatable.initializeRegistryWithDefinitions({
    tipOut
})
export default class VideoList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            c_id: 0,
            trace_id: '',
            reload_tip_height: 0
        };
        this.navigation = props.navigation;
        this.channel = props.item
    }

    onFetch = (page = 1, startFetch, abortFetch) => {
        let formData = {
            page: page,
            item_type: 3,
            channel_id: this.channel.id
        };
        HTTPUtil.post("/v1/rec", formData).then(res => {
            if (res.code === 200) {
                this.setState({
                    trace_id: res.data.trace_id,
                    tip: res.data.tip
                });
                let listArr = [];
                res.data.list.map(item => {
                    listArr.push(item)
                });
                startFetch(listArr, res.data.count)

                if (page == 1) {
                    this.setState({
                        reload_tip_height: 35
                    })
                    setTimeout(() => {
                        this.tip_view.tipOut(500).then(res => {
                            this.setState({
                                reload_tip_height: 0
                            })
                        })
                        //this.tip_view.tipOut(800)
                    }, 2000);
                }
            } else {
                abortFetch()
            }

        }, err => {
            abortFetch()
        })
    };
    renderPaginationFetchingView = () => {
        return (<ListLoadView />);
    };

    renderItem = (item, index, separator) => {
        if (item.content_type === 3) {
            return (<ItemVideo item={item} onClick={() => { this._itemVideoClick(item) }} />)
        }
    };

    _itemVideoClick = (item) => {
        this.navigation.navigate("VideoPage", {
            item_id: item.item_id,
            title: item.title,
            media: item.media,
            video_info: item.video_info,
            net_type: this.props.net_type,
            trace_id: this.state.trace_id
        })
    };

    renderSeparatorView = () => {
        return (<View style={{ height: platform.borderH, backgroundColor: "#ffffff" }}>
            <View style={{
                borderBottomWidth: platform.borderH,
                borderBottomColor: "#e9e9e9",
                marginLeft: 15,
                marginRight: 15
            }} />
        </View>)
    };
    renderEmptyView = () => {
        return <Text style={{ textAlign: "center", lineHeight: 50, color: "#999999" }}>暂无数据</Text>;
    };

    rendHeaderView = () => {
        return (
            <View>
                {this.state.reload_tip_height > 0 ?
                    <Animatable.Text
                        ref={ref => { this.tip_view = ref }}
                        includeFontPadding={false}
                        animation="bounceIn"//bounceIn lightSpeedIn slideInUp
                        style={{
                            backgroundColor: "#ffe110",
                            height: this.state.reload_tip_height,
                            alignItems: "center",
                            justifyContent: 'center',
                            textAlign: "center",
                            textAlignVertical: "center",
                            ...Platform.select({
                                ios: {
                                    lineHeight: 35,
                                }
                            }),
                            color: "#2e2e2e",
                            fontSize: 13,
                            fontWeight: "400"
                        }}>{this.state.tip || "刷新成功"}</Animatable.Text>
                    : null}
            </View>
        );
    };


    render() {
        const { navigate } = this.props.navigation;
        return (
            <UltimateListView
                style={{}}
                ref={ref => this.listView = ref}
                onFetch={this.onFetch}
                keyExtractor={(item, index) => index}
                refreshableMode={platform.platform == "ios" ? "advanced" : "basic"} // basic or advanced
                item={this.renderItem}
                arrowImageStyle={{ width: 20, height: 20, resizeMode: 'contain' }}
                dateStyle={{ color: 'lightgray' }}
                refreshViewStyle={platform.platform === 'ios' ? { height: 35, top: -35 } : { height: 35 }}
                refreshViewHeight={35}
                separator={this.renderSeparatorView}//分割线
                paginationFetchingView={this.renderPaginationFetchingView}//初始化加载View
                //paginationWaitingView={this.renderPaginationFetchingView}//加载更多View
                emptyView={this.renderEmptyView}
                header={this.rendHeaderView}
                refreshableTitlePull="下拉刷新"
                refreshableTitleRelease="松手刷新"
                refreshableTitleRefreshing="正在推荐"
                waitingSpinnerText="正在加载"
                spinnerColor="#999999"
            />
        );
    }
}