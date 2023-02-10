import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isLoading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
    },
    loginFailed: (state) => {
      state.isLoading = false;
      state.error = true;
    },
    logout: (state) => {
      return initialState;
    },
    changeProfile: (state, action) => {
      //@ts-ignore
      state.currentUser.profilePicture = action.payload;
    },
    following: (state, action) => {
      //@ts-ignore
      if (state.currentUser.following.includes(action.payload)) {
        //@ts-ignore
        state.currentUser.following.splice(
          //@ts-ignore
          state.currentUser.following.findIndex(
            //@ts-ignore
            (followingId) => followingId === action.payload
          )
        );
      } else {
        //@ts-ignore
        state.currentUser.following.push(action.payload);
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logout,
  changeProfile,
  following,
} = userSlice.actions;

export default userSlice.reducer;
export interface userInterface {
  id: string;
  username: string;
  followers: string[];
  following: string[];
  description: string;
  profilePicture: string;
}
