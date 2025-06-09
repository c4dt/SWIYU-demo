import axios from "axios";
import { useRuntimeConfig } from "nuxt/app";


export const createApiClient = () => {
    const config = useRuntimeConfig();
    return axios.create({
        baseURL: config.public.swiyuIssuerInternal as string,
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

export const createVerifierAPIClient = () => {
    const config = useRuntimeConfig();
    return axios.create({
        baseURL: config.public.swiyuVerifierInternal as string,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}