import React from 'react';
import PropTypes from 'prop-types';
import styles from './scss/Radio.scss';

export default class Radio extends React.Component {
  static propTypes = {
    Selected: PropTypes.bool,// 是否选中
    Title: PropTypes.string, // 标题
  }
  constructor(props) {
    super(props);
  }

  render() {
    const { onClick, FieldName, Title, Selected } = this.props;
    return (
      <div className={styles.CheckBoxCss} onClick={() => {

        onClick && onClick({ field: FieldName, value: !Selected ? 1 : 0 })
      }}>

        <div className={`${styles.w} ${Selected ? styles.selected : ''}`}>
          <div className={styles.l}></div>
        </div>

        {Title && <div className={styles.title}>{Title}</div>}
      </div>
    );
  }
}