import { useState } from "react";
import { updateStatus } from "../../API/homeAPI";
import { memo } from "react";

interface StatusProps {
  isLoading: boolean;
  userDetails: IUser | null;
}

const Status: React.FC<StatusProps> = memo(({ isLoading, userDetails }) => {
  const req = [
    require("../../images/img1.png"),
    require("../../images/img2.png"),
    require("../../images/img3.png"),
    require("../../images/img4.png"),
    require("../../images/img5.png"),
  ];

  const [headline, setHeadline] = useState<string>(userDetails?.headline || "");
  const [updatedHeadline, setUpdatedHeadline] = useState("");

  const modifyStatus = async () => {
    console.log("modifying status: status.js");
    if (updatedHeadline !== "") {
      try {
        let new_status = updatedHeadline;
        await updateStatus(new_status);
        setHeadline(new_status);
      } catch (err: unknown) {
        if (err instanceof Error)
          console.log(" Headline error: " + err.message);
      } finally {
        setUpdatedHeadline("");
      }
    }
  };

  return (
    <div className="flex-col home_profile">
      <div className="home-profile__img-container">
        {!isLoading && (
          <img
            className="home__profile-img"
            id="user_image"
            alt="profile pic"
            width={150}
            height={150}
            loading="lazy"
            src={userDetails?.avatar || req[1]}
          ></img>
        )}
      </div>
      <div style={{ height: "2rem" }}>
        <span className="statusUsername">
          {isLoading ? " " : userDetails?.username}
        </span>
      </div>
      <div className="userCatchPhrase" style={{ height: "2rem" }}>
        <span className="statusStatus">
          {isLoading ? "  " : headline || userDetails?.headline}
        </span>
      </div>
      <div className="flex-col update-status__container">
        <input
          type="text"
          className="update-status__input "
          placeholder="New status"
          onChange={(e) => setUpdatedHeadline(e.target.value)}
          value={updatedHeadline}
        />
        <button className="update-status__btn" onClick={() => modifyStatus()}>
          Update
        </button>
      </div>
    </div>
  );
});

export default Status;
