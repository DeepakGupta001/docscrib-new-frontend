import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export const login = createAsyncThunk("auth/login", async (params, { rejectWithValue }) => {
  try {
    const { router, ...rest } = params;
    const {
      data: { data, code, message }
    } = await axios.post("/users/sign_in", rest);

    if (code === 200) {
      Cookies.set("__Dcocscrib_user", JSON.stringify(data), { expires: 7 });
      return data; // should contain { user, token }
    } else {
      return rejectWithValue(message);
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  Cookies.remove("__Dcocscrib_user");
  return null; // clear state
});

const initialState = {
  user: {},
  token: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = {};
        state.token = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = {};
        state.token = null;
      });
  }
});

export default authSlice.reducer;
