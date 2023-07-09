import React from "react";
import "./UserMessage.css";
import Image from "next/image";

interface UserMessageProps {
  message: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <div className="user-message-container">
      <div className="user-text-and-icon">
        <div className="user-textbox">
          <p className="user-text">{message}</p>
        </div>
        <Image src="/user_icon.svg" alt="user" width={39} height={39} />
      </div>
    </div>
  );
};

export default UserMessage;
