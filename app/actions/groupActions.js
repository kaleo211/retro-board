import {
  FETCH_GROUPS,
  SET_GROUP,
  POST_GROUP
} from './types';
import Utils from '../components/Utils';

export const fetchGroups = () => {
  return (dispatch) => {
    Utils.list('group').then(groups => {
      dispatch({
        type: FETCH_GROUPS,
        groups,
      });
    });
  };
};

export const postGroup = (updatedGroup) => {
  return (dispatch) => {
    Utils.post('group', updatedGroup).then(group => {
      Utils.list('group').then(groups => {
        dispatch({
          type: POST_GROUP,
          groups,
          group,
        });
      });
    });
  };
};

export const setGroup = (groupID) => {
  return (dispatch) => {
    if (groupID) {
      Utils.get(`group`, groupID).then(group => {
        let members = group.members || [];
        dispatch({
          type: SET_GROUP,
          group,
        });
      });
    } else {
      dispatch({
        type: SET_GROUP,
        group: null,
      });
    }
  };
};

export const addUserToGroup = (groupID, userID) => {
  return (dispatch) => {
    console.log('addUserToGroup:', groupID, userID);
    let group = { id: groupID, userID: userID }
    Utils.patch('group', group).then(body => {
      dispatch({
        type: SET_GROUP,
        group: body,
      })
    });
  };
};