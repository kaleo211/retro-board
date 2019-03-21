import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';

import Button from '@material-ui/core/Button';
import { Tooltip, Avatar, Grid } from '@material-ui/core';
import { List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

import {
  VpnKeyOutlined,
  LockOutlined,
  VoiceChat,
  SaveOutlined,
  RefreshRounded,
  Assignment,
  CheckRounded,
  HistoryRounded,
} from '@material-ui/icons';

import { patchBoard, setBoard, fetchBoards } from '../actions/boardActions';
import { setGroup } from '../actions/groupActions';
import { openSnackBar, setPage } from '../actions/localActions';
import { patchAction } from '../actions/itemActions';

const styles = theme => ({
});

class ActionBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpen: false,
    }

    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
  }

  handleVideoOpen(url) {
    let win = window.open(url, '_blank');
    win.focus();
  }

  handleBoardLock() {
    let updatedBoard = { locked: true };
    this.props.patchBoard(this.props.board, updatedBoard);
    this.props.openSnackBar("Board is LOCKED.")
  }

  handleBoardUnlock() {
    let updatedBoard = { locked: false };
    this.props.patchBoard(this.props.board, updatedBoard);
    this.props.openSnackBar("Board is UNLOCKED.");
  }

  handleRefreshBoard() {
    this.props.setBoard(this.props.board.id);
  }

  handleViewHistory() {
    this.props.fetchBoards();
    this.props.setPage('boardList');
  }

  handleBoardFinish() {
    let updatedBoard = { finished: true };
    this.props.patchBoard(this.props.board, updatedBoard);
    this.props.setPage('createBoard');
    this.props.openSnackBar("Board is ARCHIVED.");
    this.props.setGroup(this.props.group.id);
    this.props.setBoard(null);
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false });
  }

  handleDialogOpen() {
    this.setState({ dialogOpen: true });
  }

  handleActionCheck(action) {
    this.props.patchAction("actions/" + action.id, { finished: true })
      .then(() => {
        this.props.setGroup(this.props.group.id);
      });
  }

  render() {
    const { board, members, group } = this.props;
    const membersWithActions = members.filter(member =>
      member.actions && member.actions.filter(action =>
        !action.finished && action.group.id === group.id
      ).length > 0
    );

    return (<div>
      <Tooltip title="Show board history" placement="bottom">
        <IconButton id="historyButton" onClick={this.handleViewHistory.bind(this)} color="inherit">
          <HistoryRounded />
        </IconButton>
      </Tooltip>
      {board && (
        <Tooltip title="Refresh board" placement="bottom">
          <IconButton id="refreshButton" onClick={this.handleRefreshBoard.bind(this)} color="inherit">
            <RefreshRounded />
          </IconButton>
        </Tooltip>)}
      {board && board.facilitator && board.facilitator.video && (
        <Tooltip title="Open video chat" placement="bottom">
          <IconButton onClick={this.handleVideoOpen.bind(this, board.facilitator.video)} color="inherit">
            <VoiceChat />
          </IconButton>
        </Tooltip>)}
      {board && (
        <Tooltip title="Show actions" placement="bottom">
          <IconButton onClick={this.handleDialogOpen} color="inherit">
            <Assignment />
          </IconButton>
        </Tooltip>)}
      {board && !board.locked && (
        <Tooltip title="Lock board" placement="bottom">
          <IconButton onClick={this.handleBoardLock.bind(this)} color="inherit">
            <LockOutlined />
          </IconButton>
        </Tooltip>)}
      {board && board.locked && (
        <Tooltip title="Unlock board" placement="bottom">
          <IconButton onClick={this.handleBoardUnlock.bind(this)} color="inherit">
            <VpnKeyOutlined />
          </IconButton>
        </Tooltip>)}
      {board && !board.finished && (
        <Tooltip title="Archive board" placement="bottom">
          <IconButton onClick={this.handleBoardFinish.bind(this)} color="inherit">
            <SaveOutlined />
          </IconButton>
        </Tooltip>)}

      <Dialog
        fullWidth
        open={this.state.dialogOpen}
        onClose={this.handleDialogClose} >
        <DialogTitle>
          {membersWithActions && membersWithActions.length > 0 ? "Actions" : "No Actions"}
        </DialogTitle>
        <DialogContent>
          <Grid container justify="flex-start" spacing={16}>
            {membersWithActions.map(member => (
              <Grid item xs={12} key={"action" + member.userID}>
                <List>
                  {member.actions && member.actions.filter(ac => ac.group.id === group.id && !ac.finished).map((a, idx) => (
                    <ListItem divider key={"actionToCheck" + a.id} button >
                      <Avatar style={{ backgroundColor: idx === 0 || 'rgba(0, 0, 0, 0)' }}>{member.userID}</Avatar>
                      <ListItemText primary={a.title} />
                      <ListItemSecondaryAction onClick={this.handleActionCheck.bind(this, a)}>
                        <IconButton><CheckRounded /></IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>))}
                </List>
              </Grid>))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDialogClose} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
    </div>);
  }
}

const mapStateToProps = (state) => ({
  board: state.boards.board,
  group: state.groups.group,
  members: state.groups.members,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setBoard: (id) => dispatch(setBoard(id)),
    patchBoard: (board, updatedBoard) => dispatch(patchBoard(board, updatedBoard)),
    fetchBoards: () => dispatch(fetchBoards()),
    setGroup: (id) => dispatch(setGroup(id)),
    patchAction: (link, updatedAction) => dispatch(patchAction(link, updatedAction)),
    openSnackBar: (message) => dispatch(openSnackBar(message)),
    setPage: (page) => dispatch(setPage(page)),
  }
};

ActionBar.propTypes = {
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ActionBar);
