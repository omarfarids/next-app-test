"use client";
import React, { useContext, useEffect, useState } from "react";
import { Loader, TextInput } from "@mantine/core";
import { AppContext } from "../context/context";
import { Image } from "@mantine/core";
import { useRouter } from "next/navigation";

const Home = () => {
  const { loggedUserTodos, setLoggedUserTodos } = useContext<any>(AppContext);
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(false);
  const [newTask, setNewTask] = useState("");

  // Adding new task to the list
  const addNewTask = () => {
    if (!isSelected) {
      setIsSelected(!isSelected);
    } else {
      fetch("http://localhost:4000/todos", {
        method: "POST",
        body: JSON.stringify({ task: newTask }),
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              loggedUserTodos.user.username +
                ":" +
                loggedUserTodos.user.password
            ).toString("base64"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setLoggedUserTodos({
            ...loggedUserTodos,
            todoList: [...loggedUserTodos.todoList, { ...data }],
          });
          console.log("Success:", data);
        })
        .catch((err) => console.log(err));
      setIsSelected(false);
      setNewTask("");
    }
  };

  // deleting task from the list
  const deleteTask = (id: any) => {
    fetch(`http://localhost:4000/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            loggedUserTodos.user.username + ":" + loggedUserTodos.user.password
          ).toString("base64"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setLoggedUserTodos({
          ...loggedUserTodos,
          todoList: [
            ...loggedUserTodos.todoList.filter((toDo: any) => toDo.id !== id),
          ],
        });
      })
      .catch((err) => console.log(err));
  };

  // to toggle completion
  const toggleTask = (id: any) => {
    fetch(`http://localhost:4000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            loggedUserTodos.user.username + ":" + loggedUserTodos.user.password
          ).toString("base64"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setLoggedUserTodos({
          ...loggedUserTodos,
          todoList: [
            ...loggedUserTodos.todoList,
            (loggedUserTodos.todoList.find(
              (toDo: any) => toDo.id === id
            ).completed = !loggedUserTodos.todoList.find(
              (toDo: any) => toDo.id === id
            ).completed),
          ],
        });
      })
      .catch((err) => console.log(err));
  };

  if (!loggedUserTodos.loggedIn) {
    return (
      <div className="spinner centered">
        <Loader size="xl" variant="bars" />
      </div>
    );
  }
  return (
    <div className="user-card">
      <div>
        <Image
          className="user-card__avatar"
          src={loggedUserTodos.user.avatar}
          alt={loggedUserTodos.user.name}
        />
        <h1 className="user-card__title">{loggedUserTodos.user.name}</h1>
      </div>
      <ul className="user-card__todos">
        {loggedUserTodos?.todoList?.map((todo: any) => {
          if (todo.completed && todo.id) {
            return (
              <li key={todo.id}>
                <del>{todo.task}</del>
                <div>
                  <button
                    className="btn-seconary btn"
                    onClick={() => toggleTask(todo.id)}
                  >
                    toggle
                  </button>
                  <button
                    className="btn-danger btn"
                    onClick={() => deleteTask(todo.id)}
                  >
                    X
                  </button>
                </div>
              </li>
            );
          } else if (todo.id) {
            return (
              <li key={todo.id}>
                {todo.task}
                <div>
                  <button
                    className="btn-seconary btn"
                    onClick={() => toggleTask(todo.id)}
                  >
                    toggle
                  </button>
                  <button
                    className="btn-danger btn"
                    onClick={() => deleteTask(todo.id)}
                  >
                    X
                  </button>
                </div>
              </li>
            );
          }
        })}
        {isSelected && (
          <TextInput
            required
            placeholder="Add new task here ..."
            value={newTask}
            onChange={(e: any) => {
              setNewTask(e.target.value);
            }}
          />
        )}
        <button className="btn btn-primary" onClick={addNewTask}>
          Add task
        </button>
      </ul>
      <button
        className="logout-btn btn btn-primary"
        type="button"
        onClick={() => {
          setLoggedUserTodos({
            loggedIn: false,
            user: {},
            todoList: [],
          });
          router.push("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
