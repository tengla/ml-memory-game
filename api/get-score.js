
const faunadb = require('faunadb');

const q = faunadb.query;
const secret = process.env.FAUNADB_SECRET + ':faunadb-vercel-sample-app:server'
var client = new faunadb.Client({ secret })

module.exports = async (req, res) => {
  try {
    const result = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index("all_scores"))),
        q.Lambda("scoreRef", q.Get(q.Var("scoreRef")))
      )
    );
    const scores = result.data.map(r => {
      return {
        name: r.data.name,
        time: r.data.time
      }
    })
    res.json({ scores })
  } catch (err) {
    res.json({
      statusCode: 400,
      message: err.message
    })
  }
}
