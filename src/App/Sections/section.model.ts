import { Schema, model, models, Document, Model } from 'mongoose';
import getModelName from '@utils/getModelName';

export type SectionDocument = Document & {
  name: string;
};

type SectionModel = Model<SectionDocument>;

const { pluralName, singularName } = getModelName('section');

const sectionSchema = new Schema<SectionDocument>(
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

sectionSchema.virtual('subsections', {
  ref: 'subsections',
  localField: '_id',
  foreignField: 'section',
});

sectionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export default (models[singularName] as SectionModel) ||
  model<SectionDocument, SectionModel>(pluralName, sectionSchema);
