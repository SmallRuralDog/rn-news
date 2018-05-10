import React, { PureComponent } from 'react';
import { View, ActivityIndicator, Image, Text, TouchableOpacity } from 'react-native';

export default class StateView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            status: 'loading',
            err_text: "加载失败，点击重试！"
        }
    }

    setLoading() {
        this.setState({
            status: 'loading'
        })
    }

    setErr(text = this.state.err_text) {
        this.setState({
            status: 'err',
            err_text: text
        })
    }

    render() {
        return (
            <View style={[this.props.style, { flex: 1, alignItems: "center", justifyContent: "center" }]}>
                {this.state.status === 'loading' ?
                    <ActivityIndicator />
                    : this.state.status === 'err' ?
                        <TouchableOpacity
                            onPress={() => {
                                if (this.props.errClick) {
                                    this.props.errClick()
                                }
                            }}
                            style={{ alignItems: "center" }}>
                            <Image source={require('../img/img_blank_error.png')} style={{ width: 200, height: 200 }} />
                            <Text>{this.state.err_text}</Text>
                        </TouchableOpacity>
                        : null}
            </View>
        );
    }
}