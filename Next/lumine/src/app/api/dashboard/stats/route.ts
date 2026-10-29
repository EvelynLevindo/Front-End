import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Book from '@/lib/models/Book';
import Member from '@/lib/models/Member';
import Loan from '@/lib/models/Loan';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/dashboard/stats - Consolidação das métricas executivas do painel administrativo
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    await connectToDatabase();
    const now = new Date();

    const [totalBooks, totalMembers, activeLoansCount, delayedLoansDocs, recentLoans] =
      await Promise.all([
        Book.countDocuments(),
        Member.countDocuments(),
        Loan.countDocuments({ status: 'Ativo' }),
        Loan.find({
          status: 'Ativo',
          expectedReturnDate: { $lt: now },
        })
          .populate('book', 'title author coverUrl')
          .populate('member', 'name phone email')
          .sort({ expectedReturnDate: 1 })
          .limit(3),
        Loan.find()
          .populate('book', 'title author coverUrl status')
          .populate('member', 'name registrationNumber')
          .sort({ createdAt: -1 })
          .limit(4),
      ]);

    const delayedLoansCount = await Loan.countDocuments({
      status: 'Ativo',
      expectedReturnDate: { $lt: now },
    });

    // Formatar os atrasos críticos com cálculo de dias
    const criticalDelayed = delayedLoansDocs.map((loan) => {
      const expectedTime = new Date(loan.expectedReturnDate).getTime();
      const diffTime = now.getTime() - expectedTime;
      const daysDelayed = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

      return {
        ...loan.toObject(),
        daysDelayed,
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalBooks,
        totalMembers,
        activeLoans: activeLoansCount,
        delayedLoans: delayedLoansCount,
        criticalDelayed,
        recentLoans,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao carregar estatísticas do painel administrativo.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}
