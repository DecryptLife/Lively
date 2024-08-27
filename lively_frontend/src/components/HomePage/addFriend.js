import { useState } from "react";
import { addFollower, removeFriend } from "../../API/followersAPI";

const AddFriend = ({ followersDetails, setFollowersList }) => {
  const [isEmpty, setIsEmpty] = useState(null);
  const [invalidUser, setInvalidUser] = useState(null);
  const [addFriend, setAddFriend] = useState("");

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
      <h3 style={{ textAlign: "center" }}>Follow users</h3>
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
              <span style={{ flex: 3, marginLeft: "0.5rem" }}>
                {follower.username}
              </span>
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
