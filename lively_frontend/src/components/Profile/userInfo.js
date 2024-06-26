const UserInfo = ({ userDetails }) => {
  const password = "abcdefghij";
  return (
    <div className="userDetails">
      <h4 className="heading">Current Info</h4>
      Email-address: <span>{userDetails["email"]}</span>
      <br />
      <br />
      Mobile No: <span>{userDetails["mobile"]}</span>
      <br />
      <br />
      Date of Birth: <span>{userDetails["dob"]}</span>
      <br />
      <br />
      Pin code: <span>{userDetails["zipCode"]}</span>
      <br />
      <br />
      Password: <span>{"*".repeat(password.length)}</span>
    </div>
  );
};

export default UserInfo;
