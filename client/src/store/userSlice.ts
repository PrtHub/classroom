import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  currentUser: {
    _id: string;
    email: string;
    fullName: string;
    password: string;
    refreshToken: string;
    role: 'principal' | 'teacher' | 'student';
  } | null;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState["currentUser"]>) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
