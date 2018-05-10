import React, { PureComponent } from 'react';
import { StyleSheet, View, TextInput, Keyboard, BackHandler, TouchableOpacity, Text } from 'react-native';
import { TextareaItem } from 'antd-mobile';
import Modal from 'react-native-modalbox'
import platform from '../../common/platform';
import Toast from '../../component/Toast';
import color from '../../widget/color';
import user from '../../common/user';
import http from '../../common/http';

const modal_height = 200;
export default class CommentModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            placeholder: "优质评论将会在前排展示哦~",
            comment_value: '',
            item: {},
            re_name: "",
            comment_id: 0,
            parent_id: 0


        }
        this.postComment = this.postComment.bind(this)
    }

    componentWillMount() {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidHide = () => {
        this.modal.close();
    }
    open(item, comment = { comment_id: 0, name: "", parent_id: 0 }) {
        this.setState({
            item: item,
            comment_id: comment.comment_id,
            re_name: comment.name,
            parent_id: comment.parent_id,
            placeholder: comment.comment_id > 0 ? "回复" + comment.name+":" : "优质评论将会在前排展示哦~"
        })
        this.modal.open()
    }

    okClose() {
        this.setState({
            comment_value: ''
        })
        this.close()
    }

    close() {
        this.modal.close()
    }

    async postComment() {
        if (this.state.comment_value.length <= 0) {
            Toast.show("请输入评论内容"); return false;
        }
        let isLogin = await user.IsLogin()
        if (isLogin) {
            http.post("/v1/comment-add", {
                item_id: this.state.item.item_id,
                content: this.state.comment_value,
                comment_id: this.state.comment_id,
                parent_id: this.state.parent_id
            }).then(res => {
                if (res.code === 200) {
                    Toast.show("发表成功")
                    if (this.props.okCallBack) {
                        this.props.okCallBack()
                    }
                } else {
                    Toast.show(res.message)
                }
            }, err => {
                Toast.show("请求失败")
            })
        } else {
            if (this.props.goLogin) {
                this.props.goLogin()
            } else {
                Toast.show("未登录")
            }
        }
    }

    render() {
        return (
            <Modal
                ref={ref => { this.modal = ref }}
                style={styles.modal}
                backButtonClose={true}
                coverScreen={false}
            //position="bottom"
            >
                <View style={{ height: modal_height, flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity style={styles.btn} onPress={() => {
                            this.modal.close()
                        }}>
                            <Text>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.postComment()
                            }}
                            style={styles.btn}>
                            <Text style={{ fontWeight: "bold", color: this.state.comment_value.length > 0 ? color.theme_text_color : null }}>发表</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        ref="comment_input"
                        value={this.state.comment_value}
                        underlineColorAndroid={"transparent"}
                        style={styles.comment_input}
                        placeholder={this.state.placeholder}
                        multiline={true}
                        autoFocus={true}
                        maxLength={120}
                        blurOnSubmit={true}
                        placeholderTextColor="#999999"
                        onChangeText={text => {
                            this.setState({
                                comment_value: text
                            })
                        }}
                    />
                </View>
            </Modal >
        );
    }
}
const styles = StyleSheet.create({
    modal: {
        height: modal_height
    },
    btn: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 8,
        paddingTop: 15
    },
    comment_input: {
        flexGrow: 1,
        textAlignVertical: 'top',
        color: "#2e2e2e",
        fontSize: 16,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15
    },
})