import { Schema, model, Document, PopulatedDoc, Model } from "mongoose";
import { IUser } from "./user.model";

export interface ISubscription {
  subscriber: PopulatedDoc<IUser & Document["_id"]>;
  channel: PopulatedDoc<IUser & Document["_id"]>;
}

export interface SubscriptionDocument extends Document, ISubscription {}

export interface SubscriptionModel extends Model<SubscriptionDocument> {}

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Subscription: SubscriptionModel = model<
  SubscriptionDocument,
  SubscriptionModel
>("Subscription", subscriptionSchema);
