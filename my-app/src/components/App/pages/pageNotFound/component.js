import React from 'react';

export default function () {

    return {
        name: 'notfound',
        path: '*',
        props: function () {
            return {

            }
        },
        Component: function () {
            return <div>
                <h1>
                    Page not found 404
                </h1>
            </div>;
        }
    };
}
