export const setJwt = (jwt) => {

    if (!jwt) {
        return "Missing jwt token";
    }

    localStorage.setItem("jwt", `Bearer ${jwt}`)
}

export const clearJwt = () => {
    localStorage.clear();
}

export const getJwt = () => {
    return localStorage.getItem("jwt");
}

