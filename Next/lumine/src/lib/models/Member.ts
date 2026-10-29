import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMember extends Document {
  name: string;
  email: string;
  phone: string;
  registrationNumber: string;
  address?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema = new Schema<IMember>(
  {
    name: {
      type: String,
      required: [true, 'O nome do membro é obrigatório'],
      trim: true,
      minlength: [2, 'O nome deve conter pelo menos 2 caracteres'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'O e-mail do membro é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Por favor, forneça um endereço de e-mail válido',
      ],
    },
    phone: {
      type: String,
      required: [true, 'O telefone é obrigatório'],
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'O número de registro é obrigatório'],
      unique: true,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índice de busca textual para membros
MemberSchema.index({ name: 'text', email: 'text', registrationNumber: 'text' });

export const Member: Model<IMember> =
  mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);

export default Member;
