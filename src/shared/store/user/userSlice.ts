// shared/store/user/userSlice.ts
"use client";

import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  isLogged: boolean;
  id: string | undefined;
  name: string | undefined;
  surname: string | undefined;
  email: string | undefined;
  role: string | undefined;
  avatar: string | undefined;
}

// Helper function to safely access sessionStorage
const getSessionStorageUser = () => {
  if (typeof window === 'undefined') return null;

  try {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data from sessionStorage:', error);
    return null;
  }
};

// Create initial state based on sessionStorage
const createInitialState = (): UserState => {
  const sessionUser = getSessionStorageUser();

  if (sessionUser?.isLogged) {
    return {
      isLogged: true,
      id: sessionUser.id,
      name: sessionUser.name,
      surname: sessionUser.surname,
      email: sessionUser.email,
      role: sessionUser.role,
      avatar: sessionUser.avatar
    };
  }

  return {
    isLogged: false,
    id: undefined,
    name: undefined,
    surname: undefined,
    email: undefined,
    role: undefined,
    avatar: undefined
  };
};

const userSlice = createSlice({
  name: 'user',
  initialState: createInitialState(),
  reducers: {
    login(state, action) {
      state.isLogged = true;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.surname = action.payload.surname;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.avatar = action.payload.avatar;

      // Save to sessionStorage on login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(state));
      }
    },
    logout(state) {
      state.isLogged = false;
      state.id = undefined;
      state.name = undefined;
      state.surname = undefined;
      state.email = undefined;
      state.role = undefined;
      state.avatar = undefined;

      // Clear from sessionStorage on logout
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('user');
      }
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;