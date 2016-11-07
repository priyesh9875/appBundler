import React, {PropTypes, Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import {cyan600, white} from 'material-ui/styles/colors';
import {typography} from 'material-ui/styles';
import Wallpaper from 'material-ui/svg-icons/device/wallpaper';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import FileCancelDelete from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';

const styles = {
  subheader: {
    fontSize: 24,
    fontWeight: typography.fontWeightLight,
    backgroundColor: cyan600,
    color: white
  }
};


class MyFiles extends Component {

  constructor(props) {
    super(props);

  }

  handleDownload(path) {
    var win = window.open("/app/download?filePath=" + path, '_blank');
    win.focus();
  }

  handleFileDelete(path, name, size) {
    $.post("/app/deleteFile", {
      filePath: path,
      username: this.props.user.username,
      password: this.props.user.password,
    })
      .success(res => {
        // console.log(res);
        this.props.updateUser(res);
      })
      .error(err => {
        // console.log(err)
        alert("Unknown error. Please check the console");

      });
  }

  render() {


    var content = <div>{ this.props.data.length == 0 ?
      <div className="text-center;">No history</div> :
      <div>{this.props.data.map((item, index) =>
        <div key={index}>
          <ListItem
            leftAvatar={<Avatar icon={<Wallpaper />} />}
            primaryText={item.name}
            secondaryText={"Zip size: " + item.size + " bytes"}
            rightIconButton={ <div>
              <IconButton tooltip="Download" onClick={this.handleDownload.bind(this, item.path) }>
                <FileDownload />
              </IconButton>
              <span>       </span>
              <IconButton tooltip={"Delete"} onClick={this.handleFileDelete.bind(this, item.path, item.name, item.size) }>
                <FileCancelDelete/>
              </IconButton>
            </div> }
            />
          <Divider inset={true} />
        </div>
      ) }</div>
    }
    </div>


    return (
      <Paper >
        <List  >
          <Subheader style={styles.subheader}>{this.props.title}</Subheader>
          {content}
        </List>
      </Paper>
    )
  };
}
MyFiles.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string
};

export default MyFiles;