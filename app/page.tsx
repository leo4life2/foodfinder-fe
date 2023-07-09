"use client";

import Logo from "@/components/Logo/Logo";
import AddressBar from "@/components/AddressBar/AddressBar";
import ChatContainer from "@/components/ChatContainer/ChatContainer";
import TextBar from "@/components/TextBar/TextBar";
import { Message } from "@/components/ChatContainer/AIMessage/AIMessage";
import Image from "next/image";
import { useState } from "react";
import "./page.css";

export default function Home() {
  const [messages, setMessages] = useState([] as any[]);
  const [address, setAddress] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [foodInfoObject, setFoodInfoObject] = useState({} as any);

  const handleReload = () => {
    setMessages([]);
    setSystemPrompt("");
    setFoodInfoObject({});
  };

  const getRequestBody = (userInput: string) => {
    if (systemPrompt === "") {
      // If there is no system prompt, then this is the first message
      return {
        address: address,
        is_first: true,
        messages: [
          {
            role: "user",
            content: userInput
          },
        ],
      }; 
    } else {
      let bodyMessages = [];
      bodyMessages.push({
        role: "system",
        content: systemPrompt
      });
      // Loop through messages, and elements that are strings are user messages, and elements that are objects are AI messages.
      for (let i = 0; i < messages.length; i++) {
        if (typeof messages[i] === "string") {
          bodyMessages.push({
            role: "user",
            content: messages[i]
          });
        } else {
          bodyMessages.push({
            role: "ai",
            content: messages[i].text
          });
        }
      }

      bodyMessages.push({
        role: "user",
        content: userInput
      });

      return {
        address: address,
        is_first: false,
        messages: bodyMessages
      };
    }
  }
        

  const handleSend = async (inputText: string) => {
    if (inputText === "") {
      alert("Please enter a message");
      return;
    }
    if (address === "") {
      alert("Please enter an address");
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      inputText
    ]);

    try {
      const requestBody = getRequestBody(inputText);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "loading",
        },
      ]);
  
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      if (data.system_prompt) {
        setSystemPrompt(data.system_prompt);
      }
      if (data.food_info) {
        setFoodInfoObject(data.food_info);
      }

      setMessages((prevMessages) => [
        ...prevMessages.slice(0, prevMessages.length - 1), // Select all but the last message
        {
          type: "text",
          text: data.response
        },
      ]);
  
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  };

  return (
    <div className="home-container">
      <div className="top-container">
        <Logo />
        <AddressBar setAddress={setAddress} />
      </div>
      <ChatContainer messages={messages} foodInfoList={foodInfoObject} />
      <div className="bottom-container">
        <button onClick={handleReload}>
          <Image src="/reload.svg" alt="refresh" width={50} height={50} />
        </button>
        <TextBar handleClick={handleSend} />
      </div>
    </div>
  );
}