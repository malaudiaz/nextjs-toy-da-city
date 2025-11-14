import MessageInfo from "@/components/shared/profile/Messagesinfo";
import TitleBreakcrumbs from "@/components/shared/TitleBreakcrum";
import { getMessages } from "@/lib/actions/toysAction";

const MessagesPage = async () => {
  const messages = await getMessages();

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
          <TitleBreakcrumbs translationScope="messages" />
      </div>
      <MessageInfo messages={messages} />
    </div>
  );
};
export default MessagesPage;
