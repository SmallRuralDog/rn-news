import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import platform from '../common/platform';
export default class Heder extends Component {
    state = {}
    render() {
        return (
            <View style={styles.header}>
                <TouchableOpacity style={styles.back_btn} onPress={() => {
                    this.props.back()
                }}>
                    <Image
                        style={styles.back_img}
                        source={require("../img/ic_back_black_normal.png")} />
                </TouchableOpacity>
                <View style={styles.title_view}>
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
                {this.props.right ?
                    <TouchableOpacity
                        style={styles.back_btn} onPress={() => {
                            this.navigation.right()
                        }}>
                        <Image
                            style={styles.back_img}
                            source={require("../img/ic_more_black_normal.png")} />
                    </TouchableOpacity> : <View style={styles.back_btn} />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title_view: {
        height: platform.toolbarHeight,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        color: "#2e2e2e",
        fontSize: 17,
        fontWeight: "bold"
    },
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