import { Router } from 'express';
import sneakerController from '../controllers/controllers.js'; // Corrija o caminho do controller

const router = Router();

router.get('/sneakers', sneakerController.listAll);
router.get('/sneakers/:id', sneakerController.listOne);
router.post('/sneakers', sneakerController.create);
router.put('/sneakers/:id', sneakerController.update);
router.delete('/sneakers/:id', sneakerController.delete);

export default router;

