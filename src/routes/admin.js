import express from 'express';
import { handleAddSSI, handleGetTrustlist, handleResetTrustlist, handleSSIActions } from '../controllers/adminController.js';
import { handleTestSignedData } from '../controllers/signController.js';

const router = express.Router();

router.post('/api/reset', handleResetTrustlist)
router.get('/api/trust-list', handleGetTrustlist);
router.post('/api/add/ssi', handleAddSSI);
router.patch('/api/ssi/:id/:action', handleSSIActions)

router.post('/api/test-signed-data', handleTestSignedData)

export default router;