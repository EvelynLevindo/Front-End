import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Loan from '@/lib/models/Loan';
import Book from '@/lib/models/Book';
import { requireAuth } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/loans/[id]/return - Registro de devolução e atualização automática do status do livro
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const authResult = await requireAuth(request);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    await connectToDatabase();
    const { id } = await context.params;

    const loan = await Loan.findById(id).populate('book').populate('member');
    if (!loan) {
      return NextResponse.json(
        {
          success: false,
          message: 'Registro de empréstimo não encontrado.',
        },
        { status: 404 }
      );
    }

    if (loan.status === 'Devolvido') {
      return NextResponse.json(
        {
          success: false,
          message: 'Este empréstimo já foi registrado como devolvido anteriormente.',
        },
        { status: 400 }
      );
    }

    // 1. Atualizar o empréstimo
    loan.status = 'Devolvido';
    loan.returnDate = new Date();
    await loan.save();

    // 2. Atualizar o livro vinculado automaticamente para "Disponível"
    const bookId = typeof loan.book === 'object' && '_id' in loan.book ? loan.book._id : loan.book;
    const book = await Book.findById(bookId);

    if (book) {
      book.status = 'Disponível';
      if (book.availableCopies < book.totalCopies) {
        book.availableCopies += 1;
      }
      await book.save();
    }

    return NextResponse.json({
      success: true,
      message: `Devolução registrada com sucesso! O exemplar agora está com status "Disponível".`,
      loan,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao processar devolução do livro.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}
