import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Book from '@/lib/models/Book';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/books - Consulta pública do acervo com busca e filtros
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search')?.trim();
    const category = searchParams.get('category')?.trim();
    const status = searchParams.get('status')?.trim();
    const sort = searchParams.get('sort')?.trim() || 'recentes';

    // Construção dinâmica de filtros MongoDB
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (search) {
      // Busca case-insensitive tanto no título quanto no autor
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'todos' && category !== 'Todas as Categorias') {
      query.category = category;
    }

    if (status && status !== 'todos') {
      if (status.toLowerCase() === 'disponivel') {
        query.status = 'Disponível';
      } else if (status.toLowerCase() === 'emprestado') {
        query.status = 'Emprestado';
      }
    }

    // Ordenação
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sortOption: Record<string, any> = { createdAt: -1 };
    if (sort === 'az') {
      sortOption = { title: 1 };
    } else if (sort === 'za') {
      sortOption = { title: -1 };
    } else if (sort === 'recentes') {
      sortOption = { createdAt: -1 };
    }

    const books = await Book.find(query).sort(sortOption);

    return NextResponse.json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao buscar livros no catálogo.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/books - Cadastro de novo livro (Acesso restrito ao Bibliotecário)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Validar autenticação administrativa
    const authResult = await requireAuth(request);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    await connectToDatabase();
    const body = await request.json();

    const {
      title,
      author,
      isbn,
      category,
      coverUrl,
      shelfLocation,
      publicationYear,
      pages,
      synopsis,
      totalCopies,
    } = body;

    // 2. Validações obrigatórias no servidor
    if (!title || !author || !isbn) {
      return NextResponse.json(
        {
          success: false,
          message: 'Título, autor e ISBN são campos obrigatórios para o cadastro.',
        },
        { status: 400 }
      );
    }

    // 3. Verificar unicidade do ISBN
    const existingBook = await Book.findOne({ isbn: isbn.trim() });
    if (existingBook) {
      return NextResponse.json(
        {
          success: false,
          message: `Já existe um livro catalogado com o ISBN ${isbn}.`,
        },
        { status: 409 }
      );
    }

    // 4. Criação do Livro
    const newBook = await Book.create({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      category: category?.trim() || 'Literatura Brasileira',
      coverUrl: coverUrl?.trim() || '',
      shelfLocation: shelfLocation?.trim() || 'Estante Geral',
      publicationYear: publicationYear ? Number(publicationYear) : undefined,
      pages: pages ? Number(pages) : undefined,
      synopsis: synopsis?.trim() || '',
      totalCopies: totalCopies ? Math.max(1, Number(totalCopies)) : 1,
      availableCopies: totalCopies ? Math.max(1, Number(totalCopies)) : 1,
      status: 'Disponível',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Livro cadastrado com sucesso no acervo!',
        book: newBook,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao cadastrar livro no acervo.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}
