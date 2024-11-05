import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: "badges",
  },
})
export class BadgeClass {
  @prop({ required: true })
  public index: number;

  @prop({ required: true, default: () => new mongoose.Types.ObjectId() })
  public id: mongoose.Types.ObjectId;

  @prop({ required: true })
  public NFTTitle: string;

  @prop({ type: Date, required: true })
  public receivedDate: Date;

  @prop({ type: String, required: true })
  public walletId: string;

  @prop({ type: String, required: false })
  public transactionHash?: string;

  @prop({ type: String, required: false })
  public taskId?: string;

  constructor(index: number, NFTTitle: string, receivedDate: Date) {
    this.index = index;
    this.NFTTitle = NFTTitle;
    this.id = new mongoose.Types.ObjectId();
    this.receivedDate = receivedDate;
    this.walletId = "";
  }
}

// Create the badge model
export const Badge =
  (mongoose.models.BadgeClass as
    | ReturnModelType<typeof BadgeClass>
    | undefined) ?? getModelForClass(BadgeClass);
