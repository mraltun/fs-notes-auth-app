import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter();
const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      // RTK Query always returns a 200, but sets an `isError` property when there is an error.
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      // If you query an endpoint, then unmount the component, then mount another component that makes the same request within the given time frame (5 sec), the most recent value will be served from the cache.
      keepUnusedDataFor: 5,
      // Match id with MongoDB "_id" before query hit the cache
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
  }),
});

// Automatically created "useXXXXQuery"
export const { useGetUsersQuery } = usersApiSlice;

// Returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// Creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  // Normalized state object with ids and entities
  (usersResult) => usersResult.data
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
