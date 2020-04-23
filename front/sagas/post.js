import axios from 'axios';
import { all, delay, fork, put, call, takeLatest } from 'redux-saga/effects';
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  LOAD_MAIN_POSTS_SUCCESS,
  LOAD_MAIN_POSTS_REQUEST,
  LOAD_MAIN_POSTS_FAILURE,
} from '../reducers/post';

function loadMainPostAPI() {
  return axios.get('posts/');
}

function* loadMainPost() {
  try {
    const result = yield call(loadMainPostAPI);
    console.log(result);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMainPost() {
  yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPost);
}

function addPostAPI(addPostData) {
  return axios.post('post/', addPostData, { withCredentials: true });
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    console.log(result.data);
    if (result.data == null) {
      yield put({
        type: ADD_POST_FAILURE,
        error: alert('에러가 발생했습니다.'),
      });
    } else {
      yield put({
        type: ADD_POST_SUCCESS,
        data: result.data,
      });
    }
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: alert(e),
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function addCommentAPI() {}

function* addComment(action) {
  try {
    yield delay(2000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId,
      },
    });
  } catch (e) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e,
    });
  }
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadMainPost),
    fork(watchAddPost),
    fork(watchAddComment),
  ]);
}
