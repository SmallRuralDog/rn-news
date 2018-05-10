import React, { PureComponent } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import platform from '../../common/platform';
import Button from 'apsl-react-native-button'
import color from '../../widget/color';
export default class UserTask extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            ic_gold_small: require("../../img/ic_gold_small.png"),
            private_ic_gold: require("../../img/private_ic_gold.png"),
            private_ic_box: require("../../img/private_ic_box.png"),
            sing_arr: [
                { day: 1, num: 10 },
                { day: 2, num: 15 },
                { day: 3, num: 20 },
                { day: 4, num: 25 },
                { day: 5, num: 30 },
                { day: 6, num: 35 },
                { day: 7, num: 40 }
            ],
            sing_day: 0
        }
        this.navigation = props.navigation;
    }


    render() {
        const log_line_w = (platform.deviceHeight - 30) / 12;
        const log_line_w_4 = log_line_w / 4;
        return (
            <View style={{ marginTop: 10, backgroundColor: "#f7f7f7" }}>
                <View style={styles.task_title_view}>
                    <Text style={{ fontSize: 12, color: "#999999", padding: 15 }}>每日任务</Text>
                    <TouchableOpacity
                        onPress={() => { this.navigation.navigate("TaskRule") }}
                        style={{ flexDirection: "row", alignItems: "center", padding: 15 }}>
                        <Image source={require('../../img/ic_task_about_normal.png')} style={{ width: 12, height: 12 }} />
                        <Text style={{ fontSize: 12, color: "#999999", marginLeft: 3 }}>查看任务规则</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.task_list}>
                    <View style={styles.border_bottom}>
                        <View style={styles.item}>
                            <View style={styles.item_left}>
                                <View style={styles.item_info}>
                                    <Text style={styles.item_title}>签到打卡</Text>
                                </View>
                                <Text style={styles.item_desc}>每日签到领金币</Text>
                            </View>
                            <Button style={styles.item_btn} textStyle={styles.btn_text}>签到</Button>
                        </View>
                        <View style={styles.sing_log_view}>
                            <View style={styles.log_line_bg}>
                                {this.props.state.isLogin ?
                                    <View style={{
                                        backgroundColor: color.theme,
                                        flex: 1,
                                        marginLeft: -log_line_w_4,
                                        width: log_line_w * this.state.sing_day,
                                        borderRadius: 4
                                    }} />
                                    : null}
                            </View>
                            <View style={styles.log_list}>
                                {this.state.sing_arr.map((item, index) => {
                                    return (
                                        <View key={index} style={[styles.log_item, this.state.sing_day >= item.day && this.props.state.isLogin ? styles.log_item_ac : null]}>
                                            {this.props.state.isLogin
                                                ? index == 6 ? <Image source={this.state.private_ic_box} style={styles.log_item_icon} /> : <Text style={[styles.log_item_num, this.state.sing_day >= item.day ? styles.log_item_num_ac : null]}>{item.num}</Text>
                                                : index == 6 ? <Image source={this.state.private_ic_box} style={styles.log_item_icon} /> : <Image source={this.state.private_ic_gold} style={styles.log_item_icon} />
                                            }
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                    <View style={styles.border_bottom}>
                        <View style={styles.item}>
                            <View style={styles.item_left}>
                                <View style={styles.item_info}>
                                    <Text style={styles.item_title}>绑定微信</Text>
                                    <Text style={styles.item_plus}>+</Text>
                                    <Text style={styles.item_num}>200</Text>
                                    <Image source={this.state.ic_gold_small} style={styles.item_b_icon} />
                                </View>
                                <Text style={styles.item_desc}>绑定微信立得200金币</Text>
                            </View>
                            <Button style={styles.item_btn} textStyle={styles.btn_text}>立即绑定</Button>
                        </View>
                    </View>
                    <View style={styles.border_bottom}>
                        <View style={styles.item}>
                            <View style={styles.item_left}>
                                <View style={styles.item_info}>
                                    <Text style={styles.item_title}>邀请收徒</Text>
                                    <Text style={styles.item_plus}>+</Text>
                                    <Text style={styles.item_num}>3</Text>
                                    <Text style={styles.item_money}>元</Text>
                                </View>
                                <Text style={styles.item_desc}>邀请一名好友可得3元，首次额外得0.5元</Text>
                            </View>
                            <Button style={styles.item_btn} textStyle={styles.btn_text}>立即邀请</Button>
                        </View>
                    </View>
                    <View style={styles.border_bottom}>
                        <View style={styles.item}>
                            <View style={styles.item_left}>
                                <View style={styles.item_info}>
                                    <Text style={styles.item_title}>输入邀请码</Text>
                                </View>
                                <Text style={styles.item_desc}>输入邀请码与好友建立师徒关系</Text>
                            </View>
                            <Button style={styles.item_btn} textStyle={styles.btn_text}>立即输入</Button>
                        </View>
                    </View>
                    <View style={styles.border_bottom}>
                        <View style={styles.item}>
                            <View style={styles.item_left}>
                                <View style={styles.item_info}>
                                    <Text style={styles.item_title}>晒收入</Text>
                                    <Text style={styles.item_plus}>+</Text>
                                    <Text style={styles.item_num}>10</Text>
                                    <Image source={this.state.ic_gold_small} style={styles.item_b_icon} />
                                </View>
                                <Text style={styles.item_desc}>晒出去立得10金币</Text>
                            </View>
                            <Button style={styles.item_btn} textStyle={styles.btn_text}>晒一晒</Button>
                        </View>
                    </View>
                    <View style={styles.border_bottom}>
                        <View style={styles.item}>
                            <View style={styles.item_left}>
                                <View style={styles.item_info}>
                                    <Text style={styles.item_title}>看资讯</Text>
                                    <Text style={styles.item_plus}>+</Text>
                                    <Text style={styles.item_num}>10</Text>
                                    <Image source={this.state.ic_gold_small} style={styles.item_b_icon} />
                                    <Text style={styles.item_title_p}> / 篇</Text>
                                </View>
                                <Text style={styles.item_desc}>认真阅读文章或看视频，每篇可得10金币</Text>
                            </View>
                            <Button style={styles.item_btn} textStyle={styles.btn_text}>立即看</Button>
                        </View>
                    </View>
                    <View style={styles.border_bottom}>
                        <View style={styles.item}>
                            <View style={styles.item_left}>
                                <View style={styles.item_info}>
                                    <Text style={styles.item_title}>分享文章</Text>
                                    <Text style={styles.item_plus}>+</Text>
                                    <Text style={styles.item_num}>10</Text>
                                    <Image source={this.state.ic_gold_small} style={styles.item_b_icon} />
                                    <Text style={styles.item_title_p}> / 篇</Text>
                                </View>
                                <Text style={styles.item_desc}>分享文章给好友，每篇可得10金币</Text>
                            </View>
                            <Button style={styles.item_btn} textStyle={styles.btn_text}>去分享</Button>
                        </View>
                    </View>
                    <View>
                        <View style={styles.item}>
                            <View style={styles.item_left}>
                                <View style={styles.item_info}>
                                    <Text style={styles.item_title}>看推送</Text>
                                    <Text style={styles.item_plus}>+</Text>
                                    <Text style={styles.item_num}>15</Text>
                                    <Image source={this.state.ic_gold_small} style={styles.item_b_icon} />
                                    <Text style={styles.item_title_p}> / 篇</Text>
                                </View>
                                <Text style={styles.item_desc}>阅读推送文章，每篇奖励15金币</Text>
                            </View>
                            <Button style={styles.item_btn} textStyle={styles.btn_text}>开启通知</Button>
                        </View>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sing_log_view: {
        width: platform.deviceWidth - 30,
        height: 26,
        marginBottom: 20
    },
    log_line_bg: {
        width: platform.deviceWidth - 30,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#f0f0f0",
        position: "absolute",
        top: 10,
        overflow: "hidden"
    },
    log_list: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 26,
    },
    log_item: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        justifyContent: "center"
    },
    log_item_num: {
        fontSize: 12,
        color: "#999999"
    },
    log_item_num_ac: {
        color: "#2e2e2e"
    },
    log_item_icon: {
        width: 26,
        height: 26,
        borderRadius: 13,
    },
    log_item_ac: {
        backgroundColor: color.theme
    },
    border_bottom: {
        borderBottomWidth: platform.borderH,
        borderBottomColor: color.border
    },
    item: {
        flexDirection: "row",
        paddingTop: 25,
        paddingBottom: 15
    },
    item_btn: {
        width: 100,
        height: 36,
        borderRadius: 18,
        borderWidth: 0,
        backgroundColor: color.theme
    },
    btn_text: {
        fontSize: 14
    },
    item_left: {
        flexGrow: 1,
        flexDirection: "column"
    },
    item_info: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8
    },
    item_title: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#2e2e2e"
    },
    item_plus: {
        marginLeft: 10,
        fontSize: 13,
        color: "#ec523e"
    },
    item_num: {
        marginLeft: 5,
        fontSize: 18,
        color: "#ec523e"
    },
    item_money: {
        marginLeft: 5,
        fontSize: 17,
        color: "#ec523e"
    },
    item_b_icon: {
        width: 17,
        height: 17,
        marginLeft: 5
    },
    item_title_p: {
        fontSize: 12,
        color: "#999999",
        marginLeft: 3
    },
    item_desc: {
        fontSize: 12,
        color: "#999999"
    },
    task_list: {
        backgroundColor: "#FFFFFF",
        paddingLeft: 15,
        paddingRight: 15
    },
    sing_in_item: {
        paddingTop: 15,
        paddingBottom: 15
    },
    task_title_view: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: platform.borderH,
        borderBottomColor: color.border,
        backgroundColor: "#FFFFFF"
    }
});