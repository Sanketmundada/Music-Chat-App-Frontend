import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router";
import { io } from "socket.io-client";
import Message from "../../components/message/Message";
import { SocketContext } from "../../context";
import { SocketType } from "../../context/types";
import { UserContext } from "../../context/user";
import { BASE_DOMAIN } from "../../utils/constants";
import { spotifyApi } from "../../utils/spotify";
import styles from "./Chat.module.css";

const ChatScreen = () => {
  const { setSocket } = useContext(SocketContext);
  const { setDetails, display_name, email } = useContext(UserContext);
  const socketRef = useRef<SocketType>(null);
  const [participants, setParticipants] = useState([]);
  const params = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);

  const [search, setSearch] = useState("");
  const [songState, setSongState] = useState({
    uri: "",
    title: "",
  });

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("music_token"))
      spotifyApi.setAccessToken(localStorage.getItem("music_token")!);
    (async () => {
      try {
        const resp = await spotifyApi.getMe();
        const { email, display_name } = resp.body;
        //console.log(resp);
        setDetails(email, display_name || "");
      } catch (error) {
        //console.log("object");
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (display_name && email) {
      socketRef.current = io(BASE_DOMAIN, { transports: ["websocket"] });
      setSocket(socketRef);
      socketRef.current?.emit(
        "join",
        {
          username: display_name,
          room: params.room,
        },
        (error: string) => {
          if (error) {
            console.log(error);
            alert(error);
          }
        },
      );
      socketRef?.current?.on("alert", ({ message, participants }) => {
        console.log(message);
        alert(message);
        setParticipants(participants);
      });

      return () => {
        socketRef?.current?.emit("disc", () => {
          socketRef.current?.disconnect();
        });
      };
    }
  }, [display_name, email]);

  useEffect(() => {
    socketRef.current?.on("message", (message) => {
      console.log(message);
      setMessages((messages: any) => [...messages, message]);
    });
  }, [socketRef.current]);

  const sendMessage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    socketRef.current?.emit("sendMessage", { message, type: "text" }, () =>
      setMessage(""),
    );
  };

  useEffect(() => {
    (async () => {
      const res = await spotifyApi.searchTracks(search);
      setSongState({
        title: res.body.tracks?.items[0].name!,
        uri: res.body.tracks?.items[0].preview_url!,
      });
    })();
  }, [search]);

  const SendMusic = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    socketRef.current?.emit(
      "sendMessage",
      { message: songState, type: "music" },
      () => setSongState({ title: "", uri: "" }),
    );
  };

  const LeaveRoom = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    socketRef?.current?.emit("disc", () => {
      socketRef.current?.disconnect();
    });
    setRedirect(true);
    console.log("object");
  };

  if (redirect) return <Navigate to="/join" />;

  return (
    <div className={styles.root}>
      <div className={styles.mainChat}>
        <div className={styles.msgs}>
          {messages.map((item: any, i: number) => {
            return (
              <div
                className={`${styles.wrapper} ${
                  item.user === display_name ? styles.right : styles.left
                }`}
              >
                <Message item={item} i={i} />
              </div>
            );
          })}
        </div>
        <div className={styles.bottomBar}>
          <div className={styles.section}>
            <input
              type="text"
              value={search}
              placeholder="Search Music"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <button onClick={SendMusic}>Send Music</button>
          </div>
          <div className={styles.section}>
            <input
              type="text"
              value={message}
              placeholder="Enter a message..."
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
      <div className={styles.sidebar}>
        {participants.map((item: any, i) => {
          return (
            <div className={styles.participant} key={i}>
              {item.username}
              {item.username === display_name && <span>(You)</span>}
              {item.username === display_name && (
                <button onClick={LeaveRoom}>Leave</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatScreen;
