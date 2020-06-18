import myListPageMaker from './mylist/controller';
import loginPageMaker from './login/controller';

export default function ({appStateModel, elq, axios, url}) {
    const loginPage = loginPageMaker({elq, axios, url});

    function getPages() {
        const myListPage = myListPageMaker({appStateModel, elq, axios, url});
        return [
            {
                label: 'My Lists',
                path: myListPage.path,
                Component: myListPage.Component,
                props: myListPage.props,
                aPromise: myListPage.aPromise
            }
        ];
    }

    function getLoginPage() {
        return loginPage;
    }

    return {
        getPages: getPages,
        getLoginPage: getLoginPage,
    }
}
