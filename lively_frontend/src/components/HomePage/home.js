import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Status from "./status";
import "./home.css";
import ShowPosts from "./showPosts";
import NewPost from "./newPost";
import Followers from "./Followers";
import AddFriend from "./addFriend";
import { getFollowers } from "../../API/followersAPI";
import {
  getUser,
  getArticles,
  addComment,
  deleteArticle,
} from "../../API/homeAPI";

const Home = () => {
  const navigate = useNavigate();

  const [searchPost, setSearchPost] = useState("");

  const [comment, setComment] = useState("");

  const [userDetails, setUserDetails] = useState("");
  const [followersList, setFollowersList] = useState([]);
  const [followerDetails, setFollowerDetails] = useState([]);

  const [updatedArticle, setUpdatedArticle] = useState();
  const [displayArticles, setDisplayArticles] = useState([]);
  const [articles, setArticles] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      await addComment(articleID, commentContent);

      setArticles((prev) =>
        prev.map((article) => {
          if (article._id === articleID) {
            return {
              ...article,
              comments: [...article.commentsID, commentContent],
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

  const handlePostDelete = async (postID) => {
    console.log("Delete post: ", postID);

    try {
      const deletedPostID = await deleteArticle(postID);
      console.log("Post deleted: ", deletedPostID);

      setArticles((prev) =>
        prev.filter((article) => article._id !== deletedPostID)
      );
    } catch (err) {
      console.log("Post Delete Error: ", err.message);
    }
  };

  useEffect(() => {
    async function fetchUserDetails() {
      const details = await getUser();
      setUserDetails(details);
    }

    fetchUserDetails();
  }, []);

  useEffect(() => {
    console.log("New friend added");
    async function fetchArticles() {
      console.log("Fetching articles");
      const articles = await getArticles();
      console.log("Articles after fetching: ", articles);
      setArticles(
        articles.map((article) => ({
          ...article,
          commentsDisplayed: false,
        }))
      );
    }

    async function fetchFollowerDetails() {
      const followersInfo = await getFollowers(followersList);

      console.log("Fetching Follower details: ", followersInfo);

      setFollowerDetails(followersInfo);
    }

    fetchArticles();
    fetchFollowerDetails();
  }, [followersList]);

  useEffect(() => {
    setFollowersList(userDetails.following);
  }, [userDetails]);

  console.log("Followers: ", followersList);

  useEffect(() => {
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
                alt="change post"
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
        <Status />

        <AddFriend
          followersDetails={followerDetails}
          setFollowersList={setFollowersList}
        />
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
            handlePostDelete={handlePostDelete}
            userDetails={userDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
