import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter();
const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => "/notes",
      // RTK Query always returns a 200, but sets an `isError` property when there is an error.
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      // If you query an endpoint, then unmount the component, then mount another component that makes the same request within the given time frame (5 sec), the most recent value will be served from the cache.
      keepUnusedDataFor: 5,
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
  }),
});

// Automatically created "useXXXXQuery"
export const { useGetNotesQuery } = notesApiSlice;

// Returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// Creates memoized selector
const selectnotesData = createSelector(
  selectNotesResult,
  // Normalized state object with ids and entities
  (notesResult) => notesResult.data
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllnotes,
  selectById: selectnoteById,
  selectIds: selectnoteIds,
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
  (state) => selectnotesData(state) ?? initialState
);
