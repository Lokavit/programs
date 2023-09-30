import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
    closeAlert,
    filterPopupAlerts
} from '../reducers/alerts';

import AlertsComponent from '../components/alerts/alerts.jsx';

const Alerts = ({
    alertsList,
    className,
    onCloseAlert
}) => (
    <AlertsComponent
        // 仅在此处显示标准和扩展警报
        alertsList={filterPopupAlerts(alertsList)}
        className={className}
        onCloseAlert={onCloseAlert}
    />
);

Alerts.propTypes = {
    alertsList: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    onCloseAlert: PropTypes.func
};

const mapStateToProps = state => ({
    alertsList: state.scratchGui.alerts.alertsList
});

const mapDispatchToProps = dispatch => ({
    onCloseAlert: index => dispatch(closeAlert(index))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Alerts);
