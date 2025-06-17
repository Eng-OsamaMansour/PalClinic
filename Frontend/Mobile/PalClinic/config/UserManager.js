import * as SecureStore from "expo-secure-store";

const setUser = async (user) => {
  if (user) {
    await SecureStore.setItemAsync("user", JSON.stringify(user));
  }
}

const getUser = async () => {
  const user = await SecureStore.getItemAsync("user");
  return user ? JSON.parse(user) : null;
};

const clearUser = async () => {
  await SecureStore.deleteItemAsync("user");
};


export { setUser, getUser, clearUser };