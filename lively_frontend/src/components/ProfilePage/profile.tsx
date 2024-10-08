import "./profile.css";
import { ChangeEvent, useEffect, useState } from "react";
import { getUser } from "../../API/homeAPI";
import { updateProfile } from "../../API/profileAPI";
import transformImage from "../../utils/transformImage";

const Profile = () => {
  const [user, setUser] = useState<IUser | null>(null);

  const [updateDetails, setUpdateDetails] = useState<IOptionalUser>({
    username: "",
    headline: "",
    email: "",
    mobile: "",
    dob: "",
    zipcode: "",
    avatar: "",
  });

  const handleProfileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (field !== "image")
      setUpdateDetails((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
  };

  const handleReset = () => {
    const resetValues = {
      username: "",
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
    if (user) {
      try {
        const toUpdateDetails: Partial<IOptionalUser> = {};

        // Loop through updateDetails and exclude the 'following' field
        for (const key in updateDetails) {
          if (
            key !== "following" && // Ensure we don't modify 'following'
            updateDetails[key as keyof IOptionalUser] !== "" // Ensure the field is not empty
          ) {
            const value = updateDetails[key as keyof IOptionalUser];

            // Narrow the type: Ensure the value is a string before assigning
            if (typeof value === "string") {
              toUpdateDetails[key as keyof IOptionalUser] = value;
            }
          }
        }

        // Call the updateProfile function with filtered data
        const updatedDetails = await updateProfile(user._id, toUpdateDetails);

        // Update the user state, making sure 'following' remains unchanged
        setUser((prev) => {
          if (!prev) return prev;

          return {
            ...prev, // Keep previous state
            ...toUpdateDetails, // Apply only updated details
            following: prev.following, // Ensure 'following' remains unchanged
          };
        });
      } catch (err: unknown) {
        if (err instanceof Error) console.log(err.message);
      } finally {
        handleReset();
      }
    }
  };

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const [_, image] = await transformImage(e);

      setUpdateDetails((prev) => ({
        ...prev,
        avatar: image as string,
      }));
    } catch (err: unknown) {
      if (err instanceof Error)
        console.log("Profile image error: ", err.message);
    }
  };

  useEffect(() => {
    async function fetchUserDetails() {
      const userDetails = await getUser();

      setUser(userDetails);
    }

    fetchUserDetails();
  }, []);
  return (
    <div className="profile_layout">
      <div className="profile_container">
        <div className="profile_container-left">
          <div className="profile-img-container">
            <img src={user?.avatar} alt="" />
            <span style={{ fontWeight: "bolder" }}>{user?.username}</span>
          </div>
          <div className="profile-details-container">
            <div>
              <label htmlFor="profile-headline">Headline: </label>
              <p className="profile-headline" id="profile-headline">
                {user?.headline}
              </p>
            </div>
            <div>
              <label htmlFor="profile-headline">Email: </label>
              <p className="profile-headline" id="profile-headline">
                {user?.email}
              </p>
            </div>
            <div>
              <label htmlFor="profile-headline">Mobile: </label>
              <p className="profile-headline" id="profile-headline">
                {user?.mobile}
              </p>
            </div>
            <div>
              <label htmlFor="profile-headline">Date of Birth: </label>
              <p className="profile-headline" id="profile-headline">
                {user?.dob}
              </p>
            </div>
            <div>
              <label htmlFor="profile-headline">Zipcode: </label>
              <p className="profile-headline" id="profile-headline">
                {user?.zipcode}
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
                  value={updateDetails.username}
                  onChange={(e) => handleProfileChange(e, "username")}
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
                  onChange={(e) => handleImageSelect(e)}
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
