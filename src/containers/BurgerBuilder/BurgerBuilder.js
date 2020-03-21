import React, {useState, useEffect} from 'react';
import axios from '../../axios-orders';
import {connect} from 'react-redux';

import Aux from '../../hoc/auxiliary/auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrdeSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionCreators from '../../store/actions/index';

const burgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    const {onInitIngredients} = props;
    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum, el) => {
            return sum + el;
        }, 0);

        return sum > 0;
    }

    const purchaseHandler = () => {
        if (props.isAuthenticated){
            setPurchasing(true);
        }
        else {
            props.onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        props.onInitPurchase();
        props.history.push('/checkout');
    }

    const disabledInfo = {
        ...props.ings
    };
    for(let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />
    if(props.ings) {
        burger = (
            <Aux>
                <Burger ingredients={props.ings}/>
                <BuildControls 
                    ingredientAdded={props.onIngredientAdded} 
                    ingredientRemoved={props.onIngredientRemoved} 
                    disabled={disabledInfo}
                    totalPrice={props.price}
                    purchasable={updatePurchaseState(props.ings)}
                    ordered={purchaseHandler}
                    isAuthenticated={props.isAuthenticated}
                />
            </Aux>
        );

        orderSummary = <OrderSummary 
                            ingredients={props.ings}
                            purchaseCanceled={purchaseCancelHandler}
                            purchaseContinued={purchaseContinueHandler}
                            totalPrice={props.price}/>;
    }

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );
};

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actionCreators.addIngredient({ingredient: ingName})),
        onIngredientRemoved: (ingName) => dispatch(actionCreators.removeIngredient({ingredient: ingName})),
        onInitIngredients: () => dispatch(actionCreators.initIngredients()),
        onInitPurchase: () => dispatch(actionCreators.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actionCreators.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(burgerBuilder, axios));