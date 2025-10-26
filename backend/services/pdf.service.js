// 💼 Larissa Oliveira - Product Manager
// ⚙️ Rubens Neto - Backend Developer
// Serviço de geração de PDFs

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
  /**
   * Gera relatório em PDF
   * @param {string} title - Título do relatório
   * @param {object} data - Dados do relatório
   * @returns {Promise<Buffer>} Buffer do PDF
   */
  async generateReport(title, data) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Header
        this.addHeader(doc, title);

        // Conteúdo
        this.addContent(doc, data);

        // Footer
        this.addFooter(doc);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Adiciona cabeçalho ao PDF
   */
  addHeader(doc, title) {
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text(title, { align: 'center' })
      .moveDown();

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' })
      .moveDown(2);

    // Linha separadora
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke()
      .moveDown();
  }

  /**
   * Adiciona conteúdo ao PDF
   */
  addContent(doc, data) {
    doc.fontSize(12).font('Helvetica');

    if (Array.isArray(data)) {
      // Tabela
      this.addTable(doc, data);
    } else if (typeof data === 'object') {
      // Dados estruturados
      Object.entries(data).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`);
      });
    }
  }

  /**
   * Adiciona tabela ao PDF
   */
  addTable(doc, rows) {
    if (rows.length === 0) return;

    const headers = Object.keys(rows[0]);
    const columnWidth = (545 - 50) / headers.length;
    let y = doc.y;

    // Cabeçalho da tabela
    doc.font('Helvetica-Bold');
    headers.forEach((header, i) => {
      doc.text(header, 50 + (i * columnWidth), y, {
        width: columnWidth,
        align: 'left'
      });
    });

    y += 20;
    doc.moveTo(50, y).lineTo(545, y).stroke();
    y += 10;

    // Linhas da tabela
    doc.font('Helvetica');
    rows.forEach((row) => {
      headers.forEach((header, i) => {
        doc.text(String(row[header] || ''), 50 + (i * columnWidth), y, {
          width: columnWidth,
          align: 'left'
        });
      });
      y += 20;
    });
  }

  /**
   * Adiciona rodapé ao PDF
   */
  addFooter(doc) {
    const pageHeight = doc.page.height;
    
    doc
      .fontSize(8)
      .text(
        'TudoGestão+ - Sistema de Gestão Empresarial',
        50,
        pageHeight - 50,
        { align: 'center' }
      );
  }

  /**
   * Gera NFe em PDF (DANFE)
   */
  async generateDANFE(nfeData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 20
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Título DANFE
        doc
          .fontSize(16)
          .font('Helvetica-Bold')
          .text('DANFE', { align: 'center' })
          .fontSize(10)
          .text('Documento Auxiliar da Nota Fiscal Eletrônica', { align: 'center' })
          .moveDown();

        // Dados da NFe
        doc.fontSize(10).font('Helvetica');
        doc.text(`Chave de Acesso: ${nfeData.key}`);
        doc.text(`Número: ${nfeData.number}`);
        doc.text(`Série: ${nfeData.serie}`);
        doc.text(`Data de Emissão: ${new Date(nfeData.issuedAt).toLocaleDateString('pt-BR')}`);
        doc.moveDown();

        // Emitente
        doc.fontSize(12).font('Helvetica-Bold').text('EMITENTE');
        doc.fontSize(10).font('Helvetica');
        doc.text(`Nome: ${nfeData.sale.company.name}`);
        doc.text(`CNPJ: ${nfeData.sale.company.cnpj}`);
        doc.moveDown();

        // Destinatário
        doc.fontSize(12).font('Helvetica-Bold').text('DESTINATÁRIO');
        doc.fontSize(10).font('Helvetica');
        doc.text(`Nome: ${nfeData.sale.customer.name}`);
        doc.text(`CPF/CNPJ: ${nfeData.sale.customer.cpfCnpj}`);
        doc.moveDown();

        // Produtos
        doc.fontSize(12).font('Helvetica-Bold').text('PRODUTOS');
        doc.fontSize(10).font('Helvetica');
        nfeData.sale.items.forEach((item, index) => {
          doc.text(`${index + 1}. ${item.product.name} - Qtd: ${item.quantity} - R$ ${item.total}`);
        });
        doc.moveDown();

        // Total
        doc.fontSize(12).font('Helvetica-Bold').text(`TOTAL: R$ ${nfeData.sale.netAmount}`);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new PDFService();