import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Status from "./status";
import "./home.css";
import ShowPosts from "./showPosts";
import NewPost from "./newPost";
import Followers from "./Followers";
import AddFriend from "./addFriend";
import all_posts from "../../posts";

const Home = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(
    JSON.parse(localStorage.getItem("loggedIn"))
  );
  const [searchPost, setSearchPost] = useState("");
  const [allmyposts, setAllMyPosts] = useState(null);
  const [newPost, setNewPost] = useState(null);

  const data = JSON.parse(localStorage.getItem("entire_posts"));

  // var currUser;
  const all_users = JSON.parse(localStorage.getItem("all_users"));

  const id = localStorage.getItem("cu_id");
  const c_id = parseInt(id) + 1;

  const currUser = JSON.parse(localStorage.getItem("currUser"));
  console.log("current: ", currUser);
  const newUser = "new" in currUser;

  const initialFollowers = () => {
    if (newUser) return [];
    else
      return [
        c_id >= 10 ? c_id - 10 : c_id,
        c_id + 1 >= 10 ? c_id + 1 - 10 : c_id + 1,
        c_id + 2 >= 10 ? c_id + 2 - 10 : c_id + 2,
      ];
  };

  const [followers, setFollowers] = useState(initialFollowers);
  console.log("Followers: ", followers);
  const handleFollowers = (new_followers) => {
    if (new_followers !== null) {
      setFollowers(new_followers);
    }
  };

  useEffect(() => {
    if (!loggedIn) navigate("/");
  }, [loggedIn]);

  const logout = () => {
    localStorage.setItem("loggedIn", false);
    setLoggedIn(localStorage.getItem("loggedIn"));
    console.log("l: ", loggedIn);
    navigate("/");
  };
  const profile = () => {
    navigate("/profile");
  };

  const handlePost = (postBody, setPostContent) => {
    if (postBody !== "") {
      setNewPost(postBody);
      setPostContent("");
    }
  };

  console.log("FOllowers: ", followers);

  return (
    <div className="Home">
      <div className="home_container1">
        <Status handleLogout={logout} goToProfile={profile} />
        <div className="home_container2">
          <div className="home_container3">
            <NewPost handlePost={handlePost} />
            <Followers />
          </div>
          <div className="searchField">
            <input
              className="searchInputField"
              type="text"
              placeholder="search"
              data-testid="search_posts"
              value={searchPost}
              onChange={(e) => setSearchPost(e.target.value)}
            ></input>
          </div>
        </div>
      </div>
      <div className="layer2">
        <AddFriend followers={followers} handleFollowers={handleFollowers} />
        <ShowPosts
          entirePosts={data}
          searchPost={searchPost}
          newPost={newPost}
          newUser={newUser}
          followers={followers}
          handleFollowers={handleFollowers}
        />
      </div>
    </div>
  );
};

export default Home;
