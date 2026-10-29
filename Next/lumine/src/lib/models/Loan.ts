import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import Book, { IBook } from './Book';
import Member, { IMember } from './Member';

// Garantir que os modelos referenciados estejam registrados no Mongoose
void Book;
void Member;

export type LoanStatus = 'Ativo' | 'Devolvido' | 'Atrasado';

export interface ILoan extends Document {
  book: Types.ObjectId | IBook;
  member: Types.ObjectId | IMember;
  loanDate: Date;
  expectedReturnDate: Date;
  returnDate?: Date | null;
  status: LoanStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema = new Schema<ILoan>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'O livro é obrigatório para registrar o empréstimo'],
      index: true,
    },
    member: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'O membro leitor é obrigatório para registrar o empréstimo'],
      index: true,
    },
    loanDate: {
      type: Date,
      required: [true, 'A data do empréstimo é obrigatória'],
      default: Date.now,
    },
    expectedReturnDate: {
      type: Date,
      required: [true, 'A data prevista de devolução é obrigatória'],
      index: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['Ativo', 'Devolvido', 'Atrasado'],
        message: '{VALUE} não é um status válido',
      },
      default: 'Ativo',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Loan: Model<ILoan> =
  mongoose.models.Loan || mongoose.model<ILoan>('Loan', LoanSchema);

export default Loan;
