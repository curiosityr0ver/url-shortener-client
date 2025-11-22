import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
    return (
        <div className="container animate-fade-in" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                filter: 'blur(100px)',
                position: 'absolute',
                width: '60%',
                height: '60%',
                zIndex: -1,
                borderRadius: '50%'
            }}></div>

            <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
                Shorten URLs with <br />
                <span style={{ background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Superpowers</span>
            </h1>

            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem' }}>
                The most powerful URL shortener for modern teams. Track clicks, manage links, and analyze performance with a premium experience.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                    Get Started for Free
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                    Login
                </Link>
            </div>

            <div style={{ marginTop: '5rem', display: 'flex', gap: '3rem', color: 'var(--text-secondary)' }}>
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>10k+</div>
                    <div>Links Shortened</div>
                </div>
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>5k+</div>
                    <div>Happy Users</div>
                </div>
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>99.9%</div>
                    <div>Uptime</div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
