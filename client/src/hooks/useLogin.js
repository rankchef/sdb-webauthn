import { useState } from 'react';
import { startAuthentication } from '@simplewebauthn/browser';
import { apiFetch } from '../api';

export function useLogin(){
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const login = async (username) => {
        setLoading(true)
        try{
            const optionsRes = await apiFetch('/login/generate-options', {
                    method: 'POST',
                    body: JSON.stringify({ username }),
                });

            
                const optionsData = await optionsRes.json();
            if (!optionsRes.ok) {
                throw new Error(optionsData.error || 'Failed to generate login options');
            }

            const credential = await startAuthentication({optionsJSON: optionsData.options})

            const verifyRes = await apiFetch('/login/verify', {
                method: 'POST',
                body: JSON.stringify({ credential }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
                throw new Error(verifyData.error || 'Verification failed');
            }

            const meRes = await apiFetch('/me');
            const meData = await meRes.json();
            if (!meRes.ok) {
                throw new Error(meData.error || 'Login succeeded but session was not saved');
            }

            setSuccess(true);
            setError(false);
            return meData.user;
        }
        catch(error){
            setError(error.message)
            throw error;
        }
        finally{
            setLoading(false)
        }
    }

    return { login, isLoading, error, success }
}
