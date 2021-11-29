import SpotifyWebApi from "spotify-web-api-node";

const credentials = {
  clientId: import.meta.env.CLIENT_ID as string | undefined,
  clientSecret: import.meta.env.CLIENT_SECRET as string | undefined,
  redirectUri: import.meta.env.REDIRECT_URI as string | undefined,
};

export const spotifyApi = new SpotifyWebApi(credentials);
