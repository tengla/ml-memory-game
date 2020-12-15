const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = () => crypto.randomBytes(16);

const encrypt = (text) => {
  const _iv = iv();
  const cipher = crypto.createCipheriv(algorithm, secretKey, _iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: _iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrypted.toString();
};

const pseudoId = () => (Math.random() * Date.now() * 1000).toString(36);

const GetEncryptedCookie = (value) => {
  try {
    const utf8str = Buffer.from(value, 'base64').toString('utf-8');
    const hash = JSON.parse(utf8str);
    const decrypted = decrypt(hash);
    return JSON.parse(decrypted);
  } catch (err) {
    console.log(err);
  }
};

const SetEncryptedCookie = (name, data, options = {
  expires: new Date(Date.now() + (15*60*1000))
}) => {
  const cookieOptions = (() => {
    const opts = [];
    const exp = options.expires;
    opts.push('Expires=' + exp.toGMTString())
    if (process.env.NODE_ENV === 'production') {
      opts.push('Secure')
    }
    opts.push('HttpOnly')
    opts.push('SameSite=Strict')
    return opts.join('; ')
  })();
  const json = JSON.stringify(data);
  const secured = JSON.stringify(encrypt(json));
  const buf = Buffer.from(secured)
    .toString('base64');
  const cookie = `${name}=${buf}; ${cookieOptions}`
  return cookie;
};

module.exports = {
  pseudoId, GetEncryptedCookie, SetEncryptedCookie
};
