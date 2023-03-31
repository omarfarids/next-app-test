"use client";
import React, { createContext, useEffect, useState } from "react";

export type ContextProps = {
  loggedUserTodos: any;
  setLoggedUserTodos: (data: any) => void;
};

const AppContext = createContext<Partial<ContextProps>>({});

const AppProvider = ({ children }: any) => {
  const [loggedUserTodos, setLoggedUserTodos] = useState({
    loggedIn: false,
    user: {},
    todoList: [],
  });
  return (
    <AppContext.Provider value={{ loggedUserTodos, setLoggedUserTodos }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
