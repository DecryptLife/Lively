import { useEffect, useState } from "react";

const AddFriend = ({ handleFollowers }) => {
  const url = (path) => `http://localhost:3001${path}`;
  const cookie = JSON.parse(localStorage.getItem("cookie"));
  const [isEmpty, setIsEmpty] = useState(null);
  const [invalidUser, setInvalidUser] = useState(null);

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    fetch(url("/avatar"), {
      method: "GET",
      credentials: "include",
      withCredentials: true,
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const avatar = res.avatar;
        setAvatar(avatar.url);
      });
  }, [avatar]);

  const [newFriend, setNewFriend] = useState("");
  const [followingList, setFollowingList] = useState("");

  useEffect(() => {
    fetch(url("/following"), {
      method: "GET",
      credentials: "include",
      withCredentials: true,
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const userFollowers = res.following;

        if (userFollowers.length > 0) {
          setFollowingList(userFollowers);
        }
      });
  }, []);
  const req = [
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

  const handleUnfollow = (username) => {
    fetch(url(`/following/${username}`), {
      method: "DELETE",
      credentials: "include",
      withCredentials: true,
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const new_followers = res.following;
        setFollowingList(new_followers);
        handleFollowers(new_followers);
      });
  };

  useEffect(() => {
    var count = 0;
    let friendList = [];

    if (followingList !== [] || followingList !== undefined) {
      fetch(url("/followersDetails"), {
        method: "GET",
        credentials: "include",
        withCredentials: true,
        headers: { "Content-Type": "application/json", Cookie: cookie },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          const followerDetails = res.followers;
          followerDetails.forEach((friend) => {
            friendList.push(
              <div className="friend1" key={friend["username"]}>
                <img
                  className="searchImage2"
                  src={avatar !== "" ? avatar : req[1]}
                ></img>
                <br></br>
                <span className="friendName">{friend["username"]}</span>
                <br></br>
                <span>{friend["headline"]}</span>
                <br></br>
                <button
                  className="ufBtns"
                  data-testid={"unfollow_button_" + count.toString()}
                  onClick={() => handleUnfollow(friend["username"])}
                >
                  Unfollow
                </button>
              </div>
            );
            count++;
          });
          setFriends(friendList);
        });
    }
  }, [followingList]);

  const [friends, setFriends] = useState(null);

  const addNewFriend = (e) => {
    fetch(url(`/following/${newFriend}`), {
      method: "PUT",
      credentials: "include",
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setFollowingList(res.following);
        handleFollowers(res.following);
        setNewFriend("");
      });
  };

  return (
    <div className="AddFriendLayout">
      <h3>Follow users</h3>
      <div className="topSearchFriends">
        {followingList.length > 0 ? friends : <h3>Not following any user</h3>}
        <div className="searchForFriends">
          <input
            className="followFriendsEt"
            type="text"
            data-testid="addFriendField"
            placeholder="Add a friend "
            value={newFriend}
            onChange={(e) => setNewFriend(e.target.value)}
          ></input>

          <button className="addFriendBtn" onClick={(e) => addNewFriend(e)}>
            Add
          </button>
          <br></br>
          {isEmpty && (
            <span className="redText">Can't add a nameless friend</span>
          )}

          {invalidUser && <span className="redText">Not an existing user</span>}
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
