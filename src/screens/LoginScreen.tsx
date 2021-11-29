import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { BASE_DOMAIN } from "../utils/constants";
import { spotifyApi } from "../utils/spotify";

const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = "http://localhost:3000/";
const clientId = "837b8e1354924265a6fbb1b73fd2acc3";

const scopes = ["streaming", "user-read-email", "user-read-private"];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20",
)}`;

const ScreenBeforeLogin = () => {
  return (
    <div>
      <img
        src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
        alt="Spotify-Logo"
      />
      <a href={loginUrl}>LOGIN WITH SPOTIFY</a>
    </div>
  );
};

const ScreenAfterLogin: React.FC<{ code: string }> = ({ code }) => {
  const [redirect, setRedirect] = useState(false);

  const func = async () => {
    try {
      const resp = await axios.post(BASE_DOMAIN + "/auth/login", { code });
      localStorage.setItem("music_token", resp.data.token);
      spotifyApi.setAccessToken(resp.data.token);
      console.log(resp);
      setRedirect(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    func();
  }, []);

  if (redirect) return <Navigate to="/join" />;
  return null;
};

const LoginScreen = () => {
  const code = new URLSearchParams(window.location.search).get("code");
  return code ? <ScreenAfterLogin code={code} /> : <ScreenBeforeLogin />;
};

export default LoginScreen;
