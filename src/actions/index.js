import _ from "lodash";
import jsonPlaceholder from "../apis/jsonPlaceholder";

export const fetchPostsAndUsers = () => async (dispatch, getState) => {
  await dispatch(fetchPosts());
  // Lodashs version of the .map() array helper: https://lodash.com/docs#map
  // const userIds = _.uniq(_.map(getState().posts, "userId"));
  // userIds.forEach(id => dispatch(fetchUser(id)));

  // Further refactor using lodash. Above two lines are other optional way
  _.chain(getState().posts)
    .map("userId") // Maps over posts, pulling out userId
    .uniq() // Find the unique values
    .forEach(id => dispatch(fetchUser(id))) // Run function over each unique value
    .value(); // Executes the chain
};

export const fetchPosts = () => async dispatch => {
  const response = await jsonPlaceholder.get("/posts");
  dispatch({ type: "FETCH_POSTS", payload: response.data });
};

export const fetchUser = id => async dispatch => {
  const response = await jsonPlaceholder.get(`/users/${id}`);
  dispatch({ type: "FETCH_USER", payload: response.data });
};

// Allows each user to be fetched only once. A function that returns a function so that it won't get called multiple times (10 times per user since each user has 10 posts) using Lodashs memoize method.
// export const fetchUser = id => dispatch => _fetchUser(id, dispatch);
// const _fetchUser = _.memoize(async (id, dispatch) => {
//   const response = await jsonPlaceholder.get(`/users/${id}`);
//   dispatch({ type: "FETCH_USER", payload: response.data });
// });
