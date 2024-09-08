import { Schema, model, models, Document, Model } from 'mongoose';

export type RoleDocument = Document & {
  name: string;
};

type RoleModel = Model<RoleDocument>;

export const roleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      enum: ['admin', 'usuario'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

roleSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export default models.Role || model<RoleModel>('Role', roleSchema);
