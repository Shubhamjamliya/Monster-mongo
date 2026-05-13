const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');

dotenv.config();

const SECRET_KEY = process.env.CRYPTO_SECRET || 'monster_mongo_secret_key_123';

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const decrypt = (hash) => {
  const bytes = CryptoJS.AES.decrypt(hash, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encrypt,
  decrypt
};
