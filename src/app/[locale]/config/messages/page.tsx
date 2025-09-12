import Breadcrumbs from "@/components/shared/BreadCrumbs";
import MessageInfo from "@/components/shared/profile/Messagesinfo";
import { getMessages } from "@/lib/actions/toysAction";

const MessagesPage = async () => {
  const messages = await getMessages();
  
  console.log(messages);

  return (
    <div>
      <div className="px-5 py-3 md:hidden ">
        <Breadcrumbs />
      </div>
      <MessageInfo />
    </div>
  );

}
export default MessagesPage