const { MongoClient } = require('mongodb');

class MongoTransferService {
  constructor(io) {
    this.io = io;
  }

  async testConnection(uri) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      await client.db().admin().ping();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      await client.close();
    }
  }

  async getCollections(uri, dbName) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      return collections.map(c => c.name);
    } catch (error) {
      throw new Error(`Failed to fetch collections: ${error.message}`);
    } finally {
      await client.close();
    }
  }

  async transferData({ sourceUri, destinationUri, dbName, collections, transferOptions }) {
    const sourceClient = new MongoClient(sourceUri);
    const destinationClient = new MongoClient(destinationUri);

    try {
      const destDbName = transferOptions?.destinationDbName || dbName;
      console.log(`Starting transfer: Source DB (${dbName}) -> Destination DB (${destDbName})`);
      await sourceClient.connect();
      await destinationClient.connect();
      console.log('Connected to both source and destination');

      const sourceDb = sourceClient.db(dbName);
      const destinationDb = destinationClient.db(destDbName);

      let collectionsToTransfer = collections;
      if (!collectionsToTransfer || collectionsToTransfer.length === 0) {
        const allCollections = await sourceDb.listCollections().toArray();
        collectionsToTransfer = allCollections.map(c => c.name);
      }
      
      console.log(`Collections to transfer: ${collectionsToTransfer.join(', ')}`);

      for (const collectionName of collectionsToTransfer) {
        console.log(`Processing collection: ${collectionName}`);
        this.io.emit('transfer-progress', {
          collection: collectionName,
          status: 'starting',
          progress: 0
        });

        const sourceCollection = sourceDb.collection(collectionName);
        const destinationCollection = destinationDb.collection(collectionName);

        // Handle duplication options
        if (transferOptions?.clearDestination) {
          console.log(`Clearing destination collection: ${collectionName}`);
          await destinationCollection.deleteMany({});
        }

        const totalDocuments = await sourceCollection.countDocuments();
        console.log(`Found ${totalDocuments} documents in ${collectionName}`);
        let transferredDocuments = 0;

        if (totalDocuments === 0) {
          this.io.emit('transfer-progress', {
            collection: collectionName,
            status: 'completed',
            progress: 100,
            count: 0
          });
          continue;
        }

        const batchSize = 1000;
        const cursor = sourceCollection.find({});

        while (await cursor.hasNext()) {
          const batch = [];
          for (let i = 0; i < batchSize && await cursor.hasNext(); i++) {
            batch.push(await cursor.next());
          }

          if (batch.length > 0) {
            try {
              await destinationCollection.insertMany(batch, { ordered: false });
              transferredDocuments += batch.length;
              console.log(`Transferred batch of ${batch.length} for ${collectionName}`);

              const progress = Math.round((transferredDocuments / totalDocuments) * 100);
              this.io.emit('transfer-progress', {
                collection: collectionName,
                status: 'transferring',
                progress,
                count: transferredDocuments,
                total: totalDocuments
              });
            } catch (batchError) {
              console.error(`Error in batch for ${collectionName}:`, batchError.message);
              // We continue even if some docs in the batch fail (e.g. duplicates)
              // because ordered: false is used.
              if (batchError.insertedCount) {
                transferredDocuments += batchError.insertedCount;
              }
            }
          }
        }

        this.io.emit('transfer-progress', {
          collection: collectionName,
          status: 'completed',
          progress: 100,
          count: transferredDocuments,
          total: totalDocuments
        });
      }

      this.io.emit('transfer-complete', {
        message: 'All collections transferred successfully',
        dbName,
        collections: collectionsToTransfer
      });

      return { success: true, message: 'Transfer completed successfully' };
    } catch (error) {
      this.io.emit('transfer-error', { message: error.message });
      throw error;
    } finally {
      await sourceClient.close();
      await destinationClient.close();
    }
  }
}

module.exports = MongoTransferService;
