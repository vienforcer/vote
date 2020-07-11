import React from 'react';
import { Utility } from '../services';

export default class BasePage extends React.Component {
  constructor(props) {
    super(props);

  }

  UNSAFE_componentWillMount() {

  }

  UNSAFE_componentWillReceiveProps(pros, state) {

  }

  update() {
    this.setState({ _ts: new Date().getTime() })
  }

  /**
   * 是否登录
   *
   * @memberof BasePage
   */
  JudgeIsLog() {

  }

  ToPage(url, params, search) {
    Utility.ToPage(url, params, search);
  }
  GoBack() {
    Utility.GoBack();
  }

  
}