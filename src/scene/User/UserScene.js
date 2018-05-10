import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, ScrollView, DeviceEventEmitter } from 'react-native';
import platform from '../../common/platform';
import USER from '../../common/user';
import http from '../../common/http';
import UserTask from './UserTask';

export default class UserScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            init: false,
            isLogin: false,
            user: false
        };
        this.navigation = props.navigation;
    }

    componentDidMount() {
        this._getData();
        DeviceEventEmitter.addListener("LOGIN_OK", () => {
            this._getData();
        });
        DeviceEventEmitter.addListener("LOGIN_OUT", () => {
            this._getData();
        });
        DeviceEventEmitter.addListener("USER_INFO_UPDATE", () => {
            this._getData();
        });
    }

    async _getData() {
        let isLogin = await USER.IsLogin();
        this.setState({
            init: true,
            isLogin: !isLogin ? false : true,

        });
        http.post("/v1/user-index", { "xx": "xx" }).then(res => {
            this.setState({
                user: res.data.user
            })
            if (res.data.user) {
                USER.SetUser(res.data.user)
            }
        }, err => {

        })
    }
    _user_info_click() {
        if (this.state.isLogin) {
            this.navigation.navigate("UserInfo", {
                user: this.state.user
            })
        } else {
            this.navigation.navigate("Login")
        }
    }

    render() {
        return (
            this.state.init ?
                <View style={{ flex: 1, flexDirection: "column" }}>

                    <ScrollView
                        style={{ backgroundColor: "#f7f7f7" }}
                        bounces={true}
                        stickyHeaderIndices={[0]}
                        automaticallyAdjustContentInsets={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View>
                            <ImageBackground
                                source={require("../../img/img_user_bg_header.png")}
                                style={styles.header}>
                                <TouchableOpacity style={styles.back_btn} onPress={() => {

                                }}>
                                    <Image
                                        style={styles.back_img}
                                        source={require("../../img/ic_message_normal.png")} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.back_btn} onPress={() => {
                                    this.navigation.navigate("SettingScene");
                                }}>
                                    <Image
                                        style={styles.back_img}
                                        source={require("../../img/ic_setting_normal.png")} />
                                </TouchableOpacity>
                            </ImageBackground>
                        </View>

                        <ImageBackground
                            style={styles.top_view}
                            source={require("../../img/img_user_bg_con.png")}
                        >
                            <View style={styles.top_user_info}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this._user_info_click()
                                    }}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingLeft: 15,
                                        paddingRight: 15
                                    }}
                                >
                                    <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#FFFFFF" }}>
                                        <Image
                                            style={{ width: 64, height: 64, borderRadius: 32 }}
                                            source={this.state.isLogin ? { uri: this.state.user.avatar } : require("../../img/user_head_default.png")}
                                        />
                                    </View>

                                    <View style={{
                                        flexGrow: 1,
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        marginLeft: 15
                                    }}>
                                        <Text style={{
                                            fontSize: 20,
                                            fontWeight: "500",
                                            color: "#333333",
                                            backgroundColor: "transparent"
                                        }}>{this.state.isLogin ? this.state.user.name : "点击登录"}</Text>
                                        {this.state.isLogin ? null :
                                            <Text style={{
                                                fontSize: 12,
                                                color: "#999999",
                                                marginTop: 10,
                                                backgroundColor: "transparent"
                                            }}>首次登录送红包，最高可得200元哦！</Text>
                                        }
                                    </View>
                                    <Image style={{ width: 20, height: 20 }}
                                        source={require("../../img/ic_user_more_normal.png")} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.top_property_view}>
                                <View style={styles.property_item}>
                                    <Text style={styles.property_num}>0.00</Text>
                                    <Text style={styles.property_name}>现金</Text>
                                </View>
                                <View style={styles.property_item}>
                                    <Text style={styles.property_num}>0</Text>
                                    <Text style={styles.property_name}>金币</Text>
                                </View>
                                <View style={styles.property_item}>
                                    <Text style={styles.property_num}>0</Text>
                                    <Text style={styles.property_name}>徒弟</Text>
                                </View>
                            </View>

                        </ImageBackground>
                        <View>

                        </View>
                        <UserTask state={this.state} navigation={this.navigation} />
                    </ScrollView>
                </View> : null
        );
    }
}
const styles = StyleSheet.create({
    top_view: {
        width: platform.deviceWidth,
        height: platform.deviceWidth / (750 / 278),
        flexDirection: "column"
    },
    top_user_info: {
        flexGrow: 1,
    },
    top_property_view: {
        width: platform.deviceWidth,
        height: platform.deviceWidth / (750 / 125),
        flexDirection: "row"
    },
    property_item: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1
    },
    property_num: {
        fontSize: 20,
        fontWeight: "500",
        color: "#333333",
        backgroundColor: "transparent"
    },
    property_name: {
        marginTop: 8,
        fontSize: 12,
        color: "#333333",
        backgroundColor: "transparent"
    },
    header: {
        paddingTop: platform.headerPaddingTop,
        backgroundColor: "#ffffff",
        flexDirection: "row",
        justifyContent: "flex-end"
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