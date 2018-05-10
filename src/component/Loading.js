import React, {
    Component,
} from 'react';
import {
    View
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import LoadingContainer, {positions, durations} from './LoadingContainer';

class Loading extends Component {
    static displayName = 'Loading';
    static propTypes = LoadingContainer.propTypes;
    static positions = positions;
    static durations = durations;

    static show = (message, options = {position: positions.CENTER, duration: durations.SHORT}) => {
        return new RootSiblings(<LoadingContainer
            {...options}
            visible={true}
        >
            {message}
        </LoadingContainer>);
    };

    static hide = loading => {
        if (loading instanceof RootSiblings) {
            loading.destroy();
        } else {
            console.warn(`loading hide error`);
        }
    };

    _loading = null;

    componentWillMount = () => {
        this._loading = new RootSiblings(<LoadingContainer
            {...this.props}
            duration={0}
        />);
    };

    componentWillReceiveProps = nextProps => {
        this._loading.update(<LoadingContainer
            {...nextProps}
            duration={0}
        />);
    };

    componentWillUnmount = () => {
        this._loading.destroy();
    };

    render() {
        return null;
    }
}

export {
    RootSiblings as Manager
};
export default Loading;
