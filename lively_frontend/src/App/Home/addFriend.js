import { useEffect, useState } from "react";
import axios from "axios";
const AddFriend = ({ handleFollowers }) => {
  const url = (path) => `http://localhost:3001${path}`;
  const cookie = JSON.parse(localStorage.getItem("cookie"));
  const [isEmpty, setIsEmpty] = useState(null);
  const [invalidUser, setInvalidUser] = useState(null);

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    async function getAvatar() {
      const response = await axios.get(url("/avatar"), {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setAvatar(response.data.avatar.url);
    }

    getAvatar();
  }, [avatar]);

  const [newFriend, setNewFriend] = useState("");
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    async function getAvatar() {
      const response = await axios.get(url("/following"), {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      const userFollowers = response.data.following;

      if (userFollowers.length > 0) {
        setFollowingList(userFollowers);
      }
    }

    getAvatar();
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

  const handleUnfollow = async (username) => {
    console.log("To unfollow: ", username);
    const response = await axios.delete(url(`/following/${username}`), {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    const new_followers = response.data.following;
    setFollowingList(new_followers);
    handleFollowers(new_followers);
  };

  useEffect(() => {
    let count = 0;
    let friendList = [];

    async function getFollowerDetails() {
      const response = await axios.get(url("/followersDetails"), {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      console.log("Followers: ", response.data);
      const followerDetails = response.data.followers;
      console.log("Follower Details: ", followerDetails);
      followerDetails.forEach((friend) => {
        friendList.push(
          <div className="friend1" key={friend["username"]}>
            <img
              className="searchImage2"
              src={friend["avatar"] !== "" ? friend["avatar"] : req[1]}
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
    }
    getFollowerDetails();
  }, []);

  const [friends, setFriends] = useState(null);

  const addNewFriend = async (e) => {
    const response = await axios.put(
      url(`/following/${newFriend}`),
      {},
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );

    setFollowingList(response.data.following);
    handleFollowers(response.data.following);
    setNewFriend("");
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
