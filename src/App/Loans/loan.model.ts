import { Schema, model, models, Document, Model } from 'mongoose';
import getModelName from '@utils/getModelName';

export type LoanDocument = Document & {
  student: Schema.Types.ObjectId;
  book: Schema.Types.ObjectId;
  quantity: number;
  loanDate: Date;
  expectReturnDate: Date;
  returnDate: Date;
  isConfirmed: boolean;
  isReturned: boolean;
  isRejected: boolean;
  isCancelled: boolean;
  rejectionReason: string;
};

type loanModel = Model<LoanDocument>;

const { pluralName, singularName } = getModelName('loan');

const loanSchema = new Schema<LoanDocument>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'students',
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'books',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    loanDate: {
      type: Date,
      required: true,
    },
    expectReturnDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isReturned: {
      type: Boolean,
    },
    isRejected: {
      type: Boolean,
    },
    isCancelled: {
      type: Boolean,
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

loanSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export default (models[singularName] as loanModel) ||
  model<LoanDocument, loanModel>(pluralName, loanSchema);
