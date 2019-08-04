import Utils from '../components/Utils';
import { setBoard } from './boardActions';
import { setActiveItem } from './localActions';
import { getMe } from './userActions';

export const patchItem = (item) => async (dispatch) => {
  await Utils.patch('items', item);
  dispatch(setBoard(item.boardId));
};

export const likeItem = (item) => async (dispatch) => {
  await Utils.fetch(`/items/${item.id}/like`);
  dispatch(setBoard(item.boardId));
};

export const finishItem = (item) => async (dispatch) => {
  await Utils.fetch(`/items/${item.id}/finish`);
  dispatch(getMe());
  dispatch(setBoard(item.boardId));
};

export const startItem = (item) => async (dispatch) => {
  const resp = await Utils.fetch(`/items/${item.id}/start`);
  if (resp) {
    dispatch(setBoard(item.boardId));
    dispatch(setActiveItem(resp.json()));
  }
};

export const deleteItem = (item) => async (dispatch) => {
  await Utils.delete('items', item.id);
  dispatch(setBoard(item.boardId));
};

export const postItem = (item) => async (dispatch) => {
  await Utils.post('items', item);
  dispatch(setBoard(item.boardId));
};
