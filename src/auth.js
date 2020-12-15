import React, { useState } from 'react';

const validate = ({ name, email }) => {
  const val = {
    errors: false
  };
  if (!/^\w{3,}/.test(name)) {
    val.name = 'Navn må være satt'
    val.errors = true
  }
  if (!/^\w+@capraconsulting.no$/.test(email)) {
    val.email = 'Må være en capracon e-post'
    val.errors = true
  }
  return val;
};

const writeInfo = ({ name, email, status }) => {
  localStorage.setItem('name', name);
  localStorage.setItem('email', email);
  localStorage.setItem('status', status);
};

export const Auth = ({ children }) => {

  const [info, setInfo] = useState({
    name: localStorage.getItem('name') || '',
    email: localStorage.getItem('email') || ''
  });

  const [status, setStatus] = useState(
    localStorage.getItem('status') || 'initial');

  const [validation, setValidation] = useState({
    name: '',
    email: '',
    errors: false
  });

  if (status === 'done') {
    return children;
  }

  return (
    <div className='auth'>
      <h3>Hei, hvem er du?</h3>
      <p>For å komme på resultatlista kan du velge å gi navn og email.</p>
      <p>Men du kan skippe om du vil.</p>
      <div className='field'>
        <label htmlFor="name">Navn</label>
        <input type="text" id="name" name="name" value={info.name}
          onChange={e => setInfo({
            ...info,
            name: e.target.value
          })}
        />
        <div className='errors'>{validation.name}</div>
      </div>
      <div className='field'>
        <label htmlFor="email">E-post</label>
        <input type="text" id="email" name="email" value={info.email}
          onChange={e => setInfo({
            ...info,
            email: e.target.value
          })}
        />
        <div className='errors'>{validation.email}</div>
      </div>
      <div className='actions'>
        <button className='primary' onClick={() => {
          const v = validate(info);
          if (!v.errors) {
            writeInfo({
              ...info,
              status: 'done'
            });
            setStatus('done');
          } else {
            setValidation(v);
            setStatus('error');
          }
        }}>Lagre</button>
        <button className='secondary' onClick={() => {
          writeInfo({
            name: '', email: '', status: 'done'
          })
          setStatus('done');
        }}>Avbryt</button>
      </div>
    </div>
  );
};
