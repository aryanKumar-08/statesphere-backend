import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const messageSchema = new Schema({
  text: { type: String, required: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  chatId: { type: Types.ObjectId, ref: 'Chat', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = model('Message', messageSchema);
export default Message;
