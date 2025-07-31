import prisma from '../database';
import HttpException from '../middlewares/httpException';
import {
  PONTUACAO_TIERS,
  DESCRICOES_TIERS,
  PONTUACAO_POR_ONGS_ATINGIDAS,
  PONTUACAO_POR_ODS_ATINGIDOS,
  PONTUACAO_POR_VALOR_DOADO,
  PONTUACAO_POR_ACOES_REALIZADAS,
} from '../constants/seloConstants';

type RegraPontuacao = {
  min: number;
  pontos: number;
  detalhe: string;
};

class SeloService {
  public async calcularSeloParaEmpresa(empresaId: string) {
    const apoios = await prisma.apoio.findMany({
      where: { empresaId },
      include: {
        ong: {
          select: {
            ods: true,
          },
        },
      },
    });

    if (apoios.length === 0) {
      const seloInicial = this.definirTierSelo(0);
      return {
        empresaId,
        pontuacaoAtual: 0,
        seloAtual: seloInicial,
        detalhamento: [
          { criterio: 'Ações de Apoio Realizadas', detalhe: 'Nenhuma ação realizada', pontos: 0 },
          { criterio: 'ONGs Únicas Atingidas', detalhe: 'Nenhuma ONG parceira', pontos: 0 },
          { criterio: 'ODSs Únicos Impactados', detalhe: 'Nenhum ODS abordado', pontos: 0 },
          { criterio: 'Valor Total Doado', detalhe: 'Nenhum valor doado', pontos: 0 },
        ],
      };
    }

    const quantidadeAcoes = apoios.length;
    const ongsUnicas = new Set(apoios.map(a => a.ongId)).size;
    const odsUnicos = new Set(apoios.map(a => a.ong.ods).filter(ods => ods)).size;

    const valorTotalDoado = apoios.reduce((sum, a) => sum + a.valor, 0);

    const resultadoAcoes = this.getPontosPorFaixa(quantidadeAcoes, PONTUACAO_POR_ACOES_REALIZADAS);
    const resultadoOngs = this.getPontosPorFaixa(ongsUnicas, PONTUACAO_POR_ONGS_ATINGIDAS);
    const resultadoOds = this.getPontosPorFaixa(odsUnicos, PONTUACAO_POR_ODS_ATINGIDOS);
    const resultadoValor = this.getPontosPorFaixa(valorTotalDoado, PONTUACAO_POR_VALOR_DOADO);

    const pontuacaoTotal =
      resultadoAcoes.pontos +
      resultadoOngs.pontos +
      resultadoOds.pontos +
      resultadoValor.pontos;

    const seloAtual = this.definirTierSelo(pontuacaoTotal);

    const detalhamento = [
      {
        criterio: 'Ações de Apoio Realizadas',
        detalhe: resultadoAcoes.detalhe,
        pontos: resultadoAcoes.pontos,
      },
      {
        criterio: 'ONGs Únicas Atingidas',
        detalhe: resultadoOngs.detalhe,
        pontos: resultadoOngs.pontos,
      },
      {
        criterio: 'ODSs Únicos Impactados',
        detalhe: resultadoOds.detalhe,
        pontos: resultadoOds.pontos,
      },
      {
        criterio: 'Valor Total Doado',
        detalhe: resultadoValor.detalhe,
        pontos: resultadoValor.pontos,
      },
    ];

    return {
      empresaId,
      pontuacaoAtual: pontuacaoTotal,
      seloAtual,
      detalhamento,
    };
  }

  private getPontosPorFaixa(valor: number, regras: RegraPontuacao[]): { pontos: number; detalhe: string } {
    for (const regra of regras) {
      if (valor >= regra.min) {
        return { pontos: regra.pontos, detalhe: regra.detalhe };
      }
    }
    return { pontos: 0, detalhe: 'N/A' };
  }

  private definirTierSelo(pontuacao: number): { tier: string; descricao: string } {
    if (pontuacao >= PONTUACAO_TIERS.OURO) {
      return { tier: 'Ouro', descricao: DESCRICOES_TIERS.OURO };
    }
    if (pontuacao >= PONTUACAO_TIERS.PRATA) {
      return { tier: 'Prata', descricao: DESCRICOES_TIERS.PRATA };
    }
    if (pontuacao >= PONTUACAO_TIERS.BRONZE) {
      return { tier: 'Bronze', descricao: DESCRICOES_TIERS.BRONZE };
    }
    return { tier: 'Nenhum', descricao: DESCRICOES_TIERS.NENHUM };
  }
}

export default new SeloService();