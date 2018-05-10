import React, { Component, PureComponent } from 'react';
import {
    InteractionManager,
    Dimensions,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    PixelRatio,
    NetInfo,
    Image,
    DeviceEventEmitter
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome"
import Button from 'apsl-react-native-button'
import VideoPlayer from '../../component/VideoPlayer'
import platform from '../../common/platform';
import http from '../../common/http';
import ItemPic from '../Detail/ItemPic'
import ItemText from '../Detail/ItemText'
import StateView from '../../widget/StateView'
import Toast from '../../component/Toast';
import USER from '../../common/user'
import Loading from '../../component/Loading';
import CommentPageView from '../Comment/PageView'
import CommentModal from '../Comment/CommentModal';
const width = platform.deviceWidth;
export default class VideoPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            comment_ic: require('../../img/ic_commentbar_commernt.png'),
            share_ic: require('../../img/ic_commentbar_share.png'),
            init: false,
            data: {},
            rec_list: [],
            comment_list: [],
            comment_num: 0,
            net_type: props.navigation.state.params.net_type,
            item_id: props.navigation.state.params.item_id,
            title: props.navigation.state.params.title,
            media: props.navigation.state.params.media,
            video_info: props.navigation.state.params.video_info,
            auto_play: props.navigation.state.params.net_type == 'wifi' ? true : false,
            is_detail: props.navigation.state.params.is_detail || false,

            attitude: {
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0
            },
            attitude_type: 0,
            follow_btn_load: false,
            follow_btn_dis: false,
            is_follow: false,
            attitude_arr: [
                {
                    key: 1,
                    name: '点赞',
                    icon: require('../../img/img_emoji_good.png')
                },
                {
                    key: 2,
                    name: '惊讶',
                    icon: require('../../img/img_emoji_amazed.png')
                },
                {
                    key: 3,
                    name: '伤感',
                    icon: require('../../img/img_emoji_sad.png')
                },
                {
                    key: 4,
                    name: '愤怒',
                    icon: require('../../img/img_emoji_angry.png')
                }
            ]
        }
        this.navigation = props.navigation;
    }
    componentDidMount() {
        this._getData()

        DeviceEventEmitter.addListener("PAGE_SHOW", data => {
            if (data.scene == 'VideoPage') {
                if (data.params.item_id == this.state.item_id && this.state.auto_play && this.player) {
                    this.player.setPlay(true)
                }
            }
        })
    }

    _getData = () => {
        let param = {
            item_id: this.state.item_id,
            trace_id: this.state.trace_id,
            is_detail: this.state.is_detail
        };
        http.post("/v1/news", param).then(res => {
            if (res.code === 200) {
                this.setState({
                    init: true,
                    rec_list: res.data.rec_list,
                    comment_list: res.data.comment_list,
                    data: res.data.news,
                    comment_num: res.data.news.comment_num,
                    attitude: res.data.news.attitude,
                    is_follow: res.data.news.is_follow,
                    attitude_type: res.data.news.attitude_type,
                })
            } else {
                console.warn("error")
            }
        }, err => {
            console.warn(err)
        })
    };

    _itemClick = (item) => {
        this.player.setPlay(false);
        this.navigation.navigate("NewsDetail", {
            item_id: item.item_id,
            trace_id: this.state.trace_id,
            is_detail: true
        })
    };
    _itemVideoClick = (item) => {
        this.player.setPlay(false);
        this.navigation.navigate("VideoPage", {
            item_id: item.item_id,
            title: item.title,
            media: item.media,
            video_info: item.video_info,
            net_type: this.state.net_type,
            trace_id: this.state.trace_id
        })
    };

    async _follow(than) {
        let isLogin = await USER.IsLogin();
        if (isLogin) {
            this.setState({
                follow_btn_load: true,
                follow_btn_dis: true
            });
            http.post("/v1/follow-media", { media_id: this.state.media.media_id }).then(res => {
                than.setState({
                    follow_btn_load: false
                })
                if (res.code === 200) {
                    than.setState({
                        is_follow: true
                    })
                } else {
                    Toast.show(res.message)
                }
            }, err => {
                than.setState({
                    follow_btn_load: false,
                    follow_btn_dis: false
                })
            })
        } else {
            this.player.setPlay(false);
            than.navigation.navigate("Login")
        }
    }
    _attitude = (type) => {
        if (type == this.state.attitude_type) {
            return false;
        }
        let data = this.state.attitude
        if (this.state.attitude_type > 0) {
            data[this.state.attitude_type] = data[this.state.attitude_type] - 1
        }
        data[type] = data[type] + 1


        this.setState({
            attitude: data,
            attitude_type: type
        })

        http.post("/v1/news-attitude", { item_id: this.item_id, type: type }).then(res => {

        }, err => {

        })
    }
    render() {
        const { video_info } = this.state;
        return (
            <View style={{ flex: 1, flexDirection: "column" }}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.back_btn} onPress={() => {
                        this.navigation.goBack()
                    }}>
                        <Image
                            style={styles.back_img}
                            source={require("../../img/ic_back_white_normal.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.back_btn} onPress={() => {
                        this.navigation.goBack()
                    }}>
                        <Image
                            style={styles.back_img}
                            source={require("../../img/ic_more_white_normal.png")} />
                    </TouchableOpacity>
                </View>
                <VideoPlayer
                    ref={pl => {
                        this.player = pl
                    }}
                    autoplay={this.state.auto_play}
                    endWithThumbnail
                    thumbnail={{ uri: video_info.cover.url }}
                    video={{ uri: video_info.url }}
                    videoWidth={width}
                    videoHeight={width / (16 / 9)}
                />
                {this.state.init ?
                    <ScrollView
                        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
                    >
                        <View style={styles.news_top}>
                            <Text
                                style={styles.news_title}>{this.state.data.title}</Text>
                            <View style={styles.media}>
                                <TouchableOpacity style={styles.media_left}>
                                    <Image resizeMode="cover" style={styles.media_avatar}
                                        source={{ uri: this.state.media.media_avatar }} />
                                    <View style={styles.media_info}>
                                        <Text style={{ color: "#333333" }}>{this.state.media.media_name}</Text>
                                        <Text style={{ fontSize: 10, color: "#999999" }}>{this.state.data.created_time}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ height: 28 }}>
                                    <Button
                                        onPress={() => {
                                            this._follow(this)
                                        }}
                                        style={styles.follow_btn}
                                        textStyle={{ fontSize: 14 }}
                                        isLoading={this.state.follow_btn_load}
                                        isDisabled={this.state.follow_btn_dis}
                                    >{this.state.is_follow ? '已关注' : '关注'}</Button>
                                </View>

                            </View>
                        </View>
                        <View style={styles.mood_view}>

                            {this.state.attitude_arr.map((item, index) => {
                                return (
                                    <View key={index} style={styles.mood_item}>
                                        <Text style={[styles.mood_item_num, this.state.attitude_type == item.key ? styles.ac : null]}>{this.state.attitude[item.key]}</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this._attitude(item.key)
                                            }}
                                        >
                                            <Image style={styles.mood_item_img}
                                                source={item.icon} />
                                        </TouchableOpacity>
                                        <Text style={[styles.mood_item_name, this.state.attitude_type == item.key ? styles.ac : null]}>{item.name}</Text>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={{ height: platform.borderH, backgroundColor: "#dcdcdc", marginLeft: 15 }} />
                        <View style={styles.more_list}>
                            <View style={{
                                borderLeftColor: "#ffe110",
                                borderLeftWidth: 4,
                                marginTop: 15, marginLeft: 15, marginBottom: 5
                            }}><Text style={{ fontSize: 20, color: "#333333", marginLeft: 5 }}>相关阅读</Text></View>
                            <View>
                                {this.state.rec_list.map((item, index) => {
                                    if (item.content_type === 1) {
                                        if (item.pic_list.length === 0) {
                                            return (<ItemText key={index} item={item} onClick={() => { this._itemClick(item) }} />)
                                        } else if (item.pic_list.length >= 1) {
                                            return (<ItemPic key={index} item={item} onClick={() => { this._itemClick(item) }} />)
                                        }
                                    } else {
                                        return (<ItemPic key={index} item={item} onClick={() => { this._itemVideoClick(item) }} />)
                                    }
                                })}
                            </View>
                        </View>
                        <View>
                            <CommentPageView list={this.state.comment_list} emptyClick={() => {
                                if (this.state.init) {
                                    this.commentModal.open(this.state.data)
                                }
                            }} />
                        </View>
                    </ScrollView>
                    : <StateView />}
                <View style={styles.bottomBar}>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.state.init) {
                                this.commentModal.open(this.state.data)
                            }
                        }}
                        style={styles.input_view}>
                        <Text style={{ color: "#999999", fontSize: 12 }}>我来说两句...</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.navigation.navigate("CommentSence", {
                                item_id: this.state.item_id
                            })
                        }}
                        style={styles.comment_btn}>
                        <Image style={{ width: 27, height: 27 }} source={this.state.comment_ic} />
                        <Text style={{ fontSize: 14, fontWeight: "500", marginLeft: 2, color: "#2E2E2E" }}>{this.state.comment_num || null}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.comment_btn}>
                        <Image style={{ width: 27, height: 27 }} source={this.state.share_ic} />
                    </TouchableOpacity>
                </View>
                <CommentModal
                    ref={ref => { this.commentModal = ref }}
                    goLogin={() => {
                        this.navigation.navigate("Login")
                    }}
                    okCallBack={() => {
                        this.commentModal.okClose()
                        this._getData()
                    }}
                />
            </View>
        );
    }
}
const comment_bar_h = 49;
const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
    },
    back_btn: {
        height: platform.toolbarHeight,
        width: platform.toolbarHeight,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    back_img: {
        width: 32,
        height: 32
    },
    more_tim: {
        position: "absolute",
        right: 3,
        bottom: 3,
        backgroundColor: "rgba(0,0,0,0.6)",
        fontSize: 10,
        color: "#ffffff",
        height: 15,
        lineHeight: 15,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 10
    },
    ac: {
        color: "#000000",
        fontWeight: "bold"
    },
    more_list: {},
    mood_view: {
        flexDirection: "row",
        paddingTop: 15,
        paddingBottom: 15,
        marginBottom: 15
    },
    mood_item: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1
    },
    mood_item_img: {
        width: 50, height: 50
    },
    mood_item_name: {
        marginTop: 10,
        color: "#999999"
    },
    mood_item_num: {
        marginBottom: 5,
        color: "#999999"
    },
    labels_list: {
        flexDirection: "row",
        paddingRight: 15
    },
    labels: {
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#f7f7f7",
        borderRadius: 3,
        marginLeft: 15,
        marginBottom: 15,
        flex: 0
    },
    news_top: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10
    },
    news_title: {
        fontSize: 22,
        lineHeight: 35,
        fontWeight: "bold",
        color: "#333333",
        textAlign: "justify"
    },
    media: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 40,
        marginTop: 10,
        marginBottom: 10
    },
    media_left: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        flexGrow: 1
    },
    media_avatar: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
    },
    media_info: {
        flexDirection: "column",
        height: 33,
        marginLeft: 10,
        justifyContent: "space-between"
    },
    follow_btn: {
        width: 65,
        height: 28,
        borderRadius: 5,
        borderWidth: 0,
        backgroundColor: "#ffe110",
        alignItems: "center",
        justifyContent: "center"
    }
    , bottomBar: {
        height: comment_bar_h,
        backgroundColor: "#FFFFFF",
        borderTopColor: "#dcdcdc",
        borderTopWidth: platform.borderH,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15
    },
    comment_btn: {
        alignItems: "center", justifyContent: "center", flexDirection: "row", flexGrow: 1
    },
    input_view: {
        backgroundColor: "#efefef",
        height: 28,
        borderRadius: 19,
        flexDirection: "row",
        paddingLeft: 15,
        alignItems: "center",
        flexGrow: 4,
        marginRight: 20
    },
});