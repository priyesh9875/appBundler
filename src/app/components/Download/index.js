import React, { Component } from 'react'
import Select from 'react-select';


import 'react-select/dist/react-select.css';
import cookie from 'react-cookie';

import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import CloutUpload from 'material-ui/svg-icons/file/cloud-upload';


const styles = {
    loginContainer: {
        minWidth: 320,
        maxWidth: 400,
        height: 'auto',
        position: 'absolute',
        top: '20%',
        left: 0,
        right: 0,
        margin: 'auto'
    },
    paper: {
        padding: 20,
        overflow: 'auto'
    },
    loginBtn: {
    },
    textHead: {
        fontSize: "35px",
        paddingBottom: "15px",
        textAlign: "center"
    }

};
class Download extends Component {

    constructor(props, context) {
        super(props, context)

        this.state = {
            user: this.props.user,
            value: [],
            bundling: false,
            filesList: []
        }

        this.state.user.filesList.map((value, index) => {
            this.state.filesList.push({
                label: value.name,
                value: value.name,
            })
        })
    }

    handleZip() {
        var filesList = [];
        this.state.value.split(",").map(value => {
            this.state.user.filesList.map(v => {
                if (v.name == value) {
                    filesList.push(v.path);
                    return;
                }
            })
        })

        this.setState({ bundling: true })


        $.post('/api/zip', {
            username: this.state.user.username,
            password: this.state.user.password,
            id: this.state.user.id,
            filesList: filesList
        }).
            success((res) => {
                console.log(res)
                this.props.updateUser(res)
                this.setState({
                    value: [],
                    bundling: false
                })

            })
            .error((err) => {
                console.log("Error", err)
                this.setState({ bundling: false })

            });

    }



    handleSelectChange(value) {
        this.setState({ value });
    }


    render() {
        return (
            <div>

                <br/><br/>
                {
                    this.state.bundling ?
                        <div className="text-center">

                            <CircularProgress size={2} thickness={2} />
                            <p> Please wait...bundling... </p>

                        </div> :
                        <div className="text-center">
                            <p>Select apps and click on bundle button</p>

                            <Select multi simpleValue  value={this.state.value} placeholder="Select apps to bundle" options={this.state.filesList} onChange={this.handleSelectChange.bind(this) } />
                            <br/>
                            <RaisedButton label={  <span><CloutUpload/> Bundle</span>  }
                                primary={true}
                                style={styles.loginBtn}
                                onClick={this.handleZip.bind(this) }/>
                        </div>
                }


            </div>
        )
    }
}


export default Download
