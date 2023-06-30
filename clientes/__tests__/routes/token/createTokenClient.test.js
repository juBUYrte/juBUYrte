import {
  describe, expect, it,
} from '@jest/globals';

import createTokenClient from '../../../solutions/token.js';

const tokenAcess = await createTokenClient();

describe('Testes da funcao createTokenClient', () => {
  it('Deve retornar um Token', async () => {
    const esp = expect.any(String);
    expect(tokenAcess).toEqual(esp);
  });
});
