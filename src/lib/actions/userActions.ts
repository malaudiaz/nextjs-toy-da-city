import { getLocale } from "next-intl/server";
import { BACKEND_URL } from "../utils";
import { User } from "@/types/modelTypes";

export async function getUsers() {
    const response = await fetch(`${BACKEND_URL}/en/api/users`, {
      method: "GET"
    });
    const users = await response.json();
    return {users: users.data as User[]};
}