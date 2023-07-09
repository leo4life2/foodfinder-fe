import React from 'react'
import './TextBar.css'
import Image from 'next/image'

interface TextBarProps {
  handleClick: (inputText: string) => void;
}

const TextBar: React.FC<TextBarProps> = ({ handleClick }) => {
  const [inputText, setInputText] = React.useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleButtonClick = () => {
    handleClick(inputText);
    setInputText('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleButtonClick();
    }
  };

  return (
    <div className='text-bar'>
      <input 
        type="text" 
        className="user-input" 
        placeholder="What's your food mood today?" 
        onChange={handleInputChange} 
        onKeyDown={handleKeyDown} 
        value={inputText} 
      />
      <button onClick={handleButtonClick} className="image-button">
        <Image
          src="/send.svg"
          alt="Send Icon"
          className="send-icon"
          width={20}
          height={20}
        />
      </button>
    </div>
  )
}

export default TextBar;
