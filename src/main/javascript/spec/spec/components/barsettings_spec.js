import React from 'react';
import thunk from 'redux-thunk';

import configureStore from 'redux-mock-store';
import { createShallow } from '@material-ui/core/test-utils';

import BarSettings from '../../../components/BarSettings';
import * as actions from "../../../actions/boardActions";
import * as localActions from '../../../actions/localActions';

describe("BarSettings", () => {
  const mockStore = configureStore([thunk]);

  beforeEach(() => {
  })

  it("has a refresh button", () => {
    let store = mockStore({
      boards: {
        board: {
          id: 0,
          locked: false,
          finished: false,
          facilitator: { video: "fakeURL" },
        },
      },
      teams: {
        members: [{ userID: "fakeID" }],
        team: { name: "fakeTeam" },
      },
    });

    spyOn(actions, 'selectBoard').withArgs(0).and.returnValue("fakeReturn");
    spyOn(store, 'dispatch');

    let shallow = createShallow();

    const wrapper = shallow(<BarSettings store={store} />).dive().dive();

    expect(wrapper.find('#refreshButton').length).toEqual(1);
    wrapper.find('#refreshButton').simulate('click');

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith("fakeReturn");
  });

  it("has a button for view history boards", () => {
    let store = mockStore({
      boards: {
        boards: [
          {id:0, name: "fakeBoard0"},
          {id:1, name: "fakeBoard1"},
        ],
      },
      teams: {
        members: [{ userID: "fakeID" }],
        team: { name: "fakeTeam" },
      },
    });

    spyOn(actions, 'fetchBoards').and.returnValue("fakeFetchBoardsReturn");
    spyOn(localActions, 'showPage').withArgs('boardList').and.returnValue("fakeShowPageReturn");
    spyOn(store, 'dispatch');

    let shallow = createShallow();
    const wrapper = shallow(<BarSettings store={store} />).dive().dive();

    expect(wrapper.find('#historyButton').length).toEqual(1);
    wrapper.find('#historyButton').simulate('click');

    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenCalledWith("fakeFetchBoardsReturn");
  });
});