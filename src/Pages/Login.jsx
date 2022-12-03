import React, { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import WhiteLogo from '../Assets/White.png';
import { login } from '../services';

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [requestError, setRequestError] = useState(null);
  const onSubmit = (data) => {
    console.log(data);
    login(data)
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem('token', res.data.data.token);
          localStorage.setItem('email', res.data.data.email);
          localStorage.setItem('role', res.data.data.role);
          navigate('/');
        } else {
          setRequestError(res.data.error);
        }
      })
      .catch((err) => {
        setRequestError(err.message);
      });
  };
  return (
    <>
      <main className='relative h-screen'>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='w-96'>
            <div className='flex items-center justify-start'>
              <img src={WhiteLogo} alt='logo' className='w-52 mx-auto' />
            </div>

            <div className='flex items-center justify-start my-1 w-full'>
              <form
                id='login'
                className='w-full p-4 bg-gray-800 rounded-xl'
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className='flex items-center justify-start my-3 w-full'>
                  <h1 className='text-white text-center text-2xl w-full'>
                    Login{' '}
                  </h1>
                </div>
                <div className='m-3'>
                  <input
                    type='email'
                    name='name'
                    id='name'
                    className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 px-4 rounded-full py-2 leading-tight'
                    placeholder='Email Address'
                    {...register('email', { required: true })}
                  />
                </div>
                <div className='m-3'>
                  <input
                    type='password'
                    name='name'
                    id='name'
                    className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 px-4 rounded-full py-2 leading-tight'
                    placeholder='Password'
                    {...register('password', { required: true })}
                  />
                </div>
                <div className='m-3'>
                  <button className='w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-full hover:shadow-inner hover:shadow-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'>
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
