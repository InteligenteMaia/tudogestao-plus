// Communication Routes
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Email configuration
const emailTransporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'seu-email@gmail.com',
        pass: process.env.SMTP_PASS || 'sua-senha'
    }
});

// Send orientation/communication
router.post('/send', async (req, res) => {
    try {
        const { recipients, type, message, sendVia } = req.body;
        
        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Destinatários são obrigatórios'
            });
        }
        
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Mensagem é obrigatória'
            });
        }
        
        const results = {
            email: null,
            whatsapp: null,
            sistema: null
        };
        
        // Send via Email
        if (sendVia.includes('email')) {
            results.email = await sendEmailNotification(recipients, type, message);
        }
        
        // Send via WhatsApp
        if (sendVia.includes('whatsapp')) {
            results.whatsapp = await sendWhatsAppNotification(recipients, type, message);
        }
        
        // Send via Sistema (save to database for in-app notifications)
        if (sendVia.includes('sistema')) {
            results.sistema = await saveSystemNotification(recipients, type, message);
        }
        
        res.json({
            success: true,
            message: 'Comunicação enviada com sucesso',
            results,
            sentAt: new Date()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Send task orientation
router.post('/task-orientation', async (req, res) => {
    try {
        const { taskId, userId, orientation, sendVia } = req.body;
        
        if (!taskId || !userId || !orientation) {
            return res.status(400).json({
                success: false,
                error: 'Dados incompletos'
            });
        }
        
        // Get task and user info
        const taskInfo = await getTaskInfo(taskId);
        const userInfo = await getUserInfo(userId);
        
        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4f46e5;">Nova Orientação de Tarefa</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #1e293b;">Tarefa: ${taskInfo.title}</h3>
                    <p style="color: #64748b;">${taskInfo.description}</p>
                </div>
                <div style="background: #fff; border-left: 4px solid #4f46e5; padding: 15px; margin: 20px 0;">
                    <h4 style="color: #1e293b; margin-top: 0;">Orientações:</h4>
                    <p style="color: #475569; line-height: 1.6;">${orientation}</p>
                </div>
                <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
                    Este é um email automático do sistema TudoGestão+.
                </p>
            </div>
        `;
        
        const results = {};
        
        if (sendVia.includes('email')) {
            results.email = await sendEmail(userInfo.email, 'Nova Orientação de Tarefa', message);
        }
        
        if (sendVia.includes('whatsapp')) {
            const whatsappMessage = `*Nova Orientação de Tarefa*\n\n*Tarefa:* ${taskInfo.title}\n\n*Orientações:*\n${orientation}`;
            results.whatsapp = await sendWhatsApp(userInfo.phone, whatsappMessage);
        }
        
        res.json({
            success: true,
            message: 'Orientação enviada com sucesso',
            results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get communication history
router.get('/history', async (req, res) => {
    try {
        const { userId, type, startDate, endDate } = req.query;
        
        // Buscar histórico de comunicações do banco de dados
        const history = await getCommunicationHistory(userId, type, startDate, endDate);
        
        res.json({
            success: true,
            data: history,
            total: history.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Helper functions
async function sendEmailNotification(recipients, type, message) {
    const emailList = await getEmailsFromRecipients(recipients);
    
    const typeLabels = {
        orientacao: 'Orientação de Tarefa',
        feedback: 'Feedback',
        alerta: 'Alerta',
        atualizacao: 'Atualização'
    };
    
    const mailOptions = {
        from: process.env.SMTP_USER || 'tudogestao@example.com',
        to: emailList.join(', '),
        subject: `TudoGestão+ - ${typeLabels[type] || 'Notificação'}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4f46e5;">${typeLabels[type] || 'Notificação'}</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    ${message}
                </div>
                <hr style="border: 1px solid #e2e8f0; margin: 20px 0;">
                <p style="color: #64748b; font-size: 12px;">
                    Este é um email automático do sistema TudoGestão+.<br>
                    Enviado em ${new Date().toLocaleString('pt-BR')}
                </p>
            </div>
        `
    };
    
    try {
        const info = await emailTransporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: info.messageId,
            recipients: emailList.length
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

async function sendWhatsAppNotification(recipients, type, message) {
    const phoneNumbers = await getPhonesFromRecipients(recipients);
    
    const typeLabels = {
        orientacao: '📋 Orientação',
        feedback: '💬 Feedback',
        alerta: '⚠️ Alerta',
        atualizacao: '🔔 Atualização'
    };
    
    const whatsappMessage = `*TudoGestão+ - ${typeLabels[type]}*\n\n${message}`;
    
    // Integração com WhatsApp Business API
    // Esta é uma implementação simulada
    const results = await Promise.all(
        phoneNumbers.map(async (phone) => {
            // Aqui você integraria com Twilio, WhatsApp Cloud API, etc.
            return {
                phone,
                status: 'sent',
                messageId: `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            };
        })
    );
    
    return {
        success: true,
        results,
        totalSent: results.length
    };
}

async function saveSystemNotification(recipients, type, message) {
    // Salvar notificação no banco de dados para exibir no sistema
    const notifications = recipients.map(recipientId => ({
        recipientId,
        type,
        message,
        read: false,
        createdAt: new Date()
    }));
    
    // Salvar no banco de dados
    // await Notification.insertMany(notifications);
    
    return {
        success: true,
        saved: notifications.length
    };
}

async function getEmailsFromRecipients(recipientIds) {
    // Buscar emails dos usuários do banco de dados
    // Esta é uma implementação simulada
    const mockEmails = [
        'joao.silva@example.com',
        'maria.santos@example.com',
        'pedro.oliveira@example.com'
    ];
    
    return mockEmails;
}

async function getPhonesFromRecipients(recipientIds) {
    // Buscar telefones dos usuários do banco de dados
    // Esta é uma implementação simulada
    const mockPhones = [
        '+5511999999999',
        '+5511988888888',
        '+5511977777777'
    ];
    
    return mockPhones;
}

async function getTaskInfo(taskId) {
    // Buscar informações da tarefa do banco de dados
    return {
        id: taskId,
        title: 'Implementar autenticação',
        description: 'Desenvolver sistema de login e autenticação JWT'
    };
}

async function getUserInfo(userId) {
    // Buscar informações do usuário do banco de dados
    return {
        id: userId,
        name: 'João Silva',
        email: 'joao.silva@example.com',
        phone: '+5511999999999'
    };
}

async function sendEmail(to, subject, html) {
    const mailOptions = {
        from: process.env.SMTP_USER || 'tudogestao@example.com',
        to,
        subject,
        html
    };
    
    try {
        const info = await emailTransporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

async function sendWhatsApp(phone, message) {
    // Integração com WhatsApp Business API
    return {
        success: true,
        phone,
        messageId: `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
}

async function getCommunicationHistory(userId, type, startDate, endDate) {
    // Buscar histórico do banco de dados
    // Esta é uma implementação simulada
    return [
        {
            id: 1,
            type: 'orientacao',
            message: 'Lembre-se de seguir as melhores práticas de código',
            sentAt: new Date('2025-10-25'),
            sentVia: ['email', 'whatsapp']
        },
        {
            id: 2,
            type: 'feedback',
            message: 'Excelente trabalho na implementação do módulo!',
            sentAt: new Date('2025-10-24'),
            sentVia: ['sistema']
        }
    ];
}

module.exports = router;
