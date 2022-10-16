import React from "react";
import { useGetUsersQuery } from "./usersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import NewNoteForm from "./NewNoteForm";

const NewNote = () => {
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!users?.length) return <PulseLoader color={"#FFF"} />;

  const content = users ? <NewNoteForm users={users} /> : <p>Loading...</p>;

  return content;
};
export default NewNote;
