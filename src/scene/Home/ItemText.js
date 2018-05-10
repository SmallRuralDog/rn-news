import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import platform from '../../common/platform'
import value from '../../widget/value';

export default class ItemText extends PureComponent {
    state = {
        ic_dislike: require('../../img/ic_homepage_dislike_normal.png')
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
                        <Text style={[styles.title,this.props.titleStyle]} numberOfLines={3}>{item.title}</Text>
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
                                <Image
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
        lineHeight: value.list_item_title_line_height,
        fontWeight: "bold",
        textAlignVertical: "top"
    },
    bottom_view: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8
    }
});