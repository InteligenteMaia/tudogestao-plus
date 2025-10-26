// 🚀 Eliseu Junior - Full Stack
// Serviço de integração com API de NFe (Focus NFe)

const axios = require('axios');
const PDFService = require('./pdf.service');

class NFeService {
  constructor() {
    this.apiUrl = process.env.NFE_API_URL || 'https://api.focusnfe.com.br';
    this.apiToken = process.env.NFE_API_TOKEN;
  }

  /**
   * Emite NFe
   * @param {object} sale - Dados da venda
   * @returns {Promise<object>} Dados da NFe emitida
   */
  async issue(sale) {
    try {
      // Monta dados da NFe
      const nfeData = this.buildNFeData(sale);

      // Envia para API
      const response = await axios.post(
        `${this.apiUrl}/v2/nfe`,
        nfeData,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(this.apiToken + ':').toString('base64')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Aguarda processamento
      const ref = response.data.ref;
      const nfeResult = await this.waitForProcessing(ref);

      // Gera PDF (DANFE)
      const pdfBuffer = await PDFService.generateDANFE({
        ...nfeResult,
        sale
      });

      return {
        number: nfeResult.numero,
        serie: nfeResult.serie,
        key: nfeResult.chave_nfe,
        protocol: nfeResult.protocolo,
        xml: nfeResult.caminho_xml_nota_fiscal,
        pdf: pdfBuffer.toString('base64'),
        status: 'AUTHORIZED',
        statusMessage: 'NFe autorizada com sucesso'
      };

    } catch (error) {
      console.error('❌ Erro ao emitir NFe:', error);
      
      return {
        number: null,
        serie: null,
        key: null,
        protocol: null,
        xml: null,
        pdf: null,
        status: 'DENIED',
        statusMessage: error.response?.data?.mensagem || error.message
      };
    }
  }

  /**
   * Monta dados da NFe
   */
  buildNFeData(sale) {
    return {
      natureza_operacao: 'Venda de mercadoria',
      data_emissao: new Date().toISOString(),
      tipo_documento: '1', // Saída
      finalidade_emissao: '1', // Normal
      
      // Emitente
      cnpj_emitente: sale.company.cnpj,
      
      // Destinatário
      nome_destinatario: sale.customer.name,
      cpf_cnpj_destinatario: sale.customer.cpfCnpj,
      telefone_destinatario: sale.customer.phone,
      email_destinatario: sale.customer.email,
      
      // Endereço
      logradouro_destinatario: sale.customer.address?.street,
      numero_destinatario: sale.customer.address?.number,
      bairro_destinatario: sale.customer.address?.neighborhood,
      municipio_destinatario: sale.customer.address?.city,
      uf_destinatario: sale.customer.address?.state,
      cep_destinatario: sale.customer.address?.zipCode,
      
      // Itens
      items: sale.items.map((item, index) => ({
        numero_item: index + 1,
        codigo_produto: item.product.sku,
        descricao: item.product.name,
        cfop: item.product.cfop || '5102',
        unidade_comercial: item.product.unit || 'UN',
        quantidade_comercial: item.quantity,
        valor_unitario_comercial: item.unitPrice,
        valor_bruto: item.total,
        
        // Tributos
        icms_situacao_tributaria: '102',
        pis_situacao_tributaria: '07',
        cofins_situacao_tributaria: '07',
        
        // NCM
        codigo_ncm: item.product.ncm || '00000000'
      })),
      
      // Forma de pagamento
      formas_pagamento: [{
        forma_pagamento: this.mapPaymentMethod(sale.paymentMethod),
        valor_pagamento: sale.netAmount
      }]
    };
  }

  /**
   * Mapeia forma de pagamento
   */
  mapPaymentMethod(method) {
    const map = {
      'DINHEIRO': '01',
      'CHEQUE': '02',
      'CARTAO_CREDITO': '03',
      'CARTAO_DEBITO': '04',
      'CREDITO_LOJA': '05',
      'PIX': '17',
      'BOLETO': '15'
    };
    return map[method] || '99'; // Outros
  }

  /**
   * Aguarda processamento da NFe
   */
  async waitForProcessing(ref, attempts = 10) {
    for (let i = 0; i < attempts; i++) {
      await this.sleep(3000); // Aguarda 3 segundos

      const response = await axios.get(
        `${this.apiUrl}/v2/nfe/${ref}`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(this.apiToken + ':').toString('base64')}`
          }
        }
      );

      if (response.data.status === 'autorizado') {
        return response.data;
      }

      if (response.data.status === 'erro_autorizacao') {
        throw new Error(response.data.mensagem_sefaz);
      }
    }

    throw new Error('Timeout ao processar NFe');
  }

  /**
   * Cancela NFe
   */
  async cancel(key, reason) {
    try {
      const response = await axios.delete(
        `${this.apiUrl}/v2/nfe/${key}`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(this.apiToken + ':').toString('base64')}`,
            'Content-Type': 'application/json'
          },
          data: {
            justificativa: reason
          }
        }
      );

      return {
        success: true,
        message: 'NFe cancelada com sucesso',
        protocol: response.data.protocolo
      };

    } catch (error) {
      throw new Error(error.response?.data?.mensagem || 'Erro ao cancelar NFe');
    }
  }

  /**
   * Consulta NFe
   */
  async query(key) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/v2/nfe/${key}`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(this.apiToken + ':').toString('base64')}`
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error('Erro ao consultar NFe');
    }
  }

  /**
   * Helper: Sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new NFeService();