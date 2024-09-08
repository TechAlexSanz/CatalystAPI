import { Schema, model, models, Document, Model } from 'mongoose';
import getModelName from '@utils/getModelName';

export type SubSectionDocument = Document & {
  name: string;

  section: Schema.Types.ObjectId;
};

type SubSectionModel = Model<SubSectionDocument>;

const { pluralName, singularName } = getModelName('subsection');

const subSectionSchema = new Schema<SubSectionDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    section: {
      type: Schema.Types.ObjectId,
      ref: 'sections',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

subSectionSchema.virtual('students', {
  ref: 'students',
  localField: '_id',
  foreignField: 'subsection',
});

subSectionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export default (models[singularName] as SubSectionModel) ||
  model<SubSectionDocument, SubSectionModel>(pluralName, subSectionSchema);
