export default function () {
    return `
        <div class="n-layout">
            <div class="lb4">
                <div class="body">
                    <div id="header"></div>
                </div>
            </div>
            <div class="n-layout-main">
                <div class="n-layout-aside-wrap lb4">
                    <div class="n-layout-aside-wrap body">
                        <div id="menu"></div>
                        <div id="loading" class="container mt-4"></div>
                        <div id="app" class="container mt-4"></div>
                    </div>
                </div>
            </div>
            <div class="lb4">
                <div class="body">
                    <div id="footer"></div>
                </div>
            </div>
        </div>
    `;
}
