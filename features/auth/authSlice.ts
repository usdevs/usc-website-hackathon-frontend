import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../../redux_app/store";
import { getJwtTokenFromBackend } from "./authAPI";
import { TelegramUser } from "../../components/TelegramLoginButton";
import { HYDRATE } from "next-redux-wrapper";

export interface AuthState {
  token: string;
}

const initialState: AuthState = {
  token: ""
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchJwtToken = createAsyncThunk(
  'auth/fetchJwtToken',
  async (user: TelegramUser) => {
    // The value we return becomes the `fulfilled` action payload
    return await getJwtTokenFromBackend(user);
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    logout: (state) => {
      state.token = "";
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    }
    /*
        increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
     */
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },

});
export const { logout, setToken } = authSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.auth.value)`
export const selectToken = (state: AppState) => state.auth.token;

export default authSlice.reducer;
