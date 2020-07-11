import React from 'react';
import PropTypes from 'prop-types';
export default class TmpPage extends React.Component {
  static propTypes = {
    load: PropTypes.any,
    isProduction: PropTypes.bool,
    children: PropTypes.any,
    location: PropTypes.any,
    history: PropTypes.any,
    router: PropTypes.any,
    match: PropTypes.any,
  }

  constructor(props) {
    super(props);
    this.state = { component: '' };
  }
  update() {
    this.setState({ ts: new Date().getTime() });
  }
  UNSAFE_componentWillMount() {
    this.handlerLoadingPage(this.props.component);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.com !== this.props.com) {
      this.load(nextProps.component);
    }
  }
  handlerLoadingPage(component) {
    if (component && typeof component === 'function') {
      component().then((a) => {
        this.setState({ com1: a.default });
      })
    }
  }
  render() {
    const { com1 } = this.state;
    return (
      <div>
        {com1 ? this.props.children(com1) : (<div>加载中...</div>)}
      </div>
    );
  }
}


