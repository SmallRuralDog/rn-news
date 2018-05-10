import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, Image, WebView, Animated } from 'react-native';
import Button from 'apsl-react-native-button'
import cio from 'cheerio-without-node-native';
import platform from '../../common/platform'
import ItemPic from './ItemPic'
import ItemText from './ItemText'
import USER from '../../common/user'
import Loading from '../../component/Loading';
import http from '../../common/http';
import Toast from '../../component/Toast';
import CommentPageView from '../Comment/PageView'
import storage from '../../common/storage';
export default class NewsBody extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            init: false,
            fadeAnim: new Animated.Value(1),
            html: '',
            webViewHeight: 0,
            def_img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAE0lEQVQImWP89OnTfwYgYGKAAgA7iAPZbhUs6wAAAABJRU5ErkJggg==',
            pics: [],
            attitude: props.data.news.attitude,
            attitude_type: props.data.attitude_type,
            follow_btn_load: false,
            follow_btn_dis: props.data.is_follow,
            is_follow: props.data.is_follow,
            attitude_arr: [
                {
                    key: 1,
                    name: '点赞',
                    icon: require('../../img/img_emoji_good.png')
                },
                {
                    key: 2,
                    name: '惊讶',
                    icon: require('../../img/img_emoji_amazed.png')
                },
                {
                    key: 3,
                    name: '伤感',
                    icon: require('../../img/img_emoji_sad.png')
                },
                {
                    key: 4,
                    name: '愤怒',
                    icon: require('../../img/img_emoji_angry.png')
                }
            ]
        };
        this.navigation = props.navigation;
        this.item_id = props.data.news.item_id
    }

    async componentDidMount() {
        let content = this.props.data.news.content;
        let $ = cio.load(content);
        let than = this;
        let pics_arr = [];
        $('img').map(function (i, el) {

            let url = $(this).attr("src");

            let width = $(this).attr("data-width");
            let height = $(this).attr("data-height");
            let img_item = {
                source: {
                    uri: url,
                }
            };
            pics_arr.push(img_item);
            let img_h = (platform.deviceWidth - 30) / (width / height);
            $(this).attr('data-src', url);
            $(this).attr('data-index', i);
            //if (width > platform.deviceWidth - 30) {
            $(this).attr('width', platform.deviceWidth - 30);
            $(this).attr('height', img_h);
            //} else {
            //    $(this).attr('width', width);
            //    $(this).attr('height', height);
            // }


            $(this).attr('onClick', "open_img(" + i + ")");
            $(this).attr('src', than.state.def_img);

        });
        let fontSize = await storage.get("FONT_SIZE");
        let fs = 18;
        if (fontSize) {
            fs = fontSize.value;
        }
        let html = '<html><header><meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">';
        html += '<script>open_img=function(index) {var data = {"type":"open_img","index":index};postMessage(JSON.stringify(data))}</script>';
        html += '<style>body{margin: 0;padding: 0 15px;font-family: Helvetica,"黑体";}.article-content{overflow: hidden;font-size: ' + fs + 'px;color: #1a1a1a;letter-spacing: 0;text-align: justify;line-height: 1.8;}p{margin: 15px 0;padding: 0;}img{display: block;max-width: 100%;border:none;margin: 10px auto;border-radius: 5px;background: #000000;opacity: 0.2;}.img_hide{opacity: 0;}.img_show{opacity: 1;transition: opacity 1s;}</style></header><body><div class="article-content">' + $.html() + '</div></body></html>';
        this.setState({
            init: true,
            html: html,
            pics: pics_arr
        })
    }

    _onMessage = (e) => {
        let message = e.nativeEvent.data;
        let res = JSON.parse(message);
        switch (res.type) {
            case "auto_height":
                this.setState({
                    webViewHeight: parseInt(res.height)
                });
                break;
            case "open_img":
                this.props.openImage(this.state.pics, res.index);
                break;
        }

    };

    _itemClick = (item) => {
        this.navigation.navigate("NewsDetail", {
            item_id: item.item_id,
            trace_id: this.state.trace_id,
            is_detail: true
        })
    };

    _itemVideoClick = (item) => {
        this.navigation.navigate("VideoPage", {
            item_id: item.item_id,
            title: item.title,
            media: item.media,
            video_info: item.video_info,
            net_type: this.state.net_type,
            trace_id: this.state.trace_id
        })
    };

    async _follow(than) {
        const { news } = than.props.data;
        let isLogin = await USER.IsLogin();
        if (isLogin) {
            this.setState({
                follow_btn_load: true,
                follow_btn_dis: true
            });
            http.post("/v1/follow-media", { media_id: news.media.media_id }).then(res => {
                than.setState({
                    follow_btn_load: false
                })
                if (res.code === 200) {
                    than.setState({
                        is_follow: true
                    })
                } else {
                    Toast.show(res.message)
                }
            }, err => {
                than.setState({
                    follow_btn_load: false,
                    follow_btn_dis: false
                })
            })
        } else {
            than.navigation.navigate("Login")
        }
    }

    _attitude = (type) => {
        if (type == this.state.attitude_type) {
            return false;
        }
        let data = this.state.attitude
        if (this.state.attitude_type > 0) {
            data[this.state.attitude_type] = data[this.state.attitude_type] - 1
        }
        data[type] = data[type] + 1


        this.setState({
            attitude: data,
            attitude_type: type
        })

        http.post("/v1/news-attitude", { item_id: this.item_id, type: type }).then(res => {

        }, err => {

        })
    }

    render() {
        const { news, rec_list, comment_list } = this.props.data;
        const _w = platform.deviceWidth;
        const _h = this.state.webViewHeight;
        const { emptyClick, rePlay } = this.props;
        return (
            this.state.init ?
                <Animated.View style={{ opacity: this.state.fadeAnim }}>
                    <View style={styles.news_top}>
                        <Text
                            style={styles.news_title}>{news.title}</Text>
                        <View style={styles.media}>
                            <TouchableOpacity style={styles.media_left}>
                                <Image resizeMode="cover" style={styles.media_avatar}
                                    source={{ uri: news.media.media_avatar }} />
                                <View style={styles.media_info}>
                                    <Text style={{ color: "#333333" }}>{news.media.media_name}</Text>
                                    <Text style={{ fontSize: 10, color: "#999999" }}>{news.created_time}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ height: 28 }}>
                                <Button
                                    onPress={() => {

                                        this._follow(this)
                                    }}
                                    style={styles.follow_btn}
                                    textStyle={{ fontSize: 14 }}
                                    isLoading={this.state.follow_btn_load}
                                    isDisabled={this.state.follow_btn_dis}
                                >{this.state.is_follow ? '已关注' : '关注'}</Button>
                            </View>

                        </View>
                    </View>
                    <View
                        style={{ width: _w, height: _h, marginTop: 5 }}
                    >
                        <WebView
                            ref={(ref) => {
                                this.webview = ref;
                            }}
                            style={{ flex: 1 }}
                            onMessage={this._onMessage}
                            scrollEnabled={false}
                            domStorageEnabled={true}
                            showsVerticalScrollIndicator={false}
                            source={{ html: this.state.html, baseUrl: '' }}
                            automaticallyAdjustContentInsets={true}
                            javaScriptEnabled={true}
                            injectedJavaScript={'(' + String(injectedScript) + ')();'}
                            onLoadEnd={() => {
                                this.webview.injectJavaScript('(' + String(loadOkJs) + ')();');
                                Animated.timing(this.state.fadeAnim, { toValue: 1 }).start()
                            }}
                        />
                    </View>
                    {_h > 0 ?
                        <View style={{ marginTop: 20 }}>
                            <View style={styles.labels_list}>
                                {news.labels.map((item, index) => {
                                    if (index <= 2) {
                                        return (
                                            <TouchableOpacity
                                                style={styles.labels}
                                                key={index}
                                                onPress={() => {
                                                    this.navigation.navigate("SearchScene", {
                                                        key: item
                                                    })
                                                }}
                                            >
                                                <Text>{item}</Text>
                                            </TouchableOpacity>
                                        )
                                    }

                                })}

                            </View>
                            <View style={styles.mood_view}>

                                {this.state.attitude_arr.map((item, index) => {
                                    return (
                                        <View key={index} style={styles.mood_item}>
                                            <Text style={[styles.mood_item_num, this.state.attitude_type == item.key ? styles.ac : null]}>{this.state.attitude[item.key]}</Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this._attitude(item.key)
                                                }}
                                            >
                                                <Image style={styles.mood_item_img}
                                                    source={item.icon} />
                                            </TouchableOpacity>
                                            <Text style={[styles.mood_item_name, this.state.attitude_type == item.key ? styles.ac : null]}>{item.name}</Text>
                                        </View>
                                    );
                                })}


                            </View>
                            <View style={{ height: platform.borderH, backgroundColor: "#dcdcdc", marginLeft: 15 }} />
                            <View style={styles.more_list}>
                                <View style={{
                                    borderLeftColor: "#ffe110",
                                    borderLeftWidth: 4,
                                    marginTop: 15, marginLeft: 15, marginBottom: 5
                                }}><Text style={{ fontSize: 20, color: "#333333", marginLeft: 5 }}>相关阅读</Text></View>
                                <View>
                                    {rec_list.map((item, index) => {
                                        if (item.content_type === 1) {
                                            if (item.pic_list.length === 0) {
                                                return (<ItemText key={index} item={item} onClick={() => { this._itemClick(item) }} />)
                                            } else if (item.pic_list.length >= 1) {
                                                return (<ItemPic key={index} item={item} onClick={() => { this._itemClick(item) }} />)
                                            }
                                        } else {
                                            return (<ItemPic key={index} item={item} onClick={() => { this._itemVideoClick(item) }} />)
                                        }
                                    })}
                                </View>
                            </View>
                            <View>
                                <CommentPageView
                                    navigation={this.navigation}
                                    list={comment_list}
                                    comment_num={news.comment_num}
                                    goList={() => {
                                        this.navigation.navigate("CommentScene", {
                                            item_id: news.item_id
                                        })
                                    }}
                                    emptyClick={() => {
                                        if (emptyClick) {
                                            emptyClick()
                                        }
                                    }}
                                    rePlay={(comment_id, name, parent_id) => {
                                        rePlay(comment_id, name, parent_id)
                                    }}
                                />
                            </View>
                        </View>
                        : null}
                </Animated.View> : null
        );
    }
}
const injectedScript = function () {
    function waitForBridge() {
        if (window.postMessage.length !== 1) {
            setTimeout(waitForBridge, 200);
        }
        else {
            let height = 0;
            if (document.documentElement.scrollHeight > document.body.scrollHeight) {
                height = document.documentElement.scrollHeight
            }
            else {
                height = document.body.scrollHeight
            }
            let data = { 'type': 'auto_height', 'height': height };

            postMessage(JSON.stringify(data))
        }
    }

    waitForBridge();
};

