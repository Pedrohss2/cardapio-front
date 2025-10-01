import axios from 'axios'
import { env } from 'process'

export const api = axios.create({
    baseURL: env.API_URL
})

export const apiURL = axios.create({
    baseURL: env.API_URL
})