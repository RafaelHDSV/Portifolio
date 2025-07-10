import axios from 'axios'
import { gitHubToken } from '../utils/environment'

export const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    ...(gitHubToken && { Authorization: `Bearer ${gitHubToken}` }),
    'Content-Type': 'application/json'
  }
})
