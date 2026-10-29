import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { email, password } = body;

    // 1. Validação de campos obrigatórios
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Por favor, informe o e-mail e a senha de acesso.',
        },
        { status: 400 }
      );
    }

    // 2. Busca do usuário (incluindo o campo password explicitamente)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Credenciais inválidas. Verifique seu e-mail e senha.',
        },
        { status: 401 }
      );
    }

    if (!user.active) {
      return NextResponse.json(
        {
          success: false,
          message: 'Esta conta de usuário está desativada. Contate a coordenação.',
        },
        { status: 403 }
      );
    }

    // 3. Comparação da senha criptografada via Bcrypt
    const isPasswordValid = await verifyPassword(password, user.password!);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Credenciais inválidas. Verifique seu e-mail e senha.',
        },
        { status: 401 }
      );
    }

    // 4. Criação do Token JWT
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // 5. Configuração da Resposta e Cookie HTTP-Only seguro
    const response = NextResponse.json({
      success: true,
      message: 'Autenticação realizada com sucesso! Bem-vindo(a) ao Lumine.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: 'lumine_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno durante a autenticação.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}
