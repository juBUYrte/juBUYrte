// import {crypto} from 'crypto';

const crypto = require('crypto')

// const newObject = {
//   numero,
//   nome,
//   validade,
//   codigo,
// };

// const { senha } = newObject;

// const DADOS_CRIPTOGRAFAR = {
//   algoritmo: 'aes256',
//   segredo: 'chaves',
//   tipo: 'hex',
// };

const algorithm = 'aes256';
 
// Defining key
const key = crypto.randomBytes(32);
 
// Defining iv
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv(algorithm, key, iv);
const decipher = crypto.createDecipheriv(algorithm, key, iv);

const criptografia = (dado) => {
    cipher.update(dado);
    return cipher.final(key);
  };
  
// const descriptografia = (dado) => {
//     // console.log(dado)
//     deCipher.update(dado, key)
//     // console.log(dado)
//    return deCipher.final();
//   };
  
// const criptografado = criptografia('ABOBORA');
// // console.log(criptografado)
// const descriptografado = descriptografia(criptografado);

// // console.log(criptografado, "CRIPTOGRAFOU");
// console.log(descriptografado, "DESCRIPTOGRAFOU");
let decrypted = '';
decipher.on('readable', () => {
    let chunk;
    while (null !== (chunk = decipher.read())) {
       decrypted += chunk.toString('utf8');
    }
}
)

decipher.on('end', () => {
    console.log(decrypted);
 });

// console.log(decrypted)