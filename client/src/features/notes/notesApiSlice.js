import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
  // Put "Open" top and "Completed" below in NotesList
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});
const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => ({
        url: "/notes",
        // RTK Query always returns a 200, but sets an `isError` property when there is an error.
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      // If you query an endpoint, then unmount the component, then mount another component that makes the same request within the given time frame (5 sec), the most recent value will be served from the cache.
      // keepUnusedDataFor: 5,
      // Match id with MongoDB "_id" before query hit the cache
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "note", id })),
          ];
        } else return [{ type: "note", id: "LIST" }];
      },
    }),
    addNewNote: builder.mutation({
      query: (initialNote) => ({
        url: "/notes",
        method: "POST",
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),
    updateNote: builder.mutation({
      query: (initialNote) => ({
        url: "/notes",
        method: "PATCH",
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: `/notes`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
  }),
});

// Automatically created "useXXXXQuery"
export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

// Returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// Creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  // Normalized state object with ids and entities
  (notesResult) => notesResult.data
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState
);
