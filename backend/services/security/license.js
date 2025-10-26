// 👨‍💻 Michael Santos - Tech Lead
// Serviço de licenciamento e proteção

const crypto = require('crypto');
const { machineId } = require('node-machine-id');
const fs = require('fs');
const path = require('path');

class LicenseManager {
  constructor() {
    this.SECRET_KEY = process.env.LICENSE_SECRET || 'YOUR_SECRET_KEY_CHANGE_IN_PRODUCTION';
    this.LICENSE_FILE = path.join(process.cwd(), 'license.key');
  }

  /**
   * Gera licença baseada em CNPJ + ID da máquina
   * @param {string} cnpj - CNPJ da empresa
   * @param {string} companyName - Nome da empresa
   * @param {string} expirationDate - Data de expiração (ISO)
   * @returns {string} Licença em base64
   */
  generateLicense(cnpj, companyName, expirationDate) {
    const hwid = machineId.machineIdSync();
    const data = `${cnpj}|${hwid}|${companyName}|${expirationDate}`;
    
    const hash = crypto
      .createHmac('sha256', this.SECRET_KEY)
      .update(data)
      .digest('hex');
    
    const license = {
      cnpj,
      companyName,
      hwid,
      expirationDate,
      hash,
      createdAt: new Date().toISOString(),
      version: '1.0'
    };
    
    return Buffer.from(JSON.stringify(license)).toString('base64');
  }

  /**
   * Valida licença
   * @param {string} licenseKey - Licença em base64
   * @returns {object} Resultado da validação
   */
  validateLicense(licenseKey) {
    try {
      const decoded = JSON.parse(
        Buffer.from(licenseKey, 'base64').toString('utf-8')
      );
      
      const { cnpj, companyName, hwid, expirationDate, hash } = decoded;
      const currentHwid = machineId.machineIdSync();
      
      // Verifica se é a mesma máquina
      if (hwid !== currentHwid) {
        return {
          valid: false,
          error: 'Licença vinculada a outro computador',
          code: 'INVALID_MACHINE'
        };
      }
      
      // Verifica hash
      const data = `${cnpj}|${hwid}|${companyName}|${expirationDate}`;
      const validHash = crypto
        .createHmac('sha256', this.SECRET_KEY)
        .update(data)
        .digest('hex');
      
      if (hash !== validHash) {
        return {
          valid: false,
          error: 'Licença inválida ou corrompida',
          code: 'INVALID_HASH'
        };
      }
      
      // Verifica expiração
      if (new Date(expirationDate) < new Date()) {
        return {
          valid: false,
          error: 'Licença expirada',
          code: 'EXPIRED',
          expirationDate
        };
      }
      
      return {
        valid: true,
        data: { 
          cnpj, 
          companyName, 
          expirationDate,
          daysRemaining: this.getDaysRemaining(expirationDate)
        }
      };
      
    } catch (error) {
      return {
        valid: false,
        error: 'Licença inválida',
        code: 'PARSE_ERROR'
      };
    }
  }

  /**
   * Salva licença no sistema
   */
  saveLicense(licenseKey) {
    const validation = this.validateLicense(licenseKey);
    
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    fs.writeFileSync(this.LICENSE_FILE, licenseKey);
    console.log('✅ Licença salva com sucesso');
    
    return validation.data;
  }

  /**
   * Carrega licença do sistema
   */
  loadLicense() {
    if (!fs.existsSync(this.LICENSE_FILE)) {
      return {
        valid: false,
        error: 'Licença não encontrada',
        code: 'NOT_FOUND'
      };
    }
    
    const licenseKey = fs.readFileSync(this.LICENSE_FILE, 'utf-8');
    return this.validateLicense(licenseKey);
  }

  /**
   * Remove licença
   */
  removeLicense() {
    if (fs.existsSync(this.LICENSE_FILE)) {
      fs.unlinkSync(this.LICENSE_FILE);
      console.log('🗑️ Licença removida');
    }
  }

  /**
   * Calcula dias restantes da licença
   */
  getDaysRemaining(expirationDate) {
    const now = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Gera ID único da máquina
   */
  getMachineId() {
    return machineId.machineIdSync();
  }
}

module.exports = new LicenseManager();