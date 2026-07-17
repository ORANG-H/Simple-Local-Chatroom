import { useState, type ChangeEvent } from "react";

function TextField({ Name, onSendMessage, onTypingChange }: { Name: string; onSendMessage: (text: string) => void; onTypingChange: (isTyping: boolean) => void }) {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    const trimmedText = inputText.trim();
    if (trimmedText === "") return;

    onSendMessage(trimmedText);
    setInputText("");
    onTypingChange(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    onTypingChange(value.trim().length > 0);
  };

  return (
    <div className="input-group mb-0">
        <button className="bg-info btn" onClick={handleSend} type="button">
          <span className="input-group-text bg-info border-0 btn">✏️</span>
        </button>

        <div className="form-floating flex-grow-1">
          <input
            type="text"
            className="form-control"
            id="floatingInputGroup1"
            placeholder="Username"
            value={inputText}
            onChange={handleChange}
            onBlur={() => onTypingChange(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <label htmlFor="floatingInputGroup1">{Name}</label>
        </div>
      </div>
  );
}

export default TextField;