import React from 'react';
import PropTypes from 'prop-types';
import styles from './scss/CheckboxList.scss'
import CheckBox from './CheckBox';
import { Utility } from '..';

/**
 *  <XtnCheckBoxList 
 *       Disabled={!api.IsModify} 
 *       IsMultiple 
 *       DataSource={CheckBoxDataSource} 
 *       SelectedItems={SelectedItems} 
 *       onChange={(args) => {
 *          api.ModifyArray = args;
 *        }} />
 *
 * @export
 * @class CheckBoxList
 * @extends {React.Component}
 */
export default class CheckBoxList extends React.Component {
  static propTypes = {
    Disabled: PropTypes.bool,//                  是否可用
    IsMultiple: PropTypes.bool,//                是否多选
    DataSource: PropTypes.array,//               [{Title,FieldName},...]
    FieldName: PropTypes.string,//               字段名称
    SelectedItems: PropTypes.array,//            [FieldName1,FieldName2,...]
    onChange: PropTypes.func,//                   是一个方法，返回数据用的。
    onCurrent: PropTypes.func,//                  是一个方法，当前信息
  }
  constructor(props) {
    super(props);
    this.state = { SelectedMap: {} };
  }

  UNSAFE_componentWillMount() {
    this.__Init(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { SelectedItems = [] } = nextProps;
    const { SelectedItems: sItem = [] } = this.props;
    if (JSON.stringify(SelectedItems) !== JSON.stringify(sItem)) {
      this.state.SelectedMap = {};
      if (SelectedItems.length > 0) {
        this.__Init(nextProps);
      }
      this.setState({ ts: new Date() });
    }
  }

  update() {
    this.setState({ _ts: new Date() });
  }

  __Init(props) {
    const { SelectedItems } = props;
    if (!Utility.IsArray(SelectedItems)) {
      return;
    }
    SelectedItems.forEach((fieldName) => {
      this.state.SelectedMap[fieldName] = true;
    })
  }

  __HandlerClick(args, index) {
    const { FieldName, Disabled, IsMultiple, onChange, onCurrent } = this.props;
    if (!!Disabled) {
      return;
    }
    if (IsMultiple) {
      this.state.SelectedMap[args.FieldName] = !this.state.SelectedMap[args.FieldName];
    } else {
      this.state.SelectedMap = {};
      this.state.SelectedMap[args.FieldName] = !this.state.SelectedMap[args.FieldName];
    }
    this.update();
    const { SelectedMap } = this.state;
    const items = Object.keys(SelectedMap).filter((f) => SelectedMap[f]);

    onChange && onChange({ field: FieldName, value: items });

    const { Title: title, FieldName: field } = args;
    onCurrent && onCurrent({ index, title, field, isSelected: this.state.SelectedMap[args.FieldName] ? true : false });
  }

  render() {
    const { DataSource } = this.props;
    const { SelectedMap } = this.state;

    return (
      <div className={styles.CheckboxListCss}>
        {
          DataSource && DataSource.map((row, index) => {
            return (
              <div className={styles.item} key={index}>
                <CheckBox Selected={SelectedMap[row.FieldName]} {...row} onClick={this.__HandlerClick.bind(this, row, index)} />
              </div>
            );
          })
        }
      </div>
    );
  }
}