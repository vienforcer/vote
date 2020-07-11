import React from 'react';
import PropTypes from 'prop-types';
import styles from './scss/InputText.scss';

/**
 * <XtnInputText 
 *   Title="标题"
 *   FieldName="字段名称"
 *   InputType="类型,text,password"
 *   DefaultValue="默认值"
 *   StyleContent={Main:{},Title:{}}
 *   onChange={this.XtnInputTextData.bind(this)}  通知数据变化
 *   onBlur={this.XtnInputTextBlur.bind(this)}  失去焦点事件
 *
 * @export
 * @class InputText
 * @extends {React.Component}
 */
export default class InputText extends React.Component {

  static propTypes = {
    FieldName: PropTypes.string,//                      字段
    Title: PropTypes.string,//                          标题
    StyleContent: PropTypes.object,//                   样式内容。
    InputType: PropTypes.string,//                      类型
    Placeholder: PropTypes.string,//                    placeholder
    DefaultValue: PropTypes.string,//                   类型
    Disabled: PropTypes.bool,//                         是否可用
    onChange: PropTypes.func,//                         数据值。
    onBlur: PropTypes.func,//                           失去焦点
  }
  constructor(props) {
    super(props);
    const { DefaultValue = '' } = props || {};
    this.state = { dValue: DefaultValue };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    if (nextProps.DefaultValue !== this.props.DefaultValue) {
      this.setState({ dValue: nextProps.DefaultValue || '' });
    }
  }

  /**
   * 修改内容，通知更新
   *
   * @param {*} event
   * @memberof InputText
   */
  __HanlderNotifyData(event) {
    const { FieldName, onChange } = this.props;
    const value = event.target.value;
    this.setState({ dValue: value || '' });
    onChange && onChange({ field: FieldName, value }, this.props);
  }

  /**
   * 失去焦点事件
   *
   * @param {*} event
   * @memberof InputText
   */
  __HanlderBlur(event) {
    const { FieldName, onBlur } = this.props;
    const value = event.target.value;
    this.setState({ dValue: value || '' });
    onBlur && onBlur({ field: FieldName, value }, this.props);
  }

  __StyleByTitle() {
    const { StyleContent = {} } = this.props || {};
    const { Title = {} } = StyleContent || {};
    return Title;
  }
  __StyleInfo() {
    const { StyleContent, Margin } = this.props;
    const { Margin: margin, Main = {} } = StyleContent || {};

    const info = { ...Main };
    if (Margin) {
      info.margin = `${Margin}px`;
    }
    if (margin) {
      info.margin = margin;
    }
    return info;
  }
  __StyleTextArea() {
    const { StyleContent } = this.props;
    const { TextArea = {} } = StyleContent || {};
    return TextArea;
  }

  render() {
    const { InputType = 'text', Title, Disabled } = this.props;
    const { dValue } = this.state;

    return (
      <div className={styles.inputTextCss} style={this.__StyleInfo()}>
        {
          Title &&
          <div className={styles.label} style={this.__StyleByTitle()}>{Title}</div>
        }
        <div className={styles.value}>
          {
            InputType === 'textarea' ?
              <textarea
                placeholder={this.props.Placeholder || ''}
                style={this.__StyleTextArea()}
                disabled={!!Disabled} value={dValue || ''}
                onChange={this.__HanlderNotifyData.bind(this)}
                onBlur={this.__HanlderBlur.bind(this)} />
              :
              <input
                type={InputType}
                placeholder={this.props.Placeholder || ''}
                disabled={!!Disabled} value={dValue || ''}
                onChange={this.__HanlderNotifyData.bind(this)}
                onBlur={this.__HanlderBlur.bind(this)} />
          }
        </div>
      </div>
    );
  }
}