const loadOkJs = function () {
    function loadImg() {
        var objs = document.getElementsByTagName("img");
        for (var i = 0; i < objs.length; i++) {
            var imgOriSrc = objs[i].getAttribute("data-src");
            objs[i].setAttribute("src", imgOriSrc);
            imgLoad(objs[i], i, function (img, i) {
                img.classList.add('img_show');
            })
        }
    }

    // 判断图片加载完成并回调
    function imgLoad(img, index, callback) {
        var timer = setInterval(function () {
            if (img.complete) {
                if (img.naturalWidth > 100) {
                    img.style.width = '100%';
                }
                clearInterval(timer);
                callback(img, index)
            }
        }, 50)
    }

    setTimeout(function () {
        loadImg();
    }, 500);

};

const styles = StyleSheet.create({
    ac: {
        color: "#000000",
        fontWeight: "bold"
    },
    more_list: {},
    mood_view: {
        flexDirection: "row",
        padding: 15,
        marginBottom: 15
    },
    mood_item: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1
    },
    mood_item_img: {
        width: 50, height: 50
    },
    mood_item_name: {
        marginTop: 10,
        color: "#999999"
    },
    mood_item_num: {
        marginBottom: 5,
        color: "#999999"
    },
    labels_list: {
        flexDirection: "row",
        paddingRight: 15
    },
    labels: {
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#f7f7f7",
        borderRadius: 3,
        marginLeft: 15,
        marginBottom: 15,
        flex: 0
    },
    news_top: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10
    },
    news_title: {
        fontSize: 22,
        lineHeight: 35,
        fontWeight: "bold",
        color: "#333333",
        textAlign: "justify"
    },
    media: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 40,
        marginTop: 10,
        marginBottom: 10
    },
    media_left: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        flexGrow: 1
    },
    media_avatar: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
    },
    media_info: {
        flexDirection: "column",
        height: 33,
        marginLeft: 10,
        justifyContent: "space-between"
    },
    follow_btn: {
        width: 65,
        height: 28,
        borderRadius: 5,
        borderWidth: 0,
        backgroundColor: "#ffe110",
        alignItems: "center",
        justifyContent: "center"
    }

})