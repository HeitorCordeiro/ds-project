import seloService from '../../src/services/SeloService'; 
import prisma from '../../src/database';
import { PONTUACAO_POR_ONGS_ATINGIDAS } from '../../src/constants/seloConstants'; 

jest.mock('../../src/database', () => ({
  __esModule: true,
  default: {
    apoio: {
      findMany: jest.fn(),
    },
  },
}));

describe('SeloService - Testes Unitários', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar pontuação zero e selo "Nenhum" se a empresa não tiver apoios', async () => {
    (prisma.apoio.findMany as jest.Mock).mockResolvedValueOnce([]);

    const result = await seloService.calcularSeloParaEmpresa('empresa-teste');
    expect(result.seloAtual.tier).toBe('Nenhum');
    expect(result.pontuacaoAtual).toBe(0);
  });

  it('deve retornar "Bronze" com 1 ONG, 1 ODS, 1 ação e valor baixo', async () => {
    (prisma.apoio.findMany as jest.Mock).mockResolvedValueOnce([
      { ongId: 'ong1', valor: 500, ong: { ods: '1' } },
    ]);

    const result = await seloService.calcularSeloParaEmpresa('empresa-teste');
    expect(result.seloAtual.tier).toBe('Bronze');
    expect(result.pontuacaoAtual).toBe(15);
  });

  it('deve retornar "Ouro" com valores altos em todos os critérios', async () => {
    const apoios = Array.from({ length: 10 }, (_, i) => ({
      ongId: `ong${i + 1}`,
      valor: 6000,
      ong: { ods: `${i + 1}` },
    }));

    (prisma.apoio.findMany as jest.Mock).mockResolvedValueOnce(apoios);

    const result = await seloService.calcularSeloParaEmpresa('empresa-top');
    expect(result.seloAtual.tier).toBe('Ouro');
    expect(result.pontuacaoAtual).toBeGreaterThanOrEqual(75);
  });

  it('deve tratar corretamente apoios onde a ONG não tem ODS (nulo)', async () => {
    (prisma.apoio.findMany as jest.Mock).mockResolvedValueOnce([
      { ongId: 'ong1', valor: 5000, ong: { ods: null } },
    ]);

    const result = await seloService.calcularSeloParaEmpresa('empresa-bug');
    const detalheOds = result.detalhamento.find(d => d.criterio.includes('ODS'));
    expect(detalheOds?.pontos).toBe(0);
  });

  it('deve lançar um erro se a chamada ao banco de dados falhar', async () => {
    (prisma.apoio.findMany as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    await expect(seloService.calcularSeloParaEmpresa('empresaX')).rejects.toThrow('DB error');
  });

  it('deve definir o tier correto para cada faixa de pontuação', () => {
    expect(seloService['definirTierSelo'](100).tier).toBe('Ouro');
    expect(seloService['definirTierSelo'](75).tier).toBe('Ouro');
    expect(seloService['definirTierSelo'](74).tier).toBe('Prata');
    expect(seloService['definirTierSelo'](46).tier).toBe('Prata');
    expect(seloService['definirTierSelo'](45).tier).toBe('Bronze');
    expect(seloService['definirTierSelo'](5).tier).toBe('Bronze');
    expect(seloService['definirTierSelo'](4).tier).toBe('Nenhum');
  });


  it('deve retornar os pontos corretos para o método getPontosPorFaixa', () => {
    const regras = PONTUACAO_POR_ONGS_ATINGIDAS;

    expect(seloService['getPontosPorFaixa'](10, regras).pontos).toBe(25); // 9 ou mais
    expect(seloService['getPontosPorFaixa'](7, regras).pontos).toBe(20);  // 7 a 8
    expect(seloService['getPontosPorFaixa'](5, regras).pontos).toBe(15);  // 5 a 6
    expect(seloService['getPontosPorFaixa'](3, regras).pontos).toBe(10);  // 3 a 4
    expect(seloService['getPontosPorFaixa'](1, regras).pontos).toBe(5);   // 1 a 2
    expect(seloService['getPontosPorFaixa'](0, regras).pontos).toBe(0);   // 0
  });
});
