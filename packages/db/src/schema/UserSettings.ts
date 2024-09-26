import { prop } from "@typegoose/typegoose";

export class UserSettingsClass {
  @prop({ default: "English" })
  public language?: string;

  @prop({ default: true })
  public isThemeDark?: boolean;

  @prop({ default: false })
  public twoFactorAuth?: boolean;

  @prop()
  public notificationEmail?: string;

  @prop({ default: true })
  public dueDate?: boolean;

  @prop({ default: true })
  public comments?: boolean;

  @prop({ default: true })
  public assignedToCard?: boolean;

  @prop({ default: true })
  public removedFromCard?: boolean;

  @prop({ default: true })
  public changeCardStatus?: boolean;

  @prop({ default: true })
  public newBadge?: boolean;
}
