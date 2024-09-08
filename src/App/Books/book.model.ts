import { Schema, model, models, Document, Model } from 'mongoose';
import getModelName from '@utils/getModelName';

export type BookDocument = Document & {
  title: string;
  description?: string;
  author: string;
  publisher?: string;
  quantity: number;
  coverImage?: string;
  categories: Schema.Types.ObjectId[];
  status: string;
};

type BookModel = Model<BookDocument>;

const { pluralName, singularName } = getModelName('book');

const bookSchema = new Schema<BookDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'categories',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'deleted'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

bookSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export default (models[singularName] as BookModel) ||
  model<BookDocument, BookModel>(pluralName, bookSchema);
