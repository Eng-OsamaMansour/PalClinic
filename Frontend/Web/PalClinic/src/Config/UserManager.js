
const setUser =  (user) => {
  if (user) {
     localStorage.setItem("user", JSON.stringify(user));
  }
}

const getUser =  () => {
  const user =  localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const clearUser =  () => {
   localStorage.removeItem("user");
};


export { setUser, getUser, clearUser };