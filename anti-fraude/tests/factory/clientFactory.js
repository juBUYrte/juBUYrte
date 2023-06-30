/* eslint-disable import/no-relative-packages */
import Users from '../../../clientes/src/models/User.js';

export default async function createNewCliente() {
  try {
    const newClient = await Users.create({
      nome: 'Ada Lovelace',
      cpf: '12345677910',
      email: 'adalovelace@gmail.com',
      telefone: '8399959999',
      rendaMensal: '14800',
      endereço: {
        rua: 'Rua das Amendoeiras',
        numero: '10',
        complemento: 'Casa',
        cep: '21331450',
        cidade: 'Recife',
        estado: 'PE',
      },
      dadosDoCartao: {
        numero: '1234432156788745',
        nome: 'Ada Lovelace',
        validade: '2027/12/27',
        codigo: 266,
        vencimento: '18',
      },
    });
    return newClient;
  } catch (error) {
    console.log(error);
    return error;
  }
}
