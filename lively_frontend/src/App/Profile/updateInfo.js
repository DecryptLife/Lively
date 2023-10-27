import { useEffect, useState } from "react";
import axios from "axios";

const UpdateInfo = ({ handleUpdate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobNo, setMobNo] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [pwd, setPwd] = useState("");
  const [date, setDate] = useState("");
  const [eErr, setEErr] = useState(false);
  const [mErr, setMErr] = useState(false);
  const [zErr, setZErr] = useState(false);
  const [pErr, setPErr] = useState(false);

  let emailError = false;
  let mobError = false;
  let zipError = false;
  let pwdError = false;

  let validInputs = false;

  const validateFields = () => {
    emailError = false;
    mobError = false;
    zipError = false;
    pwdError = false;
    validInputs = false;

    const email_re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const mob_re = /[1-9]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}$/;
    const zip_re = /\b\d{5}\b/;
    const pwd_re = /[a-zA-Z0-9]{6}/;

    if (email !== "") {
      emailError = !email_re.test(email);
      emailError ? setEErr(true) : setEErr(false);
    }

    if (mobNo !== "") {
      mobError = !mob_re.test(mobNo);
      mobError ? setMErr(true) : setMErr(false);
    }

    if (zipCode !== "") {
      zipError = !zip_re.test(zipCode);
      zipError ? setZErr(true) : setZErr(false);
    }

    if (pwd !== "") {
      pwdError = !pwd_re.test(pwd);
      pwdError ? setPErr(true) : setPErr(false);
    }

    if (
      emailError === true ||
      mobError === true ||
      zipError === true ||
      pwdError === true
    ) {
      validInputs = false;
    } else {
      validInputs = true;

      if (validInputs === true) {
        handleUpdate({ name, email, mobNo, zipCode, date, pwd });
        setName("");
        setEmail("");
        setMobNo("");
        setZipCode("");
        setPwd("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields();
  };

  return (
    <div className="updateInfo">
      <h4 className="heading">Update Info</h4>
      <form onSubmit={(e) => handleSubmit(e)}>
        {/* <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input> */}
        {/* <br />
        <br /> */}
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <br></br>
        {eErr && <span className="redText">Not a valid email address</span>}
        <br />
        <input
          type="text"
          placeholder="Mobile number"
          value={mobNo}
          onChange={(e) => setMobNo(e.target.value)}
        ></input>
        <br></br>
        {mErr && <span className="redText">Mobile number not valid</span>}
        <br></br>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        ></input>
        <br />
        <br />
        <input
          type="number"
          placeholder="Zip code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        ></input>
        <br></br>
        {zErr && <span className="redText">Not a valid zip code</span>}
        <br />
        <input
          type="password"
          placeholder="Password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        ></input>
        <br></br>
        {pErr && (
          <span className="redText">
            Password must atleast have 6 characters
          </span>
        )}
        <br />
        <button className="updateBtn" type="submit">
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateInfo;
