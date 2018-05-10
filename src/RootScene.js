import React, { Component, PureComponent } from 'react';
import { StatusBar, Platform, DeviceEventEmitter } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import TabBarItem from './widget/TabBarItem'
import color from './widget/color'
import platform from './common/platform'



import HomeScene from './scene/Home/HomeScene'
import VideoScene from './scene/Video/VideoScene'
import FindScene from './scene/Find/FindScene'
import UserScene from './scene/User/UserScene'
import NewsDetail from './scene/Detail/News'
import Login from './scene/Login/Login'
import TaskRule from './scene/User/TaskRule'
import UserInfo from './scene/User/UserInfo';
import VideoPage from './scene/Video/VideoPage';
import SearchScene from './scene/Search/SearchScene';
import CommentScene from './scene/Comment/CommentScene';
import CommentInfo from './scene/Comment/CommentInfo';
import SettingScene from './scene/Setting/SettingScene';

const lightContentScenes = ['Home', 'Mine']

function getCurrentRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getCurrentRouteName(route);
    }
    return route.routeName;
}

function getRouteParams(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getCurrentRouteName(route);
    }
    return route.params;
}

class RootScene extends PureComponent {
    constructor() {
        super();
        StatusBar.setBarStyle(platform.iosStatusbar);
        if (platform.platform === 'android') {
            StatusBar.setTranslucent(true);
        }
    }

    render() {
        return (<Navigator
            onNavigationStateChange={(prevState, currentState) => {
                const currentScene = getCurrentRouteName(currentState);
                const previousScene = getCurrentRouteName(prevState);

                const params = getRouteParams(currentState)

                DeviceEventEmitter.emit("PAGE_SHOW", { scene: currentScene, params: params });

                if (currentScene == 'VideoPage') {
                    StatusBar.setHidden(true)
                } else {
                    StatusBar.setHidden(false)
                }
                if (previousScene !== currentScene) {
                    if (lightContentScenes.indexOf(currentScene) >= 0) {
                        StatusBar.setBarStyle('dark-content')
                    } else {
                        StatusBar.setBarStyle('dark-content')
                    }
                }
            }} />);
    }
}

const Tab = TabNavigator({
    Home: {
        screen: HomeScene,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: '头条',
            tabBarIcon: ({ focused, tintColor }) => (<TabBarItem
                ref={ref => {
                    this.home_tab_icon = ref
                }}
                tintColor={tintColor}
                focused={focused}
                normalImage={require('./img/ic_tab_home_normal.png')}
                selectedImage={require('./img/ic_tab_home_activated.png')}
                selectedImage_bg={require('./img/ic_tab_home_activated.png')} />),
            tabBarOnPress: (res) => {
                if (res.scene.focused) {
                    DeviceEventEmitter.emit("HOME_LIST_RELOAD")
                } else {
                    res.jumpToIndex(res.scene.index);
                }
            }
        }),

    },
    Video: {
        screen: VideoScene,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: '视频',
            tabBarIcon: ({ focused, tintColor }) => (<TabBarItem
                tintColor={tintColor}
                focused={focused}
                normalImage={require('./img/ic_tab_video_normal.png')}
                selectedImage={require('./img/ic_tab_video_activated_1.png')}
                selectedImage_bg={require('./img/ic_tab_video_activated_2.png')} />)
        })
    },
    /*Find: {
        screen: FindScene,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: '发现',
            tabBarIcon: ({ focused, tintColor }) => (<TabBarItem
                tintColor={tintColor}
                focused={focused}
                normalImage={require('./img/ic_tab_focus_normal.png')}
                selectedImage={require('./img/ic_tab_focus_activated_1.png')}
                selectedImage_bg={require('./img/ic_tab_focus_activated_2.png')} />)
        })
    },*/
    User: {
        screen: UserScene,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: '我的',
            tabBarIcon: ({ focused, tintColor }) => (<TabBarItem
                tintColor={tintColor}
                focused={focused}
                normalImage={require('./img/ic_tab_user_normal.png')}
                selectedImage={require('./img/ic_tab_user_activated_1.png')}
                selectedImage_bg={require('./img/ic_tab_user_activated_2.png')} />)
        })
    }
}, {
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        animationEnabled: false,
        lazy: true,
        tabBarOptions: {
            activeTintColor: '#979797',
            inactiveTintColor: '#979797',
            style: {
                backgroundColor: '#ffffff'
            }
        },
    });
const TransitionConfiguration = () => ({
    screenInterpolator: (sceneProps) => {
        const { scene } = sceneProps;
        const { route } = scene;
        const params = route.params || {};
        const transition = params.transition || 'forHorizontal';
        return CardStackStyleInterpolator[transition](sceneProps);
    },
});

const Navigator = StackNavigator({
    Tab: {
        screen: Tab
    },
    NewsDetail: {
        screen: NewsDetail
    },
    Login: {
        screen: Login
    },
    TaskRule: { screen: TaskRule },
    UserInfo: { screen: UserInfo },
    VideoPage: { screen: VideoPage },
    SearchScene: { screen: SearchScene },
    CommentScene: { screen: CommentScene },
    CommentInfo: { screen: CommentInfo },
    SettingScene: { screen: SettingScene }
}, {
        //initialRouteName: "SettingScene",
        headerMode: 'none',
        transitionConfig: TransitionConfiguration,
        navigationOptions: {
            // headerStyle: { backgroundColor: color.theme }
            headerBackTitle: null,
            headerTintColor: '#333333',
            showIcon: true,
            gesturesEnabled: true,
        }
    });

export default RootScene;