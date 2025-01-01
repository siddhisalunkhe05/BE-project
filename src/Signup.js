import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await axios.post('http://127.0.0.1:5000/signup', { username, email, password1, password2 });
            setSuccessMessage(response.data.message);
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white py-6 px-4 sm:px-6 lg:px-8">
            <div className="absolute top-4 left-4 text-xl font-bold text-black">
            skillFusion Extractor
            </div>  
    <div className="max-w-md w-full space-y-6 bg-gray-100 p-6 rounded-xl shadow-xl border border-gray-300">
        <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                Signup Here
            </h2>
        </div>
        <form className="mt-4 space-y-4" onSubmit={handleSignup}>
            <div className="rounded-md shadow-sm -space-y-px">
                <div className="mb-4"> {/* Standardized bottom margin */}
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-50"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-4"> {/* Standardized bottom margin */}
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-50"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4"> {/* Standardized bottom margin */}
                    <label htmlFor="password1" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="password1"
                        name="password1"
                        type="password"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-50"
                        placeholder="Create a password"
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                    />
                </div>
                <div className="mb-4"> {/* Standardized bottom margin */}
                    <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                    </label>
                    <input
                        id="password2"
                        name="password2"
                        type="password"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-50"
                        placeholder="Confirm your password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                    Sign Up
                </button>
            </div>
        </form>
        {successMessage && <p className="mt-2 text-center text-sm text-green-600">{successMessage}</p>}
        {errorMessage && <p className="mt-2 text-center text-sm text-red-600">{errorMessage}</p>}
        <div className="text-center mt-2">
            <a href="/" className="font-medium text-blue-600 hover:text-blue-700 transition duration-150 ease-in-out">
                I already have an account
            </a>
        </div>
    </div>
</div>



    );
};

export default Signup;