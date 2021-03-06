import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { IconButton } from 'office-ui-fabric-react';

import { setBoard, setBoards, archiveBoard, lockBoard, unlockBoard, refreshBoard } from '../actions/boardActions';
import { setGroup } from '../actions/groupActions';
import { setPage } from '../actions/localActions';
import { finishItem } from '../actions/itemActions';

const iconStyle = {
  fontSize: 20,
  color: '#222222',
};

const classNames = mergeStyleSets({
  iconButton: {
    fontSize: 24,
    height: 24,
    width: 24,
    marginRight: 16,
  },
});

class ActionBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onVideoOpen(url) {
    const win = window.open(url, '_blank');
    win.focus();
  }

  onRefreshBoard() {
    this.props.refreshBoard();
  }

  onViewHistory() {
    this.props.setBoards();
    this.props.setPage('boardList');
  }

  async onArchiveBoard() {
    await this.props.archiveBoard(this.props.board.id);
    await this.props.setGroup(this.props.group.id);
    this.props.setBoard(null);
  }

  onActionCheck(action) {
    this.props.finishItem(action);
  }

  onLockBoard() {
    this.props.lockBoard(this.props.board.id);
  }

  onUnlockBoard() {
    this.props.unlockBoard(this.props.board.id);
  }

  render() {
    const { board, page, me, group } = this.props;

    const isFacilitator = me.id == group.facilitatorID;

    return page === 'board' && board && board.stage !== 'archived' &&
      <div style={{ marginLeft: 8 }}>
        <IconButton
            primary
            className={classNames.iconButton}
            iconProps={{iconName: 'Refresh', style: iconStyle}}
            onClick={this.onRefreshBoard.bind(this)}
        />
        {board.locked && isFacilitator &&
          <IconButton
              primary
              className={classNames.iconButton}
              iconProps={{iconName: 'Permissions', style: iconStyle}}
              onClick={this.onUnlockBoard.bind(this)}
          />
        }
        {!board.locked && isFacilitator &&
          <IconButton
              primary
              className={classNames.iconButton}
              iconProps={{iconName: 'Lock', style: iconStyle}}
              onClick={this.onLockBoard.bind(this)}
          />
        }
        {board.video &&
          <IconButton
              primary
              className={classNames.iconButton}
              iconProps={{iconName: 'PresenceChickletVideo', style: iconStyle}}
          />
        }
        {board.stage === 'created' && isFacilitator &&
          <IconButton
              primary
              className={classNames.iconButton}
              iconProps={{iconName: 'archive', style: iconStyle}}
              onClick={this.onArchiveBoard.bind(this)}
          />
        }
      </div>;
  }
}

const mapStateToProps = state => ({
  group: state.groups.group,
  board: state.boards.board,
  page: state.local.page,
  me: state.users.me,
});

const mapDispatchToProps = (dispatch) => ({
  archiveBoard: id => dispatch(archiveBoard(id)),
  finishItem: item => dispatch(finishItem(item)),
  lockBoard: id => dispatch(lockBoard(id)),
  setBoard: id => dispatch(setBoard(id)),
  setBoards: () => dispatch(setBoards()),
  setGroup: id => dispatch(setGroup(id)),
  setPage: page => dispatch(setPage(page)),
  unlockBoard: id => dispatch(unlockBoard(id)),
  refreshBoard: () => dispatch(refreshBoard()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ActionBar);
