import React from 'react';
import responsiveBlockMaker from '../../../util/responsiveBlock';

export default function ({elq}) {
    const ResponsiveBlock = responsiveBlockMaker({elq: elq});

    function FooterComponent(props) {
        return (
            <footer style={{
                position: 'fixed',
                width: '100%',
                bottom: '0px'
            }} id="sticky-footer" className="py-4 bg-dark text-white-50">
                <div className="container text-center">
                    <small>Karl Lundvall</small>
                </div>
            </footer>
        );
    }

    return function Footer(props) {
        const sizeBreakpoints = {
            xs: 0,
            sm: 650,
            md: 801,
            xl: 1200
        };
        return (
            <ResponsiveBlock sizeBreakpoints={sizeBreakpoints}>
                <FooterComponent {...props} />
            </ResponsiveBlock>
        );
    };
}
