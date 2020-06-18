import _ from 'lodash';
import Events from './util/events';
import appViewsBuilderMaker from './util/appViewBuilder';
import appLayoutHTML from './appLayout';
import modelMaker from './util/model/model';
import loginControllerMaker from './components/App/pages/login/controller';
import menuControllerMaker from './components/Menu/controller';
import footerControllerMaker from './components/Footer/controller';
import myListControllerMaker from './components/App/pages/mylist/controller';
import refreshTimerMaker from './refreshTimer';
import cookieHandlerMaker from './cookieHandler';
import serviceMaker from './services/service';

export default function ({url, elq, axios}) {
    const app = _.assignIn({}, Events);

    const appStateModel = modelMaker({
        shouldDisplayLogin: true,
        shouldDisplayRefreshSessionMessage: false,
        loggedInUser: null,
        isLoggedIn: false
    });
    const cookieHandler = cookieHandlerMaker();

    const serviceCaller = serviceMaker({
        url,
        axios,
        cookieHandler,
        appStateModel
    });

    const refreshTimer = refreshTimerMaker({
        appStateModel,
        axios,
        url,
        cookieHandler
    });

    (function setSingletonElementLayouts() {
        document.getElementById('app-container').insertAdjacentHTML('afterbegin', appLayoutHTML());

        const appContainer = document.getElementById('app-container');
        const mainLayout = appContainer.querySelector('.n-layout-main');
        const menu = document.getElementById('menu');

        appContainer.setAttribute('elq-breakpoints', '');
        appContainer.setAttribute('elq-breakpoints-widths', '544 801 992 1200');

        menu.setAttribute('elq-mirror', '');
        mainLayout.setAttribute('elq-mirror', '');

        elq.activate([appContainer, menu, mainLayout]);
    }());

    (function verifyJwt() {
        serviceCaller.verifyJwt()
            .then(function ({data}) {
                if (_.get(data, 'validSession') && cookieHandler.getUsernameCookie()) {
                    appStateModel.swap(function (state) {
                        state.loggedInUser = cookieHandler.getUsernameCookie();
                        state.isLoggedIn = true;
                        return state;
                    });
                }
            }).catch(function (error) {
            appStateModel.swap(function (state) {
                state.error = error;
                return state;
            })
        }).finally(function () {
            if (appStateModel.deref().isLoggedIn) {
                serviceCaller.fetchList(cookieHandler.getUsernameCookie()).finally(function () {
                    refreshTimer.refreshSession();
                    buildApp(appStateModel.deref().isLoggedIn);
                });
            } else {
                buildApp(appStateModel.deref().isLoggedIn);
            }
        });
    }());

    const modules = {};

    modules.menu = menuControllerMaker({
        elq,
        appStateModel,
        refreshTimer,
        axios,
        url
    });

    modules.footer = footerControllerMaker({
        elq,
        appStateModel
    });

    modules.login = loginControllerMaker({
        elq,
        appStateModel,
        axios,
        url
    });

    modules.mylist = myListControllerMaker({
        appStateModel,
        elq,
        url,
        axios
    });
    const appViewsBuilder = appViewsBuilderMaker(modules);

    function buildApp(isLoggedIn) {
        appViewsBuilder.build(isLoggedIn);
    }

    app.listenTo(modules.login, 'loginSuccess', function ({email}) {
        appStateModel.swap(function (state) {
            state.loggedInUser = email;
            state.isLoggedIn = true;
            return state;
        });
        serviceCaller.fetchList(appStateModel.deref().loggedInUser).finally(function () {
            cookieHandler.setUsernameCookie(appStateModel.deref().loggedInUser);
            appViewsBuilder.buildAppView(appStateModel.deref().isLoggedIn);
        });
    });

    app.listenTo(modules.menu, 'logout', function () {
        cookieHandler.deleteUsernameCookie();
        appStateModel.swap(function (state) {
            state.isLoggedIn = false;
            return state;
        });
        appViewsBuilder.buildAppView(appStateModel.deref().isLoggedIn);
    });
};
