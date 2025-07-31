import { Router } from 'express';
import seloController from '../controllers/SeloController';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.get('/:empresaId', authMiddleware, seloController.getSeloByEmpresaId);

export default router;
