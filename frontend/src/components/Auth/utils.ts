import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000",
});


const setDefaultAuthHeader = (accessToken: string): void => {
    API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

const updateAuthHeader = (accessToken: any): void => {
    localStorage.setItem(accessToken, accessToken);
    console.log(accessToken + '    hiiiiii');
    setDefaultAuthHeader(accessToken);
};


export { setDefaultAuthHeader, updateAuthHeader , API}