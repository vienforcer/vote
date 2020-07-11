import React from 'react';
import styles from './scss/Header.scss';
import { Utility } from '..';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { _ts: new Date().getTime() }
  }

  update() {
    this.setState({ _ts: new Date().getTime() })
  }
  UNSAFE_componentWillMount() {
    const { cid } = Utility.ParseUrl(window.location.href);
    if (cid) {
      this.state.currentId = cid;
    }
  }

  __HandlerClick(args) {
    this.state.currentId = args.id;
    const { onClick } = this.props;
    onClick && onClick(args);
    this.update();
  }
  render() {
    const { DataSource = [] } = this.props;
    const { currentId } = this.state;
    const items = [...DataSource];
    items.unshift({ id: -1, c_name: '全部' })
    return (
      <div className={styles.headerCss}>
        {/* <div className={styles.logo}></div> */}
        <div className={styles.navs}>
          {
            items.map((row, index) => {
              return (
                <div key={index} className={`${styles.item} ${currentId == row.id ? styles.selected : ''}`} onClick={this.__HandlerClick.bind(this, row)}>{row.c_name}</div>
              );
            })
          }
        </div>
      </div>
    );
  }
}