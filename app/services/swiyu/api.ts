import axios from "axios";

export const createApiClient = (apiKey: string) => {
    return axios.create({
        baseURL: "http://localhost:8081/api/v1",
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey
        }
    });
};
