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
            <View>
                <TouchableHighlight
                    onPress={onClick ? onClick : undefined}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                >
                    <View style={styles.item}>
                        <View>
                            <Text style={styles.title} numberOfLines={3}>{item.title}</Text>
                        </View>
                        <View style={styles.bottom_view}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 11,
                                        color: "#999999"
                                    }}>{item.media.media_name}</Text>
                            </View>
                            <View>

                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
                <View style={{ height: platform.borderH, backgroundColor: "#f0f0f0", marginLeft: 15, marginRight: 15 }} />
            </View>
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
        alignItems: "flex-end",
        marginTop: 8
    }
});