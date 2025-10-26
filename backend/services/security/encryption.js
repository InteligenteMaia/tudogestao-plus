// 👨‍💻 Michael Santos - Tech Lead
// Serviço de criptografia

const crypto = require('crypto');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.key = crypto.scryptSync(
      process.env.ENCRYPTION_KEY || 'default-key-change-in-production',
      'salt',
      32
    );
  }

  /**
   * Criptografa texto
   * @param {string} text - Texto a ser criptografado
   * @returns {object} Dados criptografados
   */
  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  /**
   * Descriptografa dados
   * @param {object} encryptedData - Dados criptografados
   * @returns {string} Texto descriptografado
   */
  decrypt(encryptedData) {
    const { encrypted, iv, authTag } = encryptedData;
    
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Hash de senha
   * @param {string} password - Senha
   * @returns {object} Salt e hash
   */
  hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');
    
    return { salt, hash };
  }

  /**
   * Verifica senha
   * @param {string} password - Senha
   * @param {string} salt - Salt
   * @param {string} hash - Hash armazenado
   * @returns {boolean} Senha válida
   */
  verifyPassword(password, salt, hash) {
    const verifyHash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');
    
    return hash === verifyHash;
  }

  /**
   * Gera token aleatório
   */
  generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
}

module.exports = new EncryptionService();