import {Platform, Dimensions, PixelRatio,StatusBar} from "react-native";

const deviceHeight = Dimensions
    .get("window")
    .height;
const deviceWidth = Dimensions
    .get("window")
    .width;
const platform = Platform.OS;
const version = Platform.Version;
const platformStyle = undefined;
const isIphoneX = platform === "ios" && deviceHeight === 812 && deviceWidth === 375;
const statusBarHeight = StatusBar.currentHeight
export default {
    version,
    deviceHeight,
    deviceWidth,
    platformStyle,
    platform,
    statusBarHeight,
    borderH:1/PixelRatio.get(),
    // Header
    toolbarBtnColor: platform === "ios" ? "#007aff" : "#fff",
    toolbarDefaultBg: platform === "ios" ? "#F8F8F8" : "#3F51B5",
    toolbarHeight: platform === "ios" ? 49 : 45,
    toolbarIconSize: platform === "ios" ? 20 : 22,
    toolbarSearchIconSize: platform === "ios" ? 20 : 23,
    toolbarInputColor: platform === "ios" ? "#CECDD2" : "#fff",
    searchBarHeight: platform === "ios" ? 30 : 40,
    searchBarInputHeight: platform === "ios" ? 30 : 50,
    toolbarInverseBg: "#222",
    toolbarTextColor: platform === "ios" ? "#000" : "#fff",
    toolbarDefaultBorder: platform === "ios" ? "#a7a6ab" : "#3F51B5",
    iosStatusbar: platform === "ios" ? "dark-content" : "dark-content",
    headerPaddingTop: platform === "ios" ? (isIphoneX ? 39 : 15) : Platform.Version>18?StatusBar.currentHeight:0,

    //HomeList
    HomeList:{
        itemPd : 15,
        imgW :(deviceWidth-(15*2+6))/3,
        imgH : ((deviceWidth-(15*2+6))/3)*0.85
    }
    
}