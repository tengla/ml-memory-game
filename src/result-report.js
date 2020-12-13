import React from 'react'

const calculateTime = (count, timeUsed) => {
  const avg = timeUsed / count
  return [timeUsed, avg]
}

export const TimeReport = ({ count, timeUsed }) => {
  const [time, avg] = calculateTime(count, timeUsed)
  const _time = (time / 1000).toFixed(4)
  const _avg = (avg / 1000).toFixed(4)
  return (
    <div style={{
      fontWeight: 'bold'
    }}>
      Du klarte {count} trekk på {_time}s! Det er {_avg}s per trekk!
      Slett ikke dårlig.
    </div>
  )
}

export const ResultReport = ({ count, timeUsed, onReset }) => {
  return (
    <div className='result-report'>
      <h3>Whooaa, kammerat! God jul!</h3>
      <TimeReport count={count} timeUsed={timeUsed} />
      <p>
        <button
          className='button'
          onClick={() => {
            onReset()
          }}>Prøv igjen</button>
      </p>
    </div>
  )
}
