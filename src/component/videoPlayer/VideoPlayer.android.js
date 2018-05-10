import PropTypes from 'prop-types';
import { requireNativeComponent, View } from 'react-native';

var iface = {
    name: 'VideoPlayer',
    propTypes: {
        src: PropTypes.string,
        cover: PropTypes.string,
        ...View.propTypes // 包含默认的View的属性
    },
};

module.exports = requireNativeComponent('VideoPlayer', iface);