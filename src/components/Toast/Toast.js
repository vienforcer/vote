import React from 'react';
import PropTypes from 'prop-types';

import styles from './scss/Toast.scss';

export default class Toast extends React.Component {

  static propTypes = {
    Msg: PropTypes.string,
    Times: PropTypes.number,
    onClose: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

    this.displayMsg();
  }
  update() {
    this.setState({ ts: new Date() });
  }

  updateDisplay(isDisplay) {
    this.state.display = isDisplay;
    this.update();
  }

  close() {
    this.updateDisplay(false);
    const { onClose } = this.props;
    setTimeout(() => {
      onClose && onClose();
    }, 100);
  }

  displayMsg() {
    const { Times = 1500 } = this.props;
    setTimeout(() => {
      this.updateDisplay(true);
    }, 100);

    setTimeout(() => {
      this.close();
    }, Times + 100)
  }

  render() {
    const { Msg } = this.props;
    const { display } = this.state;
    return (<div className={styles.toastCss}>
      <div className={`${styles.msg} ${!!display ? styles.action : ''}`}>
        {Msg || ''}
      </div>
    </div>);
  }
}