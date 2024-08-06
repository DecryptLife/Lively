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
import { getUser, getArticles, addComment } from "../../API/homeAPI";
import { BASE_URL } from "../../config";

const Home = () => {
  const url = (path) => `${BASE_URL}${path}`;

  const navigate = useNavigate();

  const [searchPost, setSearchPost] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [comment, setComment] = useState("");

  const currUser = JSON.parse(localStorage.getItem("currUser"));
  const [userDetails, setUserDetails] = useState("");
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

      setArticles(
        articles.map((article) => ({
          ...article,
          commentsDisplayed: false,
        }))
      );
    }

    fetchUserDetails();
    fetchArticles();
  }, []);

  const handleFollowers = async (new_followers) => {
    if (new_followers !== null) {
      setFollowers(new_followers);
    } else {
      setFollowers("");
    }
  };

  const handleCommentsClick = (articleID) => {
    setArticles(
      articles.map((article) => {
        if (article._id === articleID) {
          return {
            ...article,
            commentsDisplayed: !article["commentsDisplayed"],
          };
        }
        return article;
      })
    );
  };

  const handleAddComment = async (articleID, newComment) => {
    const commentContent = {
      comment: newComment,
      author: userDetails.username,
      author_image: userDetails.avatar,
    };

    try {
      const response = await addComment(articleID, commentContent);

      setArticles((prev) =>
        prev.map((article) => {
          if (article._id === articleID) {
            return {
              ...article,
              comments: [...article.comments, commentContent],
            };
          }
          return article;
        })
      );

      setComment("");
    } catch (err) {
      console.log(err);
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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    console.log("Mod: ", articles);
    setDisplayArticles(articles);
  }, [articles]);

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
          <NewPost user={userDetails} setArticles={setArticles} />
          <Followers />
        </div>
        <div className="home_container-right-bottom">
          <div className="search-container">
            <input
              className="search-field"
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
            handleCommentsClick={handleCommentsClick}
            handleAddComment={handleAddComment}
            comment={comment}
            setComment={setComment}
          />
        </div>

        <Pagination
          className="paginationLayout"
          postsPerPage={10}
          totalPosts={10}
          paginate={paginate}
        ></Pagination>
        <div className="paginationLayout"></div>
      </div>
    </div>
  );
};

export default Home;
