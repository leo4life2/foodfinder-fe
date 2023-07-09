import React, { useEffect, useState } from "react";
import "./AIMessage.css";
import DishSection from "./DIshSection/DishSection";
import Image from "next/image";

interface Loading {
  type: "loading";
}

interface RegularText {
  type: "text";
  text: string;
  bold?: [number, number][];
}

type ParsedSection = RegularText | DishSectionProps;
export interface Parsed {
  type: "parsed";
  sections: ParsedSection[];
}
export interface DishSectionProps {
  type: "dish";
  dish_name: string;
  dish_link: string;
  description: string;
  price?: string;
  rating?: string;
  reviews_link?: string;
  image_link?: string;
}

export type Message = Loading | RegularText | Parsed;

interface AIMessageProps {
  message: Message;
  foodInfoList: any[];
}

const AIMessage: React.FC<AIMessageProps> = ({ message, foodInfoList }) => {
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    if (
      message.type === "text" &&
      message.text.includes("Dish:") &&
      message.text.includes("Restaurant:")
    ) {
      const parsedSections = parseText(message.text, foodInfoList);

      setDisplayMessage({
        type: "parsed",
        sections: parsedSections,
      });
    } else {
      setDisplayMessage(message);
    }
  }, [message, foodInfoList]);

  let messageContent;
  if (displayMessage.type === "text") {
    messageContent = (
      <p className="ai-text whitespace-break-spaces">{displayMessage.text}</p>
    );
  } else if (displayMessage.type === "loading") {
    messageContent = (
      <div className="flex justify-center items-center">
        <div className="grid gap-2">
          <div className="flex items-center justify-center space-x-2 animate-pulse">
            <div className="w-2 h-2 bg-[#ff6666] rounded-full"></div>
            <div className="w-2 h-2 bg-[#ff6666] rounded-full"></div>
            <div className="w-2 h-2 bg-[#ff6666] rounded-full"></div>
          </div>
        </div>
      </div>
    );
  } else if (displayMessage.type === "parsed") {
    messageContent = displayMessage.sections.map((section, index) =>
      section.type === "text" ? (
        <p className="ai-text" key={index}>
          {section.bold
            ? section.bold.map(([start, end], i) => (
                <React.Fragment key={i}>
                  {section.text.slice(0, start)}
                  <strong>{section.text.slice(start, end)}</strong>
                  {section.text.slice(end)}
                </React.Fragment>
              ))
            : section.text}
        </p>
      ) : (
        <DishSection key={index} {...section} />
      )
    );
  }

  return (
    <div className="ai-message-container">
      <div className="ai-text-and-icon">
        <Image src="/ai_icon.svg" alt="ai" width={39} height={39} />
        <div className="ai-textbox h-full justify-center">{messageContent}</div>
      </div>
    </div>
  );
};

function parseText(text: string, foodInfoList: any[]): ParsedSection[] {
  const lines = text.split("\n");
  const result: ParsedSection[] = [];
  let currRestaurant: string | null = null;
  let currRestaurantObj: any = null;
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.includes("Restaurant:")) {
      const restaurantName = trimmedLine
        .split("Restaurant:")[1]
        .trim()
        .toLowerCase();
      if (currRestaurant === restaurantName) return; // If the restaurant is the same as the previous line, don't do anything (this is to prevent duplicate restaurant names
      currRestaurant = restaurantName;
      const restaurantObj = foodInfoList.find(
        (obj) => obj.name.trim().toLowerCase() === restaurantName
      );
      if (restaurantObj) {
        currRestaurantObj = restaurantObj;
      }
      const lineToPush = `Restaurant:${line.split("Restaurant:")[1]}`;
      result.push({
        type: "text",
        text: lineToPush,
        bold: [[0, 11]], // The word "Restaurant:" is from index 0 to index 11
      });
    } else if (trimmedLine.includes("Dish:") && currRestaurantObj) {
      const dishName = trimmedLine.split("Dish:")[1].trim().toLowerCase();
      let foundDish = null;
      Object.keys(currRestaurantObj.menu).forEach((category) => {
        const dish = currRestaurantObj.menu[category].find(
          (d: any) => d.title.trim().toLowerCase() === dishName
        );
        if (dish) foundDish = dish;
      });
      if (foundDish) {
        const dishObject: DishSectionProps = {
          type: "dish",
          dish_name: foundDish.title,
          dish_link: foundDish.link || "",
          description: foundDish.description || "",
          price: foundDish.price || "",
          image_link: foundDish.img_url || "",
        };
        result.push(dishObject);
      } else {
        result.push({ type: "text", text: line });
      }
    } else if (trimmedLine.includes("Description:") && currRestaurantObj) {
      return; // Included in the obj already
    } else {
      result.push({ type: "text", text: line });
    }
  });
  return result;
}

export default AIMessage;
