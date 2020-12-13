import React from 'react'

const calculateTime = (count, elapsed) => {
  const avg = elapsed / count
  return [elapsed, avg]
}

export const TimeReport = ({ count, elapsed }) => {
  const [time, avg] = calculateTime(count, elapsed)
  const _time = (time / 1000).toFixed(4)
  const _avg = (avg / 1000).toFixed(4)
  return (
    <div style={{
      fontWeight: 'bold'
    }}>
      Du klarte {count} trekk på {_time}s. Det er {_avg}s per trekk.
      Slett ikke dårlig.
    </div>
  )
}

export const ResultReport = ({ count, elapsed }) => {

  return (
    <div className='result-report'>
      <h3>Whooaa!</h3>
      <TimeReport count={count} elapsed={elapsed} />
    </div>
  )
}
