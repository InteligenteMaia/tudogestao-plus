// 💼 Larissa Oliveira - Product Manager
// Serviço de geração de planilhas Excel

const ExcelJS = require('exceljs');

class ExcelService {
  /**
   * Gera relatório em Excel
   * @param {object} data - Dados do relatório
   * @returns {Promise<Buffer>} Buffer do Excel
   */
  async generateReport(data) {
    const workbook = new ExcelJS.Workbook();
    
    workbook.creator = 'TudoGestão+';
    workbook.created = new Date();

    // Adiciona planilha
    const worksheet = workbook.addWorksheet('Relatório', {
      properties: { tabColor: { argb: '0071E3' } }
    });

    // Estilo do cabeçalho
    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFF' } },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0071E3' }
      },
      alignment: { vertical: 'middle', horizontal: 'center' }
    };

    if (Array.isArray(data) && data.length > 0) {
      // Define colunas
      const columns = Object.keys(data[0]).map(key => ({
        header: key.toUpperCase(),
        key: key,
        width: 20
      }));

      worksheet.columns = columns;

      // Estiliza cabeçalho
      worksheet.getRow(1).eachCell((cell) => {
        cell.style = headerStyle;
      });

      // Adiciona dados
      data.forEach(row => {
        worksheet.addRow(row);
      });

      // Auto-ajusta largura das colunas
      worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
      });

      // Congela primeira linha
      worksheet.views = [
        { state: 'frozen', ySplit: 1 }
      ];
    }

    // Gera buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  /**
   * Gera planilha de vendas
   */
  async generateSalesReport(sales) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Vendas');

    // Colunas
    worksheet.columns = [
      { header: 'Nº Venda', key: 'saleNumber', width: 15 },
      { header: 'Data', key: 'date', width: 15 },
      { header: 'Cliente', key: 'customer', width: 30 },
      { header: 'Valor', key: 'amount', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
    ];

    // Estilo do cabeçalho
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '34C759' }
    };

    // Adiciona vendas
    sales.forEach(sale => {
      worksheet.addRow({
        saleNumber: sale.saleNumber,
        date: new Date(sale.date).toLocaleDateString('pt-BR'),
        customer: sale.customer,
        amount: parseFloat(sale.amount),
        status: sale.status
      });
    });

    // Formata valores como moeda
    worksheet.getColumn('amount').numFmt = 'R$ #,##0.00';

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  /**
   * Gera planilha de estoque
   */
  async generateStockReport(products) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Estoque');

    worksheet.columns = [
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Produto', key: 'name', width: 30 },
      { header: 'Categoria', key: 'category', width: 20 },
      { header: 'Estoque', key: 'stock', width: 12 },
      { header: 'Mín.', key: 'minStock', width: 12 },
      { header: 'Preço', key: 'unitPrice', width: 15 },
      { header: 'Custo', key: 'costPrice', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '0071E3' }
    };

    products.forEach(product => {
      const row = worksheet.addRow({
        sku: product.sku,
        name: product.name,
        category: product.category,
        stock: product.stock,
        minStock: product.minStock,
        unitPrice: parseFloat(product.unitPrice),
        costPrice: parseFloat(product.costPrice || 0),
        status: product.status
      });

      // Destaca produtos com estoque baixo
      if (product.status === 'LOW') {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEBEE' }
        };
      }
    });

    worksheet.getColumn('unitPrice').numFmt = 'R$ #,##0.00';
    worksheet.getColumn('costPrice').numFmt = 'R$ #,##0.00';

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}

module.exports = new ExcelService();