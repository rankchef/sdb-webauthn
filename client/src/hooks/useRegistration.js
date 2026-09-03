import { useState } from 'react'
import { startRegistration } from '@simplewebauthn/browser';
import { apiFetch } from '../api';

export function useRegistration(){
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const register = async (username) => {
        setLoading(true);
        
        try{
            const optionsRes = await apiFetch('/register/generate-options', {
                    method: 'POST',
                    body: JSON.stringify({ username }),
                });
            
            const optionsData = await optionsRes.json();
            if (!optionsRes.ok) {
                throw new Error(optionsData.error || 'Failed to generate registration options');
            }

            const credential = await startRegistration({ optionsJSON: optionsData.options });

            const verifyRes = await apiFetch('/register/verify', {
                method: 'POST',
                body: JSON.stringify({ credential }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
                throw new Error(verifyData.error || 'Verification failed');
            }
            setSuccess(true);
            setError(false);
        }
        catch(error){
            setError(error.message)
        }
        finally {
            setLoading(false);
        }
    }

    return { register, isLoading, error, success };
}
