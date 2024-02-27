import clsx from 'clsx';
import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface InputPorps {
    label: string;
    id: string;
    type: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    disabled?: boolean; 
  }

const Input: React.FC<InputPorps> = ({
    label,
    id,
    type,
    required,
    register,
    errors,
    disabled
}) => {
  return (
    <div className='py-1 lg:py-4'>
        <label className="fl  ex felx-start text-md font-medium leading-6 text-gray-900" htmlFor={id}>
            {label}
        </label>
        <input
            id={id}
            type={type}
            disabled={disabled}
            {...register(id,{required})}
            className={clsx(`border border-gray-500 form-input text-gray-900 w-full p-1 lg:p-3 lg:px-4 `, errors && `focus:ring-rose-500`,  disabled && "opacity-50 cursor-default")}
        />
    </div>
  )
}

export default Input