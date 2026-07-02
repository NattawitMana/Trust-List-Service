import express from 'express';
import { handleAddSSI, handleGetTrustlist, handleResetTrustlist, handleSSIActions } from '../controllers/adminController.js';
import { handleGitSync } from '../controllers/syncController.js';

const router = express.Router();

router.post('/api/reset', handleResetTrustlist)
router.get('/api/trust-list', handleGetTrustlist);
router.post('/api/add/ssi', handleAddSSI);
router.patch('/api/ssi/:id/:action', handleSSIActions)

router.post('/api/trust-list/publish', handleGitSync)
// router.post('/api/test-signed-data', handleTestSignedData)

export default router;