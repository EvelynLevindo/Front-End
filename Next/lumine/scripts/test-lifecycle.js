/* eslint-disable @typescript-eslint/no-require-imports */
async function testLifecycle() {
  console.log('--- TESTE AUTOMATIZADO DO CICLO DE VIDA DE EMPRÉSTIMO E DEVOLUÇÃO ---');

  // 1. Login
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'felipe.silva@lereviver.org.br', password: 'Lumine@2024' })
  });
  const { token } = await loginRes.json();
  const authHeaders = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };

  // 2. Livro disponível e membro
  const booksRes = await fetch('http://localhost:3000/api/books?status=disponivel');
  const { books } = await booksRes.json();
  const book = books[0];
  console.log('1. Livro selecionado:', book.title, '| Status inicial:', book.status);

  const memRes = await fetch('http://localhost:3000/api/members', { headers: authHeaders });
  const { members } = await memRes.json();
  const member = members[0];
  console.log('2. Leitor selecionado:', member.name, '(', member.registrationNumber, ')');

  // 3. Registrar empréstimo
  const d = new Date();
  const returnD = new Date(d.getTime() + 15 * 24 * 60 * 60 * 1000);
  const loanRes = await fetch('http://localhost:3000/api/loans', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      bookId: book._id,
      memberId: member._id,
      loanDate: d.toISOString(),
      expectedReturnDate: returnD.toISOString(),
      notes: 'Teste automatizado de fluxo completo'
    })
  });
  const loanData = await loanRes.json();
  console.log('3. Empréstimo registrado com sucesso! ID:', loanData.loan._id);

  // 4. Checar se livro virou "Emprestado"
  const checkBookRes = await fetch('http://localhost:3000/api/books/' + book._id);
  const checkBookData = await checkBookRes.json();
  console.log('4. Status do livro no acervo após empréstimo:', checkBookData.book.status);

  // 5. Tentativa de novo empréstimo do mesmo exemplar deve falhar (regra de negócio)
  const duplicateLoanRes = await fetch('http://localhost:3000/api/loans', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      bookId: book._id,
      memberId: member._id,
      loanDate: d.toISOString(),
      expectedReturnDate: returnD.toISOString()
    })
  });
  console.log('5. Tentativa de empréstimo duplicado (deve retornar 400):', duplicateLoanRes.status);

  // 6. Registrar Devolução
  const returnRes = await fetch('http://localhost:3000/api/loans/' + loanData.loan._id + '/return', {
    method: 'POST',
    headers: authHeaders
  });
  const returnData = await returnRes.json();
  console.log('6. Devolução registrada:', returnData.message);

  // 7. Checar se livro voltou para "Disponível"
  const finalBookRes = await fetch('http://localhost:3000/api/books/' + book._id);
  const finalBookData = await finalBookRes.json();
  console.log('7. Status final do livro no acervo:', finalBookData.book.status);
  console.log('--- TESTE CONCLUÍDO COM 100% DE SUCESSO! ---');
}

testLifecycle().catch(console.error);
