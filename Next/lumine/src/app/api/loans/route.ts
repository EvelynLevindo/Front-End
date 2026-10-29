import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Loan from '@/lib/models/Loan';
import Book from '@/lib/models/Book';
import Member from '@/lib/models/Member';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/loans - Listagem de empréstimos com filtros e paginação
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status')?.trim();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const loans = await Loan.find(query)
      .populate('book', 'title author isbn coverUrl status shelfLocation')
      .populate('member', 'name email phone registrationNumber')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: loans.length,
      loans,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao listar empréstimos.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/loans - Registro de novo empréstimo de livro
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    await connectToDatabase();
    const body = await request.json();
    const { bookId, memberId, loanDate, expectedReturnDate, notes } = body;

    // 1. Validações preliminares
    if (!bookId || !memberId || !expectedReturnDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Livro, membro leitor e data prevista de devolução são obrigatórios.',
        },
        { status: 400 }
      );
    }

    // 2. Verificar existência do Livro
    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json(
        {
          success: false,
          message: 'Livro selecionado não foi encontrado no acervo.',
        },
        { status: 404 }
      );
    }

    // Regra Crítica: Impedir empréstimo de livro indisponível / já emprestado
    if (book.status === 'Emprestado') {
      return NextResponse.json(
        {
          success: false,
          message: `O exemplar "${book.title}" já se encontra emprestado e indisponível para nova retirada.`,
        },
        { status: 400 }
      );
    }

    // Verificar se já existe empréstimo ativo registrado para o livro
    const activeLoanForBook = await Loan.findOne({ book: bookId, status: 'Ativo' });
    if (activeLoanForBook) {
      return NextResponse.json(
        {
          success: false,
          message: `Já existe um empréstimo ativo em andamento para o exemplar "${book.title}".`,
        },
        { status: 400 }
      );
    }

    // 3. Verificar existência do Membro
    const member = await Member.findById(memberId);
    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: 'Membro leitor selecionado não foi encontrado.',
        },
        { status: 404 }
      );
    }

    if (!member.active) {
      return NextResponse.json(
        {
          success: false,
          message: `O cadastro do leitor "${member.name}" está inativo.`,
        },
        { status: 400 }
      );
    }

    // 4. Validação de datas
    const parsedLoanDate = loanDate ? new Date(loanDate) : new Date();
    const parsedExpectedDate = new Date(expectedReturnDate);

    if (isNaN(parsedLoanDate.getTime()) || isNaN(parsedExpectedDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: 'Formato de data inválido.',
        },
        { status: 400 }
      );
    }

    if (parsedExpectedDate < parsedLoanDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'A data prevista de devolução não pode ser anterior à data do empréstimo.',
        },
        { status: 400 }
      );
    }

    // 5. Criar Empréstimo
    const newLoan = await Loan.create({
      book: bookId,
      member: memberId,
      loanDate: parsedLoanDate,
      expectedReturnDate: parsedExpectedDate,
      status: 'Ativo',
      notes: notes?.trim() || '',
    });

    // 6. Atualizar status do Livro para "Emprestado" automaticamente
    book.status = 'Emprestado';
    if (book.availableCopies > 0) {
      book.availableCopies -= 1;
    }
    await book.save();

    // Enriquecer resposta populando as relações
    const populatedLoan = await Loan.findById(newLoan._id)
      .populate('book', 'title author isbn coverUrl status shelfLocation')
      .populate('member', 'name email phone registrationNumber');

    return NextResponse.json(
      {
        success: true,
        message: `Empréstimo do livro "${book.title}" registrado com sucesso para ${member.name}!`,
        loan: populatedLoan,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao registrar empréstimo.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}
