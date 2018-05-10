import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import CommentItem from './CommentItem';
import color from '../../widget/color';
export default class PageView extends PureComponent {
    state = {}
    render() {
        const { list, style, emptyClick, comment_num, goList, rePlay } = this.props;
        return (
            <View>
                <View style={{
                    borderLeftColor: "#ffe110",
                    borderLeftWidth: 4,
                    marginTop: 15, marginLeft: 15, marginBottom: 5
                }}><Text style={{ fontSize: 20, color: "#333333", marginLeft: 5 }}>热门评论</Text></View>
                {list.length > 0
                    ? <View>
                        {list.map((item, index) => {
                            return <CommentItem
                                key={item.comment_id}
                                item={item}
                                navigation={this.props.navigation}
                                rePlay={(comment_id, name, parent_id) => {
                                    rePlay(comment_id, name, parent_id)
                                }}
                            />
                        })}
                        {comment_num > 10 ?
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: 50 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        goList()
                                    }}
                                >
                                    <Text style={{ color: "#999999" }}>查看全部<Text style={{ color: color.theme_text_color, fontWeight: "bold" }}> {comment_num} </Text>条评论</Text>
                                </TouchableOpacity>
                            </View>
                            : null
                        }
                    </View>
                    : <TouchableOpacity
                        onPress={() => {
                            if (emptyClick) {
                                emptyClick()
                            }
                        }}
                        activeOpacity={1}
                        style={[styles.empty_view, style]}>
                        <Image
                            style={{ width: 120, height: 120 }}
                            source={require("../../img/img_blank_comment.png")}
                        />
                        <Text style={{ fontWeight: "bold", fontSize: 16, color: "#444444" }}>等你来评论哦</Text>
                        <Text style={{ fontSize: 13, color: "#999999", marginTop: 12 }}>听说第一个发评论的人长得最好看...</Text>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    empty_view: {
        height: 300,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    }
})