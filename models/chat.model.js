import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const chatSchema = new Schema({
  userIDs: [{ type: Types.ObjectId, ref: 'User', required: true }],
  users: [{ type: Types.ObjectId, ref: 'User' }], // optional: you can populate users separately if needed
  createdAt: { type: Date, default: Date.now },
  seenBy: [{ type: Types.ObjectId, ref: 'User' }],
  messages: [{ type: Types.ObjectId, ref: 'Message' }],
  lastMessage: { type: String, default: null },
});

const Chat = model('Chat', chatSchema);
export default Chat;
