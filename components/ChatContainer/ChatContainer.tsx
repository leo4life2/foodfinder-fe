import React from "react";
import UserMessage from "./UserMessage/UserMessage";
import AIMessage from "./AIMessage/AIMessage";
import "./ChatContainer.css";

interface ChatContainerProps {
  messages: any[];
  foodInfoList: any[];
}

function ChatContainer({ messages, foodInfoList }: ChatContainerProps) {
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container" ref={chatContainerRef}>
      {messages.map((message, index) => {
        if (typeof message === "string") {
          return <UserMessage message={message} key={index} />;
        } else {
          return <AIMessage message={message} foodInfoList={foodInfoList} key={index} />;
        }
      })}
    </div>
  );
}

export default ChatContainer;
