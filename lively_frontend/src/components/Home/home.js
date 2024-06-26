import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Status from "./status";
import "./home.css";
import axios from "axios";
import ShowPosts from "./showPosts";
import NewPost from "./newPost";
import Followers from "./Followers";
import AddFriend from "./addFriend";
import Pagination from "./Pagination";
import { BASE_URL } from "../../../config";
const Home = () => {
  const url = (path) => `${BASE_URL}${path}`;

  const navigate = useNavigate();

  const cookie = JSON.parse(localStorage.getItem("cookie"));

  const [searchPost, setSearchPost] = useState("");
  const [newPost, setNewPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const currUser = JSON.parse(localStorage.getItem("currUser"));
  const [userDetails, setUserDetails] = useState("");
  const newUser = "new" in currUser;
  const [followers, setFollowers] = useState([]);

  const [totalPosts, setTotalPosts] = useState("");
  useEffect(() => {
    async function getUser() {
      const response = await axios.get(url("/userDetails"), {
        headers: { "Content-Type": "application/json", Authorization: cookie },
      });
      console.log(response.data);

      setUserDetails(response.data);
    }
    async function getArticles() {
      const response = await axios.get(url("/articles"), {
        headers: { "Content-Type": "application/json", Authorization: cookie },
      });

      setTotalPosts(response.data.articles);
    }

    getUser();
    getArticles();
  }, []);

  const handleFollowers = (new_followers) => {
    if (new_followers !== null) {
      setFollowers(new_followers);
    } else {
      setFollowers("");
    }
  };

  const logout = () => {
    axios
      .put(
        url("logout"),
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: cookie,
          },
        }
      )
      .then(navigate("/"));
  };

  const profile = () => {
    navigate("/profile");
  };

  const handlePost = (postBody, setPostContent, postImage, setPostImage) => {
    const text = postBody;
    var post;
    if (postImage) {
      post = { text: text, image: postImage };
    } else {
      post = { text: text };
    }
    if (text !== "") {
      fetch(url("/article"), {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: { "Content-Type": "application/json", Cookie: cookie },
        body: JSON.stringify(post),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          setNewPost(postBody);
          setPostContent("");
          setPostImage("");
        });
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
      <div className="home2Layout">
        <div className="layer2">
          <AddFriend followers={followers} handleFollowers={handleFollowers} />
          <ShowPosts
            entirePosts={totalPosts}
            searchPost={searchPost}
            newPost={newPost}
            setNewPost={setNewPost}
            newUser={newUser}
            followers={followers}
            handleFollowers={handleFollowers}
            currentPage={currentPage}
          />
        </div>

        <Pagination
          className="paginationLayout"
          postsPerPage={10}
          totalPosts={totalPosts.length}
          paginate={paginate}
        ></Pagination>
        <div className="paginationLayout"></div>
      </div>
    </div>
  );
};

export default Home;
