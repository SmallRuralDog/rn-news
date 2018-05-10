class utilClass {
    arrive_timer_format(value) {
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }
        var result = "" + (parseInt(theTime) < 10 ? "0" + parseInt(theTime) : parseInt(theTime)) + "";
        if (theTime1 > 0) {
            result = "" + (parseInt(theTime1) < 10 ? "0" + parseInt(theTime1) : parseInt(theTime1)) + ":" + result;
        } else {
            result = "00:" + result;
        }
        if (theTime2 > 0) {
            result = "" + (parseInt(theTime2) < 10 ? "0" + parseInt(theTime2) : parseInt(theTime2)) + ":" + result;
        }
        return result;
    }
}

const util = new utilClass();
export default util;