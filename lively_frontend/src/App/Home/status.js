import { useEffect, useState } from "react";
const Status = ({ handleLogout, goToProfile }) => {
  const url = (path) => `http://localhost:3001${path}`;

  const cookie = JSON.parse(localStorage.getItem("cookie"));
  const currUser = JSON.parse(localStorage.getItem("currUser"));

  // let userStatus = currUser["headline"];
  const [avatar, setAvatar] = useState("");
  const [status, setUStatus] = useState("");
  const [modStatus, setModStatus] = useState("");

  useEffect(() => {
    fetch(url("/avatar"), {
      method: "GET",
      credentials: "include",
      mode: "cors",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        setAvatar(res.avatar);
      });
  });
  useEffect(() => {
    fetch(url("/headline"), {
      method: "GET",
      credentials: "include",
      mode: "cors",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        Cookie: cookie,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setModStatus(res.headline);
      });
  }, [status]);

  var req = [
    require("../images/img1.png"),
    require("../images/img2.png"),
    require("../images/img3.png"),
    require("../images/img4.png"),
    require("../images/img5.png"),
    require("../images/img6.png"),
    require("../images/img7.png"),
    require("../images/img8.png"),
    require("../images/img9.png"),
    require("../images/img10.png"),
  ];

  const updateStatus = (e) => {
    if (status !== "") {
      var new_status = { headline: status };
      fetch(url("/headline"), {
        method: "PUT",
        credentials: "include",
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        body: JSON.stringify(new_status),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log("U: ", res);
          setModStatus(res.headline);
          setUStatus("");
        });
    }
  };

  return (
    <div className="homeProfile">
      <img
        className="homeImg"
        id="user_image"
        alt="profile pic"
        src={avatar !== "" ? avatar : req[1]}
      ></img>
      <br></br>
      <span className="statusUsername">{currUser["username"]}</span>
      <br></br>
      <div className="userCatchPhrase">
        <span className="statusStatus">{modStatus}</span>
      </div>

      <br></br>
      <div className="newStatusContainer">
        <input
          type="text"
          className="changeStatus"
          placeholder="New status"
          onChange={(e) => setUStatus(e.target.value)}
          value={status}
        />
        <button className="updateStatusBtn" onClick={(e) => updateStatus(e)}>
          Update
        </button>
      </div>

      <div className="btnContainer">
        <button className="logoutBtn" onClick={() => handleLogout()}>
          Logout
        </button>
        <button className="profileBtn" onClick={() => goToProfile()}>
          Profile
        </button>
      </div>
    </div>
  );
};

export default Status;
