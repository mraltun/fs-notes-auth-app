import React from "react";
import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";

const NotesList = () => {
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
    // setupListeners in the store enabled in store for these options. One of the reasons for this to keep it updated for multiple users
  } = useGetNotesQuery(undefined, {
    // Re-fetch data interval
    pollingInterval: 15000,
    // Re-fetch when the app window on focus again
    refetchOnFocus: true,
    // Re-fetch  refetch when a new subscriber to a query is added
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className='errmsg'>{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = notes;

    const tableContent = ids?.length
      ? ids.map((noteId) => <Note key={noteId} noteId={noteId} />)
      : null;

    content = (
      <table className='table table--notes'>
        <thead className='table__thead'>
          <tr>
            <th scope='col' className='table__th note__status'>
              Username
            </th>
            <th scope='col' className='table__th note__created'>
              Created
            </th>
            <th scope='col' className='table__th note__updated'>
              Updated
            </th>
            <th scope='col' className='table__th note__title'>
              Title
            </th>
            <th scope='col' className='table__th note__username'>
              Owner
            </th>
            <th scope='col' className='table__th note__edit'>
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};

export default NotesList;
