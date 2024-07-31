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
import { getUser } from "../../API/homeAPI";
import { BASE_URL } from "../../config";

const Home = () => {
  const url = (path) => `${BASE_URL}${path}`;

  const navigate = useNavigate();

  const [searchPost, setSearchPost] = useState("");
  const [newPost, setNewPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const currUser = JSON.parse(localStorage.getItem("currUser"));
  const [userDetails, setUserDetails] = useState("");
  const newUser = "new" in currUser;
  const [followers, setFollowers] = useState([]);

  const [totalPosts, setTotalPosts] = useState("");
  useEffect(() => {
    async function fetchUserDetails() {
      const details = await getUser;
      setUserDetails(details);
    }

    async function getArticles() {
      const response = await axios
        .get(url("/articles"), {
          headers: { "Content-Type": "application/json" },
        })
        .catch((err) => console.log(err));

      setTotalPosts(response.data.articles);
    }

    fetchUserDetails();
    getArticles();
  }, []);

  console.log(userDetails);

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
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(navigate("/"));
  };

  const profile = () => {
    navigate("/profile");
  };

  const handlePost = async (
    postBody,
    setPostContent,
    postImage,
    setPostImage
  ) => {
    const text = postBody;
    let post;
    if (postImage) {
      post = { text: text, image: postImage };
    } else {
      post = { text: text };
    }

    console.log(post);
    if (text !== "") {
      const response = await axios
        .post(url("/article"), post)
        .then((response) => response.data);

      console.log(response);

      // fetch(url("/article"), {
      //   method: "POST",
      //   withCredentials: true,
      //   credentials: "include",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(post),
      // })
      //   .then((res) => {
      //     return res.json();
      //   })
      //   .then((res) => {
      //     setNewPost(postBody);
      //     setPostContent("");
      //     setPostImage("");
      //   });
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="home_container">
      <div className="home_container-left">
        <Status handleLogout={logout} goToProfile={profile} />

        <AddFriend followers={followers} handleFollowers={handleFollowers} />
      </div>
      <div className="home_container-right">
        <div className="home_container-right-top">
          <NewPost handlePost={handlePost} />
          <Followers />
        </div>
        <div className="home_container-right-bottom">
          <div className="search-container">
            <input
              className="searchInputField"
              type="text"
              placeholder="search"
              data-testid="search_posts"
              value={searchPost}
              onChange={(e) => setSearchPost(e.target.value)}
            ></input>
          </div>
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
