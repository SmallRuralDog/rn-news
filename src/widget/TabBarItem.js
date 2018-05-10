import React, { PureComponent } from 'react'
import { Image, View, StyleSheet, Animated } from 'react-native'
import * as Animatable from 'react-native-animatable'
import platform from '../common/platform';
class TabBarItem extends PureComponent {

    render() {
        let selectedImage = this.props.selectedImage
            ? this.props.selectedImage
            : this.props.normalImage
        return (
            <Animatable.View
                animation="bounceIn"
                style={{
                    width: 28,
                    height: 28,
                    marginBottom: platform.platform == "ios" ? (parseFloat(platform.version) >= 11 ? 8 : 0) : 0
                }}>

                {this.props.focused
                    ? <Animatable.Image
                        ref={ref => { this.bg = ref }}
                        animation="bounceIn"
                        source={this.props.selectedImage_bg}
                        style={styles.img} />
                    : null}
                <Animatable.Image
                    ref={ref => { this.icon = ref }}
                    source={this.props.focused
                        ? selectedImage
                        : this.props.normalImage}
                    style={styles.img} />

            </Animatable.View>

        );
    }
}
const styles = StyleSheet.create({
    img: {
        width: 28,
        height: 28,
        position: "absolute",
        top: 0,
        left: 0
    }
})
export default TabBarItem;