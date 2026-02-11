const Conversation = require("../models/Conversation");
const { generateContent, generateTitle } = require("../service/geminiService");


exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};


exports.newConversation = async (req, res, next) => {
  try {
    const { prompt, model } = req.body;

    const content = await generateContent(prompt, model);

    const messages = [
      { role: "user", content: prompt },
      { role: "assistant", content: content }
    ];

    const title = await generateTitle(messages);

    const conversation = new Conversation({
      title: title,
      model: model,
      messages: messages
    });

    await conversation.save();

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Failed to create conversation" });
  }
};

exports.newMessage = async (req, res, next) => {
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

    conversation.messages.push({ role: "user", content: prompt });
    conversation.messages.push({ role: "assistant", content });

    await conversation.save();

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Failed to add message" });
  }
};

exports.deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Conversation.findByIdAndDelete(id);

    res.status(204).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete conversation" });
  }
};