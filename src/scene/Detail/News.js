import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, InteractionManager } from 'react-native';
import platform from '../../common/platform'
import Placeholder from '../../component/placeholder';
import HttpUtil from '../../common/http'
import NewsBody from './NewsBody'
import CommentModal from '../Comment/CommentModal';
import PhotoView from '@merryjs/photo-viewer';
export default class News extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            comment_ic: require('../../img/ic_commentbar_commernt.png'),
            share_ic: require('../../img/ic_commentbar_share.png'),
            init: false,
            data: {},
            item_id: props.navigation.state.params.item_id,
            trace_id: props.navigation.state.params.trace_id,
            is_detail: props.navigation.state.params.is_detail || false,
            images: [],
            image_index: 0,
            visible: false,
            comment_num: 0
        };
        this.navigation = props.navigation
    }

    componentDidMount() {
        this._getData()
    }

    _getData = () => {
        let param = {
            item_id: this.state.item_id,
            trace_id: this.state.trace_id,
            is_detail: this.state.is_detail
        };
        HttpUtil.post("/v1/news", param).then(res => {
            if (res.code === 200) {
                this.setState({
                    init: true,
                    data: res.data,
                    comment_num: res.data.news.comment_num
                })
            } else {
                console.warn("error")
            }
        }, err => {
            console.warn(err)
        })
    };


    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: "column"
            }}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.back_btn} onPress={() => {
                        this.navigation.goBack()
                    }}>
                        <Image
                            style={styles.back_img}
                            source={require("../../img/ic_back_black_normal.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.back_btn} onPress={() => {
                        this.navigation.goBack()
                    }}>
                        <Image
                            style={styles.back_img}
                            source={require("../../img/ic_more_black_normal.png")} />
                    </TouchableOpacity>
                </View>
                {this.state.init ?
                    <ScrollView scrollEnabled={true} style={styles.main}>
                        <View>
                            <NewsBody
                                data={this.state.data}
                                navigation={this.navigation}
                                openImage={(pics, index) => {
                                    this.setState({
                                        images: pics,
                                        image_index: index,
                                        visible: true
                                    })
                                }
                                }
                                emptyClick={() => {
                                    this.commentModal.open(this.state.data.news)
                                }}
                                rePlay={(comment_id, name, parent_id) => {
                                    this.commentModal.open(this.state.data.news, { comment_id: comment_id, name: name, parent_id: parent_id })
                                }}
                            />

                        </View>
                    </ScrollView>
                    : <ScrollView scrollEnabled={false} style={[styles.main, styles.load_view]}>
                        <View>
                            <Placeholder.NewsContent
                                animate="shine"
                                size={{
                                    w: platform.deviceWidth - 30,
                                    h: (platform.deviceWidth - 30) / (16 / 9)
                                }}
                                lineNumber={2}
                                lineSpacing={20}
                                lastLineWidth="30%"
                                onReady={this.state.isReady} />
                        </View>

                    </ScrollView>
                }


                <View style={styles.bottomBar}>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.state.init) {
                                this.commentModal.open(this.state.data.news)
                            }

                        }}
                        style={styles.input_view}>
                        <Text style={{ color: "#999999", fontSize: 12 }}>我来说两句...</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.navigation.navigate("CommentScene", {
                                item_id: this.state.item_id,
                                news: this.state.data.news
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
                <PhotoView
                    visible={this.state.visible}
                    data={this.state.images}
                    hideStatusBar={true}
                    initial={this.state.image_index}
                    shareText="保存"
                    onDismiss={e => {
                        this.setState({ visible: false });
                    }}
                />
            </View>
        );
    }
}
const comment_bar_h = 49;
const styles = StyleSheet.create({
    photo: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#FFFFFF"
    },
    load_view: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10
    },
    bottomBar: {
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
    main: {
        backgroundColor: "#ffffff",
        flexGrow: 1,
        flex: 1
    },
    header_view: {},
    header: {
        paddingTop: platform.headerPaddingTop,
        backgroundColor: "#ffffff",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "#dcdcdc",
        borderBottomWidth: platform.borderH
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
    }
})