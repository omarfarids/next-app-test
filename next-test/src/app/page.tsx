import { UserCard } from "./clientComponents";
import { users } from "@/data/users";

export default function Home() {
  return (
    <main>
      <div className="user-list centered">
        {users.map((user) => {
          return <UserCard key={user.id} {...user} />;
        })}
      </div>
    </main>
  );
}
