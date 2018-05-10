import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, TextInput, TouchableOpacity, Text, ScrollView, ActivityIndicator, Keyboard } from 'react-native';
import { SearchBar } from 'antd-mobile'
import platform from '../../common/platform';
import UltimateListView from '../../component/listview/ultimateListView'
import ItemPic from './ItemPic'
import ItemText from './ItemText'
import http from '../../common/http';
import StateView from '../../widget/StateView';
import Toast from '../../component/Toast';
export default class SearchScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            key: props.navigation.state.params.key || '',
            is_search: props.navigation.state.params.key ? true : false,
            init: false
        }
        this.navigation = props.navigation
    }
    componentDidMount() {

    }
    search = () => {
        if (this.state.key == null || this.state.key.length <= 0) {
            Toast.show("请输入关键词"); return false;
        } else {
            Keyboard.dismiss()
            this.setState({
                is_search: true
            })
        }
    }

    onFetch = (page = 1, startFetch, abortFetch) => {
        let formData = {
            page: page,
            key: this.state.key
        };
        http.post("/v1/search", formData).then(res => {
            if (res.code === 200) {
                this.setState({
                    init: true,
                });
                let listArr = [];
                res.data.list.map(item => {
                    listArr.push(item)
                });
                startFetch(listArr, res.data.count)
            } else {
                abortFetch()
            }

        }, err => {
            abortFetch()
        })
    };
    renderPaginationFetchingView = () => {
        return <ActivityIndicator style={{ marginTop: 20 }} />;
    };

    renderItem = (item, index, separator) => {
        if (item.content_type === 1) {
            if (item.pic_list.length === 0) {
                return (<ItemText key={index} item={item} onClick={() => { this._itemClick(item) }} />)
            } else if (item.pic_list.length >= 1) {
                return (<ItemPic key={index} item={item} onClick={() => { this._itemClick(item) }} />)
            }
        } else {
            return (<ItemPic key={index} item={item} onClick={() => { this._itemVideoClick(item) }} />)
        }
    };

    _itemClick = (item) => {
        this.navigation.navigate("NewsDetail", {
            item_id: item.item_id,
            trace_id: this.state.trace_id,
            is_detail: true
        })
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
                borderBottomColor: "#ffffff",
                marginLeft: 15,
                marginRight: 15
            }} />
        </View>)
    };
    renderEmptyView = () => {
        return <Text style={{ textAlign: "center", lineHeight: 50, color: "#999999" }}>暂无数据</Text>;
    };
    render() {
        return (
            <View style={{ flex: 1, flexDirection: "column" }}>
                <View style={styles.header}>
                    <View style={styles.input_view}>
                        <Image
                            style={{ width: 25, height: 25 }}
                            source={require("../../img/ic_search_search_normal.png")}
                        />
                        <TextInput ref={textInput => (this._textInput = textInput)} placeholder="搜索你感兴趣的内容" returnKeyType="search" returnKeyLabel="search" clearButtonMode="while-editing"
                            style={{ fontSize: 14, flexGrow: 1 }}
                            enablesReturnKeyAutomatically={true}
                            defaultValue={this.state.key}
                            onChangeText={(text) => {
                                this.setState({ is_search: false, key: text })
                            }}
                            underlineColorAndroid="transparent"
                            onSubmitEditing={() => {
                                this.search()
                            }}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.back_btn}
                        onPress={() => {
                            this.navigation.goBack()
                        }}
                    >
                        <Text>取消</Text>
                    </TouchableOpacity>
                </View>
                {this.state.is_search ?
                    <UltimateListView
                        refreshable={false}
                        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
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
                        emptyView={this.renderEmptyView}
                        header={this.rendHeaderView}
                        refreshableTitlePull="下拉刷新"
                        refreshableTitleRelease="松手刷新"
                        refreshableTitleRefreshing="正在推荐"
                        waitingSpinnerText="正在加载"
                        spinnerColor="#999999"
                    />
                    : <ScrollView style={{ flex: 1 }}>

                    </ScrollView>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        paddingTop: platform.headerPaddingTop,
        backgroundColor: "#ffffff",
        borderBottomColor: "#dcdcdc",
        borderBottomWidth: platform.borderH,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    input_view: {
        flex: 0,
        flexDirection: "row",
        flexGrow: 1,
        flexShrink: 1,
        alignItems: "center",
        backgroundColor: "#f7f7f7",
        height: 30,
        borderRadius: 15,
        paddingLeft: 8,
        paddingRight: 8,
        marginRight: 10,
        marginLeft: 10
    },
    back_btn: {
        height: platform.toolbarHeight,
        width: platform.toolbarHeight,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8
    },
})