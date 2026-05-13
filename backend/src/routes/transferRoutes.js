const express = require('express');
const router = express.Router();
const { startTransfer, getCollections, testConnection } = require('../controllers/transferController');
const { handleBackup } = require('../controllers/backupController');

router.post('/start', startTransfer);
router.post('/collections', getCollections);
router.post('/test-connection', testConnection);
router.post('/backup', handleBackup);

module.exports = router;
