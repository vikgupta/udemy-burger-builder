import React from 'react';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';

import classes from './checkoutSummary.css';

const checkoutSummary = (props) => {
    return (
        <div className={classes.CheckoutSummary}>
            <h1>test</h1>
            <div style={{width: '100%', margin: 'auto'}}>
                <Burger ingredients={props.ingredients}/>
            </div>
            <Button 
                buttonType='Danger'
                clicked={props.checkoutCancelled} >Cancel</Button>
            <Button 
                buttonType='Success'
                clicked={props.checkoutContinued} >Continue</Button>
        </div>
    );
}

export default checkoutSummary;