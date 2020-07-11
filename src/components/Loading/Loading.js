import React from 'react';
import PropTypes from 'prop-types';
import styles from './scss/Loading.scss';
import { XtnFixedFullBox } from '../'

export default class Loading extends React.Component {
  static propTypes = {
    Type: PropTypes.string,// 加载类型
  }
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <XtnFixedFullBox IsLock BeginClose={false}>
        <div className={styles.loadingCss}>
          <div className={styles.box}>
            <div></div>
          </div>
        </div>
      </XtnFixedFullBox>
    );
  }
}