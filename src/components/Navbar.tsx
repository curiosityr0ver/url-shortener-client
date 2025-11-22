import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServerHealth } from '../hooks/useServerHealth';

const Navbar: React.FC = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const { isHealthy, isChecking, checkHealth } = useServerHealth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-panel" style={{
            position: 'sticky',
            top: '1rem',
            zIndex: 50,
            margin: '1rem auto',
            maxWidth: '1200px',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '-1px' }}>
                    URLShortener
                </Link>

                {/* Server Status Indicator */}
                <button
                    onClick={checkHealth}
                    disabled={isChecking}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 0.8rem',
                        background: isHealthy === null ? '#333' : isHealthy ? '#10b981' : '#ef4444',
                        color: 'white',
                        border: '2px solid',
                        borderColor: isHealthy === null ? '#555' : isHealthy ? '#10b981' : '#ef4444',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        cursor: isChecking ? 'wait' : 'pointer',
                        opacity: isChecking ? 0.7 : 1,
                    }}
                    title="Click to check server status"
                >
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'white',
                        animation: isChecking ? 'pulse 1s infinite' : 'none'
                    }} />
                    {isChecking ? 'Checking...' : isHealthy === null ? 'Unknown' : isHealthy ? 'Server Online' : 'Server Offline'}
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {isAuthenticated ? (
                    <>
                        <span style={{ color: 'var(--text-secondary)' }}>Hello, {user?.username}</span>
                        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Login</Link>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem' }}>
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
