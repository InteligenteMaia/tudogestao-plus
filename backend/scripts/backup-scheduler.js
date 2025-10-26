// 👨‍💻 Michael Santos - Tech Lead
// Script de backup automático do banco de dados

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const schedule = require('node-schedule');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class BackupScheduler {
  constructor() {
    this.backupDir = path.join(process.cwd(), 'backups');
    this.enabled = process.env.BACKUP_ENABLED === 'true';
    this.retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS) || 30;
    
    // Cria diretório de backup se não existir
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * Inicia agendamento de backups
   */
  start() {
    if (!this.enabled) {
      console.log('⚠️  Backup automático desabilitado');
      return;
    }

    console.log('🔄 Iniciando agendador de backups...');
    
    // Agenda backup diário às 2h da manhã
    const cronExpression = process.env.BACKUP_SCHEDULE || '0 2 * * *';
    
    schedule.scheduleJob(cronExpression, async () => {
      console.log('⏰ Executando backup agendado...');
      await this.executeBackup();
    });

    console.log(`✅ Backup agendado: ${cronExpression}`);
    console.log(`📁 Diretório: ${this.backupDir}`);
    console.log(`🗓️  Retenção: ${this.retentionDays} dias\n`);
  }

  /**
   * Executa backup do banco de dados
   */
  async executeBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.sql`;
    const filepath = path.join(this.backupDir, filename);

    try {
      console.log('📦 Iniciando backup...');

      // Faz dump do PostgreSQL
      const databaseUrl = process.env.DATABASE_URL;
      const command = `pg_dump ${databaseUrl} > ${filepath}`;

      await this.executeCommand(command);
      
      console.log(`✅ Backup criado: ${filename}`);

      // Compacta backup
      await this.compressBackup(filepath);

      // Remove backups antigos
      await this.cleanOldBackups();

      console.log('✅ Backup concluído com sucesso!\n');

    } catch (error) {
      console.error('❌ Erro ao criar backup:', error.message);
    }
  }

  /**
   * Executa comando shell
   */
  executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  /**
   * Compacta arquivo de backup
   */
  async compressBackup(filepath) {
    try {
      console.log('📦 Compactando backup...');
      await this.executeCommand(`gzip ${filepath}`);
      console.log('✅ Backup compactado');
    } catch (error) {
      console.log('⚠️  Não foi possível compactar o backup');
    }
  }

  /**
   * Remove backups antigos
   */
  async cleanOldBackups() {
    try {
      const files = await fs.readdir(this.backupDir);
      const now = Date.now();
      const maxAge = this.retentionDays * 24 * 60 * 60 * 1000;

      let deletedCount = 0;

      for (const file of files) {
        const filepath = path.join(this.backupDir, file);
        const stats = await fs.stat(filepath);
        const age = now - stats.mtimeMs;

        if (age > maxAge) {
          await fs.unlink(filepath);
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        console.log(`🗑️  ${deletedCount} backup(s) antigo(s) removido(s)`);
      }

    } catch (error) {
      console.error('❌ Erro ao limpar backups antigos:', error.message);
    }
  }

  /**
   * Restaura backup
   */
  async restore(backupFile) {
    try {
      console.log('🔄 Restaurando backup...');

      const filepath = path.join(this.backupDir, backupFile);

      if (!fs.existsSync(filepath)) {
        throw new Error('Arquivo de backup não encontrado');
      }

      // Se estiver compactado, descompacta primeiro
      if (backupFile.endsWith('.gz')) {
        await this.executeCommand(`gunzip ${filepath}`);
        filepath = filepath.replace('.gz', '');
      }

      // Restaura backup
      const databaseUrl = process.env.DATABASE_URL;
      const command = `psql ${databaseUrl} < ${filepath}`;

      await this.executeCommand(command);

      console.log('✅ Backup restaurado com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao restaurar backup:', error.message);
      throw error;
    }
  }

  /**
   * Lista backups disponíveis
   */
  async listBackups() {
    try {
      const files = await fs.readdir(this.backupDir);
      const backups = [];

      for (const file of files) {
        const filepath = path.join(this.backupDir, file);
        const stats = await fs.stat(filepath);

        backups.push({
          filename: file,
          size: this.formatBytes(stats.size),
          date: stats.mtime
        });
      }

      return backups.sort((a, b) => b.date - a.date);

    } catch (error) {
      console.error('❌ Erro ao listar backups:', error.message);
      return [];
    }
  }

  /**
   * Formata bytes em formato legível
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Execução
const scheduler = new BackupScheduler();

// Se executado diretamente, faz backup manual
if (require.main === module) {
  console.log('🚀 Executando backup manual...\n');
  scheduler.executeBackup().then(() => {
    process.exit(0);
  });
} else {
  // Se importado, inicia o agendador
  scheduler.start();
}

module.exports = scheduler;