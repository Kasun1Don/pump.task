import {
  getModelForClass,
  index,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({ schemaOptions: { collection: "twoFacAuth", timestamps: true } })
@index({ createdAt: 1 }, { expireAfterSeconds: 900 })
export class TwoFactorAuthClass extends TimeStamps {
  @prop({ type: String, required: true })
  public walletId?: string;

  @prop({ type: String, required: true })
  public code?: string;
}

export const TwoFactorAuth =
  (mongoose.models.TwoFactorAuthClass as
    | ReturnModelType<typeof TwoFactorAuthClass>
    | undefined) ?? getModelForClass(TwoFactorAuthClass);
