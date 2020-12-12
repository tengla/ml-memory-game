import React from 'react'

export const Prediction = ({ prediction }) => {
  if (!prediction) {
    return null
  }

  return (
    <div>
      Prediction: {prediction.className} {prediction.probability.toFixed(2)}
    </div>
  )
}
