import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface UrlData {
    id: number;
    shortCode: string;
    shortUrl: string;
    originalUrl: string;
    hits: number;
    createdAt: string;
    expireAt: string | null;
}

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [myUrls, setMyUrls] = useState<UrlData[]>([]);
    const [popularUrls, setPopularUrls] = useState<UrlData[]>([]);
    const [originalUrl, setOriginalUrl] = useState('');
    const [customShortCode, setCustomShortCode] = useState('');
    const [durationValue, setDurationValue] = useState('');
    const [durationUnit, setDurationUnit] = useState<'hours' | 'days'>('hours');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'my' | 'popular'>('popular');
    const [lastShortenedUrl, setLastShortenedUrl] = useState<UrlData | null>(null);

    const fetchUrls = async () => {
        console.log('Fetching URLs...');

        // Fetch popular URLs
        try {
            const popularResponse = await api.get('/api/urls/stats/popular');
            setPopularUrls(popularResponse.data);
        } catch (error) {
            console.error('Error fetching popular URLs', error);
        }

        // Fetch user URLs if logged in
        if (user) {
            console.log('Fetching user URLs for user:', user.id);
            try {
                const myResponse = await api.get(`/api/users/${user.id}/urls`);
                setMyUrls(myResponse.data);
                setActiveTab('my');
            } catch (error) {
                console.error('Error fetching user URLs', error);
                toast.error('Failed to fetch your URLs');
            }
        }
    };

    useEffect(() => {
        fetchUrls();
    }, [user]);

    const handleShorten = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setLastShortenedUrl(null);

        try {
            const payload: any = {
                originalUrl,
            };

            if (user) {
                payload.userId = user.id;
            }

            if (durationValue) {
                const now = new Date();
                const value = parseInt(durationValue);
                if (!isNaN(value) && value > 0) {
                    if (durationUnit === 'hours') {
                        now.setHours(now.getHours() + value);
                    } else {
                        now.setDate(now.getDate() + value);
                    }
                    payload.expireAt = now.toISOString();
                }
            }

            let response;
            if (customShortCode) {
                payload.customShortCode = customShortCode;
                response = await api.post('/api/urls/custom', payload);
            } else {
                response = await api.post('/api/urls', payload);
            }

            setLastShortenedUrl(response.data);
            toast.success('URL Shortened successfully!');
            setOriginalUrl('');
            setCustomShortCode('');
            setDurationValue('');
            setDurationUnit('hours');
            fetchUrls(); // Refresh lists
        } catch (error: any) {
            console.error('Error shortening URL', error);
            toast.error(error.response?.data?.message || 'Failed to shorten URL');
        } finally {
            setLoading(false);
        }
    };

    const refreshUrlStats = async (shortCode: string) => {
        try {
            const response = await api.get(`/api/urls/${shortCode}`);
            const updatedUrl = response.data;

            // Update in myUrls
            setMyUrls(prev => prev.map(url =>
                url.shortCode === shortCode ? { ...url, hits: updatedUrl.hits } : url
            ));

            // Update in popularUrls
            setPopularUrls(prev => prev.map(url =>
                url.shortCode === shortCode ? { ...url, hits: updatedUrl.hits } : url
            ));

            toast.success('Stats updated!');
        } catch (error) {
            console.error('Error refreshing stats', error);
            toast.error('Failed to refresh stats');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this URL?')) return;
        try {
            await api.delete(`/api/urls/${id}`);
            toast.success('URL deleted');
            fetchUrls();
        } catch (error) {
            toast.error('Failed to delete URL');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <header style={{ textAlign: 'center', margin: '3rem 0' }}>
                <h1 className="page-title" style={{ marginBottom: '1rem' }}>Shorten Your Links</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Create custom, trackable short links in seconds.
                </p>
            </header>

            {/* Shortener Form */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <form onSubmit={handleShorten}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Original URL</label>
                            <input
                                type="url"
                                className="input-field"
                                placeholder="https://example.com/very-long-url"
                                value={originalUrl}
                                onChange={(e) => setOriginalUrl(e.target.value)}
                                required
                                style={{ fontSize: '1.1rem', padding: '1rem' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                                <label className="input-label">Custom Alias (Optional)</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="my-link"
                                    value={customShortCode}
                                    onChange={(e) => setCustomShortCode(e.target.value)}
                                />
                            </div>

                            <div className="input-group" style={{ marginBottom: 0 }}>
                                <label className="input-label">Expire After (Optional)</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="number"
                                        className="input-field"
                                        placeholder="e.g. 24"
                                        value={durationValue}
                                        onChange={(e) => setDurationValue(e.target.value)}
                                        min="1"
                                        style={{ flex: 1 }}
                                    />
                                    <select
                                        className="input-field"
                                        value={durationUnit}
                                        onChange={(e) => setDurationUnit(e.target.value as 'hours' | 'days')}
                                        style={{ width: '100px' }}
                                    >
                                        <option value="hours">Hours</option>
                                        <option value="days">Days</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }} disabled={loading}>
                            {loading ? 'Shortening...' : 'Shorten URL'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Result Section */}
            {lastShortenedUrl && (
                <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '4rem', border: '1px solid var(--primary)', background: 'rgba(99, 102, 241, 0.1)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>🎉 URL Shortened!</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <a href={lastShortenedUrl.shortUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'underline' }}>
                            {lastShortenedUrl.shortUrl}
                        </a>
                        <button onClick={() => copyToClipboard(lastShortenedUrl.shortUrl)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                            Copy
                        </button>
                    </div>
                    <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                        Original: {lastShortenedUrl.originalUrl}
                    </div>
                    {!user && (
                        <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Login</Link> to track hits and manage this link.
                        </div>
                    )}
                </div>
            )}

            {/* Lists Section */}
            <div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                    {user && (
                        <button
                            className={`btn ${activeTab === 'my' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setActiveTab('my')}
                        >
                            My URLs
                        </button>
                    )}
                    <button
                        className={`btn ${activeTab === 'popular' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('popular')}
                    >
                        Popular URLs
                    </button>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {(activeTab === 'my' && user ? myUrls : popularUrls).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                            No URLs found.
                        </div>
                    ) : (
                        (activeTab === 'my' && user ? myUrls : popularUrls).map((url) => (
                            <div key={url.id} className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                                {url.shortUrl}
                                            </a>
                                            <button onClick={() => copyToClipboard(url.shortUrl)} style={{ background: 'none', color: 'var(--text-secondary)', padding: '0.2rem' }} title="Copy">
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                            </button>
                                        </div>
                                        <div style={{ color: 'var(--text-secondary)', wordBreak: 'break-all', fontSize: '0.9rem' }}>
                                            {url.originalUrl}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{url.hits}</div>
                                                <button
                                                    onClick={() => refreshUrlStats(url.shortCode)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.2rem' }}
                                                    title="Refresh Hits"
                                                >
                                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                                </button>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Hits</div>
                                        </div>
                                        {activeTab === 'my' && user && (
                                            <button onClick={() => handleDelete(url.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                                    <span>Created: {new Date(url.createdAt).toLocaleDateString()}</span>
                                    {url.expireAt && <span>Expires: {new Date(url.expireAt).toLocaleDateString()}</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
