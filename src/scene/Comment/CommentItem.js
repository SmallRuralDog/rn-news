import React, { PureComponent } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import platform from '../../common/platform';
import user from '../../common/user';
import Toast from '../../component/Toast';
import http from '../../common/http';
import storage from '../../common/storage';
export default class CommentItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ic_comment_thumbsup_normal: require("../../img/ic_comment_thumbsup_normal.png"),
            ic_comment_thumbsup_activated: require("../../img/ic_comment_thumbsup_activated.png"),
            ic_comment_thumbsup: require("../../img/ic_comment_thumbsup_normal.png"),
            item: this.props.item,
            like_num: this.props.item.like_num,
            st_name: ("USER_COMMENT_ZAN_" + this.props.item.comment_id)
        }
        this.navigation = props.navigation
    }

    componentDidMount() {
        this.setIcon()
    }

    async setIcon() {
        let isZan = await this.isZan()
        if (isZan) {
            this.setState({
                ic_comment_thumbsup: this.state.ic_comment_thumbsup_activated
            })
        } else {
            this.setState({
                ic_comment_thumbsup: this.state.ic_comment_thumbsup_normal
            })
        }
    }

    async zan() {
        let isLogin = await user.IsLogin();
        if (isLogin) {
            let isZan = await this.isZan()
            if (isZan) {
                Toast.show("已经赞过了");
                return false;
            }
            http.post("/v1/comment-zan", {
                comment_id: this.state.item.comment_id
            }).then(res => {
                if (res.code === 200) {
                    let like_num = this.state.like_num;
                    like_num = like_num + 1
                    this.setState({
                        like_num: like_num
                    })
                    this.zanOk()
                } else {
                    Toast.show(res.message)
                }
            }, err => {
                Toast.show("请求失败")
            })
        } else {
            this.navigation.navigate("Login")
        }
    }

    async zanOk() {
        this.setState({
            ic_comment_thumbsup: this.state.ic_comment_thumbsup_activated
        })
        let user_comment_zan = await storage.get(this.state.st_name)
        storage.save(this.state.st_name, { state: true })
    }

    async isZan() {
        let user_comment_zan = await storage.get(this.state.st_name)
        try {
            return user_comment_zan.state
        } catch (error) {
            return false
        }
    }

    rePlay() {
        if (this.props.rePlay) {
            this.props.rePlay(this.state.item.comment_id, this.state.item.user.name, 0)
        }
    }
    c_rePlay(pid, name) {
        if (this.props.rePlay) {
            this.props.rePlay(this.state.item.comment_id, name, pid)
        }
    }

    render() {
        const { item, like_num } = this.state;
        return (
            <View style={[styles.item, this.props.style]}>
                <View style={styles.avatar_view}>
                    <Image style={styles.avatar} source={{ uri: item.user.avatar }} />
                </View>
                <View style={styles.r_main}>
                    <View style={styles.top}>
                        <TouchableOpacity activeOpacity={1} onPress={() => { this.rePlay() }}>
                            <Text style={styles.nickname}>{item.user.name}{item.user.p_name ? "@" + item.user.p_name : null}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                this.zan()
                            }}
                            style={styles.zan_btn}>
                            <Text style={{ fontSize: 13, color: "#969fac", marginRight: 3 }}>{like_num || "赞"}</Text>
                            <Image style={styles.zan_btn_icon} source={this.state.ic_comment_thumbsup} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={() => { this.rePlay() }}>
                        <Text style={styles.content} selectable={true} suppressHighlighting={false}>{item.content}</Text>
                    </TouchableOpacity>
                    <View style={styles.bottom}>
                        <Text style={{ fontSize: 12, color: "#999999" }}>{item.created_time}</Text>
                        <Text style={styles.dian}>·</Text>
                        <TouchableOpacity activeOpacity={1} onPress={() => { this.rePlay() }}>
                            <Text style={{ fontSize: 12, color: "#999999" }}>回复TA</Text>
                        </TouchableOpacity>
                    </View>
                    {item.re_play_num>0 && this.props.show_replay ?
                        <View style={{ backgroundColor: "#f7f7fa", paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 10, borderRadius: 1, marginTop: 10 }}>
                            {item.re_play.map((item, index) => {
                                return (<TouchableOpacity activeOpacity={1}
                                    onPress={() => { this.c_rePlay(item.comment_id, item.user.name) }}
                                    key={item.comment_id}>
                                    <Text style={styles.re_content} selectable={true} suppressHighlighting={false}>

                                        <Text style={{ color: "#888797" }}>{item.user.name}{item.user.p_name ? "@" + item.user.p_name : null}：</Text>
                                        {item.content}
                                    </Text>
                                </TouchableOpacity>);
                            })}
                            {item.re_play.length < item.re_play_num ?
                                <TouchableOpacity
                                    onPress={() => {
                                        this.navigation.navigate("CommentInfo", {
                                            comment: this.state.item
                                        })
                                    }}
                                    activeOpacity={1}
                                    style={{ height: 30, flexDirection: "row", alignItems: "center" }}
                                >
                                    <Text style={{ color: "#999999" }}>查看全部{item.re_play_num}条回复</Text>
                                    <Image source={require("../../img/ic_list_chevron.png")} style={{ width: 8, height: 16, marginLeft: 5 }} />
                                </TouchableOpacity>
                                : null}
                        </View>
                        : null}
                </View>
            </View>
        );
    }
}
CommentItem.defaultProps = {
    show_replay: true
}
const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        padding: 12,
        backgroundColor: "#FFFFFF"
    },
    avatar_view: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#f7f7f7",
        marginLeft: 8,
        marginRight: 8
    },
    avatar: {
        width: 34,
        height: 34,
        borderRadius: 17
    },
    r_main: {
        flexDirection: "column",
        flexGrow: 1,
        flexShrink: 1
    },
    top: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    nickname: {
        fontSize: 14,
        color: "#406599"
    },
    content: {
        fontSize: 16,
        lineHeight: platform.platform == "ios" ? 25 : 30,
        color: "#222122",
        marginTop: 4,
        marginBottom: 8
    },
    re_content: {
        fontSize: 15,
        lineHeight: platform.platform == "ios" ? 25 : 30,
        color: "#222122",
    },
    bottom: {
        flexDirection: "row",
        alignItems: "center"
    },
    dian: {
        marginLeft: 5,
        marginRight: 5,
        color: "#999999"
    },
    zan_btn: {
        flexDirection: "row",
        alignItems: "center"
    },
    zan_btn_icon: {
        width: 14,
        height: 25
    }
})