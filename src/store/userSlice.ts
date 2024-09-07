import { UserStateType } from "./type";

export const defaultUser = {
  uid: "",
  name: "",
  token: "",
  account: "",
};

export const createUserSlice: UserStateType = (set) => ({
  isLogin: false,

  user: defaultUser,

  settings: {},

  login: () => {},

  loginAsGuest: () => {
    set((state) => {
      state.isLogin = true;
      state.user = {
        uid: "guest",
        name: "guest",
        token: "guest",
        account: "guest",
        isGuest: true,
      };
    });
  },

  quit: () => {
    set((state) => {
      state.isLogin = false;
      state.user = defaultUser;
    });
  },
});
