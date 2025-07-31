import request from 'supertest';
import app from '../../src/app';

jest.mock('../../src/database', () => ({
  __esModule: true,
  default: {
    apoio: {
      findMany: jest.fn(),
    },
  },
}));

import prisma from '../../src/database';
import TokenRepository from '../../src/repositories/tokenRepository';


describe('GET /selos/:empresaId', () => {
  const tokenFake = 'Bearer token.simulado.valido';

  beforeAll(() => {
    jest.spyOn(TokenRepository, 'verifyAccessToken').mockReturnValue({ id: 'usuario-teste-id' } as any);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('retorna 401 se não tiver token de autenticação', async () => {
    const res = await request(app).get('/selos/empresa-teste-sem-token');
    expect(res.status).toBe(401);
  });

  it('retorna 200 e o selo "Nenhum" para uma empresa sem apoios', async () => {
    (prisma.apoio.findMany as jest.Mock).mockResolvedValueOnce([]);

    const res = await request(app)
      .get('/selos/empresa-teste-sem-apoios')
      .set('Authorization', tokenFake);

    expect(res.status).toBe(200);
    expect(res.body.seloAtual.tier).toBe('Nenhum');
  });

  it('retorna 200 e calcula o selo corretamente para uma empresa com apoios', async () => {
    (prisma.apoio.findMany as jest.Mock).mockResolvedValueOnce([
      { ongId: 'ong1', valor: 12000, ong: { ods: '3' } },
      { ongId: 'ong2', valor: 3000, ong: { ods: '4' } },
    ]);

    const res = await request(app)
      .get('/selos/empresa-impacto-positivo')
      .set('Authorization', tokenFake);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('pontuacaoAtual');
    expect(res.body.detalhamento.length).toBeGreaterThan(0);
  });

  it('retorna 500 se o serviço lançar um erro inesperado', async () => {
    (prisma.apoio.findMany as jest.Mock).mockRejectedValueOnce(new Error('Falha no banco de dados'));

    const res = await request(app)
      .get('/selos/empresa-com-erro')
      .set('Authorization', tokenFake);

    expect(res.status).toBe(500);
  });
});