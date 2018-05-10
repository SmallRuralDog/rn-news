import React, { PureComponent } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import Header from '../../widget/Header'
import http from '../../common/http';
import platform from '../../common/platform';
import StateView from '../../widget/StateView';
import color from '../../widget/color';
export default class TaskRule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            init: false,
            data: []
        }
    }

    componentDidMount() {
        this._getData();
    }

    _getData() {
        this.refs.stateView.setLoading()
        http.post("/v1/task-rule", {}).then(res => {
            if (res.code == 200) {
                this.setState({
                    init: true,
                    data: res.data
                })
            } else {
                this.refs.stateView.setErr(res.message)
            }
        }, err => {
            this.refs.stateView.setErr('服务器错误，点击重试')
        });
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: "column", backgroundColor: "#f7f7f7" }}>
                <Header
                    back={() => {
                        this.props.navigation.goBack()
                    }}
                    title="任务规则"
                />
                {this.state.init ?
                    <ScrollView style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
                        <View style={{ padding: 15 }}>
                            {this.state.data.map((item, index) => {
                                if (item.type == 1) {
                                    return (
                                        <View key={index}>
                                            {item.title.length > 0
                                                ? <Text style={styles.title}>{item.title}</Text> : null}
                                            <Text style={styles.text}>{item.text}</Text>
                                        </View>
                                    )
                                } else {
                                    return (
                                        <View key={index} style={styles.card}>
                                            <View style={{ marginTop: 10, marginBottom: 10,paddingLeft: 10, borderLeftColor: color.theme, borderLeftWidth: 4 }}>
                                                <Text style={styles.card_title}>{item.title}</Text>
                                            </View>
                                            <View style={{ padding: 10, borderTopColor: color.border, borderTopWidth: platform.borderH }}>
                                                <Text style={styles.card_text}>{item.text}</Text>
                                            </View>

                                        </View>
                                    )
                                }
                            })}

                        </View>
                    </ScrollView>
                    : <StateView ref="stateView" errClick={() => { this._getData }} />}
            </View>
        );
    }
}
const lineHeight = platform.platform == 'ios' ? 25 : 30
const styles = StyleSheet.create({
    title: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#2e2e2e",
        marginTop: 30,
        marginBottom: 10
    },
    text: {
        fontSize: 16,
        color: "#666666",
        lineHeight: lineHeight,
        textAlign: "justify"
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 5,
        marginTop: 15
    },
    card_title: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#2e2e2e",
    },
    card_text: {
        fontSize: 15,
        color: "#666666",
        lineHeight: lineHeight,
        textAlign: "justify"
    }
})