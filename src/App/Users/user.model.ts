import bcrypt from 'bcryptjs';
import { Schema, model, models, Document, Model } from 'mongoose';
import getModelName from '@utils/getModelName';
import roleModel from '../Roles/role.model';

export type UserDocument = Document & {
  code: number;
  password: string;
  role: {
    _id: string;
    name: string;
  };
};

type UserModel = Model<UserDocument> & {
  encryptPassword(password: string): Promise<string>;
  comparePassword(password: string, receivedPassword: string): Promise<boolean>;
};

const { pluralName, singularName } = getModelName('user');

const userSchema = new Schema<UserDocument>(
  {
    code: {
      type: Number,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

userSchema.statics.encryptPassword = async (
  password: string,
): Promise<string> => {
  const salt = await bcrypt.genSalt(10);

  return bcrypt.hash(password, salt);
};

userSchema.statics.comparePassword = async (
  password: string,
  receivedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, receivedPassword);
};

userSchema.pre<UserDocument>('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  const hash = await bcrypt.hash(user.password, 10);

  user.password = hash;

  next();
});

userSchema.pre<UserDocument>('save', async function (next) {
  const user = this;

  if (!user.role) {
    try {
      const role = await roleModel.findOne({ name: 'usuario' });

      if (role) {
        user.role = role._id;
      }
    } catch (err) {
      console.error(err);
    }
  }

  next();
});

export default (models[singularName] as UserModel) ||
  model<UserDocument, UserModel>(pluralName, userSchema);
