import React from 'react';
import RockPng from './assets/rock.png';
import ScissorsPng from './assets/scissors.png';
import PaperPng from './assets/paper.png';

export const Description = ({ onReady }) => {
  return (
    <div className='description'>
      <h1>Velkommen!</h1>
      <p>
        Dette er ett slags spill basert på stein, saks, papir,
        blandet med memory game + hurtighet.
      </p>

      <p>
        Hvor mange kombinasjoner av stein saks papir klarer du?
      </p>
      <p>
        Og, hvor hurtig?
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
        Prøv å unngå ansikt innenfor rammen. Pen som du sikkert er, kommer jeg til
        å få lavere sannsynlighet i prediksjonene. Du kommer til å forvirre meg 😂
      </p>

      <p>
        PS: Denne tingen vil sannsynligvis ikke kjøre på mobil i det hele tatt,
        siden WebRTC, cam og GPU må være tilgjengelig for Browser.
      </p>

      <p style={{
        fontWeight: 'bold'
      }}>Er du klar til å begynne?</p>

      <button
        className='button'
        onClick={() => {
          onReady();
        }}>Start!</button>

      <p style={{ fontSize: '0.8em' }}>
        (Basert på <a target='_blank' href='https://www.tensorflow.org/js'>TensorFlow.js</a>
        og <a
          target='_blank'
          href='https://teachablemachine.withgoogle.com/models/xf82yR2IE/'
        >
          Teachable Machine.
        </a>)
      </p>
    </div>
  );
};
