// import Chat from '../models/Chat.js';
// import Message from '../models/Message.js';
import mongoose from 'mongoose';
import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js';

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
    // Validate chat and user participation
    const chat = await Chat.findOne({
      _id: chatId,
      userIDs: tokenUserId, // Ensure the user is part of the chat
    });

    if (!chat) return res.status(404).json({ message: 'Chat not found!' });

    // Create message
    const message = await Message.create({
      text,
      chatId,
      userId: tokenUserId,
    });

    // Update chat: seenBy and lastMessage
    chat.seenBy = [tokenUserId];
    chat.lastMessage = text;
    chat.messages.push(message._id); // Optional: if you want to push message to Chat.messages
    await chat.save();

    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to add message!' });
  }
};
