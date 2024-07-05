import { mergeSecurityParams } from '../share/tunnel';
const timeout  = 10000;
export async function fetch(url, body, headers = { 'Content-Type':'application/x-www-form-urlencoded'}) {
    if (!url) {
        return Promise.reject(new Error('doPost: url is required'));
    }
    let bodyParam = '';
    [body, headers] = await mergeSecurityParams(body, headers, {
        ctorArg: {
          appId: 'xxx', //http://waap.jd.com/InterfaceHard/index申请加固ID, 请注意，不是网关appid
        }
    });
    if (body && Object.keys(body).length > 0) {
        const strigifyParam = Object.keys(body).map(key => `${key}=${encodeURIComponent(body[key])}`).join('&');
        bodyParam += strigifyParam;
    }

    return fetchWithTimeout(window.fetch(url, {
        method: 'POST',
        headers: headers,
        mode: "cors",
        body: bodyParam,
        credentials: "include"
    }), timeout).then(res => res.json(), () => {});
}

function fetchWithTimeout(fetching, timeout) {
    // @ts-ignore
    let timerId;
    return Promise.race([fetching, new Promise((resolve, reject) => {
        timerId = setTimeout(() => {
            reject(new Error('请求超时'));
        }, timeout || 10000);
    })]).then(e => {
        timerId && clearTimeout(timerId);
        return e;
    }, () => {});
}
