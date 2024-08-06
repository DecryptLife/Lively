import { BASE_URL } from "../../config";
import "./profile.css";
import UpdateInfo from "./updateInfo";
import UserInfo from "./userInfo";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../API/homeAPI";
import { updateProfile } from "../../API/profileAPI";

const Profile = () => {
  const url = (path) => `${BASE_URL}${path}`;

  const [user, setUser] = useState({});

  const [avatar, setAvatar] = useState("");

  const [updateDetails, setUpdateDetails] = useState({
    name: "",
    headline: "",
    email: "",
    mobile: "",
    dob: "",
    zipcode: "",
    avatar: "",
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

  const handleProfileChange = (e, field) => {
    console.log("Target element: ", e.target);
    setUpdateDetails((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleReset = () => {
    const resetValues = {
      name: "",
      headline: "",
      email: "",
      mobile: "",
      dob: "",
      zipcode: "",
      avatar: "",
    };

    setUpdateDetails(resetValues);
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await updateProfile(user._id, updateDetails);

      console.log("Profile page: ", response.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    async function fetchUserDetails() {
      const userDetails = await getUser();

      console.log("Profile user details: ", userDetails);
      setUser(userDetails);
    }

    fetchUserDetails();
  }, []);
  return (
    <div className="profile_layout">
      <div className="profile_container">
        <div className="profile_container-left">
          <div className="profile-img-container">
            <img src={user.avatar} alt="" />
            <span style={{ fontWeight: "bolder" }}>Benson</span>
          </div>
          <div className="profile-details-container">
            <div>
              <label htmlFor="profile-headline">Headline: </label>
              <p className="profile-headline" id="profile-headline">
                {user.headline}
              </p>
            </div>
            <div>
              <label htmlFor="profile-headline">Email: </label>
              <p className="profile-headline" id="profile-headline">
                {user.email}
              </p>
            </div>
            <div>
              <label htmlFor="profile-headline">Mobile: </label>
              <p className="profile-headline" id="profile-headline">
                {user.mobile}
              </p>
            </div>
            <div>
              <label htmlFor="profile-headline">Date of Birth: </label>
              <p className="profile-headline" id="profile-headline">
                {user.dob}
              </p>
            </div>
            <div>
              <label htmlFor="profile-headline">Zipcode: </label>
              <p className="profile-headline" id="profile-headline">
                {user.zipcode}
              </p>
            </div>
          </div>
        </div>
        <div className="profile_container-right">
          <div className="profile-update-container">
            <div className="profile-update__header">
              <h2>Update Information</h2>
            </div>
            <div className="profile-update__fields">
              <div>
                <label htmlFor="profile-update-username"></label>
                <input
                  id="profile-update-username"
                  type="text"
                  placeholder="Username"
                  value={updateDetails.name}
                  onChange={(e) => handleProfileChange(e, "name")}
                />
              </div>
              <div>
                <label htmlFor="profile-update"></label>
                <input
                  id="profile-update-headline"
                  type="text"
                  placeholder="Headline"
                  value={updateDetails.headline}
                  onChange={(e) => handleProfileChange(e, "headline")}
                />
              </div>
              <div>
                <label htmlFor="profile-update"></label>
                <input
                  id="profile-update-email"
                  type="email"
                  placeholder="Email"
                  value={updateDetails.email}
                  onChange={(e) => handleProfileChange(e, "email")}
                />
              </div>
              <div>
                <label htmlFor="profile-update"></label>
                <input
                  id="profile-update-mobile"
                  type="text"
                  placeholder="Mobile"
                  value={updateDetails.mobile}
                  onChange={(e) => handleProfileChange(e, "mobile")}
                />
              </div>
              <div>
                <label htmlFor="profile-update"></label>
                <input
                  id="profile-update-dob"
                  type="text"
                  placeholder="Date of Birth"
                  value={updateDetails.dob}
                  onChange={(e) => handleProfileChange(e, "dob")}
                />
              </div>
              <div>
                <label htmlFor="profile-update"></label>
                <input
                  id="profile-update-zipcode"
                  type="text"
                  placeholder="Zip code"
                  value={updateDetails.zipcode}
                  onChange={(e) => handleProfileChange(e, "zipcode")}
                />
              </div>
              <div className="update-image-container">
                <label
                  htmlFor="profile-update-image"
                  style={{
                    flex: "1",
                  }}
                >
                  Change image:
                </label>
                <input
                  type="file"
                  id="profile-update-image"
                  style={{ flex: "2" }}
                  onChange={(e) => handleProfileChange(e, "image")}
                />
              </div>
            </div>
            <div className="profile-update__btns">
              <button onClick={() => handleReset()}>Reset</button>
              <button onClick={() => handleProfileUpdate()}>Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
{
  /* <div className="profile_container1">
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
          <button className="home_text">Home</button>
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
      </div> */
}
