import React from 'react';
import PropTypes from 'prop-types';
import styles from './App.scss';
import './App.css';

import { XtnLoading, XtnToast } from '../components';
import { connect } from 'react-redux';
import Utility from '../common/Utility';
import { hot } from 'react-hot-loader';

@connect((state) => ({ ...state }))
class App extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
    history: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = { isListen: false, counter: 0, page: 0, size: 5 };

    this.initListen();
  }

  UNSAFE_componentWillMount() {
  }

  componentDidMount() {

  }
  update() {
    this.setState({ _ts: new Date().getTime() });
  }

  initListen() {
    const { isListen } = this.state;
    if (!!isListen) {
      return;
    }
    this.state.isListen = true;

    const { KeyHistory } = Utility.ConstItem;
    Utility.SetContent(KeyHistory, this.props.history);
    Utility.SetContent(Utility.ConstItem.KeyGlobalState, this.props.Common);
  }

  __BuildToastHtml() {
    const { Common } = this.props;
    const { ToastList = [] } = Common || {};
    return ToastList.map((toast) => {
      const { msg: Msg, times: Times, index } = toast;
      return <XtnToast key={index} Msg={Msg} Times={Times} onClose={() => Utility.ToastDelete(index)} />
    })
  }


  render() {
    const { IsLoading } = this.props.Common || {};
    return (
      <div className={styles.appCss}>

        <div className={styles.center}>
          <div className={styles.body}>
            <div> {this.props.children}</div>
          </div>
        </div>

        <div className={styles.otherComponent}>
          {
            IsLoading && <XtnLoading />
          }
          {
            this.__BuildToastHtml()
          }

        </div>
      </div>
    );
  }
}

export default hot(module)(App)