const UserInfo = ({ currentUser }) => {
  const password = currentUser["address"]["street"];
  return (
    <div className="userDetails">
      <h4 className="heading">Current Info</h4>
      Username: <span>{currentUser.username}</span>
      <br />
      <br />
      Email-address: <span>{currentUser["email"]}</span>
      <br />
      <br />
      Mobile No: <span>{currentUser["phone"]}</span>
      <br />
      <br />
      Pin code: <span>{currentUser["address"]["zipcode"]}</span>
      <br />
      <br />
      Password: <span>{"*".repeat(password.length)}</span>
    </div>
  );
};

export default UserInfo;
