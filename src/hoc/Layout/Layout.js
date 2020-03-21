import React, {useState} from 'react';
import {connect} from 'react-redux';

import Aux from '../auxiliary/auxiliary';
import classes from './Layout.css';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const layout = props => {
    const [showSideDrawer, setShowSideDrawer] = useState(false);

    const sideDrawerCloseHandler = () => {
        setShowSideDrawer(false);
    }

    const sideDrawerToggleHandler = () => {
        setShowSideDrawer(!showSideDrawer);
    }

    return (
        <Aux>
            <Toolbar 
                drawerToggleClicked={sideDrawerToggleHandler}
                isAuth={props.isAuthenticated} />
            <SideDrawer 
                open={showSideDrawer} 
                closed={sideDrawerCloseHandler}
                isAuth={props.isAuthenticated} />
            <main className={classes.Content}>
                {props.children}
            </main>
        </Aux>
    );
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(layout);