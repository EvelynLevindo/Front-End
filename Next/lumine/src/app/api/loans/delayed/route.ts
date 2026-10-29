import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Loan from '@/lib/models/Loan';
import Book from '@/lib/models/Book';
import Member from '@/lib/models/Member';
import { requireAuth } from '@/lib/auth';

// Garantir inicialização de esquemas
void Book;
void Member;

/**
 * GET /api/loans/delayed - Listagem de empréstimos em atraso com cálculo automático em tempo real
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    await connectToDatabase();
    const now = new Date();

    // Buscar empréstimos ativos com data prevista anterior a hoje
    const delayedLoans = await Loan.find({
      status: 'Ativo',
      expectedReturnDate: { $lt: now },
    })
      .populate('book', 'title author isbn coverUrl status shelfLocation category')
      .populate('member', 'name email phone registrationNumber address')
      .sort({ expectedReturnDate: 1 }); // Mais antigos primeiro

    // Enriquecer cada empréstimo com os dias de atraso calculados dinamicamente
    const loansWithDelay = delayedLoans.map((loan) => {
      const expectedTime = new Date(loan.expectedReturnDate).getTime();
      const diffTime = now.getTime() - expectedTime;
      const daysDelayed = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

      return {
        ...loan.toObject(),
        daysDelayed,
        overdueDate: loan.expectedReturnDate,
      };
    });

    return NextResponse.json({
      success: true,
      count: loansWithDelay.length,
      delayedLoans: loansWithDelay,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao calcular e listar empréstimos atrasados.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}
