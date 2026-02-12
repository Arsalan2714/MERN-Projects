import Conversation from "../models/Conversation.js";
import { generateContent, generateTitle } from "../service/chatgptService.js";

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

export const newConversation = async (req, res, next) => {
  try {
    const { prompt, model } = req.body;

    const content = await generateContent(prompt, model);

    const messages = [
      {
        role: "user",
        content: prompt,
        timestamp: new Date()
      },
      {
        role: "assistant",
        content: content,
        timestamp: new Date()
      }
    ];

    const title = await generateTitle(messages);

    const conversation = new Conversation({
      title,
      model,
      messages
    });

    await conversation.save();

    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: "Failed to create conversation" });
  }
};

export const newMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { prompt } = req.body;

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const content = await generateContent(
      prompt,
      conversation.model,
      conversation.messages
    );

    conversation.messages.push({
      role: "user",
      content: prompt,
      timestamp: new Date()
    });

    conversation.messages.push({
      role: "assistant",
      content,
      timestamp: new Date()
    });

    await conversation.save();

    res.json(conversation);
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Failed to add message" });
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Conversation.findByIdAndDelete(id);

    res.status(204).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete conversation" });
  }
};