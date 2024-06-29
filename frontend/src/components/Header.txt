import React from 'react'
import { Link, useLocation } from 'react-router-dom';


const Header = () => {

    const location = useLocation();

    const back_home = (event) => {
        if (location.pathname === '/') {
            event.preventDefault(); // Prevent the default link behavior
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    return (
        <div className="main-container">
            <header>
                <nav className="navbar">
                    <div className="navbar-left">
                        <Link className="home-button" to="/" onClick={back_home}>
                            recalld
                        </Link>
                    </div>
                    <div className="navbar-right">
                        
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Header
