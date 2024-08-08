import { Fragment } from "react";

import HeaderCartButton from "./HeaderCartButton";

import shoppingImage from '../../assests/shopping.jpg';
import classes from './Header.module.css';

const Header = (props) => {
    return (
        <Fragment>
            <header className={classes.header} >
                <h1>Shopper's Point</h1>
                <HeaderCartButton onClick={props.onShowCart} />
            </header>
            <div className={classes['main-image']}>
                <img src={shoppingImage} alt='All your shopping needs met at one place!' />
            </div>
        </Fragment>
    );
}

export default Header;