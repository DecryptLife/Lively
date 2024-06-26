const useError = (user) => {
  const [unameError, emailError, mobError, zipError, pwdError, coPwdError] =
    Array(6).fill(false);

  if (user.uname === "Ben") {
    unameError = true;
  }
  return unameError, emailError, mobError, zipError, pwdError, coPwdError;
};

export default useError;
