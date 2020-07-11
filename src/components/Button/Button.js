import React from 'react';
import PropTypes from 'prop-types';
import styles from './scss/Button.scss';

export default class Button extends React.Component {

  static propTypes = {
    Title: PropTypes.string,//                           标题
    Size: PropTypes.string,//                            大小:字体大小 s,m,l,xl
    Theme: PropTypes.string,//                           样式:主要颜色
    ClassName: PropTypes.string,//                       类名称
    Disabled: PropTypes.bool,//                          样式:主要颜色
    StyleContent: PropTypes.object,//                    自定义样式
    onClick: PropTypes.func,//                           点击事件。
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { Size, StyleContent, Title, Theme, Disabled, ClassName, onClick } = this.props;
    return (
      <div className={`${styles.buttonCss} ${styles[ClassName] || ''}`} style={StyleContent || {}}>
        <button disabled={!!Disabled} className={`${styles.btn} ${Theme ? styles[Theme] : ''} ${styles[Size || 'm']}`}
          style={StyleContent || {}}
          onClick={
            () => {
              onClick && onClick();
            }
          }>{Title || 'Btn'}</button>
      </div >
    );
  }
}