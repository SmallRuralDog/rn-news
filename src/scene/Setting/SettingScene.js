import React, { PureComponent } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ImageBackground, DeviceEventEmitter } from 'react-native';
import { List, WhiteSpace, Switch } from 'antd-mobile'
import Header from '../../widget/Header';
import color from '../../widget/color';
import Modal from 'react-native-modalbox'
import storage from '../../common/storage';
export default class SettingScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            fontSize: 18,
            fontSizeName: ""
        }
        this.navigation = props.navigation;
        this.font_arr = [
            { name: "小", value: 15 },
            { name: "中", value: 18 },
            { name: "大", value: 22 },
            { name: "特大", value: 25 },
        ]
        this.setting_fontsize_normal = require("../../img/img_setting_fontsize_normal.png");
        this.setting_fontsize_activated = require("../../img/img_setting_fontsize_activated.png");
    }
    componentDidMount() {
        this.getFontSize()
    }

    async getFontSize() {
        let fontSize = await storage.get("FONT_SIZE")
        if (fontSize == null) {
            this.setState({
                fontSize: 18,
                fontSizeName: "中"
            })
        } else {
            this.font_arr.map(item => {
                if (item.value == fontSize.value) {
                    this.setState({
                        fontSize: item.value,
                        fontSizeName: item.name
                    })
                }
            })
        }
    }


    onSwitchChange = (value) => {
        this.setState({
            checked: value,
        });
    }
    setFont = (value) => {
        storage.save("FONT_SIZE", { value: value })
        this.setState({
            fontSize: value
        })
        this.getFontSize()
        DeviceEventEmitter.emit("FONT_SIZE_CHANGE", value)
    }
    render() {
        return (
            <View style={styles.page}>
                <Header title="设置" back={() => { this.navigation.goBack() }} />
                <ScrollView
                    style={{ flex: 1, backgroundColor: color.background }}
                    showsVerticalScrollIndicator={false}
                >
                    <WhiteSpace />
                    <List>
                        <List.Item arrow="horizontal" >
                            <Text style={styles.list_item}>阅读历史</Text>
                        </List.Item>
                    </List>
                    <WhiteSpace />
                    <List>
                        <List.Item arrow="horizontal" extra={this.state.fontSizeName} onClick={() => {
                            this.fintModal.open()
                        }}>
                            <Text style={styles.list_item}>文字大小</Text>
                        </List.Item>
                        <List.Item extra={
                            <Switch color={color.theme} checked={this.state.checked} onChange={this.onSwitchChange} />
                        }>
                            <Text style={styles.list_item}>推送通知</Text>
                        </List.Item>
                        <List.Item extra="15.4MB">
                            <Text style={styles.list_item}>清除缓存</Text>
                        </List.Item>
                    </List>

                </ScrollView>
                <Modal
                    position="bottom"
                    style={{ height: 220 }}
                    ref={ref => { this.fintModal = ref }}
                >
                    <View style={{ flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: 80 }}>
                            <Text style={{ fontSize: this.state.fontSize }}>随时随地，想看就看</Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            {this.font_arr.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setFont(item.value)
                                        }}
                                        key={index}>
                                        <ImageBackground
                                            source={this.state.fontSize == item.value ? this.setting_fontsize_activated : this.setting_fontsize_normal}
                                            style={styles.font_btn}>
                                            <Text style={styles.font_name}>{item.name}</Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        flexDirection: "column"
    },
    list_item: {
        fontSize: 16,
        color: "#2e2e2e",
        paddingTop: 12,
        paddingBottom: 12
    },
    font_btn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    font_name: {
        fontSize: 18,
        color: "#2e2e2e",
        backgroundColor: color.transparent
    }
})