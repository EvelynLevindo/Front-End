import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Member from '@/lib/models/Member';
import Loan from '@/lib/models/Loan';
import { requireAuth } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/members/[id] - Detalhes do membro e seu histórico de empréstimos
 */
export async function GET(
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

    const member = await Member.findById(id);
    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: 'Membro leitor não encontrado.',
        },
        { status: 404 }
      );
    }

    const loans = await Loan.find({ member: id })
      .populate('book', 'title author isbn coverUrl status')
      .sort({ loanDate: -1 });

    return NextResponse.json({
      success: true,
      member,
      loans,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao buscar dados do membro.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/members/[id] - Atualização dos dados do membro
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

    const member = await Member.findById(id);
    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: 'Membro leitor não encontrado para alteração.',
        },
        { status: 404 }
      );
    }

    // Verificar conflito de e-mail se alterado
    if (body.email && body.email.toLowerCase().trim() !== member.email) {
      const emailConflict = await Member.findOne({
        email: body.email.toLowerCase().trim(),
        _id: { $ne: id },
      });
      if (emailConflict) {
        return NextResponse.json(
          {
            success: false,
            message: 'Este endereço de e-mail já está sendo utilizado por outro membro.',
          },
          { status: 409 }
        );
      }
      member.email = body.email.toLowerCase().trim();
    }

    if (body.name !== undefined) member.name = body.name.trim();
    if (body.phone !== undefined) member.phone = body.phone.trim();
    if (body.address !== undefined) member.address = body.address.trim();
    if (body.active !== undefined) member.active = Boolean(body.active);

    await member.save();

    return NextResponse.json({
      success: true,
      message: 'Cadastro do membro atualizado com sucesso!',
      member,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao atualizar dados do membro.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/members/[id] - Exclusão de membro com bloqueio de integridade
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

    const member = await Member.findById(id);
    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: 'Membro leitor não encontrado para exclusão.',
        },
        { status: 404 }
      );
    }

    // Regra Crítica: Verificar se existem empréstimos ativos pendentes para este membro
    const activeLoansCount = await Loan.countDocuments({
      member: id,
      status: 'Ativo',
    });

    if (activeLoansCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Não é possível excluir o leitor "${member.name}" pois ele possui ${activeLoansCount} livro(s) com empréstimo ativo pendente de devolução. Registre as devoluções antes de excluir o cadastro.`,
        },
        { status: 400 }
      );
    }

    await Member.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Cadastro do leitor "${member.name}" excluído com sucesso!`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao excluir membro da biblioteca.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}
