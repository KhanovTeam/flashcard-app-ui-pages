import {httpClient} from "./httpClient.ts";
import {USERS_URL} from "../Constants/BaseURL.ts";
import {UserTypes} from "../types/UserTypes.ts";

export const getCurrentUser = async () =>
    await httpClient<unknown, UserTypes>(`${USERS_URL}/currentUser`);