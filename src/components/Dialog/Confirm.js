import React from 'react';
import PropTypes from 'prop-types';
import { XtnFixedFullBox, XtnButton } from '../'
import styles from './scss/Confirm.scss';

export default class Confirm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isActive: false };
  }

  componentDidMount() {

    this.__IsActive(true);
  }

  update() {
    this.setState({ ts: new Date() });
  }

  __IsActive(isActive) {
    setTimeout(() => {
      this.state.isActive = isActive;
      this.update();
    }, 50);
  }


  __HandlerClick(type) {
    const { onOk, onCancel } = this.props;
    if (type === 1 && onOk) {
      this.__IsActive(false);
      setTimeout(() => {
        onOk();
      }, 200);
    } else if (type === 0 && onCancel) {
      this.__IsActive(false);
      setTimeout(() => {
        onCancel();
      }, 200);
    }
  }

  render() {
    const { Title, Content, DisabledCancel } = this.props;
    const { isActive } = this.state;
    return (
      <XtnFixedFullBox BeginClose={isActive} onClick={this.__HandlerClick.bind(this, 0)}>
        <div className={`${styles.confirmCss} ${!!isActive ? styles.active : ''}`}>
          <div className={styles.title}>{Title}</div>
          <div className={styles.content}>{Content}</div>
          <div className={styles.btns}>
            <XtnButton className={styles.ok} Title="确认" Size="l" onClick={this.__HandlerClick.bind(this, 1)} />
            {
              !DisabledCancel && <XtnButton className={styles.cancel} Title="取消" Size="l" onClick={this.__HandlerClick.bind(this, 0)} />
            }
          </div>
        </div>
      </XtnFixedFullBox>
    )
  }
}