import React, { Component } from 'react'
import PageBase from './PageBase';


class AboutUs extends Component {
    render() {
        return (
            <PageBase title={"About"} navigation={"About"} >
                <div >
                    <p>Cloud app bundler is a free open source project created as for cloud project at <b>NMIT Karnataka India campus</b></p>
                    <p>More to come</p>
                </div>
            </PageBase>
        )
    }
}


export default AboutUs
