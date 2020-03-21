import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import axios from '../../axios-orders';

import Order from '../../components/Order/Order';
import withError from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actionCreator from '../../store/actions/index';

const orders = props => {

    const {token, localId, onFetchOrders} = props;
    useEffect(() => {
        props.onFetchOrders(props.token, props.localId);
    }, [token, localId, onFetchOrders]);
    
    let orders = <Spinner />;
    if(!props.loading) {
        orders = props.orders.map(order => (
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

export default connect(mapStateToProps, mapDispatchToProps)(withError(orders, axios));