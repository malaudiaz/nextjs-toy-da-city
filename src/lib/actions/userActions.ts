import { User } from "@/types/modelTypes";

export async function getUsers() {
    const response = await fetch(`api/users`, {
      method: "GET"
    });
    const users = await response.json();
    return {users: users.data as User[]};
}