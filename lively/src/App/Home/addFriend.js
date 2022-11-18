import { useEffect, useState } from "react";

const AddFriend = ({ followers, handleFollowers }) => {
  const currUser = JSON.parse(localStorage.getItem("currUser"));
  const users = JSON.parse(localStorage.getItem("all_users"));
  const id = currUser["id"];
  var c_id = parseInt(id);
  const [isEmpty, setIsEmpty] = useState(null);
  const [invalidUser, setInvalidUser] = useState(null);

  var newUser = "new" in currUser;
  const old_friends =
    followers.length === 0
      ? followers
      : [
          users[followers[0] - 1],
          users[followers[1] - 1],
          users[followers[2] - 1],
        ];

  const [newFriend, setNewFriend] = useState("");
  const [followingList, setFollowingList] = useState(old_friends);

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

  const coolstats = [
    "Hakuna Matata",
    "You only live once",
    "Now or never",
    "Egg or chicken? what came first",
    "Univerisities are meant for fun",
    "Now, always and forever",
    "Loving myself",
    "Life is just funny",
    "Friends is the best TV show",
    "Ice-creams are the best",
  ];

  const handleUnfollow = (username, id) => {
    setFollowingList(
      followingList.filter(function (user) {
        return user.username != username;
      })
    );

    var modfollowers = followers.filter(function (follower_id) {
      return follower_id !== id;
    });
    handleFollowers(modfollowers);

    // localStorage.setItem("friend_posts", JSON.stringify(mod_posts));
    // localStorage.setItem("trial", JSON.stringify(mod_posts));
  };

  useEffect(() => {
    var count = 0;
    let friendList = [];
    if (followingList !== [] || followingList !== undefined) {
      followingList.forEach((friend) => {
        friendList.push(
          <div className="friend1" key={friend["username"]}>
            <img className="searchImage2" src={req[friend["id"] - 1]}></img>
            <br></br>
            <span className="friendName">{friend["username"]}</span>
            <br></br>
            <span>{friend["company"]["catchPhrase"]}</span>
            <br></br>
            <button
              className="ufBtns"
              data-testid={"unfollow_button_" + count.toString()}
              onClick={() => handleUnfollow(friend["username"], friend["id"])}
            >
              Unfollow
            </button>
          </div>
        );
        count++;
      });
      setFriends(friendList);
    }
  }, [followingList]);

  const [friends, setFriends] = useState(null);

  const addNewFriend = (e) => {
    console.log("New: ", newFriend);
    if (newFriend != "") {
      console.log("curr: ", currUser["username"]);
      var newFriendDetails = users.filter(function (user) {
        return newFriend === user.username;
      });
      if (newFriendDetails[0] !== undefined) {
        var addNewFriend = newFriendDetails[0];
        setFollowingList((prevUsers) => [...prevUsers, addNewFriend]);
        setNewFriend("");
        setInvalidUser(false);
        setIsEmpty(false);

        followers === undefined || followers === []
          ? handleFollowers([addNewFriend["id"]])
          : handleFollowers(followers.concat(addNewFriend["id"]));
      } else {
        setInvalidUser(true);
      }
    } else {
      setIsEmpty(true);
    }
  };

  return (
    <div className="AddFriendLayout">
      <h3>Follow users</h3>
      <div className="topSearchFriends">
        {friends}
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
