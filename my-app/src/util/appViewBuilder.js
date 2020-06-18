export default function appViewsBuilder(modules) {
    let viewInstances = [];

    function renderAndSaveToList(view) {
        viewInstances.push(view);
    }

    function renderActiveAppView(isLoggedIn) {
        if (isLoggedIn) {
            modules.mylist.view.render(document.getElementById('app'));
            renderAndSaveToList(modules.mylist.view);
        } else {
            modules.login.view.render(document.getElementById('app'));
            renderAndSaveToList(modules.login.view);
        }
    }

    return {
        buildAppView: (isLoggedIn) => renderActiveAppView(isLoggedIn),
        build: function (isLoggedIn) {
            modules.menu.view.render(document.getElementById('menu'));
            renderAndSaveToList(modules.menu.view);
            renderActiveAppView(isLoggedIn);
            modules.footer.view.render(document.getElementById('footer'));
            renderAndSaveToList(modules.footer.view);
        },
        destroy: function () {
            viewInstances.forEach((view) => view.remove());
            viewInstances = [];
        },
    };
}
