import express from 'express';
import { handleAddService, handleGetTrustlist, handleResetTrustlist, handleServiceActions, handleAddProvider, handleProviderActions } from '../controllers/adminController.js';
import { handleGitSync, handleVerifyTrustList } from '../controllers/syncController.js';

const router = express.Router();

router.post('/api/reset', handleResetTrustlist)
router.get('/api/trust-list', handleGetTrustlist);
router.post('/api/add/provider', handleAddProvider);
router.patch('/api/provider/:id/:action', handleProviderActions);
router.post('/api/add/:provider_id/service', handleAddService);
router.patch('/api/service/:service_id', handleServiceActions);

router.post('/api/trust-list/publish', handleGitSync)
router.post('/api/verify-trust-list', handleVerifyTrustList)

export default router;