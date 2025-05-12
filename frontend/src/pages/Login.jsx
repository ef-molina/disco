import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth.js';

/**
 * Login component for user authentication.
 * This component renders a login form where users can enter their credentials.
 * Upon successful login, it sets the userLoggedIn state to true,
 * stores the user information in local storage, and redirects to the home page.
 *
 */
const Login = ({ setUserLoggedIn, setUser }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        // Validate form inputs
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        if (!username || !password) {
            alert('Please fill in all fields.');
            return;
        }

        // login the user
        try {
            const user = await loginUser({ username, password });
            console.log('Logged in user:', user);

            // we will store a flag to see if user is still logges in or not
            localStorage.setItem('userLoggedIn', true);
            setUserLoggedIn(true);
            console.log('User logged in:', user);
            setUser(user);

            // Redirect to home
            navigate('/genres');
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div className='flex flex-col h-screen p-4 justify-center items-center'>
            <h1 className='text-2xl font-bold mb-4'>Login Page</h1>
            <p className='mb-4'>Please enter your credentials to log in.</p>
            <form className='w-80' onSubmit={handleLogin}>
                <div className='mb-4'>
                    <label className='block mb-2' htmlFor='username'>
                        Username
                    </label>
                    <input className='w-full p-2 border border-gray-300 rounded' type='text' id='username' name='username' required />
                </div>
                <div className='mb-4'>
                    <label className='block mb-2' htmlFor='password'>
                        Password
                    </label>
                    <input className='w-full p-2 border border-gray-300 rounded' type='password' id='password' name='password' required />
                </div>
                <button className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600' type='submit'>
                    Login
                </button>
            </form>
            <p className='mt-4 text-sm text-gray-600'>
                Don't have an account?{' '}
                <a href='/register' className='text-blue-500 hover:underline'>
                    Register here
                </a>
                .
            </p>
        </div>
    );
};

export default Login;
