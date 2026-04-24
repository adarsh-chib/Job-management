import prisma from "../configs/prisma"

interface ConversationItem {
  user: {
    id: string;
    fullName: string;
    Profile: { avatar: string | null } | null;
  };
  lastMessage: {
    id: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
    senderId: string;
  };
}

export const sendMessageService = async(
    senderId : string,
    receiverId : string,
    content : string,
)=>{
   
    const message = await prisma.message.create({
        data : {
            content,
            senderId,
            receiverId,
        }
    })
    return message
}

export const getChatHistoryService = async (userId: string, otherUserId: string) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return messages;
};

export const getUserConversationsService = async (userId: string) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    },
    include: {
      sender: { select: { id: true, fullName: true, Profile: { select: { avatar: true } } } },
      receiver: { select: { id: true, fullName: true, Profile: { select: { avatar: true } } } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const seenUsers = new Set();
  const conversations: ConversationItem[] = [];

  for (const msg of messages) {
    const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
    
    if (!seenUsers.has(otherUser.id)) {
      seenUsers.add(otherUser.id);
      conversations.push({
        user: otherUser,
        lastMessage: {
          id: msg.id,
          content: msg.content,
          createdAt: msg.createdAt,
          isRead: msg.isRead,
          senderId: msg.senderId
        }
      });
    }
  }

  return conversations;
};