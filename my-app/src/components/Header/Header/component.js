import React from 'react';

import responsiveBlockMaker from '../../../util/responsiveBlock';

export default function ({elq}) {
    const ResponsiveBlock = responsiveBlockMaker({elq: elq});

    const styles = {
        overflow: 'hidden',
        backgroundColor: '#333',
        position: 'fixed',
        top: '0',
        width: '100%',
    };

    function HeaderComponent(props) {
        return (
            <div style={styles}>
                <h1>This is the Header from now on wooooho</h1>
            </div>
        );
    }

    return function Header(props) {
        const sizeBreakpoints = {
            xs: 0,
            sm: 650,
            md: 801,
            xl: 1200
        };
        return (
            <ResponsiveBlock sizeBreakpoints={sizeBreakpoints}>
                <HeaderComponent {...props} />
            </ResponsiveBlock>
        );
    };
}
