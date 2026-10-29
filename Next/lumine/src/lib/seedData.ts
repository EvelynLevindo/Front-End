import { connectToDatabase } from './mongodb';
import User from './models/User';
import Book from './models/Book';
import Member from './models/Member';
import Loan from './models/Loan';
import { hashPassword } from './auth';

export async function runDatabaseSeed() {
  await connectToDatabase();

  // 1. Criar ou atualizar o Bibliotecário Chefe
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'felipe.silva@lereviver.org.br';
  const adminName = process.env.ADMIN_INITIAL_NAME || 'Felipe Silva';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Lumine@2024';

  let librarian = await User.findOne({ email: adminEmail });
  if (!librarian) {
    const hashedPassword = await hashPassword(adminPassword);
    librarian = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'librarian',
      active: true,
    });
  }

  // 2. Livros Iniciais (Inspirados no Protótipo Stitch - Biblioteca Comunitária Ler é Viver)
  const initialBooks = [
    {
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      isbn: '978-85-359-0277-1',
      category: 'Literatura Brasileira',
      shelfLocation: 'Estante A1 · P2',
      publicationYear: 1899,
      pages: 256,
      synopsis: 'O ciúme e a dúvida de Bento Santiago sobre Capitu. Um dos maiores enigmas da literatura universal em edição anotada pela Academia.',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO-KpxaKPaxAI7cZSEsFaDGzvnxTqqg7Uf88iuu7ch32lQHV9UJJgyExFRgNgO2Vch_Sz4uEpCYXGb9JZuOgRKf5l13y1tiXFIun0jhIUDGfk0HylCtsoJqeWyA1NCyxSc_nCM8t70UNAUPpaVHJ8UN6D5xdU7HAmTAtSH3V90WtTqm7GjTcV8b-_PxwqzMA6qsU_fDrLgSAa0li-I8xD96qM6_Gp_aRg6L2OrNLw',
      status: 'Emprestado' as const,
      totalCopies: 3,
      availableCopies: 2,
    },
    {
      title: 'Quarto de Despejo: Diário de uma Favelada',
      author: 'Carolina Maria de Jesus',
      isbn: '978-85-081-5401-2',
      category: 'Memórias & Biografias',
      shelfLocation: 'Estante C3 · P1',
      publicationYear: 1960,
      pages: 200,
      synopsis: 'O pungente diário real da catadora Carolina relatando a fome, a força materna e a crueza da antiga favela do Canindé.',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHaD-PxNfudbCCP3zPXO77-Xc7hDweOBzdLQn9hNRnzQZ1MwaNpfLCOjuFBayrQZCQTOqpjTYqJisIssSjShy7b9H3_jvrlSEkHc8OIbD7b-mZpRRN03M0wOOTvYyung_wwOYjGnalrxtd0FwvRIM-Ci7cCvHCqBf6iFbCXCBkF_UndXmVHowd9rc6tQhWSXe_yNUNQmTe8NYRnzpOosDDhOJ_f4fD3iTH_1TXX4Y',
      status: 'Emprestado' as const,
      totalCopies: 2,
      availableCopies: 1,
    },
    {
      title: 'Grande Sertão: Veredas',
      author: 'João Guimarães Rosa',
      isbn: '978-85-209-4144-8',
      category: 'Literatura Brasileira',
      shelfLocation: 'Estante A2 · P4',
      publicationYear: 1956,
      pages: 600,
      synopsis: 'O épico monólogo de Riobaldo pelas veredas do sertão e sua relação enigmática com Diadorim. Uma revolução na linguagem literária.',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7rWOYWtk4Ne3V-e1JO0p-mg7Xy4lbP37XlfyBl6Q2ojTTRmJHlyS-fAeDtcgbtsqUiqdMLI2ANARbZhgX7GSCGbrCEHSlkJW-KnDZREj5yfQVKQCqmJuEJB_xpP-3mFTfgIYXjC_mBFPR9tdsEyWmPvk_s-cpEqqhtLKdbzUZ7YB5bSzj-QYJER9L2D39ZyNJnvfhvjC5j1XSM0mjKurKLzY-kuIQ5YqS5RkU37w',
      status: 'Emprestado' as const,
      totalCopies: 2,
      availableCopies: 0,
    },
    {
      title: 'Capitães da Areia',
      author: 'Jorge Amado',
      isbn: '978-85-359-1406-4',
      category: 'Literatura Brasileira',
      shelfLocation: 'Estante B1 · P3',
      publicationYear: 1937,
      pages: 280,
      synopsis: 'A comovente e vibrante vida dos meninos de rua de Salvador liderados por Pedro Bala em busca de acolhimento e dignidade.',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7yHXh8VrYHLKA9p2dROm2a84lj0a6n15n2CPbMrT5IFoOHLBG1cz6Ky-FYw8EBSErjDg_59xALwC-fyuzkhoe17Pih87MnwauEqQUFZ9xbofG71QTirM-eJpKiiPhJMfyuEnn6fyNhVM4yDIXhwRynDPkE2d_mopBltQITM2HHQDVpf0TvMt8y3j7axkllSo7AfSaRSjBoMH6ev2B-R70KSOEnAjHqDAGmRsTl_8',
      status: 'Disponível' as const,
      totalCopies: 3,
      availableCopies: 3,
    },
    {
      title: 'A Hora da Estrela',
      author: 'Clarice Lispector',
      isbn: '978-85-325-0811-9',
      category: 'Literatura Brasileira',
      shelfLocation: 'Estante A3 · P1',
      publicationYear: 1977,
      pages: 88,
      synopsis: 'A história lírica e dolorosa de Macabéa, jovem alagoana que sobrevive na metrópole paulistana sem desconfiar de sua grandeza.',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFfzaIEDRI89CX9kPjTQsret5PMwjo41Tx2RSIpLN-UqmOOzpHBb_5MCxCLu_yb5n6ihZcRSff9eHQso8ibwl45WSKKppXs7pVdYtNxb_scfpL0KAPpmwd-NmJBw1ekQAoimRspgYxA9DSwYg5uHgP30MPHgrUJp3EgfjHwqAcE-2rTFNbAnF8f-_rundg5kHavwFtlSw4Bq-wN1_qD4us8lJU8GTolYX5CCdn4XU',
      status: 'Emprestado' as const,
      totalCopies: 2,
      availableCopies: 0,
    },
    {
      title: 'O Pequeno Príncipe',
      author: 'Antoine de Saint-Exupéry',
      isbn: '978-85-220-3144-3',
      category: 'Infanto-Juvenil',
      shelfLocation: 'Estante D1 · P2',
      publicationYear: 1943,
      pages: 96,
      synopsis: 'A clássica fábula poética sobre amizade, responsabilidade e o valor de ver com o coração em um pequeno asteroide.',
      coverUrl: '',
      status: 'Disponível' as const,
      totalCopies: 4,
      availableCopies: 4,
    },
    {
      title: 'Vidas Secas',
      author: 'Graciliano Ramos',
      isbn: '978-85-010-0925-8',
      category: 'Literatura Brasileira',
      shelfLocation: 'Estante A2 · P1',
      publicationYear: 1938,
      pages: 176,
      synopsis: 'A trajetória de Fabiano, Sinhá Vitória, seus filhos e a cachorra Baleia em meio à seca impiedosa do sertão nordestino.',
      coverUrl: '',
      status: 'Emprestado' as const,
      totalCopies: 2,
      availableCopies: 0,
    },
    {
      title: 'O Cortiço',
      author: 'Aluísio Azevedo',
      isbn: '978-85-080-4103-9',
      category: 'Literatura Brasileira',
      shelfLocation: 'Estante B2 · P3',
      publicationYear: 1890,
      pages: 304,
      synopsis: 'Obra-prima do naturalismo brasileiro que retrata a vida em uma habitação coletiva no Rio de Janeiro do século XIX.',
      coverUrl: '',
      status: 'Emprestado' as const,
      totalCopies: 2,
      availableCopies: 0,
    },
  ];

  for (const bookData of initialBooks) {
    const existing = await Book.findOne({ isbn: bookData.isbn });
    if (!existing) {
      await Book.create(bookData);
    }
  }

  // 3. Membros Leitores Iniciais
  const initialMembers = [
    {
      name: 'Mariana Souza Santos',
      email: 'mariana.souza@email.com',
      phone: '(11) 98765-4321',
      registrationNumber: 'MEM-0418',
      address: 'Rua das Flores, 120 - Bairro da Paz',
    },
    {
      name: 'Carlos Eduardo Ramos',
      email: 'carlos.ramos@email.com',
      phone: '(11) 97654-3210',
      registrationNumber: 'MEM-0192',
      address: 'Av. Brasil, 450 - Bairro da Paz',
    },
    {
      name: 'Juliana Mendes Albuquerque',
      email: 'juliana.mendes@email.com',
      phone: '(11) 99876-5432',
      registrationNumber: 'MEM-0530',
      address: 'Rua da Esperança, 88 - Bairro da Paz',
    },
    {
      name: 'Lucas Daniel Pires',
      email: 'lucas.daniel@email.com',
      phone: '(11) 98123-4567',
      registrationNumber: 'MEM-0614',
      address: 'Travessa dos Pinheiros, 15 - Bairro da Paz',
    },
    {
      name: 'Ana Paula Ferreira',
      email: 'ana.ferreira@email.com',
      phone: '(11) 98421-4402',
      registrationNumber: 'MEM-0220',
      address: 'Rua Bela Vista, 310 - Bairro da Paz',
    },
    {
      name: 'Sebastião Nogueira',
      email: 'sebastiao.nogueira@email.com',
      phone: '(11) 97130-1899',
      registrationNumber: 'MEM-0105',
      address: 'Alameda dos Ipês, 75 - Bairro da Paz',
    },
    {
      name: 'Clara Beatriz Lima',
      email: 'clara.lima@email.com',
      phone: '(11) 99342-8812',
      registrationNumber: 'MEM-0341',
      address: 'Rua 7 de Setembro, 204 - Bairro da Paz',
    },
  ];

  for (const memberData of initialMembers) {
    const existing = await Member.findOne({ email: memberData.email });
    if (!existing) {
      await Member.create(memberData);
    }
  }

  // 4. Empréstimos Iniciais (Ativos e Atrasados)
  const domCasmurro = await Book.findOne({ isbn: '978-85-359-0277-1' });
  const quartoDespejo = await Book.findOne({ isbn: '978-85-081-5401-2' });
  const grandeSertao = await Book.findOne({ isbn: '978-85-209-4144-8' });
  const horaEstrela = await Book.findOne({ isbn: '978-85-325-0811-9' });
  const vidasSecas = await Book.findOne({ isbn: '978-85-010-0925-8' });
  const oCortico = await Book.findOne({ isbn: '978-85-080-4103-9' });

  const mariana = await Member.findOne({ registrationNumber: 'MEM-0418' });
  const carlos = await Member.findOne({ registrationNumber: 'MEM-0192' });
  const juliana = await Member.findOne({ registrationNumber: 'MEM-0530' });
  const anaPaula = await Member.findOne({ registrationNumber: 'MEM-0220' });
  const sebastiao = await Member.findOne({ registrationNumber: 'MEM-0105' });
  const clara = await Member.findOne({ registrationNumber: 'MEM-0341' });

  const now = new Date();

  // Empréstimo 1: Dom Casmurro -> Mariana (Ativo, no prazo)
  if (domCasmurro && mariana) {
    const exists = await Loan.findOne({ book: domCasmurro._id, member: mariana._id, status: 'Ativo' });
    if (!exists) {
      const loanDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      const expectedReturn = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000);
      await Loan.create({
        book: domCasmurro._id,
        member: mariana._id,
        loanDate,
        expectedReturnDate: expectedReturn,
        status: 'Ativo',
        notes: 'Retirada regular balcão',
      });
    }
  }

  // Empréstimo 2: Quarto de Despejo -> Carlos (Ativo, no prazo)
  if (quartoDespejo && carlos) {
    const exists = await Loan.findOne({ book: quartoDespejo._id, member: carlos._id, status: 'Ativo' });
    if (!exists) {
      const loanDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      const expectedReturn = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      await Loan.create({
        book: quartoDespejo._id,
        member: carlos._id,
        loanDate,
        expectedReturnDate: expectedReturn,
        status: 'Ativo',
      });
    }
  }

  // Empréstimo 3: Grande Sertão -> Juliana (Ativo, no prazo)
  if (grandeSertao && juliana) {
    const exists = await Loan.findOne({ book: grandeSertao._id, member: juliana._id, status: 'Ativo' });
    if (!exists) {
      const loanDate = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
      const expectedReturn = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
      await Loan.create({
        book: grandeSertao._id,
        member: juliana._id,
        loanDate,
        expectedReturnDate: expectedReturn,
        status: 'Ativo',
      });
    }
  }

  // Empréstimo 4 (Atrasado 12 dias): A Hora da Estrela -> Ana Paula
  if (horaEstrela && anaPaula) {
    const exists = await Loan.findOne({ book: horaEstrela._id, member: anaPaula._id, status: 'Ativo' });
    if (!exists) {
      const expectedReturn = new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000);
      const loanDate = new Date(expectedReturn.getTime() - 14 * 24 * 60 * 60 * 1000);
      await Loan.create({
        book: horaEstrela._id,
        member: anaPaula._id,
        loanDate,
        expectedReturnDate: expectedReturn,
        status: 'Ativo',
        notes: 'Contato acolhedor pendente',
      });
    }
  }

  // Empréstimo 5 (Atrasado 8 dias): Vidas Secas -> Sebastião
  if (vidasSecas && sebastiao) {
    const exists = await Loan.findOne({ book: vidasSecas._id, member: sebastiao._id, status: 'Ativo' });
    if (!exists) {
      const expectedReturn = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
      const loanDate = new Date(expectedReturn.getTime() - 14 * 24 * 60 * 60 * 1000);
      await Loan.create({
        book: vidasSecas._id,
        member: sebastiao._id,
        loanDate,
        expectedReturnDate: expectedReturn,
        status: 'Ativo',
      });
    }
  }

  // Empréstimo 6 (Atrasado 6 dias): O Cortiço -> Clara
  if (oCortico && clara) {
    const exists = await Loan.findOne({ book: oCortico._id, member: clara._id, status: 'Ativo' });
    if (!exists) {
      const expectedReturn = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
      const loanDate = new Date(expectedReturn.getTime() - 14 * 24 * 60 * 60 * 1000);
      await Loan.create({
        book: oCortico._id,
        member: clara._id,
        loanDate,
        expectedReturnDate: expectedReturn,
        status: 'Ativo',
      });
    }
  }

  return {
    success: true,
    message: 'Banco de dados inicializado com sucesso!',
    librarian: {
      name: librarian.name,
      email: librarian.email,
    },
  };
}
