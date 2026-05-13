const backupService = require('../services/backupService');
const path = require('path');

const handleBackup = async (req, res) => {
  const { uri, dbName } = req.body;

  if (!uri || !dbName) {
    return res.status(400).json({ error: 'URI and DB Name are required' });
  }

  try {
    const zipPath = await backupService.createBackup(uri, dbName);
    res.download(zipPath, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Optionally delete the zip after download
      // fs.unlinkSync(zipPath);
    });
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleBackup };
