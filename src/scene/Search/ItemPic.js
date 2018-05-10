import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, Image, TouchableHighlight, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image'
import ParsedText from 'react-native-parsed-text';
import cio from 'cheerio-without-node-native';
import platform from '../../common/platform'
import util from '../../common/util';
import value from '../../widget/value';
import color from '../../widget/color';

export default class ItemPic extends PureComponent {
    state = {
        ic_dislike: require('../../img/ic_homepage_dislike_normal.png')
    };

    setTitle(title) {
        let html = cio.parseHTML(title);
        console.log(html)
        return html.map((item, index) => {
            if (item.type == 'text') {
                return item.data
            } else {
                return <Text key={index} style={styles.hashTag}>{item.children[0].data}</Text>
            }
        })
    }

    render() {
        const { item, onClick, onPressIn, onPressOut } = this.props;
        return (
            <View>
                <TouchableHighlight
                    onPress={onClick ? onClick : undefined}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                >
                    <View style={styles.item}>
                        <View style={styles.left}>
                            <View>
                                <Text
                                    style={styles.title}
                                    numberOfLines={3}
                                    includeFontPadding={false}>{this.setTitle(item.title)}</Text>
                            </View>
                            <View style={styles.bottom_view}>
                                <View>
                                    <Text style={{ fontSize: 11, color: "#999999" }}>{item.media.media_name}</Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={styles.img}
                        >
                            <FastImage
                                style={styles.img}
                                resizeMode="cover"
                                source={{
                                    uri: item.pic_list[0].url
                                }} />
                            {item.content_type == 3 ?
                                <View style={styles.time_view}>
                                    <Text style={{ fontSize: 10, color: "#ffffff" }}>{util.arrive_timer_format(item.video_info.duration)}</Text>
                                </View>
                                : null}
                        </View>

                    </View>
                </TouchableHighlight>
                <View style={{ height: platform.borderH, backgroundColor: "#f0f0f0", marginLeft: 15, marginRight: 15 }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    hashTag: {
        color: color.search_key
    },
    item: {
        flex: 0,
        justifyContent: "space-between",
        flexDirection: "row",
        padding: 15,
        backgroundColor: "#FFFFFF"
    },
    left: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        flexGrow: 1,
        marginRight: 15
    },
    title: {
        color: "#333333",
        fontSize: value.list_item_title,
        lineHeight: value.list_item_title_line_height,
        fontWeight: "bold",
        textAlignVertical: "top"
    },
    bottom_view: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end"
    },
    img: {
        width: platform.HomeList.imgW,
        height: platform.HomeList.imgW * 0.85,
        borderRadius: 5,
        backgroundColor: "#f7f7f7"
    },
    time_view: {
        borderRadius: 3,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 6,
        paddingRight: 6,
        backgroundColor: "rgba(0,0,0,0.6)",
        position: "absolute",
        bottom: 5,
        right: 5,
    },
});
