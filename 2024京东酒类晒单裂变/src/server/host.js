const isDev = true
const devHost = 'https://jlsd-rc.isvjcloud.com'
// const devHost = 'http://127.0.0.1:5000'
// const devHost = 'http://192.168.10.166:5000'
// const releaseHost = 'https://tgb-jhqa-rc.isvjd.com'
const host = isDev ? devHost : releaseHost

// const defaultToken = 'KLGg7wTkNF1VF1jRfb45'
const tokenPrefix = 'KLGg7wTkNF1VF1jRfb45'

export {
    host,
    tokenPrefix,
}
