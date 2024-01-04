import { Schema, model } from 'mongoose';
import { Embarcador } from '@Interfaces/IEmbarcador';

const embarcadorSchema = new Schema<Embarcador>({
  cpfCnpj: { type: String, required: true },
  nome: { type: String, required: true },
});

const EmbarcadorModel = model<Embarcador>('embarcadores', embarcadorSchema);

export default EmbarcadorModel;
