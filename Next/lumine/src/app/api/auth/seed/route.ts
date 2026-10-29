import { NextResponse } from 'next/server';
import { runDatabaseSeed } from '@/lib/seedData';

export async function POST() {
  try {
    const result = await runDatabaseSeed();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: 'Falha ao executar carga inicial de dados.',
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
