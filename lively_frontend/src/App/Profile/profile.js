import "./profile.css";
import UpdateInfo from "./updateInfo";
import UserInfo from "./userInfo";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const url = (path) => `http://localhost:3001${path}`;
  const [currUser, setCurrUser] = useState("");
  const inputref = useRef(null);
  const [mobile, setMobile] = useState("");
  const [dob, setDOB] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch(url("/userDetails"), {
      method: "GET",
      credentials: "include",
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setCurrUser(res.user.username);
        setMobile(res.user.mobile);
        setDOB(res.user.dob);
        setZipCode(res.user.zipcode);
        setEmail(res.user.email);
      });
  }, [currUser, email, mobile, dob, zipCode]);
  const handleClick = () => {
    inputref.current.click();
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    fetch(url("/avatar"), {
      method: "GET",
      credentials: "include",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        setAvatar(res.avatar);
      });
  });

  const transformFile = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        // console.log("IKL");
        // console.log(reader.result);
        fetch(url("/avatar"), {
          method: "PUT",
          credentials: "include",
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: reader.result }),
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            setAvatar(res.avatar.url);
          });
      };
    } else {
    }
  };

  const handleChange = (e) => {
    const fileObj = e.target.files && e.target.files[0];

    if (!fileObj) {
      return;
    } else {
      setAvatar(fileObj);
      transformFile(fileObj);
    }
  };

  const handleImageUpdate = () => {
    if (avatar !== "") {
      let image = { avatar: avatar };
      fetch(url("/avatar"), {
        method: "PUT",
        credentials: "include",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(image),
      }).then((res) => {
        setAvatar("");
      });
    }
  };
  const handleUpdate = (new_details) => {
    var updatedDetails = {
      mobile: new_details["mobNo"].length > 0 ? new_details["mobNo"] : mobile,
      dob: new_details["date"].length > 0 ? new_details["date"] : dob,
      email: new_details["email"].length > 0 ? new_details["email"] : email,
      zipcode:
        new_details["zipCode"].length > 0 ? new_details["zipCode"] : zipCode,
      password: new_details["pwd"].length > 0 ? new_details["pwd"] : null,
    };

    fetch(url("/updateDetails"), {
      method: "PUT",
      credentials: "include",
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedDetails),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setMobile(res.mobile);
        setDOB(res.dob);
        setZipCode(res.zipcode);
        setEmail(res.email);
      });
  };

  return (
    <div className="profile_page">
      <div className="profile_container1">
        <div className="profileImgLayout">
          <img className="profileImg" src={avatar} alt="profile"></img>
          <br />
          <span
            className="profileUname"
            data-testid="profile_username"
            value={currUser}
          >
            {currUser}
          </span>
          <br />
          <div>
            <input
              style={{ display: "none" }}
              type="file"
              ref={inputref}
              onChange={handleChange}
            ></input>
            <button className="uploadImgBtn" onClick={() => handleClick()}>
              Change image
            </button>
            <button
              className="updateImgBtn"
              onClick={() => handleImageUpdate()}
            >
              Update image
            </button>
          </div>
          <button className="home_text" onClick={() => handleHomeClick()}>
            Home
          </button>
        </div>
      </div>

      <div className="uInfoLayout">
        <UserInfo
          userDetails={{
            currUser: currUser,
            mobile: mobile,
            dob: dob,
            zipCode: zipCode,
            email: email,
          }}
        />
        <UpdateInfo handleUpdate={handleUpdate} />
      </div>
    </div>
  );
};

export default Profile;
