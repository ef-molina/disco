import React from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth.js'; //

/**
 * Register component for user registration.
 * This component renders a registration form where users can create a new account.
 * Upon successful registration, it alerts the user and redirects to the login page.
 * It also validates that the password and confirm password fields match.
 */
const Register = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.target;

        // Handle form submission logic
        const formData = new FormData(event.target); // this will collect all form data
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password');

        // Validate password and confirm password
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // try to register the user
        try {
            const { userId } = await registerUser({ username, email, password });
            console.log('User registered with ID:', userId);
            alert('Registration successful!');
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Registration failed. Please try again.');
            return;
        }

        form.reset();
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className='flex flex-col h-screen p-4 justify-center items-center'>
            <h1 className='text-2xl font-bold mb-4'>Register Page</h1>
            <p className='mb-4'>Please fill out the form to create a new account.</p>
            <form className='w-80' onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='block mb-2' htmlFor='username'>
                        Username
                    </label>
                    <input className='w-full p-2 border border-gray-300 rounded' type='text' id='username' name='username' required />
                </div>
                <div className='mb-4'>
                    <label className='block mb-2' htmlFor='email'>
                        Email
                    </label>
                    <input className='w-full p-2 border border-gray-300 rounded' type='email' id='email' name='email' required />
                </div>
                <div className='mb-4'>
                    <label className='block mb-2' htmlFor='password'>
                        Password
                    </label>
                    <input className='w-full p-2 border border-gray-300 rounded' type='password' id='password' name='password' required />
                </div>
                <div className='mb-4'>
                    <label className='block mb-2' htmlFor='confirm-password'>
                        Confirm Password
                    </label>
                    <input className='w-full p-2 border border-gray-300 rounded' type='password' id='confirm-password' name='confirm-password' required />
                </div>
                <button className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600' type='submit'>
                    Register
                </button>
            </form>
            <p className='mt-4 text-sm text-gray-600'>
                Already have an account?{' '}
                <a href='/login' className='text-blue-500 hover:underline'>
                    Login here
                </a>
                .
            </p>
        </div>
    );
};

export default Register;
