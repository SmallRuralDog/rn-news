import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import FastImage from 'react-native-fast-image'
import platform from '../../common/platform'
import util from '../../common/util';
import value from '../../widget/value';
export default class ItemVideo extends PureComponent {
    state = {
        ic_dislike: require('../../img/ic_homepage_dislike_normal.png'),
        ic_play: require('../../img/play_normal.png')
    }
    render() {
        const { item, onClick, onPressIn, onPressOut } = this.props;
        return (
            <TouchableHighlight
                onPress={onClick ? onClick : undefined}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                <View style={styles.item}>
                    <View>
                        <Text style={[styles.title,this.props.titleStyle]} numberOfLines={3} includeFontPadding={false}>{item.title}</Text>
                    </View>
                    <View style={styles.img_view}>
                        <FastImage
                            style={styles.img}
                            resizeMode="cover"
                            source={{
                                uri: item.video_info.cover.url
                            }} />
                        <View style={styles.img_mask} />
                        <FastImage style={styles.play_icon} source={this.state.ic_play} />
                        <View style={styles.time_view}>
                            <Text style={{ fontSize: 10, color: "#ffffff" }}>{util.arrive_timer_format(item.video_info.duration)}</Text>
                        </View>
                    </View>
                    <View style={styles.bottom_view}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: 11,
                                    color: "#999999"
                                }}>{item.media.media_name}</Text>
                            {item.comment_num > 0 ?
                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10 }}>
                                    <Image source={require("../../img/ic_homepage_comment_normal.png")} style={{ width: 12.5, height: 12.5 }} />
                                    <Text style={{ fontSize: 11, color: "#999999", fontWeight: "100" }}>{item.comment_num}</Text>
                                </View> : null}
                        </View>
                        <View>
                            <TouchableOpacity style={{ padding: 5 }}>
                                <FastImage
                                    source={this.state.ic_dislike}
                                    style={{
                                        width: 12,
                                        height: 12
                                    }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>

        );
    }
}
const iw = platform.deviceWidth - 30;
const ih = iw / (16 / 9)
const styles = StyleSheet.create({
    item: {
        flex: 0,
        flexDirection: "column",
        padding: 15,
        backgroundColor: "#FFFFFF"
    },

    title: {
        color: "#333333",
        fontSize: value.list_item_title,
        lineHeight: 25,
        fontWeight: "bold",
        textAlignVertical: "top"
    },
    bottom_view: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    img_view: {
        width: iw,
        height: ih,
        backgroundColor: "#f7f7f7",
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5
    },
    img_mask: {
        width: iw,
        height: ih,
        backgroundColor: "rgba(0,0,0,0.2)",
        position: "absolute",
        top: 0,
        left: 0,
        borderRadius: 5
    },
    play_icon: {
        width: 50,
        height: 50,
        position: "absolute",
        top: (ih - 50) / 2,
        left: (iw - 50) / 2,
        zIndex: 2
    },
    time_view: {
        borderRadius: 6,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 6,
        paddingRight: 6,
        backgroundColor: "rgba(0,0,0,0.4)",
        position: "absolute",
        bottom: 10,
        right: 8,
    },
    img: {
        width: iw,
        height: ih,
        borderRadius: 5
    }
});