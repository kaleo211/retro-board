import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Divider } from '@material-ui/core';
import { Menu, MenuItem } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { selectTeam } from '../actions/teamActions';
import { fetchTeamActiveBoards, selectBoard } from '../actions/boardActions';
import { showPage } from '../actions/localActions';

const styles = theme => ({
});

class TeamMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };
  }

  handleClick(evt) {
    this.setState({ anchorEl: evt.currentTarget });
  };

  handleMenuClose() {
    this.setState({ anchorEl: null });
  };

  handleTeamSelect(teamID) {
    this.props.selectTeam(teamID);
    if (teamID === null) {
      this.props.selectBoard(null);
      this.props.showPage("");
    } else {
      this.props.fetchTeamActiveBoards(teamID)
        .then((boards) => {
          if (boards) {
            if (boards.length === 0) {
              this.props.showPage("boardCreate");
              this.props.selectBoard(null);
            } else if (boards.length === 1) {
              this.props.selectBoard(boards[0].id);
              this.props.showPage("board");
            } else {
              this.props.selectBoard(null);
              this.props.showPage("activeBoards");
            }
          }
        });
    }
    this.handleMenuClose();
  }

  handleTeamCreate() {
    this.props.showPage("teamCreate");
    this.handleMenuClose();
  }

  render() {
    const { team, teams } = this.props;
    const { anchorEl } = this.state;

    return (<div>
      <Button fullWidth variant="flat" style={{ color: "white" }}
        onClick={this.handleClick.bind(this)} >
        {team ? team.name : "TEAMS"}
      </Button>
      <Menu anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.handleMenuClose.bind(this)}>
        <MenuItem onClick={this.handleTeamSelect.bind(this, null)}>
          {'TEAMS'}
        </MenuItem>
        <Divider />
        {teams.map(t => (
          <MenuItem key={t.id} onClick={this.handleTeamSelect.bind(this, t.id)}>
            {t.name}
          </MenuItem>
        ))}
        <MenuItem onClick={this.handleTeamCreate.bind(this)}>
          <Add />
        </MenuItem>
      </Menu>
    </div>)
  }
}

const mapStateToProps = state => ({
  team: state.teams.team,
  teams: state.teams.teams,
});

TeamMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, {
  selectTeam,
  selectBoard,
  showPage,
  fetchTeamActiveBoards
})(withStyles(styles)(TeamMenu));
