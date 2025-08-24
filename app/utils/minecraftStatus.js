export async function getServerStatus(ip, port = 19132) {
    try {
        // API 1: mcapi.us
        const response = await fetch(`https://api.mcapi.us/server/status/bedrock/${ip}:${port}`);
        const data = await response.json();
        
        return {
            online: data.online,
            players: {
                current: data.players?.online || 0,
                max: data.players?.max || 0
            },
            motd: data.motd,
            version: data.version
        };
    } catch (error) {
        try {
            // API 2: Fallback para mcsrvstat.us
            const response2 = await fetch(`https://api.mcsrvstat.us/bedrock/3/${ip}:${port}`);
            const data2 = await response2.json();
            
            return {
                online: data2.online,
                players: {
                    current: data2.players?.online || 0,
                    max: data2.players?.max || 0
                },
                motd: data2.motd?.clean?.[0] || 'Servidor Minecraft'
            };
        } catch (error2) {
            return { 
                online: false, 
                error: 'Servidor offline ou inacessível' 
            };
        }
    }
}