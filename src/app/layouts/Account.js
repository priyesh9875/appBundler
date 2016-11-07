import React, { PropTypes } from 'react';
import Header from '../components/Header';
import LeftDrawer from '../components/LeftDrawer';
import withWidth, {LARGE, SMALL} from 'material-ui/utils/withWidth';
import cookie from 'react-cookie';
import globalStyles from '../styles.css';

import Applications from 'material-ui/svg-icons/action/dns';
import DashBoard from 'material-ui/svg-icons/action/home';
import Contacts from 'material-ui/svg-icons/action/pregnant-woman';


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      navDrawerOpen: false,
      user: cookie.load("user")
    };

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.width !== nextProps.width) {
      this.setState({ navDrawerOpen: nextProps.width === LARGE });
    }
  }

  handleChangeRequestNavDrawer() {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    });
  }

  render() {
    let { navDrawerOpen } = this.state;
    const paddingLeftDrawerOpen = 236;

    const styles = {
      header: {
        paddingLeft: navDrawerOpen ? paddingLeftDrawerOpen : 0
      },
      container: {
        margin: '80px 20px 20px 15px',
        paddingLeft: navDrawerOpen && this.props.width !== SMALL ? paddingLeftDrawerOpen : 0
      }
    };

    const child = React.Children.map(this.props.children, (c) => React.cloneElement(c, this.props));

    return (
      <div>
        <Header styles={styles.header}
          handleChangeRequestNavDrawer={this.handleChangeRequestNavDrawer.bind(this) }/>

        <LeftDrawer navDrawerOpen={navDrawerOpen}
          menus={[
            { text: 'DashBoard', icon: <DashBoard/>, link: '/app/' },
            { text: 'About', icon: <Contacts/>, link: '/app/about' }

          ]}
          user={this.state.user}/>

        <div style={styles.container}>
          {child}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  width: PropTypes.number
};

export default withWidth()(App);
