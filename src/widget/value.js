import platform from "../common/platform";
const ios = platform.platform == "ios" ? true : false;
export default {
    top_class_font_size: ios ? 17 : 16,
    top_class_unline_bottom: ios ? 15 : 13,
    list_item_title: ios ? 17 : 16,
    list_item_title_line_height: ios ? 25 : 28,
}