'use client';
import { useState, useEffect } from 'react';

export default function ServerStatus() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch('/api/server-status');
                const data = await response.json();
                setStatus(data);
            } catch (error) {
                setStatus({ online: false, error: 'Erro ao carregar' });
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // Atualiza a cada 30s
        
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="text-center p-4">🔄 Verificando servidor...</div>;
    }

    return (
        <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">📡 Status do Servidor</h3>
            
            <div className="flex items-center gap-2 mb-2">
                <span className={status?.online ? 'text-green-600' : 'text-red-600'}>
                    {status?.online ? '🟢 Online' : '🔴 Offline'}
                </span>
            </div>
            
            {status?.online && (
                <div className="text-sm text-gray-600">
                    <p>👥 Jogadores: {status.players.current}/{status.players.max}</p>
                    <p>📝 MOTD: {status.motd}</p>
                </div>
            )}
            
            {status?.error && (
                <p className="text-red-500 text-sm">❌ {status.error}</p>
            )}
        </div>
    );
}