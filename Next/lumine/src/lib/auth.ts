import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from './mongodb';
import User, { IUser } from './models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'lumine_default_jwt_secret_development_key_2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Criptografa uma senha em texto claro usando Bcrypt com salt rounds = 10
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compara uma senha em texto claro com um hash Bcrypt
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Gera um token JWT assinado para o usuário autenticado
 */
export function signToken(payload: TokenPayload): string {
  // @ts-expect-error jsonwebtoken types mismatch with string expiresIn
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Decodifica e valida a integridade de um token JWT
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extrai o token JWT da requisição (Cookie HTTP-Only ou Header Authorization: Bearer <token>)
 */
export function extractToken(request: Request | NextRequest): string | null {
  // 1. Tentar ler do cabeçalho Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 2. Tentar ler do Cookie HTTP-Only "lumine_token"
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    const tokenCookie = cookies.find((c) => c.startsWith('lumine_token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
  }

  return null;
}

/**
 * Obtém o usuário bibliotecário autenticado a partir da requisição
 */
export async function getAuthenticatedUser(request: Request | NextRequest): Promise<IUser | null> {
  const token = extractToken(request);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || !payload.userId) return null;

  try {
    await connectToDatabase();
    const user = await User.findById(payload.userId);
    if (!user || !user.active) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Guard para rotas que exigem perfil administrativo/bibliotecário
 */
export async function requireAuth(
  request: Request | NextRequest
): Promise<{ user: IUser } | { errorResponse: NextResponse }> {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          message: 'Acesso não autorizado. Por favor, realize login com sua conta de bibliotecário.',
        },
        { status: 401 }
      ),
    };
  }

  return { user };
}
