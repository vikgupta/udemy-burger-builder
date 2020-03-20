import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    building: false
}

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1,
    bacon: 0.75
};

const addIngredient = (state, action) => {
    const updatedIngredient = {[action.ingredient]: state.ingredients[action.ingredient] + 1};
    const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
    return updateObject(state, {
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredient],
        building: true
    });
}

const removeIngredient = (state, action) => {
    const removedIngredient = {[action.ingredient]: state.ingredients[action.ingredient] - 1};
    const removedIngredients = updateObject(state.ingredients, removedIngredient);
    return updateObject(state, {
        ingredients: removedIngredients,
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredient],
        building: true
    });
}

const setIngredients = (state, action) => {
    return updateObject(state, {
        error: false,
        totalPrice: 4,
        building: false,
        ingredients: {
            salad: action.ingredients.salad,
            bacon: action.ingredients.bacon,
            cheese: action.ingredients.cheese,
            meat: action.ingredients.meat,
        }
    });
}

const fetchFailed = (state, action) => {
    return updateObject(state, {
        error: true
    });
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case (actionTypes.ADD_INGREDIENT):
            return addIngredient(state, action);

        case (actionTypes.REMOVE_INGREDIENT):
            return removeIngredient(state, action);

        case (actionTypes.SET_INGREDIENTS):
            return setIngredients(state, action);

        case (actionTypes.FETCH_INGREDIENTS_FAILED):
            return fetchFailed(state, action);

        default:
            return state;
    }
}

export default reducer;