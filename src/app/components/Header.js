import React, {PropTypes} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Menu from 'material-ui/svg-icons/navigation/menu';
import ViewModule from 'material-ui/svg-icons/action/view-module';
import {white} from 'material-ui/styles/colors';
import Face from 'material-ui/svg-icons/action/face';
import Logout from 'material-ui/svg-icons/hardware/keyboard-tab';


import cookie from 'react-cookie';
import {browserHistory} from 'react-router';

class Header extends React.Component {

  logout() {
    Object.keys(cookie.select()).forEach(name => cookie.remove(name, { path: '/' }));
    browserHistory.push('/login');
  }

  dashboard() {
    browserHistory.push('/app/');
  }

  render() {
    const {styles, handleChangeRequestNavDrawer} = this.props;

    var style = {
      appBar: {
        position: 'fixed',
        top: 0,
        overflow: 'hidden',
        maxHeight: 57
      },
      menuButton: {
        marginLeft: 10
      },
      iconsRightContainer: {
        marginLeft: 20
      }
    };

    $.extend(styles, styles.appBar);



    return (
      <div>
        <AppBar
          style={styles}
          title={ ""}
          iconElementLeft={
            <IconButton style={style.menuButton} onClick={handleChangeRequestNavDrawer}>
              <Menu color={white} />
            </IconButton>
          }
          iconElementRight={
            <div style={style.iconsRightContainer}>




              <IconButton  tooltip="Dashboard" onClick={this.dashboard}><ViewModule /></IconButton>
              <IconButton tooltip="Logout" onClick={this.logout}><Logout/></IconButton>


            </div>
          }
          />
      </div>
    );
  }
}

Header.propTypes = {
  styles: PropTypes.object,
  handleChangeRequestNavDrawer: PropTypes.func
};

export default Header;
