import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      min: 3,
      validate: {
        validator(value) {
          return /^[^0-9].*$/.test(value);
        },
        message: 'The name cannot start with numbers.',
      },
    },
    cpf: {
      type: String,
      required: true,
      min: 11,
      max: 11,
      validate: {
        validator(value) {
          return /^[0-9]{11}$/.test(value);
        },
        message: 'The cpf must be valid.',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(value) {
          return /\S+@\S+\.\S+/.test(value);
        },
        message: 'The email must be valid.',
      },
    },
    telefone: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return /^[0-9]{10,}$/.test(value);
        },
        message: 'The email must be valid.',
      },
    },
    rendaMensal: { type: Number, required: true },

    endereço: {
      rua: { type: String, required: true },
      numero: { type: String, required: true },
      complemento: { type: String, required: true },
      cep: { type: String, required: true },
      cidade: { type: String, required: true },
      estado: {
        type: String,
        required: true,
        enum: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF',
          'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB',
          'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR',
          'SC', 'SP', 'SE', 'TO',
        ],
      },
    },
    dadosDoCartao: {
      numero: {
        type: String, required: true, min: 13, max: 16,
      },
      nome: {
        type: String,
        required: true,
        min: 3,
        validate: {
          validator(value) {
            return /^[^0-9].*$/.test(value);
          },
          message: 'The name cannot start with numbers.',
        },
      },
      validade: {
        type: String,
        required: true,
      },
      codigo: { type: String, required: true },
      vencimento: { type: String, required: true },
    },
  },
);

const Users = mongoose.model('users', userSchema);
export default Users;
