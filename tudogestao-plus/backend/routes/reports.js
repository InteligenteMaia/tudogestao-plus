// Reports Routes
const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

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

// Generate report
router.post('/generate', async (req, res) => {
    try {
        const { type, projectId, startDate, endDate, format } = req.body;
        
        if (!type || !projectId) {
            return res.status(400).json({
                success: false,
                error: 'Tipo de relatório e projeto são obrigatórios'
            });
        }
        
        const reportData = await generateReportData(type, projectId, startDate, endDate);
        
        let filePath;
        
        if (format === 'pdf' || format === 'abnt') {
            filePath = await generatePDFReport(reportData, format === 'abnt');
        } else if (format === 'docx') {
            filePath = await generateDOCXReport(reportData);
        } else {
            return res.status(400).json({
                success: false,
                error: 'Formato inválido'
            });
        }
        
        res.json({
            success: true,
            data: {
                reportType: type,
                projectId,
                format,
                filePath,
                downloadUrl: `/api/reports/download/${path.basename(filePath)}`,
                createdAt: new Date()
            },
            message: 'Relatório gerado com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Send report by email
router.post('/send-email', async (req, res) => {
    try {
        const { reportPath, recipients, subject, message } = req.body;
        
        if (!reportPath || !recipients || !Array.isArray(recipients)) {
            return res.status(400).json({
                success: false,
                error: 'Dados inválidos para envio de email'
            });
        }
        
        const mailOptions = {
            from: process.env.SMTP_USER || 'tudogestao@example.com',
            to: recipients.join(', '),
            subject: subject || 'Relatório TudoGestão+',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4f46e5;">TudoGestão+ - Relatório</h2>
                    <p>${message || 'Segue em anexo o relatório solicitado.'}</p>
                    <hr style="border: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="color: #64748b; font-size: 12px;">
                        Este é um email automático do sistema TudoGestão+.
                    </p>
                </div>
            `,
            attachments: [
                {
                    filename: path.basename(reportPath),
                    path: reportPath
                }
            ]
        };
        
        await emailTransporter.sendMail(mailOptions);
        
        res.json({
            success: true,
            message: 'Relatório enviado por email com sucesso',
            recipients: recipients.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Send report by WhatsApp
router.post('/send-whatsapp', async (req, res) => {
    try {
        const { reportPath, phoneNumbers, message } = req.body;
        
        if (!reportPath || !phoneNumbers || !Array.isArray(phoneNumbers)) {
            return res.status(400).json({
                success: false,
                error: 'Dados inválidos para envio via WhatsApp'
            });
        }
        
        // Integração com WhatsApp Business API ou Twilio
        // Esta é uma implementação simulada
        const whatsappResults = await Promise.all(
            phoneNumbers.map(async (phone) => {
                // Aqui você integraria com a API do WhatsApp Business
                // Por exemplo: Twilio, WhatsApp Cloud API, etc.
                return {
                    phone,
                    status: 'sent',
                    messageId: `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                };
            })
        );
        
        res.json({
            success: true,
            message: 'Relatório enviado via WhatsApp com sucesso',
            results: whatsappResults,
            totalSent: whatsappResults.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Download report
router.get('/download/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../../temp/reports', filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                error: 'Arquivo não encontrado'
            });
        }
        
        res.download(filePath);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Helper functions
async function generateReportData(type, projectId, startDate, endDate) {
    // Buscar dados do projeto e gerar conteúdo do relatório
    // Esta é uma implementação simulada
    return {
        type,
        projectId,
        projectName: 'ERP Financeiro',
        startDate,
        endDate,
        generatedAt: new Date(),
        content: {
            summary: 'Resumo executivo do projeto',
            progress: '65% concluído',
            tasks: {
                total: 15,
                completed: 10,
                inProgress: 3,
                pending: 2
            },
            team: [
                { name: 'João Silva', role: 'Desenvolvedor', tasks: 5 },
                { name: 'Maria Santos', role: 'Gerente', tasks: 3 }
            ],
            activities: [
                { date: '2025-10-20', description: 'Implementação de módulo X', status: 'Concluído' },
                { date: '2025-10-22', description: 'Testes unitários', status: 'Em andamento' }
            ],
            metrics: {
                productivity: 85,
                quality: 92,
                onTime: 78
            }
        }
    };
}

async function generatePDFReport(reportData, isABNT = false) {
    return new Promise((resolve, reject) => {
        try {
            const tempDir = path.join(__dirname, '../../temp/reports');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            
            const filename = `report_${Date.now()}.pdf`;
            const filePath = path.join(tempDir, filename);
            const doc = new PDFDocument({ margin: 50 });
            
            doc.pipe(fs.createWriteStream(filePath));
            
            if (isABNT) {
                // Formatação ABNT
                doc.fontSize(14).font('Helvetica-Bold').text('RELATÓRIO TÉCNICO', { align: 'center' });
                doc.moveDown();
                doc.fontSize(12).font('Helvetica').text(`Projeto: ${reportData.projectName}`, { align: 'center' });
                doc.moveDown(2);
            } else {
                // Formatação padrão
                doc.fontSize(20).font('Helvetica-Bold').text('TudoGestão+', { align: 'center' });
                doc.moveDown();
                doc.fontSize(16).text(`Relatório - ${reportData.projectName}`, { align: 'center' });
                doc.moveDown(2);
            }
            
            // Conteúdo do relatório
            doc.fontSize(14).font('Helvetica-Bold').text('1. RESUMO EXECUTIVO');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica').text(reportData.content.summary);
            doc.moveDown(1.5);
            
            doc.fontSize(14).font('Helvetica-Bold').text('2. PROGRESSO DO PROJETO');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica').text(`Status: ${reportData.content.progress}`);
            doc.text(`Tarefas Totais: ${reportData.content.tasks.total}`);
            doc.text(`Tarefas Concluídas: ${reportData.content.tasks.completed}`);
            doc.text(`Tarefas em Andamento: ${reportData.content.tasks.inProgress}`);
            doc.text(`Tarefas Pendentes: ${reportData.content.tasks.pending}`);
            doc.moveDown(1.5);
            
            doc.fontSize(14).font('Helvetica-Bold').text('3. EQUIPE');
            doc.moveDown(0.5);
            reportData.content.team.forEach(member => {
                doc.fontSize(11).font('Helvetica').text(`• ${member.name} - ${member.role} (${member.tasks} tarefas)`);
            });
            doc.moveDown(1.5);
            
            doc.fontSize(14).font('Helvetica-Bold').text('4. ATIVIDADES RECENTES');
            doc.moveDown(0.5);
            reportData.content.activities.forEach(activity => {
                doc.fontSize(11).font('Helvetica').text(`${activity.date}: ${activity.description} [${activity.status}]`);
            });
            doc.moveDown(1.5);
            
            doc.fontSize(14).font('Helvetica-Bold').text('5. MÉTRICAS DE DESEMPENHO');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica').text(`Produtividade: ${reportData.content.metrics.productivity}%`);
            doc.text(`Qualidade: ${reportData.content.metrics.quality}%`);
            doc.text(`Pontualidade: ${reportData.content.metrics.onTime}%`);
            
            // Footer
            doc.moveDown(2);
            doc.fontSize(9).font('Helvetica').text(
                `Gerado em ${new Date().toLocaleString('pt-BR')} | TudoGestão+ v1.0`,
                { align: 'center' }
            );
            
            doc.end();
            
            doc.on('finish', () => {
                resolve(filePath);
            });
            
            doc.on('error', (error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function generateDOCXReport(reportData) {
    // Implementar geração de DOCX usando a biblioteca 'docx'
    // Por enquanto, retorna um placeholder
    const tempDir = path.join(__dirname, '../../temp/reports');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const filename = `report_${Date.now()}.docx`;
    const filePath = path.join(tempDir, filename);
    
    // Simular criação de arquivo DOCX
    fs.writeFileSync(filePath, 'Relatório DOCX - Em desenvolvimento');
    
    return filePath;
}

module.exports = router;
