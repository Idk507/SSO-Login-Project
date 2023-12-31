import Keycloak from "keycloak-js";

let initOptions = {
    url: `${process.env.REACT_APP_KEYCLOAK_HOST}`, 
    realm: 'sso-login', 
    clientId: 'react-login-client-2', 
    onLoad: 'login-required',

}

const keycloak = new Keycloak(initOptions);

keycloak.init({ onLoad: 'login-required' }).then((auth) => {

    if (!auth) {
        window.location.reload();
    } else {
        console.info("Authenticated");
    }

    localStorage.setItem("bearer-token", keycloak.token);
    localStorage.setItem("refresh-token", keycloak.refreshToken);

    setTimeout(() => {
        keycloak.updateToken(70).then((refreshed) => {
            if (refreshed) {
                console.debug('Token refreshed' + refreshed);
            } else {
                console.warn('Token not refreshed, valid for '
                    + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
            }
        }).catch(() => {
            console.error('Failed to refresh token');
        });


    }, 60000)

}).catch(() => {
    console.error("Authenticated Failed");
});

export default keycloak;