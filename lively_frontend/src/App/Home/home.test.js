import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./home";
import all_posts from "../../posts";
import all_users from "../../users";
import ShowPosts from "./showPosts";
import AddFriend from "./addFriend";

const currentUser = {
  id: 2,
  name: "Ervin Howell",
  username: "Antonette",
  email: "Shanna@melissa.tv",
  address: {
    street: "Victor Plains",
    suite: "Suite 879",
    city: "Wisokyburgh",
    zipcode: "90566-7771",
    geo: {
      lat: "-43.9509",
      lng: "-34.4618",
    },
  },
  phone: "010-692-6593 x09125",
  website: "anastasia.net",
  company: {
    name: "Deckow-Crist",
    catchPhrase: "Proactive didactic contingency",
    bs: "synergize scalable supply-chains",
  },
};

const id = parseInt(currentUser["id"]);
const followers = [id + 1, id + 2, id + 3];
const posts = all_posts.all_posts.filter(function (post) {
  return post.userId === currentUser["id"];
});

const addAuthours = (all_set) => {
  all_set.forEach((post) => {
    post["author"] = all_users.all_users[post["userId"] - 1]["username"];
  });

  return all_set;
};

const findFollowerPosts = (followers) => {
  var all_follower_posts = [];
  followers.forEach((follower_id) => {
    var fol_posts = all_posts.all_posts.filter(function (post) {
      return post.userId == follower_id;
    });
    all_follower_posts = all_follower_posts.concat(fol_posts);
  });
  return addAuthours(posts.concat(all_follower_posts));
};

const allposts = findFollowerPosts(followers);
var initial;
describe("Validate article acions", () => {
  localStorage.setItem("currUser", JSON.stringify(currentUser));
  localStorage.setItem("all_users", JSON.stringify(all_users.all_users));
  localStorage.setItem("entire_posts", JSON.stringify(all_posts.all_posts));

  // const posts = JSON.parse(localStorage.getItem("all_posts"));
  localStorage.setItem("cu_id", "1");

  render(
    <Router>
      <Home />
    </Router>
  );

  const searchField = screen.getByTestId("search_posts");

  test("should fetch all articles for current logged in user", () => {
    const shownPosts = JSON.parse(localStorage.getItem("initial_posts"));
    initial = shownPosts;
    expect(allposts.length).toBe(shownPosts.length);
  });

  test("should fetch subset of articles for current logged in user given search keyword ", () => {
    const keyword = "modi";
    render(
      <ShowPosts
        entirePosts={all_posts.all_posts}
        searchPost={keyword}
        followers={followers}
        newUser={false}
      />
    );

    var count_match = 0;

    allposts.map((post) => {
      if (post["body"].match(keyword) || post["author"].match(keyword)) {
        count_match++;
      }
    });

    fireEvent.change(searchField, {
      target: {
        value: keyword,
      },
    });

    // const searched = localStorage.getItem("keyword");
    const searched_result = JSON.parse(localStorage.getItem("searched_posts"));

    expect(count_match).toBe(searched_result.length);
  });

  test("should add articles when adding a follower", () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    const addFriendField = screen.getByTestId("addFriendField");
    const addFriendButton = screen.getByRole("button", { name: "Add" });

    fireEvent.change(addFriendField, {
      target: {
        value: "Bret",
      },
    });

    fireEvent.click(addFriendButton);

    const shownPosts = JSON.parse(localStorage.getItem("mod_posts"));

    expect(shownPosts.length).toBeGreaterThan(initial.length);
  });

  test("should remove articles when removing a follower (posts state is smaller)", () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    const unfollowBtn = screen.getByTestId("unfollow_button_2");

    fireEvent.click(unfollowBtn);

    const newPosts = JSON.parse(localStorage.getItem("mod_posts"));

    expect(newPosts.length).toBeLessThan(initial.length);
  });
});
