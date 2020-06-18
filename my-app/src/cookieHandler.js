export default function () {

    function readCookie({key, cookie = document.cookie}) {
        // we convert to cookie from string format: "cookie1=1; cookie2=2"
        // into javascript object:                  {cookie1: 1, cookie2: 2}

        var cookies = {};
        var cookiesStrings = cookie.split('; ');

        cookiesStrings.forEach(function (cookieString) {
            var cookieKeyAndValue = cookieString.split('=');
            cookies[cookieKeyAndValue[0]] = cookieKeyAndValue.length > 1 ? cookieKeyAndValue[1] : null;
        });
        return cookies[key];
    }

    function setUsernameCookie(email) {
        document.cookie = "username=" + email + " ";
    }

    function deleteUsernameCookie() {
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    function getUsernameCookie() {
        return readCookie({ key: 'username', cookie: document.cookie });
    }


    return {
        setUsernameCookie: (email) => setUsernameCookie(email),
        deleteUsernameCookie: deleteUsernameCookie,
        getUsernameCookie: getUsernameCookie
    }
}
