import React from 'react';
import styles from './scss/FullBox.scss';
import PropTypes from 'prop-types';

export default class FullBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isDisplay: false };
  }

  componentDidMount() {
    this.__IsDispaly(true);
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (!this.props.IsLock) {
      this.state.isDisplay = nextProps.BeginClose;
    }
  }

  update() {
    this.setState({ ts: new Date() });
  }

  __IsDispaly(isDisplay) {
    this.state.isDisplay = isDisplay;
    setTimeout(() => {
      this.update();
    }, 50);
  }


  render() {
    const { onClick, Name, BeginClose } = this.props;
    const { isDisplay } = this.state;
    return (
      <div className={`${styles.fullBoxCss} ${isDisplay ? styles.display : ''}`} onClick={() => {
        onClick && onClick()
      }}>
        <div className={styles.box}>
          {this.props.children}
        </div>
      </div>
    );
  }
}