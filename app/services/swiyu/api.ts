import axios from "axios";
import { useRuntimeConfig } from "nuxt/app";

const config = useRuntimeConfig();

export const createApiClient = () => {
    return axios.create({
        baseURL: config.public.swiyuIssuerInternal as string,
        headers: {
            'Content-Type': 'application/json',
        }
    });
};
