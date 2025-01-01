import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';

// Import components
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
//import Dashboard from './Dashboard';
import Dashboard from './components/Dashboard';


// PrivateRoute component
const PrivateRoute = ({ element: Element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

// PublicRoute component (for login and signup)
const PublicRoute = ({ element: Element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/home" /> : <Element />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<PublicRoute element={Login} />} />
                    <Route path="/signup" element={<PublicRoute element={Signup} />} />
                    
                    {/* Private routes */}
                    <Route path="/home" element={<PrivateRoute element={Home} />} />
                    <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
                    
                    {/* Redirect root to login if not authenticated, otherwise to home */}
                    <Route 
                        path="/" 
                        element={
                            <PrivateRoute element={() => <Navigate to="/home" />} />
                        } 
                    />

                    {/* Catch-all route for undefined paths */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;