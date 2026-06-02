import { Vaga } from './vaga.model'; // Nome correto do arquivo e da classe

describe('Vaga', () => {
  it('should create an instance', () => {
    // Passando valores fictícios para o construtor não reclamar
    expect(new Vaga(1, 'Nome', 'foto.jpg', 'Desc', 1000)).toBeTruthy();
  });
});