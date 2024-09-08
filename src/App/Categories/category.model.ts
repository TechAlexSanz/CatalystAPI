import { Schema, model, models, Document, Model } from 'mongoose';
import getModelName from '@utils/getModelName';

export type CategoryDocument = Document & {
  name: string;
};

type CategoryModel = Model<CategoryDocument>;

const { pluralName, singularName } = getModelName('category');

const categorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

categorySchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export default (models[singularName] as CategoryModel) ||
  model<CategoryDocument, CategoryModel>(pluralName, categorySchema);
