import "./profile.css";
import UpdateInfo from "./updateInfo";
import UserInfo from "./userInfo";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
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
    async function getUserDetails() {
      const response = await axios.get(url("/userDetails"), {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data;

      setCurrUser(data.user.username);
      setMobile(data.user.mobile);
      setDOB(data.user.dob);
      setZipCode(data.user.zipcode);
      setEmail(data.user.email);
    }

    getUserDetails();
  }, [currUser, email, mobile, dob, zipCode]);

  const handleClick = () => {
    inputref.current.click();
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    async function getAvatar() {
      const response = await axios(url("/avatar"), {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setAvatar(response.data.avatar);
    }

    getAvatar();
  });

  const transformFile = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const response = await axios.put(
          url("/avatar"),
          { avatar: reader.result },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        setAvatar(response.data.avatar.url);
      };
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

  const handleImageUpdate = async () => {
    if (avatar !== "") {
      let image = { avatar: avatar };

      const response = await axios.put(url("/avatar"), image, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setAvatar("");
    }
  };
  const handleUpdate = async (new_details) => {
    let updatedDetails = {
      mobile: new_details["mobNo"].length > 0 ? new_details["mobNo"] : mobile,
      dob: new_details["date"].length > 0 ? new_details["date"] : dob,
      email: new_details["email"].length > 0 ? new_details["email"] : email,
      zipcode:
        new_details["zipCode"].length > 0 ? new_details["zipCode"] : zipCode,
      password: new_details["pwd"].length > 0 ? new_details["pwd"] : null,
    };

    const response = await axios.put(url("/updateDetails"), updatedDetails, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    setMobile(response.data.mobile);
    setDOB(response.data.dob);
    setZipCode(response.data.zipcode);
    setEmail(response.data.email);
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
