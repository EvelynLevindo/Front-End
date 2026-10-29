import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'librarian' | 'admin';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'O nome do usuário é obrigatório'],
      trim: true,
      minlength: [2, 'O nome deve ter pelo menos 2 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Por favor, forneça um endereço de e-mail válido',
      ],
    },
    password: {
      type: String,
      required: [true, 'A senha é obrigatória'],
      minlength: [6, 'A senha deve conter no mínimo 6 caracteres'],
      select: false, // Ocultar por padrão nas consultas
    },
    role: {
      type: String,
      enum: ['librarian', 'admin'],
      default: 'librarian',
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

// Prevenir recompilação do modelo durante o Fast Refresh do Next.js
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
