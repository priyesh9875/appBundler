import React from 'react';
import PageBase from './PageBase';

class NotFoundPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (

      <PageBase  title="404 error" nativation={this.props.location.pathname} >
        <div>
          <div>
            <h1>404 Page Not Found</h1>
            <p>Path <b> {this.props.location.pathname}</b> not found on this server.</p>
          </div>
        </div>
      </PageBase>
    )
  }

}

NotFoundPage.PropTypes = {
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string
  })
}



export default NotFoundPage;
