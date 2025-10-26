// ABNT Routes - Geração de documentos acadêmicos nas normas ABNT
const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate ABNT document
router.post('/generate', async (req, res) => {
    try {
        const { projectId, docType, author, title, subtitle, institution, course, advisor, year } = req.body;
        
        if (!projectId || !docType) {
            return res.status(400).json({
                success: false,
                error: 'Dados incompletos'
            });
        }
        
        // Get project data
        const projectData = await getProjectData(projectId);
        
        // Generate ABNT document
        const filePath = await generateABNTDocument({
            docType,
            author: author || 'Nome do Autor',
            title: title || projectData.name,
            subtitle: subtitle || '',
            institution: institution || 'Instituição de Ensino',
            course: course || 'Curso',
            advisor: advisor || 'Nome do Orientador',
            year: year || new Date().getFullYear(),
            content: projectData.content
        });
        
        res.json({
            success: true,
            message: 'Documento ABNT gerado com sucesso',
            data: {
                filePath,
                downloadUrl: `/api/abnt/download/${path.basename(filePath)}`,
                docType,
                createdAt: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Download ABNT document
router.get('/download/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../../temp/abnt', filename);
        
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
async function getProjectData(projectId) {
    // Buscar dados do projeto
    return {
        id: projectId,
        name: 'Sistema ERP Financeiro',
        content: {
            introduction: 'Este trabalho apresenta o desenvolvimento de um sistema ERP...',
            objectives: [
                'Desenvolver um sistema completo de gestão',
                'Implementar módulos financeiros',
                'Criar relatórios gerenciais'
            ],
            methodology: 'O desenvolvimento seguiu a metodologia ágil Scrum...',
            results: 'Os resultados obtidos demonstram a eficácia do sistema...',
            conclusion: 'Conclui-se que o sistema atende aos requisitos propostos...',
            references: [
                'PRESSMAN, Roger S. Engenharia de Software. 8. ed. São Paulo: McGraw-Hill, 2016.',
                'SOMMERVILLE, Ian. Engenharia de Software. 10. ed. São Paulo: Pearson, 2018.',
                'ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. NBR 14724: Informação e documentação: trabalhos acadêmicos: apresentação. Rio de Janeiro, 2011.'
            ]
        }
    };
}

async function generateABNTDocument(data) {
    return new Promise((resolve, reject) => {
        try {
            const tempDir = path.join(__dirname, '../../temp/abnt');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            
            const filename = `abnt_${data.docType}_${Date.now()}.pdf`;
            const filePath = path.join(tempDir, filename);
            const doc = new PDFDocument({ 
                margin: 72, // 2.5cm em pontos (ABNT)
                size: 'A4'
            });
            
            doc.pipe(fs.createWriteStream(filePath));
            
            // CAPA (conforme ABNT NBR 14724)
            doc.fontSize(12).font('Helvetica-Bold');
            doc.text(data.institution.toUpperCase(), { align: 'center' });
            doc.moveDown(0.5);
            doc.text(data.course.toUpperCase(), { align: 'center' });
            doc.moveDown(8);
            
            doc.fontSize(14).font('Helvetica-Bold');
            doc.text(data.author.toUpperCase(), { align: 'center' });
            doc.moveDown(8);
            
            doc.fontSize(14).font('Helvetica-Bold');
            doc.text(data.title.toUpperCase(), { align: 'center' });
            if (data.subtitle) {
                doc.moveDown(0.5);
                doc.fontSize(12);
                doc.text(data.subtitle, { align: 'center' });
            }
            
            // Posicionar cidade e ano no final da página
            doc.moveDown(12);
            doc.fontSize(12).font('Helvetica');
            doc.text(`${data.institution.split(' ')[0].toUpperCase()}`, { align: 'center' });
            doc.text(data.year.toString(), { align: 'center' });
            
            // FOLHA DE ROSTO
            doc.addPage();
            doc.fontSize(12).font('Helvetica-Bold');
            doc.text(data.author.toUpperCase(), { align: 'center' });
            doc.moveDown(8);
            
            doc.fontSize(14);
            doc.text(data.title.toUpperCase(), { align: 'center' });
            if (data.subtitle) {
                doc.moveDown(0.5);
                doc.fontSize(12);
                doc.text(data.subtitle, { align: 'center' });
            }
            doc.moveDown(4);
            
            // Natureza do trabalho
            doc.fontSize(10).font('Helvetica');
            const natureza = getTipoTrabalho(data.docType);
            doc.text(natureza, { 
                align: 'right',
                width: doc.page.width / 2,
                indent: doc.page.width / 2
            });
            doc.moveDown(0.5);
            doc.text(`Orientador: ${data.advisor}`, { 
                align: 'right',
                width: doc.page.width / 2,
                indent: doc.page.width / 2
            });
            
            doc.moveDown(8);
            doc.fontSize(12);
            doc.text(`${data.institution.split(' ')[0].toUpperCase()}`, { align: 'center' });
            doc.text(data.year.toString(), { align: 'center' });
            
            // SUMÁRIO
            doc.addPage();
            doc.fontSize(14).font('Helvetica-Bold');
            doc.text('SUMÁRIO', { align: 'center' });
            doc.moveDown(2);
            
            doc.fontSize(12).font('Helvetica');
            const sumario = [
                '1 INTRODUÇÃO ......................................................... 5',
                '2 OBJETIVOS ........................................................... 6',
                '3 METODOLOGIA ....................................................... 7',
                '4 RESULTADOS ......................................................... 8',
                '5 CONCLUSÃO .......................................................... 9',
                'REFERÊNCIAS ........................................................... 10'
            ];
            
            sumario.forEach(item => {
                doc.text(item);
                doc.moveDown(0.5);
            });
            
            // INTRODUÇÃO
            doc.addPage();
            doc.fontSize(12).font('Helvetica-Bold');
            doc.text('1 INTRODUÇÃO');
            doc.moveDown(1);
            
            doc.fontSize(12).font('Helvetica');
            doc.text(data.content.introduction, {
                align: 'justify',
                indent: 30,
                lineGap: 6
            });
            
            // OBJETIVOS
            doc.addPage();
            doc.fontSize(12).font('Helvetica-Bold');
            doc.text('2 OBJETIVOS');
            doc.moveDown(1);
            
            doc.fontSize(12).font('Helvetica');
            data.content.objectives.forEach((obj, index) => {
                doc.text(`${index + 1}. ${obj}`, {
                    align: 'justify',
                    indent: 30,
                    lineGap: 6
                });
                doc.moveDown(0.5);
            });
            
            // METODOLOGIA
            doc.addPage();
            doc.fontSize(12).font('Helvetica-Bold');
            doc.text('3 METODOLOGIA');
            doc.moveDown(1);
            
            doc.fontSize(12).font('Helvetica');
            doc.text(data.content.methodology, {
                align: 'justify',
                indent: 30,
                lineGap: 6
            });
            
            // RESULTADOS
            doc.addPage();
            doc.fontSize(12).font('Helvetica-Bold');
            doc.text('4 RESULTADOS');
            doc.moveDown(1);
            
            doc.fontSize(12).font('Helvetica');
            doc.text(data.content.results, {
                align: 'justify',
                indent: 30,
                lineGap: 6
            });
            
            // CONCLUSÃO
            doc.addPage();
            doc.fontSize(12).font('Helvetica-Bold');
            doc.text('5 CONCLUSÃO');
            doc.moveDown(1);
            
            doc.fontSize(12).font('Helvetica');
            doc.text(data.content.conclusion, {
                align: 'justify',
                indent: 30,
                lineGap: 6
            });
            
            // REFERÊNCIAS
            doc.addPage();
            doc.fontSize(12).font('Helvetica-Bold');
            doc.text('REFERÊNCIAS');
            doc.moveDown(1);
            
            doc.fontSize(12).font('Helvetica');
            data.content.references.forEach(ref => {
                doc.text(ref, {
                    align: 'left',
                    lineGap: 6
                });
                doc.moveDown(0.5);
            });
            
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

function getTipoTrabalho(docType) {
    const tipos = {
        tcc: 'Trabalho de Conclusão de Curso apresentado ao curso de [CURSO] da [INSTITUIÇÃO] como requisito parcial para obtenção do título de [TÍTULO].',
        artigo: 'Artigo científico apresentado ao curso de [CURSO] da [INSTITUIÇÃO].',
        relatorio: 'Relatório técnico apresentado como requisito para [FINALIDADE].',
        monografia: 'Monografia apresentada ao curso de [CURSO] da [INSTITUIÇÃO] como requisito parcial para obtenção do título de [TÍTULO].'
    };
    
    return tipos[docType] || tipos.tcc;
}

module.exports = router;
