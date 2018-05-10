import React, { PureComponent } from 'react';
import {
    Image,
    StyleSheet,
    LayoutAnimation,
    Text,
    TouchableHighlight,
    Dimensions,
    PanResponder,
    View,
    Alert,
    NativeModules
} from 'react-native';
import Modal from 'react-native-modalbox';
import RootSiblings from 'react-native-root-siblings';
//获取屏幕宽高
let { width, height } = Dimensions.get('window');
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
export default class More extends PureComponent {
    constructor() {
        super();
        this._width = width / 4;
        this.topIndex = 0;
        this.leftIndex = 0;
        this.index = 0;
        this.finalTopIndex = 0;
        this.finalLeftIndex = 0;
        this.finalIndex = 0;
        this.prev_left = 0;
        this.prev_top = 0;
        this.left = 0;
        this.top = 0;
        this.offset = 90; //偏移
        this.items = [
            {
                id: 0,
                name: '首页',
                ordernum: 0
            },
            {
                id: 1,
                name: '成交价',
                ordernum: 0
            },
            {
                id: 2,
                name: '库存',
                ordernum: 0
            },
            {
                id: 3,
                name: '快讯',
                ordernum: 0
            },
            {
                id: 4,
                name: '分析',
                ordernum: 0
            },
            {
                id: 5,
                name: '视频',
                ordernum: 0
            },
            {
                id: 6,
                name: '钢厂',
                ordernum: 0
            },
            {
                id: 7,
                name: '期货',
                ordernum: 0
            }
        ];
        this.state = {}
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => {
                return gestureState.dx !== 0 || gestureState.dx !== 0;
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                const { pageX, pageY } = evt.nativeEvent;

                this.topIndex = Math.floor((pageY - this.offset) / (this._width / 2));
                this.leftIndex = Math.floor(pageX / this._width);
                this.index = this.topIndex * 4 + this.leftIndex;

                this.prev_left = this._width * this.leftIndex;
                this.prev_top = this._width / 2 * this.topIndex;
            },
            onPanResponderMove: (evt, gestureState) => {
                //Alert.alert(JSON.stringify(this.index));
                if (this.index > 0) {
                    this.left = this.prev_left + gestureState.dx;
                    this.top = this.prev_top + gestureState.dy;
                    let box = this.refs[this.items[this.index].id];
                    box.setNativeProps({
                        style: { top: this.top, left: this.left }
                    });
                }
            },

            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                if (this.index > 0) {
                    const { pageX, pageY } = evt.nativeEvent;
                    this.finalTopIndex = Math.floor((pageY - this.offset) / (this._width / 2));
                    this.finalLeftIndex = Math.floor(pageX / this._width);
                    let index = this.finalTopIndex * 4 + this.finalLeftIndex;

                    this.prev_left = this._width * this.finalTopIndex;
                    this.prev_top = this._width / 2 * this.finalTopIndex;

                    if (index > 0 && this.items[index]) {
                        if (index > this.index) {
                            //往后移动
                            for (let i = this.index; i < index; i++) {
                                let box2 = this.refs[this.items[i + 1].id];
                                let top2 = Math.floor(i / 4) * (this._width / 2);
                                let left2 = (i % 4) * this._width;
                                //LayoutAnimation.linear();
                                LayoutAnimation.configureNext(
                                    LayoutAnimation.create(
                                        200,
                                        LayoutAnimation.Types.linear,
                                        LayoutAnimation.Properties.scaleXY
                                    )
                                );
                                box2.setNativeProps({
                                    style: {
                                        top: top2,
                                        left: left2
                                    }
                                });
                            }
                            let box1 = this.refs[this.items[this.index].id];
                            let top1 = Math.floor(index / 4) * (this._width / 2);
                            let left1 = (index % 4) * this._width;

                            box1.setNativeProps({
                                style: {
                                    top: top1,
                                    left: left1
                                }
                            });
                            let temp = this.items[this.index];
                            for (let i = this.index; i < index; i++) {
                                this.items[i] = this.items[i + 1];
                            }
                            this.items[index] = temp;
                        } else if (index < this.index) {
                            //往前移动
                            for (let i = this.index; i > index; i--) {
                                let box2 = this.refs[this.items[i - 1].id];
                                let top2 = Math.floor(i / 4) * (this._width / 2);
                                let left2 = (i % 4) * this._width;
                                //LayoutAnimation.linear();
                                LayoutAnimation.configureNext(
                                    LayoutAnimation.create(
                                        200,
                                        LayoutAnimation.Types.linear,
                                        LayoutAnimation.Properties.scaleXY
                                    )
                                );
                                box2.setNativeProps({
                                    style: {
                                        top: top2,
                                        left: left2
                                    }
                                });
                            }
                            let box1 = this.refs[this.items[this.index].id];
                            let top1 = Math.floor(index / 4) * (this._width / 2);
                            let left1 = (index % 4) * this._width;

                            box1.setNativeProps({
                                style: {
                                    top: top1,
                                    left: left1
                                }
                            });
                            let temp = this.items[this.index];
                            for (let i = this.index; i > index; i--) {
                                this.items[i] = this.items[i - 1];
                            }
                            this.items[index] = temp;
                        }
                    } else {
                        //移出范围，则重新回到原始位置
                        let box1 = this.refs[this.items[this.index].id];
                        let top1 = Math.floor(this.index / 4) * (this._width / 2);
                        let left1 = (this.index % 4) * this._width;
                        LayoutAnimation.linear();
                        box1.setNativeProps({
                            style: {
                                top: top1,
                                left: left1
                            }
                        });
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); //系统自带
                    }
                }
            },
            //onPanResponderTerminate: (evt, gestureState) => this._release(evt, gestureState),
            onShouldBlockNativeResponder: (event, gestureState) => true
        });
    }

    render() {
        const boxes = this.items.map((item, index) => {
            let top = Math.floor(index / 4) * (this._width / 2);
            let left = (index % 4) * this._width;

            return (
                <View
                    ref={'' + item.id}
                    {...this._panResponder.panHandlers}
                    key={'' + item.id}
                    style={[styles.touchBox, { top, left }]}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: (width - 10) / 4 - 10,
                            height: (width - 10) / 8 - 10,
                            //width: width / 4 - 10,
                            //height: width / 8 - 10,
                            backgroundColor: '#f3f3f3',
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: '#f3f3f3'
                        }}
                    >
                        <Text style={{ color: index > 0 ? '#5c5c5c' : '#ff0000' }}>{item.name}</Text>
                    </View>
                </View>
            );
        });

        return (
            <Modal
                backButtonClose={true}
                isOpen={false}
                swipeToClose={false}
                style={styles.modal}
                ref={ref => {
                    this.modal = ref
                }}
                coverScreen={true}>
                <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff' }}>
                    <Text style={{ height: 40 }}>关闭</Text>
                    <View style={{ flexDirection: 'row', height: 40, backgroundColor: '#fff' }}>
                        <Text>我的频道</Text>
                        <Text>点击进入频道</Text>
                        <Text>编辑</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            width: width,
                            marginTop: 10,
                            marginLeft: 10,
                            marginBottom: 10,
                            marginRight: 10
                        }}
                    >
                        {boxes}
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', top: 200 }}>
                        <Text>推荐频道</Text>
                        <Text>点击添加频道</Text>
                    </View>
                </View>
            </Modal>
        );
    }

    open = () => {
        this.modal.open()
    }
}
const styles = StyleSheet.create({
    modal: {
        zIndex: 999
    },
    touchBox: {
        width: (width - 10) / 4 - 10,
        height: (width - 10) / 8 - 10,
        backgroundColor: '#fff',
        position: 'absolute',
        left: 0,
        top: 0
        //borderWidth: 1,
        //borderRadius: 5,
        //borderColor: '#f3f3f3'
    }
});