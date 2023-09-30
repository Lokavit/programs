import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import {
    getIsShowingWithId
} from '../reducers/project-state';

/**
 * 在采取某些措施之前，监视项目是否完成更新.
 *
 * 要使用ProjectWatcher，请使用onDoneUpdating道具将其传递给回调函数.
 * ProjectWatcher将waitForUpdate函数传递给其子级，子级可以调用它们来设置ProjectWatcher，以在项目不再更新时请求其调用onDoneUpdating回调。.
 */
class ProjectWatcher extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'waitForUpdate'
        ]);

        this.state = {
            waiting: false
        };
    }
    componentDidUpdate (prevProps) {
        if (this.state.waiting && this.props.isShowingWithId && !prevProps.isShowingWithId) {
            this.fulfill();
        }
    }
    fulfill () {
        this.props.onDoneUpdating();
        this.setState({ // eslint-disable-line react/no-did-update-set-state
            waiting: false
        });
    }
    waitForUpdate (isUpdating) {
        if (isUpdating) {
            this.setState({
                waiting: true
            });
        } else { // fulfill immediately
            this.fulfill();
        }
    }
    render () {
        return this.props.children(
            this.waitForUpdate
        );
    }
}

ProjectWatcher.propTypes = {
    children: PropTypes.func,
    isShowingWithId: PropTypes.bool,
    onDoneUpdating: PropTypes.func
};

ProjectWatcher.defaultProps = {
    onDoneUpdating: () => {}
};

const mapStateToProps = state => {
    const loadingState = state.scratchGui.projectState.loadingState;
    return {
        isShowingWithId: getIsShowingWithId(loadingState)
    };
};

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectWatcher);
