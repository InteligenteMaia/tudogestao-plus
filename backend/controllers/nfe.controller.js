// 🚀 Eliseu Junior - Full Stack
// Controller de Nota Fiscal Eletrônica

const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error.middleware');
const NFeService = require('../services/nfe.service');
const auditService = require('../services/audit.service');

const prisma = new PrismaClient();

class NFeController {
  /**
   * Lista NFes
   */
  async list(req, res) {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      sale: {
        companyId: req.companyId
      },
      ...(status && { status })
    };

    const [nfes, total] = await Promise.all([
      prisma.nFe.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { issuedAt: 'desc' },
        include: {
          sale: {
            include: {
              customer: {
                select: { name: true, cpfCnpj: true }
              }
            }
          }
        }
      }),
      prisma.nFe.count({ where })
    ]);

    res.json({
      nfes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }

  /**
   * Busca NFe por ID
   */
  async getById(req, res) {
    const { id } = req.params;

    const nfe = await prisma.nFe.findFirst({
      where: { id },
      include: {
        sale: {
          include: {
            customer: true,
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    if (!nfe) {
      throw new AppError('NFe não encontrada', 404);
    }

    // Verifica se pertence à empresa
    if (nfe.sale.companyId !== req.companyId) {
      throw new AppError('NFe não encontrada', 404);
    }

    res.json(nfe);
  }

  /**
   * Emite NFe
   */
  async issue(req, res) {
    const { saleId } = req.body;

    // Busca venda
    const sale = await prisma.sale.findFirst({
      where: { 
        id: saleId,
        companyId: req.companyId 
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        },
        company: true
      }
    });

    if (!sale) {
      throw new AppError('Venda não encontrada', 404);
    }

    if (sale.nfeIssued) {
      throw new AppError('NFe já foi emitida para esta venda', 400);
    }

    // Emite NFe via API
    const nfeData = await NFeService.issue(sale);

    // Salva NFe
    const nfe = await prisma.$transaction(async (tx) => {
      const newNfe = await tx.nFe.create({
        data: {
          saleId,
          number: nfeData.number,
          serie: nfeData.serie,
          key: nfeData.key,
          protocol: nfeData.protocol,
          xml: nfeData.xml,
          pdf: nfeData.pdf,
          status: nfeData.status,
          statusMessage: nfeData.statusMessage
        }
      });

      // Atualiza venda
      await tx.sale.update({
        where: { id: saleId },
        data: {
          nfeIssued: true,
          nfeNumber: nfeData.number,
          nfeKey: nfeData.key
        }
      });

      return newNfe;
    });

    await auditService.log(req.userId, 'ISSUE_NFE', 'NFe', nfe.id, { saleId });

    res.status(201).json({
      message: 'NFe emitida com sucesso',
      nfe
    });
  }

  /**
   * Cancela NFe
   */
  async cancel(req, res) {
    const { id } = req.params;
    const { reason } = req.body;

    const nfe = await prisma.nFe.findFirst({
      where: { id },
      include: {
        sale: true
      }
    });

    if (!nfe) {
      throw new AppError('NFe não encontrada', 404);
    }

    if (nfe.sale.companyId !== req.companyId) {
      throw new AppError('NFe não encontrada', 404);
    }

    if (nfe.status === 'CANCELLED') {
      throw new AppError('NFe já está cancelada', 400);
    }

    // Cancela via API
    const cancelData = await NFeService.cancel(nfe.key, reason);

    // Atualiza NFe
    await prisma.$transaction(async (tx) => {
      await tx.nFe.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          statusMessage: cancelData.message
        }
      });

      // Atualiza venda
      await tx.sale.update({
        where: { id: nfe.saleId },
        data: {
          status: 'CANCELLED'
        }
      });
    });

    await auditService.log(req.userId, 'CANCEL_NFE', 'NFe', id, { reason });

    res.json({ message: 'NFe cancelada com sucesso' });
  }

  /**
   * Download XML da NFe
   */
  async downloadXML(req, res) {
    const { id } = req.params;

    const nfe = await prisma.nFe.findFirst({
      where: { id }
    });

    if (!nfe || !nfe.xml) {
      throw new AppError('XML não encontrado', 404);
    }

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename=NFe-${nfe.key}.xml`);
    res.send(nfe.xml);
  }

  /**
   * Download PDF da NFe
   */
  async downloadPDF(req, res) {
    const { id } = req.params;

    const nfe = await prisma.nFe.findFirst({
      where: { id }
    });

    if (!nfe || !nfe.pdf) {
      throw new AppError('PDF não encontrado', 404);
    }

    // Se PDF está em base64, converte
    const pdfBuffer = Buffer.from(nfe.pdf, 'base64');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=NFe-${nfe.key}.pdf`);
    res.send(pdfBuffer);
  }
}

module.exports = new NFeController();