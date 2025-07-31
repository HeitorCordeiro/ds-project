// src/controllers/SeloController.ts

import { Request, Response, NextFunction } from 'express';
import SeloService from '../services/SeloService';
// SOLUÇÃO: Importar diretamente do ficheiro "barril" (index.ts) da pasta middlewares.
import { HttpException } from '../middlewares';

class SeloController {
  public getSeloByEmpresaId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { empresaId } = req.params;

      if (!empresaId) {
        return next(new HttpException(400, 'O ID da empresa é obrigatório.'));
      }

      const seloInfo = await SeloService.calcularSeloParaEmpresa(empresaId);

      res.status(200).json(seloInfo);
    } catch (error) {
      next(error);
    }
  };
}

export default new SeloController();
