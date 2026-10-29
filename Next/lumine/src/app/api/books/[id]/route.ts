import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Book from '@/lib/models/Book';
import Loan from '@/lib/models/Loan';
import { requireAuth } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/books/[id] - Detalhes de um livro específico
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json(
        {
          success: false,
          message: 'Livro não encontrado no acervo.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      book,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao buscar detalhes do livro.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/books/[id] - Edição dos dados de um livro (Acesso do Bibliotecário)
 */
export async function PUT(
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
    const body = await request.json();

    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json(
        {
          success: false,
          message: 'Livro não encontrado para atualização.',
        },
        { status: 404 }
      );
    }

    // Se o ISBN foi alterado, verificar conflito
    if (body.isbn && body.isbn !== book.isbn) {
      const isbnConflict = await Book.findOne({ isbn: body.isbn.trim(), _id: { $ne: id } });
      if (isbnConflict) {
        return NextResponse.json(
          {
            success: false,
            message: `O ISBN ${body.isbn} já está em uso por outro livro catalogado.`,
          },
          { status: 409 }
        );
      }
      book.isbn = body.isbn.trim();
    }

    if (body.title !== undefined) book.title = body.title.trim();
    if (body.author !== undefined) book.author = body.author.trim();
    if (body.category !== undefined) book.category = body.category.trim();
    if (body.coverUrl !== undefined) book.coverUrl = body.coverUrl.trim();
    if (body.shelfLocation !== undefined) book.shelfLocation = body.shelfLocation.trim();
    if (body.publicationYear !== undefined) book.publicationYear = Number(body.publicationYear) || undefined;
    if (body.pages !== undefined) book.pages = Number(body.pages) || undefined;
    if (body.synopsis !== undefined) book.synopsis = body.synopsis.trim();
    if (body.status !== undefined && (body.status === 'Disponível' || body.status === 'Emprestado')) {
      book.status = body.status;
    }

    await book.save();

    return NextResponse.json({
      success: true,
      message: 'Dados do livro atualizados com sucesso!',
      book,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao atualizar livro.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/books/[id] - Exclusão de livro com proteção de integridade referencial
 */
export async function DELETE(
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

    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json(
        {
          success: false,
          message: 'Livro não encontrado para exclusão.',
        },
        { status: 404 }
      );
    }

    // Regra de Negócio Crítica: Impedir exclusão se houver empréstimos ativos para este exemplar
    const activeLoansCount = await Loan.countDocuments({
      book: id,
      status: 'Ativo',
    });

    if (activeLoansCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Não é possível excluir o livro "${book.title}" pois existem ${activeLoansCount} empréstimo(s) ativo(s) pendente(s) de devolução associados a ele.`,
        },
        { status: 400 }
      );
    }

    await Book.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Livro "${book.title}" excluído do acervo com sucesso!`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao excluir livro do acervo.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}
