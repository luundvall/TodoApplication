import React from 'react';
import responsiveBlockMaker from '../../../util/responsiveBlock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

export default function ({elq}) {

    const ResponsiveBlock = responsiveBlockMaker({elq: elq});

    const Navbar = ({isLoggedIn, shouldDisplayRefresh, refreshSession, logout}) => {
        return (
            <nav style={{backgroundColor: 'black'}}>
                <div style={{display: 'flex', width: '100%'}}>
                    <div>
                        <h1>Todo App</h1>
                    </div>
                    {isLoggedIn ? <div style={{
                        marginLeft: 'auto',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        paddingRight: '5px'
                    }}>
                        <button style={{
                            paddingBottom: '0px',
                            paddingTop: '0px'
                        }} className='btn btn-primary' onClick={function (event) {
                            event.preventDefault();
                            logout();
                        }}>
                            <span style={{fontWeight: 'bold', fontSize: '20px'}}>Logout</span>
                        </button>
                    </div> : null}
                    {isLoggedIn && shouldDisplayRefresh ?
                        <div style={{
                            marginLeft: 'auto',
                            marginTop: 'auto',
                            marginBottom: 'auto',
                            paddingRight: '5px'
                        }}>
                            <button style={{
                                paddingBottom: '0px',
                                paddingTop: '0px'
                            }} className='btn btn-primary' onClick={function (event) {
                                event.preventDefault();
                                refreshSession();
                            }}>
                                <div>
                                    <span style={{fontWeight: 'bold', fontSize: '20px'}}>Refresh session</span>
                                    <span>&nbsp;&nbsp;</span>
                                    <FontAwesomeIcon style={{fontSize: '15px'}} icon={faSync}/>
                                </div>
                            </button>
                        </div> : null
                    }
                </div>
            </nav>
        )
    };

    return function Menu(props) {
        const sizeBreakpoints = {
            xs: 0,
            sm: 650,
            md: 801,
            xl: 1200
        };

        return (
            <ResponsiveBlock sizeBreakpoints={sizeBreakpoints}>
                <Navbar {...props} />
            </ResponsiveBlock>
        );
    };
}
