
const faunadb = require('faunadb');
const crypto = require('crypto');

const md5sum = (str) => {
  return crypto.createHash('md5').update(str).digest('hex');
};

const q = faunadb.query;
const secret = process.env.FAUNADB_SECRET + ':faunadb-vercel-sample-app:server'
var client = new faunadb.Client({ secret })

module.exports = async (req, res) => {

  if (req.method !== 'POST') {
    return response.status(405).json({
      statusCode: 405,
      message: 'Not allowed'
    });
  }
  const contentType = req.headers['content-type'];
  if (contentType !== 'application/json') {
    return response.status(415).json({
      statusCode: 415,
      message: 'Unsupported Media Type'
    });
  }

  const { name, email, elapsed } = req.body;

  if (!/@capraconsulting\.no$/.test(email)) {
    return response.status(422).json({
      statusCode: 422,
      message: 'Unprocessable Entity'
    });
  }

  const faunaResponse = await client.query(
    q.Create(
      q.Collection('scores'),
      {
        data: {
          createdAt: new Date().toISOString(),
          id: md5sum(name + email),
          name, email, elapsed
        }
      }
    )
  );

  return res.json({
    statusCode: 201,
    message: 'Created',
    data: faunaResponse.data
  });
}
