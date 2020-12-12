import React from 'react'

const calculateTime = (count, timeUsed) => {
  const avg = timeUsed / count
  return [timeUsed, avg]
}

export const TimeReport = ({ count, timeUsed }) => {
  const [time, avg] = calculateTime(count, timeUsed)
  const _time = (time / 1000).toFixed(2)
  const _avg = (avg / 1000).toFixed(2)
  return (
    <div>Du klarte {count} trekk på {_time}s! Det er {_avg}s per trekk!</div>
  )
}

export const ResultReport = ({ count, timeUsed, onReset }) => {
  return (
    <div className='result-report'>
      <h3>Whooaa, genius!</h3>
      <TimeReport count={count} timeUsed={timeUsed} />
      <p>
        Du vet, denne tingen er ikke perfekt. Så ikke bli sur om
        du mener en feilbedømning skjedde 😁
      </p>
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
