import React from "react";
import styles from "./Message.module.css";
interface Props {
  item: any;
  i: number;
}

const Message: React.FC<Props> = ({ item, i }) => {
  return item.type === "music" ? (
    <div key={i}>
      <audio controls>
        <source src={item.text.uri} />
      </audio>
      <p>{item.text.title}</p>
    </div>
  ) : (
    <div key={i}>
      <span>{item.text}</span>
    </div>
  );
};

export default Message;
