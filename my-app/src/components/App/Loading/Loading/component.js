import React from "react";
import responsiveBlockMaker from "../../../../util/responsiveBlock";

export default function ({elq}) {

    const ResponsiveBlock = responsiveBlockMaker({elq});

    function LoadingComponent({shouldShowLoading}) {
        return shouldShowLoading ? (
            <div className="mt-5">
                <div style={{margin: 'auto', textAlign: 'center'}}>
                    <h1>TODO APP</h1>
                </div>
                <div style={{margin: 'auto'}} className="loader"></div>
            </div>
        ) : <div/>;
    }

    return function (props) {
        const sizeBreakpoints = {
            small: 0,
            large: 700
        };

        return (
            <ResponsiveBlock sizeBreakpoints={sizeBreakpoints}>
                <LoadingComponent {...props}/>
            </ResponsiveBlock>
        )
    }


}
