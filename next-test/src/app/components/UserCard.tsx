import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  TextInput,
} from "@mantine/core";
import { useContext, useState } from "react";
import { AppContext } from "../context/context";
import { useRouter } from "next/navigation";

type User = {
  id?: number;
  name: string;
  avatar: string;
  username: string;
};

export function UserCard({ id, name, avatar, username }: User) {
  const { loggedUserTodos, setLoggedUserTodos } = useContext<any>(AppContext);

  const router = useRouter();

  const [selectedUser, setSelectedUser] = useState({
    username,
    password: "",
  });
  const [isSelected, setIsSelected] = useState(false);

  // user login function
  const login = async (e: any) => {
    e.preventDefault();
    fetch("http://localhost:4000/todos", {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            selectedUser.username + ":" + selectedUser.password
          ).toString("base64"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLoggedUserTodos({
          ...loggedUserTodos,
          loggedIn: true,
          user: {
            id,
            username: selectedUser.username,
            avatar,
            name,
            password: selectedUser.password,
          },
          todoList: [...data],
        });
        router.push("/home");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Card
      className="login-card"
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
    >
      <Card.Section>
        <Image src={avatar} height={160} alt={name} />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{name}</Text>
      </Group>

      <form onSubmit={login}>
        {isSelected && (
          <TextInput
            required
            placeholder="Password"
            type="password"
            value={selectedUser.password}
            onChange={(e) => {
              setSelectedUser({
                ...selectedUser,
                password: e.target.value,
              });
            }}
          />
        )}
        <Button
          variant="light"
          type="submit"
          color="blue"
          fullWidth
          mt="md"
          radius="md"
          onClick={(e) => {
            if (!isSelected) {
              e.preventDefault();
              setIsSelected(true);
            }
          }}
        >
          Login
        </Button>
      </form>
    </Card>
  );
}
