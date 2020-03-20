import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from '../../axios-orders';

import Order from '../../components/Order/Order';
import withError from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actionCreator from '../../store/actions/index';

class Orders extends Component {

    componentDidMount() {
        this.props.onFetchOrders(this.props.token, this.props.localId);
    }

    render() {
        let orders = <Spinner />;
        if(!this.props.loading) {
            orders = this.props.orders.map(order => (
                <Order 
                    key={order.id}
                    ingredients={order.ingredients}
                    price={order.price}/>
            ));
        }
        return (
            <div>
                {orders}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        localId: state.auth.localId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, localId) => dispatch(actionCreator.fetchOrders(token, localId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withError(Orders, axios));