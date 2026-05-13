const MongoTransferService = require('../services/mongoTransferService');

const startTransfer = async (req, res) => {
  const { sourceUri, destinationUri, dbName, collections, transferOptions } = req.body;
  const io = req.app.get('io');
  
  const transferService = new MongoTransferService(io);

  try {
    // Basic validation
    if (!sourceUri || !destinationUri || !dbName) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Start transfer in background (don't await so we can return 202)
    transferService.transferData({ sourceUri, destinationUri, dbName, collections, transferOptions })
      .catch(err => console.error('Transfer background error:', err));

    res.status(202).json({ message: 'Transfer started' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCollections = async (req, res) => {
  const { sourceUri, dbName } = req.body;
  const transferService = new MongoTransferService();

  try {
    const collections = await transferService.getCollections(sourceUri, dbName);
    res.json({ collections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const testConnection = async (req, res) => {
  const { uri } = req.body;
  const transferService = new MongoTransferService();

  try {
    const result = await transferService.testConnection(uri);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  startTransfer,
  getCollections,
  testConnection
};
