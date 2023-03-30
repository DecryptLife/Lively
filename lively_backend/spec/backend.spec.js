require("es6-promise").polyfill();
require("isomorphic-fetch");

const url = (path) => `http://localhost:3000${path}`;
let cookie;

describe("Backend Tests", () => {
  it("Register a new user named testUser with password 123", (done) => {
    let user = {
      username: "testUser",
      email: "test@rice.edu",
      dob: "12/12/1998",
      zipcode: "560068",
      headline: "This is my initial headline",
      password: "123",
    };

    fetch(url("/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        expect(res.username).toEqual("testUser");
        expect(res.result).toEqual("success");
        done();
      })
      .catch((err) => {
        throw err;
      });
  });

  it("login with testUser", (done) => {
    let login = { username: "testUser", password: "123" };

    fetch(url("/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login),
    })
      .then((res) => {
        cookie = res.headers.get("set-cookie");
        return res.json();
      })
      .then((res) => {
        expect(res.username).toEqual("testUser");
        expect(res.result).toEqual("success");
        done();
      });
  });

  it("Create a new article and verify that the article was added", (done) => {
    let article = { text: "New post" };
    fetch(url("/article"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify(article),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        expect(res.articles.text).toEqual(article["text"]);
        expect(res.articles.author).toEqual("testUser");
        done();
      });
  });

  it("Update the status headline and verify the change", (done) => {
    let new_headline = { headline: "new headline" };

    fetch(url("/headline"), {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify(new_headline),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        expect(res.username).toEqual("testUser");
        expect(res.headline).toEqual(new_headline["headline"]);
        done();
      });
  });

  it("Log out testUser", (done) => {
    fetch(url("/logout"), {
      method: "PUT",
      headers: { "Content-Type": "text/html", Cookie: cookie },
    }).then((res) => {
      const new_cookie = res.headers.get("set-cookie");
      expect(cookie).toNotEqual(new_cookie);
      done();
    });
  });
});
