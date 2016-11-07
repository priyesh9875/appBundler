import React, { PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import {spacing, typography} from 'material-ui/styles';
import {white, blue600} from 'material-ui/styles/colors';
import { ListItem} from 'material-ui/List';
import {Link} from 'react-router';
import Avatar from 'material-ui/Avatar';


const styles = {
    logo: {
        cursor: 'pointer',
        fontSize: 22,
        color: typography.textFullWhite,
        lineHeight: `${spacing.desktopKeylineIncrement}px`,
        fontWeight: typography.fontWeightLight,
        backgroundColor: blue600,
        paddingLeft: 40,
        height: 56,
    },
    menuItem: {
        color: white,
        fontSize: 15
    },
    avatar: {
        div: {
            padding: '15px 0 20px 5px',
            backgroundColor: "#224",
            height: 115
        },
        icon: {
            float: 'left',
            display: 'block',
            marginRight: 10,
            boxShadow: '0px 0px 0px 3px rgba(0,0,0,0.2)'
        },
        span: {
            paddingTop: 15,
            display: 'block',
            color: 'white',
            fontWeight: 300,
            textShadow: '1px 1px #444',
            fontSize: 20
        }
    },
    drawer: {
    }
};


class LeftDrawer extends React.Component {


    constructor(props) {
        super(props);
    }




    render() {
        let menu = <div>{this.props.menus.map((menu, index) => {
            if (menu.subMenu) {
                let subMenu = [];
                {
                    menu.subMenu.map((s, i) => {
                        subMenu.push(<ListItem
                            key={i}
                            primaryText={s.text}
                            leftIcon={s.icon}
                            containerElement={<Link to={s.link}/>}
                            />);
                    })
                }

                return <ListItem
                    key={index}
                    style={styles.menuItem}
                    primaryText={menu.text}
                    leftIcon={menu.icon}
                    containerElement={<Link to={menu.link}/>}
                    nestedItems={subMenu}
                    primaryTogglesNestedList={true}
                    nestedListStyle={styles.menuItem}
                    />
            } else {
                return <ListItem
                    key={index}
                    style={styles.menuItem}
                    primaryText={menu.text}
                    leftIcon={menu.icon}
                    containerElement={<Link to={menu.link}/>}
                    />
            }
        }) }</div>

        return (
            <Drawer
                containerStyle={styles.drawer}
                docked={true}
                open={this.props.navDrawerOpen}>
                <div style={styles.logo}>
                    App bundler
                </div>
                <div style={styles.avatar.div}>
                    <Avatar src="http://4vector.com/i/free-vector-evil-admin-warning-clip-art_113205_Evil_Admin_Warning_clip_art_medium.png"
                        size={70}
                        style={styles.avatar.icon}/>
                    <span style={styles.avatar.span}>{this.props.user.name}</span>
                </div>
                <div>
                    {menu}
                </div>
            </Drawer>
        );
    }
}
LeftDrawer.propTypes = {
    navDrawerOpen: PropTypes.bool,
    menus: PropTypes.array,
    username: PropTypes.string,
};

export default LeftDrawer;
