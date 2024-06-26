const GoogleLogin = () => {
  const url = (path) => `http://127.0.0.1:3001${path}`;

  fetch(url("/auth/google"), {
    method: "GET",
    // body: JSON.stringify({
    //   token: googleData.tokenId,
    // }),
    sameSite: "none",
    mode: "no-cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return <div></div>;
};

export default GoogleLogin;
