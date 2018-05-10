import React, { Component, PureComponent } from 'react';
import { View, Text } from 'react-native';
import Placeholder from '../../component/placeholder';
import platform from '../../common/platform'
export default class ListLoadView extends Component {
    state = {
        list: [
            0,
            1,
            2,
            3,
            4
        ]
    }
    render() {
        return (
            <View>
                {this
                    .state
                    .list
                    .map((item, index) => {
                        return (
                            <View
                                key={index}
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    padding: 15,
                                    borderBottomColor: "#dcdcdc",
                                    borderBottomWidth: platform.borderH
                                }}>
                                <Placeholder.VideoList
                                    animate="shine"
                                    size={{
                                        w: platform.deviceWidth - 30,
                                        h: (platform.deviceWidth - 30) / (16 / 9)
                                    }}
                                    lineNumber={2}
                                    lineSpacing={20}
                                    lastLineWidth="30%"
                                    onReady={this.state.isReady} />
                            </View>
                        )
                    })}
            </View>
        );
    }
}