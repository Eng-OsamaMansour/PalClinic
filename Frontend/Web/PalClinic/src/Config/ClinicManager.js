const setClinic = (clinic) => {
  try {
    if (clinic) {

      localStorage.setItem("clinic", JSON.stringify(clinic));
    }
  } catch (error) {
    console.log(error);
  }
};

const getClinic = () => {
  const clinic = localStorage.getItem("clinic");
  return clinic ? JSON.parse(clinic) : null;
};

const clearClinic = () => {
  localStorage.removeItem("clinic");
};

export { setClinic, getClinic, clearClinic };
