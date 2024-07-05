import crypto from 'crypto-js'
const _passkey = crypto.enc.Utf8.parse(')i7~:.bs')

// DES 加密
const encrypt = (msg) => {
  return crypto.DES.encrypt(msg, _passkey, {
    mode: crypto.mode.ECB,
    padding: crypto.pad.Pkcs7
  }).ciphertext.toString(crypto.enc.Base64)
}

// DES 解密
const decrypt = (ciphertext) => {
  return crypto.DES.decrypt(ciphertext, _passkey, {
    mode: crypto.mode.ECB,
    padding: crypto.pad.Pkcs7
  }).toString(crypto.enc.Utf8)
}

export {
  encrypt,
  decrypt
}