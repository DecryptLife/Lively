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
import { getUser, getArticles } from "../../API/homeAPI";
import { BASE_URL } from "../../config";

const Home = () => {
  const url = (path) => `${BASE_URL}${path}`;

  const navigate = useNavigate();

  const [searchPost, setSearchPost] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const currUser = JSON.parse(localStorage.getItem("currUser"));
  const [userDetails, setUserDetails] = useState("");
  const newUser = "new" in currUser;
  const [followers, setFollowers] = useState([]);

  const [updatedArticle, setUpdatedArticle] = useState();
  const [displayArticles, setDisplayArticles] = useState([]);
  const [articles, setArticles] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchUserDetails() {
      const details = await getUser();
      setUserDetails(details);
    }

    async function fetchArticles() {
      const articles = await getArticles();
      console.log(articles);

      setArticles(articles);

      // use use-effect for post updates
      setDisplayArticles(articles);
    }

    fetchUserDetails();
    fetchArticles();
  }, []);

  console.log(userDetails);

  const handleFollowers = (new_followers) => {
    if (new_followers !== null) {
      setFollowers(new_followers);
    } else {
      setFollowers("");
    }
  };

  const handleOptionsClick = (article) => {
    setUpdatedArticle(article);
    setIsDialogOpen((prev) => !prev);
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
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="home_container">
      {isDialogOpen && (
        <div className="post-dialog-layout">
          <div className="post-options-dialog">
            <h2>Edit Post</h2>
            <div className="dialog-input__field">
              <input value={updatedArticle?.text}></input>
            </div>
            <div className="dialog-image__layout">
              <img
                src={
                  updatedArticle &&
                  updatedArticle.image &&
                  updatedArticle.image.url
                }
                width={80}
                height={80}
              ></img>
            </div>
            <div className="dialog-btn__layout">
              <button>Update</button>
              <button onClick={() => setIsDialogOpen((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
            articles={displayArticles}
            handleOptionsClick={handleOptionsClick}
          />
        </div>

        <Pagination
          className="paginationLayout"
          postsPerPage={10}
          totalPosts={articles.length}
          paginate={paginate}
        ></Pagination>
        <div className="paginationLayout"></div>
      </div>
    </div>
  );
};

export default Home;
