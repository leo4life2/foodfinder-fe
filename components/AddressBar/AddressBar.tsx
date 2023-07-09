import React, { ChangeEvent } from "react";
import "./AddressBar.css";
import Image from "next/image";

interface AddressBarProps {
  setAddress: (address: string) => void;
}

function AddressBar({ setAddress }: AddressBarProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  return (
    <div className="address-bar">
      <Image
        src="/pin.svg"
        alt="Location Pin"
        className="pin-icon"
        width={16}
        height={23}
      />
      <input 
        type="text" 
        className="location-input" 
        placeholder="Your Address" 
        onChange={handleInputChange}
      />
    </div>
  );
}

export default AddressBar;
