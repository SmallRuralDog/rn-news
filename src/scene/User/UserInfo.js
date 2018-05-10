import React, { PureComponent } from 'react';
import { View, ScrollView, Image, DeviceEventEmitter, Alert } from 'react-native';
import { List, ActionSheet, Button, WhiteSpace, WingBlank, Modal, Toast } from 'antd-mobile';
import ImagePicker from 'react-native-image-crop-picker';
import Permissions from 'react-native-permissions';
import Header from '../../widget/Header';
import platform from '../../common/platform';
import user from '../../common/user';
import http from '../../common/http';
const Item = List.Item;
const Brief = Item.Brief;
export default class UserInfo extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            types: [],
            name: props.navigation.state.params.user.name,
            avatar: props.navigation.state.params.user.avatar,
        }
        this.navigation = props.navigation;
    }

    componentDidMount() {
        let types = Permissions.getTypes()
        let canOpenSettings = Permissions.canOpenSettings()
        this.setState({ types, canOpenSettings })
    }

    _editAvatar() {
        const BUTTONS = ['拍照', '从相册选择', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: 2,
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                ImagePicker.openCamera({
                    width: 300,
                    height: 300,
                    cropperCircleOverlay: true,
                    cropping: true
                }).then(image => {
                    this._uploadAvatar(image)
                }).catch(err => {
                    Permissions.check('camera').then(response => {
                        if (response != 'authorized') {
                            var buttons = [{ text: '取消', style: 'cancel' }]
                            if (this.state.canOpenSettings)
                                buttons.push({
                                    text: '去设置',
                                    onPress: () => { Permissions.openSettings() },
                                })

                            Alert.alert(
                                '无法使用相机',
                                '请在设置中允许使用相机',
                                buttons,
                            )
                        } else {

                        }
                    });
                });
            } else if (buttonIndex === 1) {
                ImagePicker.openPicker({
                    width: 300,
                    height: 300,
                    cropperCircleOverlay: true,
                    cropping: true
                }).then(image => {
                    this._uploadAvatar(image)
                }).catch(err => {
                    Permissions.check('photo').then(response => {
                        if (response != 'authorized') {
                            var buttons = [{ text: '取消', style: 'cancel' }]
                            if (this.state.canOpenSettings)
                                buttons.push({
                                    text: '去设置',
                                    onPress: () => { Permissions.openSettings() },
                                })

                            Alert.alert(
                                '无法使用相册',
                                '请在设置中允许访问照片。',
                                buttons,
                            )
                        } else {

                        }
                    });
                });


            }
        });
    }

    _uploadAvatar(image) {
        Toast.loading("正在上传");
        http.uploadImg("/v1/editAvatar", { width: image.width }, image.path).then(res => {
            console.log(res)
            if (res.code === 200) {
                Toast.info("修改成功")
                this.setState({
                    avatar: res.data
                })
                DeviceEventEmitter.emit("USER_INFO_UPDATE")
            } else {
                Toast.info(res.message)
            }
        }, err => {
            console.log(err)
            Toast.info("修改失败")
        })
    }
    _editName(name) {
        Toast.loading('修改中');
        http.post("/v1/editName", { name: name }).then(res => {
            if (res.code === 200) {
                Toast.info("修改成功")
                this.setState({
                    name: name
                })
                DeviceEventEmitter.emit("USER_INFO_UPDATE")
            } else {
                Toast.info(res.message)
            }
        }, err => {
            Toast.info("修改失败")
        })
    }



    _loginOut() {
        Modal.alert(
            '确定退出登录？',
            '',
            [
                { text: '取消', onPress: () => { }, style: 'cancel' },
                {
                    text: '确定', onPress: () => {
                        user.LoginOut();
                        DeviceEventEmitter.emit("LOGIN_OUT")
                        this.navigation.goBack()
                    }
                },
            ],
        );
    }

    render() {
        const { avatar, name } = this.state
        return (
            <View style={{ flex: 1, flexDirection: "column" }}>
                <Header title="个人信息" back={() => {
                    this.navigation.goBack()
                }} />
                <ScrollView
                    style={{ flex: 1, backgroundColor: '#f5f5f9' }}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <List renderHeader={() => '基本信息'}>
                        <Item
                            extra={<Image
                                source={{ uri: avatar }}
                                style={{ width: 50, height: 50, borderRadius: 25 }}
                            />}
                            arrow="horizontal"
                            onClick={() => { this._editAvatar() }}
                        >头像</Item>
                        <Item extra={name} arrow="horizontal" onClick={() => {
                            Modal.prompt(
                                null,
                                null,
                                name => {
                                    if (name) {
                                        if (name.length >= 2 && name.length <= 8) {
                                            this._editName(name)
                                        } else {
                                            Toast.fail("名称长度不符合")
                                        }
                                    } else {
                                        Toast.fail("请输入名称")
                                    }

                                },
                                'default',
                                null,
                                ['请输入昵称 2-8个字'],
                            );
                        }}>昵称</Item>
                    </List>
                    <WhiteSpace size="xl" />
                    <WingBlank >
                        <Button style={{ borderWidth: platform.borderH }} onClick={() => {
                            this._loginOut()
                        }}>退出登录</Button>
                    </WingBlank>
                </ScrollView>
            </View>
        );
    }
}