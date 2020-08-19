import React, { InputHTMLAttributes } from 'react';

import { InputAlertInterface } from '../../pages/NewSurvivor';

import './styles.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  error?: InputAlertInterface;
}

const Input: React.FC<InputProps> = ({ name, label, error, ...rest }) => {
  return (
    <div className="input-block">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} {...rest} className={error? 'error-input': ''} />
      
      {error && <p className="error-message">{ `${error.field} ${error.error}` }</p>}
    </div>
  );
}

export default Input;