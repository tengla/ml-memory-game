
const { SetEncryptedCookie, GetEncryptedCookie, pseudoId } = require('../api-utils/secure-cookie');

module.exports = (req, res) => {
  // Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly
  if (!req.cookies.foo) {
    const cookie = SetEncryptedCookie('foo', {
      id: pseudoId(),
      at: new Date().toISOString()
    })
    res.setHeader('Set-Cookie', [cookie])
  } else {
    console.log('foo', GetEncryptedCookie(req.cookies.foo));
  }
  res.end('ok')
};
