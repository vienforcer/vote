import React from 'react';
import PropTypes from 'prop-types';
import styles from './scss/CheckBox.scss';

export default class CheckBox extends React.Component {
  static propTypes = {
    Title: PropTypes.string,//                      标题
    Position: PropTypes.string,//                   位置 left ,top, bottom,right
    Selected: PropTypes.bool,//                     是否选中
    onClick: PropTypes.func, //                     点击事件
  }
  constructor(props) {
    super(props);
  }

  __HandlerClick() {
    const { onClick, FieldName, Selected } = this.props;
    onClick && onClick({ field: FieldName, value: !Selected ? 1 : 0 })
  }

  render() {
    const { StyleContent, Title, Selected, Position = 'right' } = this.props
    const { Title: sTitle = {} } = StyleContent || {};

    return (
      <div className={`${styles.CheckBoxCss} ${styles[Position]}`} onClick={this.__HandlerClick.bind(this)}>
        {
          Title && <div className={styles.title} style={sTitle}>{Title}</div>
        }
        <div className={`${styles.w} ${Selected ? styles.selected : ''}`}>
          <div className={styles.l}></div>
        </div>
      </div>
    );
  }
}