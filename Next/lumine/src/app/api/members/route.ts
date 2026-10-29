import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Member from '@/lib/models/Member';
import Loan from '@/lib/models/Loan';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/members - Listagem e busca de membros da biblioteca
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const members = await Member.find(query).sort({ createdAt: -1 });

    // Enriquecer com a contagem de empréstimos ativos para cada membro
    const membersWithLoans = await Promise.all(
      members.map(async (member) => {
        const activeLoansCount = await Loan.countDocuments({
          member: member._id,
          status: 'Ativo',
        });
        return {
          ...member.toObject(),
          activeLoansCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      count: membersWithLoans.length,
      members: membersWithLoans,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao listar membros da biblioteca.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/members - Cadastro de novo membro leitor
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    await connectToDatabase();
    const body = await request.json();
    const { name, email, phone, registrationNumber, address } = body;

    // 1. Validação de campos obrigatórios
    if (!name || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nome, e-mail e telefone são campos obrigatórios para cadastrar um membro.',
        },
        { status: 400 }
      );
    }

    // 2. Verificar se o e-mail já existe
    const existingEmail = await Member.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: 'Já existe um membro cadastrado com este endereço de e-mail.',
        },
        { status: 409 }
      );
    }

    // 3. Gerar ou validar registrationNumber
    let finalRegNumber = registrationNumber?.trim();
    if (!finalRegNumber) {
      const count = await Member.countDocuments();
      finalRegNumber = `MEM-${String(count + 1).padStart(4, '0')}`;
    } else {
      const existingReg = await Member.findOne({ registrationNumber: finalRegNumber });
      if (existingReg) {
        return NextResponse.json(
          {
            success: false,
            message: `A matrícula ${finalRegNumber} já está em uso por outro membro.`,
          },
          { status: 409 }
        );
      }
    }

    // 4. Salvar membro
    const member = await Member.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      registrationNumber: finalRegNumber,
      address: address?.trim() || '',
      active: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Membro leitor cadastrado com sucesso!',
        member,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao cadastrar novo membro.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}
