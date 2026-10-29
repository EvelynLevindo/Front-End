import mongoose, { Schema, Document, Model } from 'mongoose';

export type BookStatus = 'Disponível' | 'Emprestado';

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  category: string;
  coverUrl?: string;
  status: BookStatus;
  shelfLocation?: string;
  publicationYear?: number;
  pages?: number;
  synopsis?: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, 'O título do livro é obrigatório'],
      trim: true,
      minlength: [1, 'O título não pode ser vazio'],
      index: true,
    },
    author: {
      type: String,
      required: [true, 'O autor do livro é obrigatório'],
      trim: true,
      minlength: [2, 'O nome do autor deve ter pelo menos 2 caracteres'],
      index: true,
    },
    isbn: {
      type: String,
      required: [true, 'O código ISBN é obrigatório'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'A categoria é obrigatória'],
      trim: true,
      default: 'Literatura Brasileira',
    },
    coverUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Disponível', 'Emprestado'],
        message: '{VALUE} não é um status válido',
      },
      default: 'Disponível',
      index: true,
    },
    shelfLocation: {
      type: String,
      trim: true,
      default: 'Estante Geral',
    },
    publicationYear: {
      type: Number,
      min: [1000, 'Ano inválido'],
      max: [new Date().getFullYear() + 1, 'Ano não pode estar no futuro'],
    },
    pages: {
      type: Number,
      min: [1, 'O livro deve ter pelo menos 1 página'],
    },
    synopsis: {
      type: String,
      trim: true,
      default: '',
    },
    totalCopies: {
      type: Number,
      default: 1,
      min: [1, 'Total de cópias deve ser no mínimo 1'],
    },
    availableCopies: {
      type: Number,
      default: 1,
      min: [0, 'Cópias disponíveis não pode ser negativo'],
    },
  },
  {
    timestamps: true,
  }
);

// Índice de texto para buscas rápidas em catálogo público
BookSchema.index({ title: 'text', author: 'text', category: 'text' });

export const Book: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default Book;
