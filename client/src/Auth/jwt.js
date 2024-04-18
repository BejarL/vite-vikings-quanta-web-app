export const setJwt = (jwt) => {
  if (!jwt) {
    return "Missing jwt token";
  }

  localStorage.setItem("jwt", `Bearer ${jwt}`);
};

export const clearJwt = () => {
  localStorage.clear();
};

export const getJwt = () => {
  const jwt = localStorage.getItem("jwt");

  return jwt;
};

// checks for jwt error,
// if no error, get data
export const verifyData = async (res, navigate) => {
  const data = await res.json();

  if (data.err === "Invalid authorization, no authorization headers" || 
      data.err === "Invalid authorization, invalid authorization scheme") {
    navigate("/");
  } else {
    return data;
  }
} 
