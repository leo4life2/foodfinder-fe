import React from "react";
import { DishSectionProps } from "../AIMessage";
import "./DishSection.css";
import Image from "next/image";

function DishSection(props: DishSectionProps) {
  return (
    <div className="dish-section">
      <div className="dish-text">
        <ul>
          <li className="dish-title">
            <a href={props.dish_link} className="dish-link">
              {props.dish_name}
            </a>
            : {props.description}
          </li>
        </ul>
        <ul>
          {props.price && <li className="dish-detail">Price: {props.price}</li>}
          {props.rating && (
            <li className="dish-detail">Rating: {props.rating}</li>
          )}
          {props.reviews_link && (
            <li className="dish-detail">
              <a href={props.reviews_link} className="dish-link">
                Reviews
              </a>
            </li>
          )}
        </ul>
      </div>
      {props.image_link && (
        <Image
          src={props.image_link}
          alt={props.dish_name}
          width={120}
          height={120}
        />
      )}
    </div>
  );
}

export default DishSection;
