const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class MinecraftService {
    static async createPendingPurchase(data) {
        try {
            return await prisma.$executeRaw`
                INSERT INTO minecraft_purchases 
                (userId, playerName, itemId, itemName, quantity, transactionId, orderId, status)
                VALUES (${data.userId}, ${data.playerName}, ${data.itemId}, 
                        ${data.itemName}, ${data.quantity}, ${data.transactionId}, 
                        ${data.orderId}, 'pending')
            `;
        } catch (error) {
            console.error('Erro ao criar compra pendente:', error);
            throw error;
        }
    }

    static async getPendingPurchases(playerName) {
        try {
            return await prisma.$queryRaw`
                SELECT * FROM minecraft_purchases 
                WHERE playerName = ${playerName} AND status = 'pending'
                ORDER BY createdAt ASC
            `;
        } catch (error) {
            console.error('Erro ao buscar compras pendentes:', error);
            return [];
        }
    }

    static async markAsDelivered(transactionId) {
        try {
            return await prisma.$executeRaw`
                UPDATE minecraft_purchases 
                SET status = 'delivered', deliveredAt = CURRENT_TIMESTAMP
                WHERE transactionId = ${transactionId}
            `;
        } catch (error) {
            console.error('Erro ao marcar como entregue:', error);
            throw error;
        }
    }

    static async incrementAttempts(transactionId, errorMessage = null) {
        try {
            return await prisma.$executeRaw`
                UPDATE minecraft_purchases 
                SET attempts = attempts + 1, 
                    lastAttempt = CURRENT_TIMESTAMP,
                    errorMessage = ${errorMessage}
                WHERE transactionId = ${transactionId}
            `;
        } catch (error) {
            console.error('Erro ao incrementar tentativas:', error);
            throw error;
        }
    }

    static async getDeliveryStats() {
        try {
            const stats = await prisma.$queryRaw`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
                    AVG(CASE WHEN deliveredAt IS NOT NULL 
                         THEN (julianday(deliveredAt) - julianday(createdAt)) * 24 * 60 
                         ELSE NULL END) as avgDeliveryTimeMinutes
                FROM minecraft_purchases 
                WHERE createdAt >= date('now', '-7 days')
            `;
            
            return stats[0];
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return {
                total: 0,
                delivered: 0,
                pending: 0,
                failed: 0,
                avgDeliveryTimeMinutes: 0
            };
        }
    }

    static mapProductToMinecraft(productId, quantity = 1) {
        // Mapeia IDs dos produtos do seu e-commerce para items do Minecraft
        const itemMap = {
            // Adicione seus mapeamentos aqui baseado nos IDs dos seus produtos
            'diamond_1': { itemId: 'diamond', itemName: 'Diamante', quantity: 1 },
            'diamond_10': { itemId: 'diamond', itemName: 'Diamante', quantity: 10 },
            'diamond_64': { itemId: 'diamond', itemName: 'Diamante', quantity: 64 },
            
            'iron_ingot_64': { itemId: 'iron_ingot', itemName: 'Lingote de Ferro', quantity: 64 },
            'gold_ingot_32': { itemId: 'gold_ingot', itemName: 'Lingote de Ouro', quantity: 32 },
            
            'elytra': { itemId: 'elytra', itemName: 'Élitros', quantity: 1 },
            'shulker_box': { itemId: 'shulker_box', itemName: 'Baú de Shulker', quantity: 1 },
            'beacon': { itemId: 'beacon', itemName: 'Farol', quantity: 1 },
            
            'netherite_ingot': { itemId: 'netherite_ingot', itemName: 'Lingote de Netherite', quantity: 1 },
            'enchanted_golden_apple': { itemId: 'enchanted_golden_apple', itemName: 'Maçã Dourada Encantada', quantity: 1 },
            'nether_star': { itemId: 'nether_star', itemName: 'Estrela do Nether', quantity: 1 },
        };

        const mapped = itemMap[productId];
        if (mapped) {
            return {
                ...mapped,
                quantity: mapped.quantity * quantity
            };
        }

        // Fallback para produtos não mapeados
        return {
            itemId: 'dirt',
            itemName: 'Item Desconhecido',
            quantity: 1
        };
    }

    static async notifyPurchase(orderData) {
        try {
            if (!orderData.minecraftUsername) {
                console.log('Pedido sem username do Minecraft, pulando integração');
                return { success: true, skipped: true };
            }

            console.log(`🎮 Processando compra Minecraft para ${orderData.minecraftUsername}`);

            const results = [];
            
            // Processa cada item do pedido
            for (const item of orderData.items) {
                const minecraftItem = this.mapProductToMinecraft(item.productId, item.quantity);
                
                const transactionId = `${orderData.orderId}-${item.id || item.productId}-${Date.now()}`;
                
                await this.createPendingPurchase({
                    userId: orderData.userId,
                    playerName: orderData.minecraftUsername,
                    itemId: minecraftItem.itemId,
                    itemName: minecraftItem.itemName,
                    quantity: minecraftItem.quantity,
                    transactionId,
                    orderId: orderData.orderId
                });

                results.push({
                    itemId: minecraftItem.itemId,
                    itemName: minecraftItem.itemName,
                    quantity: minecraftItem.quantity,
                    transactionId
                });
            }

            // Notifica o serviço de integração (se estiver rodando)
            try {
                const integrationUrl = process.env.MINECRAFT_INTEGRATION_URL;
                if (integrationUrl) {
                    const response = await fetch(`${integrationUrl}/api/notify-purchase`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.MINECRAFT_INTEGRATION_SECRET}`
                        },
                        body: JSON.stringify({
                            playerName: orderData.minecraftUsername,
                            items: results
                        })
                    });

                    if (!response.ok) {
                        console.warn('Falha ao notificar serviço de integração, mas items ficaram na fila');
                    }
                }
            } catch (error) {
                console.warn('Serviço de integração não disponível, items ficaram na fila:', error.message);
            }

            console.log(`✅ ${results.length} items adicionados à fila do Minecraft para ${orderData.minecraftUsername}`);
            
            return { 
                success: true, 
                itemsCount: results.length, 
                items: results 
            };

        } catch (error) {
            console.error('Erro na integração Minecraft:', error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }
}

module.exports = { MinecraftService };