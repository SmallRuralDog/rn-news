import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    TextInput,
    ScrollView,
    TouchableHighlight,
    DeviceEventEmitter,
    InteractionManager
} from 'react-native';
import platform from '../../common/platform';
import Toast from '../../component/Toast';
import Button from 'apsl-react-native-button'
import HTTPUtil from '../../common/http';
import user from '../../common/user';

export default class Login extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            timerCount: this.props.timerCount || 90,
            timerTitle: this.props.timerTitle || '获取验证码',
            counting: false,
            code_btn_disabled: false,
            code_btn_load: false,
            login_btn_disabled: false,
            login_btn_load: false,
            phone: null,
            code: null
        }
        this._shouldStartCountting = this._shouldStartCountting.bind(this)
        this._countDownAction = this._countDownAction.bind(this)
    }

    componentDidMount() {
        DeviceEventEmitter.addListener("LOGIN_OK", () => {
            this.props.navigation.goBack()
        });
        InteractionManager.runAfterInteractions(() => {
            this.refs.phone_input.focus()
        })
    }

    _getCode = () => {
        const { phone } = this.state;
        if (phone === null || phone.length !== 11) {
            Toast.show("请输入正确的手机号码")
        } else {
            this.setState({
                code_btn_load: true
            })
            HTTPUtil.get("/v1/send-sms", { phone: phone }).then(res => {
                this.setState({
                    code_btn_load: false
                })
                if (res.code === 200) {
                    this._shouldStartCountting(true)
                } else {
                    Toast.show(res.message)
                }
            }, err => {
                this.setState({
                    code_btn_load: false
                })
                Toast.show("发送失败")
            })
        }
    }

    _countDownAction() {
        const codeTime = this.state.timerCount;
        this.interval = setInterval(() => {
            const timer = this.state.timerCount - 1
            if (timer === 0) {
                this.interval && clearInterval(this.interval);
                this.setState({
                    timerCount: codeTime,
                    timerTitle: this.props.timerTitle || '获取验证码',
                    counting: false,
                    code_btn_disabled: false
                })
            } else {
                this.setState({
                    timerCount: timer,
                    timerTitle: `${timer}秒`,
                })
            }
        }, 1000)
    }

    _shouldStartCountting(shouldStart) {
        if (this.state.counting) {
            return
        }
        if (shouldStart) {
            this._countDownAction()
            this.setState({ counting: true, code_btn_disabled: true })
        } else {
            this.setState({ code_btn_disabled: false })
        }
    }

    _login = () => {
        const { phone, code } = this.state
        if (phone === null || phone.length !== 11) {
            Toast.show("请输入正确的手机号码")
            return false;
        }
        if (code === null || code.length < 4) {
            Toast.show("请输入短信验证码")
            return false;
        }
        this.setState({
            login_btn_load: true,
            login_btn_disabled: true
        });
        HTTPUtil.post("/v1/login", { phone: phone, code: code }).then(res => {
            this.setState({
                login_btn_load: false,
                login_btn_disabled: false
            })
            if (res.code === 200) {
                user.LoginOk(res.data.user, res.data.token)
                DeviceEventEmitter.emit("LOGIN_OK")
            } else {
                Toast.show(res.message)
            }
        }, err => {
            this.setState({
                login_btn_load: false,
                login_btn_disabled: false
            })
            Toast.show("请求失败")
        })
    };

    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: "column",
                backgroundColor: "#ffffff"
            }}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.back_btn} onPress={() => {
                        this.props.navigation.goBack()
                    }}>
                        <Image
                            style={styles.back_img}
                            source={require("../../img/ic_back_black_normal.png")} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ padding: 15 }}>
                        <View style={styles.input_border_view}>
                            <Image source={require("../../img/ic_phone_number.png")}
                                style={{ width: 30, height: 30, marginRight: 5 }} />
                            <TextInput
                                ref="phone_input"
                                style={styles.input}
                                placeholder="输入手机号"
                                underlineColorAndroid="transparent"
                                clearButtonMode="while-editing"
                                returnKeyType="next"
                                maxLength={11}
                                autoFocus={false}
                                keyboardType={"numeric"}
                                returnKeyLabel="next"
                                onChangeText={(text) => {
                                    this.setState({
                                        phone: text
                                    })
                                }}
                            />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <View style={[styles.input_border_view, styles.code_view]}>
                                <Image source={require("../../img/ic_auth_code.png")}
                                    style={{ width: 30, height: 30, marginRight: 5 }} />
                                <TextInput
                                    style={[styles.input, styles.code_input]}
                                    placeholder="输入验证码"
                                    underlineColorAndroid="transparent"
                                    clearButtonMode="while-editing"
                                    returnKeyType="send"
                                    maxLength={4}
                                    keyboardType={"numeric"}
                                    returnKeyLabel="send"
                                    onChangeText={(text) => {
                                        this.setState({
                                            code: text
                                        })
                                    }}
                                />
                                <View style={{ height: 30 }}>
                                    <Button
                                        style={styles.get_code_btn}
                                        textStyle={{ fontSize: 14 }}
                                        isLoading={this.state.code_btn_load}
                                        isDisabled={this.state.code_btn_disabled}
                                        onPress={() => {
                                            this._getCode()
                                        }}>{this.state.timerTitle}</Button>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Button
                                style={styles.login_btn}
                                textStyle={{ fontSize: 17 }}
                                onPress={this._login}
                                isLoading={this.state.login_btn_load}
                                isDisabled={this.state.login_btn_disabled}
                            >
                                登录
                            </Button>
                        </View>

                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    login_btn: {
        height: 50,
        borderRadius: 25,
        backgroundColor: "#ffe110",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 0,
        justifyContent: "center"
    },
    get_code_btn: {
        width: 120,
        height: 30,
        borderRadius: 15,
        borderWidth: 0,
        backgroundColor: "#ffe110",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    code_view: {
        flexDirection: "row",
        alignItems: "center"
    },
    code_input: {
        flexGrow: 1
    },
    input: {
        fontSize: 18,
        flexGrow: 1
    },
    input_border_view: {
        height: 50,
        borderColor: "#dcdcdc",
        borderWidth: platform.borderH,
        borderRadius: 25,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    header: {
        paddingTop: platform.headerPaddingTop,
        backgroundColor: "#ffffff",
        flexDirection: "row",
        justifyContent: "flex-start",
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