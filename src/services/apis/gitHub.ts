import axios from 'axios'

const token = import.meta.env.VITE_GITHUB_ACCESS_TOKEN

export const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
    'Content-Type': 'application/json'
  }
})
