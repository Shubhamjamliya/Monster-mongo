const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

class BackupService {
  async createBackup(uri, dbName) {
    const client = new MongoClient(uri);
    const backupDir = path.join(__dirname, '../../backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const folderName = `${dbName}_${timestamp}`;
    const folderPath = path.join(backupDir, folderName);

    try {
      if (!fs.existsSync(backupDir)) {
        console.log(`Creating backups directory at ${backupDir}`);
        fs.mkdirSync(backupDir);
      }

      console.log(`Starting backup for DB: ${dbName}`);
      fs.mkdirSync(folderPath);

      await client.connect();
      console.log('Connected to source for backup');
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      console.log(`Found ${collections.length} collections to backup`);

      for (const col of collections) {
        console.log(`Backing up collection: ${col.name}`);
        const collection = db.collection(col.name);
        const documents = await collection.find({}).toArray();
        fs.writeFileSync(
          path.join(folderPath, `${col.name}.json`),
          JSON.stringify(documents, null, 2)
        );
      }

      // Create ZIP
      const zipPath = path.join(backupDir, `${folderName}.zip`);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      return new Promise((resolve, reject) => {
        output.on('close', () => resolve(zipPath));
        archive.on('error', (err) => {
          console.error('Archiver error:', err);
          reject(err);
        });
        archive.pipe(output);
        archive.directory(folderPath, false);
        archive.finalize();
      });
    } catch (error) {
      console.error('Backup creation failed:', error.message);
      throw error;
    } finally {
      await client.close();
      // Clean up the folder, keep only the zip
      if (fs.existsSync(folderPath)) {
        try {
          fs.rmSync(folderPath, { recursive: true });
        } catch (cleanupError) {
          console.error('Failed to clean up temp folder:', cleanupError.message);
        }
      }
    }
  }
}

module.exports = new BackupService();
