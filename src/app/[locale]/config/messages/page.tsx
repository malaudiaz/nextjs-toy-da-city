import MessageInfo from "@/components/shared/profile/Messagesinfo";
import { getMessages } from "@/lib/actions/toysAction";
import Breadcrumbs from "@/components/shared/BreadCrumbs";

const MessagesPage = async () => {
  const messages = await getMessages(); 

  return (
    <div>
      <div className="px-5 py-3 md:hidden ">
        <Breadcrumbs />
      </div>
      <MessageInfo messages={messages} />
    </div>
  );

}
export default MessagesPage