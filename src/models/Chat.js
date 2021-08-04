import mongoose from 'mongoose';

const ChatSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    members: {
      // { userId, rep, ouro, prata, bronze }
      type: mongoose.Mixed,
      required: true,
    },
  },
  {
    collection: 'Chat',
  },
);

let ChatModel = mongoose.model('Chat', ChatSchema);

ChatModel.findById = (id) => {
  return ChatModel.findOne({ id });
};

ChatModel.save = (chatToSave) => {
  return chatToSave.save();
};

ChatModel.getReputationRanking = (chatId) => {
  return ChatModel.find({ $query: { id: chatId }, $sort: { "members.reputation": -1 } });
};

ChatModel.findMemberIndex = async (chatId, memberId) => {
  const foundIndex = await ChatModel.aggregate([
    {
      "$match":{
        "id": {
          "$eq": chatId.toString(),
        }
      }
    },
    {
      "$project": {
        index: { $indexOfArray: [ "$members.userId", memberId ] }
      }
    }
  ]);

  console.log(foundIndex);

  if (!foundIndex[0] || foundIndex[0].index === -1) {
    return null
  }

  return foundIndex[0].index;
};

export default ChatModel;