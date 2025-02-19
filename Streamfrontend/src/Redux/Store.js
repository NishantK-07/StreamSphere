import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./UserSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      userstate: userSlice.reducer
    }
  })
}