import { useState, useEffect } from "react";
const ShowPosts = ({
  entirePosts,
  searchPost,
  newPost,
  newUser,
  followers,
  handleFollowers,
}) => {
  const req = [
    require("../images/img_2_1.png"),
    require("../images/img_2_2.png"),
    require("../images/img_2_3.png"),
  ];

  const users = JSON.parse(localStorage.getItem("all_users"));
  const data = entirePosts;
  const curruser = JSON.parse(localStorage.getItem("currUser"));
  var posts = data.filter(function (post) {
    return post.userId == curruser["id"];
  });

  const [NoPostExist, setNoPostExists] = useState(false);
  posts = newUser ? [] : posts;

  const addAuthours = (all_set) => {
    if (all_set !== []) {
      all_set.forEach((post) => {
        post["author"] = users[post["userId"] - 1]["username"];
      });

      return all_set;
    }

    return [];
  };

  const findFollowerPosts = (followers) => {
    if (followers !== undefined) {
      var all_follower_posts = [];
      followers.forEach((follower_id) => {
        var fol_posts = data.filter(function (post) {
          return post.userId == follower_id;
        });
        all_follower_posts = all_follower_posts.concat(fol_posts);
      });
      return addAuthours(posts.concat(all_follower_posts));
    }
    return [];
  };

  const [allposts, setMyPost] = useState(findFollowerPosts(followers));

  localStorage.setItem("initial_posts", JSON.stringify(allposts));

  localStorage.setItem("all_posts", allposts);
  useEffect(() => {
    var new_posts = findFollowerPosts(followers);
    setMyPost(findFollowerPosts(followers));
    setModPosts(findFollowerPosts(followers));
  }, [followers]);

  const [modPosts, setModPosts] = useState(findFollowerPosts(followers));
  useEffect(() => {
    if (newPost !== null) {
      if (newPost != "") {
        const new_post = [
          {
            id: curruser.id,
            title: "Keeping it simple",
            body: newPost,
            author: curruser.username,
            newPost: "true",
          },
        ];
        setModPosts(new_post.concat(modPosts));
        setMyPost(new_post.concat(modPosts));
      }
    }
  }, [newPost]);

  const showComments = (e) => {
    const comment_field = document.getElementsByClassName("comment_field");
    const post = comment_field[e.target.value - 1];

    post.style.display = post.style.display === "block" ? "none" : "block";
    console.log(post);
    console.log("Show comments: ", e.target.value);
  };

  useEffect(() => {
    searchPosts(searchPost);
  }, [searchPost]);
  useEffect(() => {
    let post_field = [];
    var count = 0;
    var times = Date.now();
    var date = new Date(times);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var time =
      "Posted on " + month + "/" + day + "/" + year + " " + hour + ":" + minute;
    allposts.forEach((post) => {
      count++;
      let postid = 0;
      console.log(count);

      post_field.push(
        <div className="Post" key={count} style={{}}>
          <span className="greenText">{}</span>
          {!(post["newPost"] === "true") && (
            <img className="bgImg" src={req[count % 3]}></img>
          )}
          {post["newPost"] === "true" && <img className="bgImg"></img>}

          <span className="greenText">{post["author"]}</span>
          <div className="content">
            <div className="postContent">
              <h2>{post["title"]}</h2>
              <p>{post["body"]}</p>
            </div>

            <div className="btnLayout">
              <button
                className="postCmntBtn"
                value={count}
                onClick={(e) => showComments(e)}
              >
                Comment
              </button>
              <button className="postEditBtn">Edit</button>
            </div>
            <div
              className="comment_field"
              id={count}
              style={{ display: "none" }}
            >
              <span>Nice post</span>
              <br></br>
              <span>Very inspiring</span>
            </div>
            <div className="postedTimeLayout">
              {<span className="greenText">{time}</span>}
            </div>
          </div>
        </div>
      );
    });
    setPostField(post_field);
  }, [allposts]);

  const searchPosts = (searchPost) => {
    localStorage.setItem("keyword", searchPost);

    // setMyPost(findFollowerPosts(followers));
    if (searchPost != "") {
      var searched_posts = [];
      var size = 0;
      allposts.map((post) => {
        if (
          post["body"].match(searchPost) ||
          post["author"].match(searchPost)
        ) {
          searched_posts.push(post);
          size++;
        }
      });

      if (size == 0) {
        setNoPostExists(true);
      } else {
        setNoPostExists(false);
        localStorage.setItem("searched_posts", JSON.stringify(searched_posts));
        setMyPost(searched_posts);
      }
    } else {
      setNoPostExists(false);
      setMyPost(modPosts);
    }
  };

  useEffect(() => {
    searchPosts(searchPost);
  }, [searchPost]);

  const [postfield, setPostField] = useState(null);

  useEffect(() => {
    if (postfield !== null) {
      localStorage.setItem("mod_posts", JSON.stringify(postfield));
    }
  }, [postfield]);

  return (
    <div className="postLayout">
      {allposts == null ? (
        <h3>No posts yet</h3>
      ) : NoPostExist ? (
        <h3>No matching post found</h3>
      ) : (
        postfield
      )}
    </div>
  );
};

export default ShowPosts;
