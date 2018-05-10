import React, { PureComponent } from 'react';
import { View, StyleSheet, InteractionManager } from 'react-native';
import PhotoView from 'react-native-photo-view';
import platform from '../../common/platform';
export default class PhotoBrowser extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            init: true
        }
        this.navigation = props.navigation
    }
    componentDidMount() {
        InteractionManager.clearInteractionHandle(() => {
            this.setState({
                init: false
            })
        });
    }
    _onScale = (event) => {
        console.log('_onScale', event.nativeEvent);
    };
    _onTap = (event) => {
        console.log('_onTap', event.nativeEvent);
    };
    _onViewTap = (event) => {
        this.navigation.goBack()
    };
    _onLoadStart = (event) => {
        console.log('_onLoadStart', event.nativeEvent);
    };
    _onLoad = (event) => {
        console.log('_onLoad', event.nativeEvent);
    };
    _onLoadEnd = (event) => {
        console.log('_onLoadEnd', event.nativeEvent);
    };
    render() {
        return (
            <View style={styles.page}>
                {this.state.init ?
                    <PhotoView
                        source={{ uri: 'http://p.cdn.smovie168.com/list/3c443040/d04ec01e53e84f5ff6a6a7e9e198a8ef.jpeg' }}
                        onScale={this._onScale}
                        onTap={this._onTap}
                        onViewTap={this._onViewTap}
                        onLoadStart={this._onLoadStart}
                        onLoad={this._onLoad}
                        onLoadEnd={this._onLoadEnd}
                        showsVerticalScrollIndicator={true}
                        showsHorizontalScrollIndicator={true}
                        minimumZoomScale={0.5}
                        maximumZoomScale={3}
                        style={{ width: platform.deviceWidth, height: platform.deviceHeight }} />
                    : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#000000"
    }
})