import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', { username, password });
            setSuccessMessage(response.data.message);
            login();
            setTimeout(() => navigate('/welcome'), 1500);
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
            {/* Project name */}
            <div className="absolute top-4 left-4 text-xl font-bold text-black">
            skillFusion Extractor
            </div>   
    <div className="max-w-md w-full space-y-8 bg-gray-100 p-10 rounded-xl shadow-xl border border-gray-300"> {/* Added border and border-gray-300 */}
        <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Login Here
            </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-50"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-50"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                    Log In
                </button>
            </div>
        </form>
        {successMessage && <p className="mt-2 text-center text-sm text-green-600">{successMessage}</p>}
        {errorMessage && <p className="mt-2 text-center text-sm text-red-600">{errorMessage}</p>}
        <div className="text-center mt-4">
            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-700 transition duration-150 ease-in-out">
                Create an account
            </a>
        </div>
    </div>
</div>

    );
};

export default Login;