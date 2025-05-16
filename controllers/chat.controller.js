import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import mongoose from 'mongoose';

// ✅ Get all chats for a user
export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await Chat.find({
      userIDs: tokenUserId, // matches if tokenUserId is in the array
    }).sort({ createdAt: -1 });

    // Add receiver data to each chat
    const chatWithReceiver = await Promise.all(
      chats.map(async (chat) => {
        const receiverId = chat.userIDs.find(
          (id) => id.toString() !== tokenUserId
        );

        const receiver = await User.findById(receiverId).select('id username avatar');
        return { ...chat.toObject(), receiver };
      })
    );

    res.status(200).json(chatWithReceiver);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to get chats!' });
  }
};

// ✅ Get single chat with messages
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      userIDs: tokenUserId,
    }).populate({
      path: 'messages',
      options: { sort: { createdAt: 1 } },
    });

    if (!chat) return res.status(404).json({ message: 'Chat not found!' });

    // Update seenBy
    if (!chat.seenBy.includes(tokenUserId)) {
      chat.seenBy.push(tokenUserId);
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to get chat!' });
  }
};

// ✅ Create a new chat
export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const receiverId = req.body.receiverId;

  try {
    const newChat = await Chat.create({
      userIDs: [tokenUserId, receiverId],
    });

    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to add chat!' });
  }
};

// ✅ Mark chat as read (update seenBy)
export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  try {
    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        userIDs: tokenUserId,
      },
      {
        seenBy: [tokenUserId],
      },
      { new: true }
    );

    if (!chat) return res.status(404).json({ message: 'Chat not found!' });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to read chat!' });
  }
};
