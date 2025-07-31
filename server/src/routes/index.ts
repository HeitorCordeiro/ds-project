// src/routes/index.ts

import { Router } from 'express';
import userRoutes from './UserRoutes';
import authRoutes from './AuthRoutes';
import fileRoutes from './FileRoutes';
import seloRoutes from './SeloRoutes'; // 1. Importe a nova rota

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/files', fileRoutes);
router.use('/selos', seloRoutes); // 2. Adicione a nova rota

router.route('/').get((_, res) => {
  res.status(200).send('Made with 💚 and &lt; &#x0002F; &gt; by CITi');
});

export default router;
