import request from 'supertest';
import app from '../../../app'; // ou seu arquivo que inicializa o Express
import prisma from '../../../database';

// ✅ Mock corrigido para lidar com export default de 'prisma'
jest.mock('../../../database', () => ({
  __esModule: true,
  default: {
    apoio: {
      findMany: jest.fn(),
    },
  },
}));

describe('GET /selos/:empresaId', () => {
  const tokenFake = 'Bearer token.simulado';

  it('retorna 401 se não tiver token', async () => {
    const res = await request(app).get('/selos/empresa-teste');
    expect(res.status).toBe(401);
  });

  it('retorna 200 e selo "Nenhum" com empresa sem apoios', async () => {
    (prisma.apoio.findMany as jest.Mock).mockResolvedValueOnce([]);

    const res = await request(app)
      .get('/selos/empresa-teste')
      .set('Authorization', tokenFake);

    expect(res.status).toBe(200);
    expect(res.body.seloAtual.tier).toBe('Nenhum');
  });

  it('retorna 200 e calcula corretamente o selo', async () => {
    (prisma.apoio.findMany as jest.Mock).mockResolvedValueOnce([
      { ongId: 'ong1', valor: 12000, ong: { ods: '3' } },
      { ongId: 'ong2', valor: 3000, ong: { ods: '4' } },
    ]);

    const res = await request(app)
      .get('/selos/empresa-impacto')
      .set('Authorization', tokenFake);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('pontuacaoAtual');
    expect(res.body.detalhamento.length).toBeGreaterThan(0);
  });

  it('retorna 500 se serviço lançar erro', async () => {
    (prisma.apoio.findMany as jest.Mock).mockRejectedValueOnce(new Error('DB fail'));

    const res = await request(app)
      .get('/selos/empresa-broken')
      .set('Authorization', tokenFake);

    expect(res.status).toBe(500);
  });
});
