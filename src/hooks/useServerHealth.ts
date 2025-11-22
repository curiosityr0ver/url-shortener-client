import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useServerHealth = () => {
    const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const checkHealth = async () => {
        setIsChecking(true);
        try {
            await api.get('/actuator/health', { timeout: 10000 });
            setIsHealthy(true);
        } catch (error) {
            console.error('Health check failed:', error);
            setIsHealthy(false);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        // Initial check
        checkHealth();

        // Set up interval to check every 60 seconds
        const interval = setInterval(checkHealth, 60000);

        return () => clearInterval(interval);
    }, []);

    return { isHealthy, isChecking, checkHealth };
};
