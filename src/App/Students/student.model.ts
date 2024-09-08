import { Schema, model, models, Document, Model } from 'mongoose';
import getModelName from '@utils/getModelName';

export type StudentDocument = Document & {
  firstName: string;
  secondName: string;
  thirdName: string;
  firstSurname: string;
  secondSurname: string;
  numberPhone: string;
  subsection: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
};

type StudentModel = Model<StudentDocument>;

const { pluralName, singularName } = getModelName('student');

const studentSchema = new Schema<StudentDocument>(
  {
    firstName: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
    },
    thirdName: {
      type: String,
    },
    firstSurname: {
      type: String,
      required: true,
    },
    secondSurname: {
      type: String,
    },
    numberPhone: {
      type: String,
      required: true,
    },
    subsection: {
      type: Schema.Types.ObjectId,
      ref: 'subsections',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

studentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export default (models[singularName] as StudentModel) ||
  model<StudentDocument, StudentModel>(pluralName, studentSchema);
