import { useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import { addFollower, removeFriend } from "../../API/followersAPI";

const AddFriend = ({ followersDetails, setFollowersList }) => {
  const url = (path) => `${BASE_URL}${path}`;
  const [isEmpty, setIsEmpty] = useState(null);
  const [invalidUser, setInvalidUser] = useState(null);
  const [addFriend, setAddFriend] = useState("");

  const req = [
    require("../../images/img1.png"),
    require("../../images/img2.png"),
    require("../../images/img3.png"),
    require("../../images/img4.png"),
    require("../../images/img5.png"),
    require("../../images/img6.png"),
    require("../../images/img7.png"),
    require("../../images/img8.png"),
    require("../../images/img9.png"),
    require("../../images/img10.png"),
  ];

  const handleRemoveFriend = async (followerID) => {
    try {
      const updatedFollowerList = await removeFriend(followerID);

      setFollowersList(updatedFollowerList);
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };

  const addNewFriend = async (e) => {
    try {
      const updatedFollowerList = await addFollower(addFriend);
      setFollowersList(updatedFollowerList);
      setAddFriend("");
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };

  return (
    <div className="flex-col add-friend-layout">
      <h3>Follow users</h3>
      <div className="add-friend-list">
        {/* {followingList.length > 0 ? friends : <h4>Not following any user</h4>} */}
        {followersDetails && followersDetails.length > 0 ? (
          followersDetails.map((follower) => (
            <div className="friend-list-item" key={follower._id}>
              <img
                className="follower-image"
                src={follower.avatar}
                style={{ flex: 1 }}
              ></img>
              <span style={{ flex: 3 }}>{follower.username}</span>
              <button
                className="follower-button__remove"
                style={{ flex: 1 }}
                onClick={() => handleRemoveFriend(follower._id)}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <h6>Not following any user</h6>
        )}
      </div>
      <div className="flex-col friend-search-container">
        <div>
          <input
            className="friend-search__input"
            type="text"
            data-testid="addFriendField"
            placeholder="Add a friend "
            value={addFriend}
            onChange={(e) => setAddFriend(e.target.value)}
          ></input>
        </div>
        <div>
          <button
            className="friend-search__button"
            onClick={(e) => addNewFriend(e)}
          >
            Add Friend
          </button>
        </div>
      </div>

      {isEmpty && <span className="redText">Can't add a nameless friend</span>}

      {invalidUser && <span className="redText">Not an existing user</span>}
    </div>
  );
};

export default AddFriend;
