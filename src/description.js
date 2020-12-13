import React from 'react'
import RockPng from './assets/rock.png'
import ScissorsPng from './assets/scissors.png'
import PaperPng from './assets/paper.png'

export const LinkRel = ({ to, target, children }) => {
  return <a href={to} target={target} rel='noreferrer'>{children}</a>
}

export const Description = ({ onReady }) => {
  return (
    <div className='description'>
      <h1>Hei!</h1>
      <p>
        Dette er ett slags spill basert på stein, saks, papir,
        med ett element av hurtighet.
      </p>

      <p>
        Hvor fort klarer du å vinne 20 runder stein, saks eller papir?
      </p>

      <p>
        For best resultat, gjør stein saks papir som i illustrasjonen under.
      </p>

      <div className='description-images'>
        <img src={RockPng} alt='rock' />
        <img src={ScissorsPng} alt='scissors' />
        <img src={PaperPng} alt='paper' />
      </div>

      <p>
        Prøv å unngå ansikt innenfor rammen. Du kommer til å forvirre meg.
      </p>

      <p>
        PS: Denne tingen vil sannsynligvis ikke kjøre på mobil i det hele tatt,
        siden WebRTC, cam og GPU må være tilgjengelig for nettleser.
      </p>

      <p>
        Dette er ett godt eksempel på personlig bias innen maskinlæring, for jeg har kun brukt
        mine egne hender til opplæring. Så ,,, dine hender burde ligne mine gorilla-størrrelse-hender 😂
      </p>

      <p style={{
        fontWeight: 'bold'
      }}
      >Er du klar til å begynne?
      </p>

      <button
        className='button'
        onClick={() => {
          onReady()
        }}
      >
        Start!
      </button>

      <p style={{ fontSize: '0.8em' }}>
        <span>Basert på</span>
        <LinkRel target='_blank' to='https://www.tensorflow.org/js'>TensorFlow.js</LinkRel>
        <span>+</span>
        <LinkRel target='_blank' to='https://teachablemachine.withgoogle.com/models/xf82yR2IE/'>Teachable Machine.</LinkRel>
        <br />
        <LinkRel target='_blank' to='https://github.com/tengla/ml-memory-game'>
          Sjekk ut koden på GitHub
        </LinkRel>
      </p>
    </div>
  )
}
