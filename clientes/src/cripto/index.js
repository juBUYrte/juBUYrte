import ncrypt from 'ncrypt-js';

const _secretKey = 'KAJSGHDHJASGDJAGSHDGASHGDHJQWTEDQTYWDRFTQWRDTQYWRDFYTQWFDTYQWFDGQHWDFQHGWFDHGQWFDHQWFHGDHG';

// eslint-disable-next-line new-cap
const ncryptObject = new ncrypt(_secretKey);

function encrypt(text) {
  const encryptedData = ncryptObject.encrypt(text);
  return encryptedData;
}

function decrypt(text) {
  const decryptedData = ncryptObject.decrypt(text);

  return decryptedData;
}

export {
  encrypt,
  decrypt,
};
