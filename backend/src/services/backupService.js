const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

class BackupService {
  async createBackup(uri, dbName) {
    const client = new MongoClient(uri);
    const backupDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const folderName = `${dbName}_${timestamp}`;
    const folderPath = path.join(backupDir, folderName);
    fs.mkdirSync(folderPath);

    try {
      await client.connect();
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();

      for (const col of collections) {
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
        archive.on('error', (err) => reject(err));
        archive.pipe(output);
        archive.directory(folderPath, false);
        archive.finalize();
      });
    } catch (error) {
      throw error;
    } finally {
      await client.close();
      // Clean up the folder, keep only the zip
      if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true });
      }
    }
  }
}

module.exports = new BackupService();
