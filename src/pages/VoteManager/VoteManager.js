import React from 'react';
import styles from './scss/VoteManager.scss';
import { connect } from 'react-redux';
import { Utility, VoteService } from '../../services';
import { hot } from 'react-hot-loader';
import BasePage from '../BasePage';
import { XtnInputText, XtnCheckBox, XtnButton } from '../../components'


@connect((state) => ({ Common: state.Common }))
class VoteManager extends BasePage {
  constructor(props) {
    super(props);
    this.state = {
      voteInfo: { title: '', vote_type: 1, state: 1 },
      records: [
        { vote_name: '', times: 0 },
        { vote_name: '', times: 0 },
        { vote_name: '', times: 0 },
        { vote_name: '', times: 0 },
      ]
    };
  }

  render() {
    const { voteInfo, records } = this.state;
    return (
      <div className={styles.pageBody}>

        <div className="row align-center">
          <div className="col1"></div>
          <div className="col0">
            <div className="row padding-tb-0">
              {/* 标题 */}
              <div className="col">
                <XtnInputText Title="投票名称" DefaultValue={voteInfo.title} FieldName="title" onBlur={({ field, value }) => {
                  this.state.voteInfo[field] = value;
                  console.log(this.state.voteInfo);
                }} />
              </div>
            </div>
            <div className="row padding-tb-0">
              <div className="col padding-left-0">
                <XtnCheckBox Position="left" Title="是否单选" FieldName="" Selected={!!voteInfo.vote_type} onClick={(a) => {
                  voteInfo.vote_type = a.value;
                  console.log(voteInfo);
                  this.update();
                }} />
              </div>
              <div className="col">
                <XtnCheckBox Position="left" Title="是否启用" FieldName="" Selected={!!voteInfo.state} onClick={(a) => {
                  voteInfo.state = a.value;
                  console.log(voteInfo);
                  this.update();
                }} />
              </div>



            </div>
            <div className="row"></div>
            <div className="row padding-tb-0">
              <div className="col">
                投票项目列表
              </div>

            </div>

            {
              records && records.map((item, index) => {

                return (<div className="row padding-tb-0 align-center" key={`${index}_${Math.random() * new Date().getTime()}`}>
                  <div className="col">
                    <XtnInputText DefaultValue={item.vote_name} onBlur={(args) => {
                      item.vote_name = args.value;

                      console.log(records);
                    }} />
                  </div>
                  <div className="col0">
                    <XtnButton Title="删除" Size="s" onClick={() => {

                      if (records.length > 1) {
                        this.state.records.splice(index, 1);
                        this.update();
                      }

                    }} />
                  </div>
                  <div className="col0">
                    <XtnButton Title="添加" Size="s" onClick={() => {
                      this.state.records.splice(index + 1, 0, { vote_name: '', times: 0 });
                      this.update()
                    }} />
                  </div>
                </div>);
              })
            }

            <div className="row">
              <div className="col"></div>
              <div className="col">
                <XtnButton Title="提交" onClick={async () => {
                  console.log(this.state);
                  Utility.Loading();
                  await VoteService.SaveVoteRecord({ vote_info: this.state.voteInfo, vote_records: this.state.records });
                  Utility.Toast('添加成功.');


                  this.state.voteInfo = { title: '', vote_type: 1, state: 1 };
                  this.state.records = [{ vote_name: '', times: 0 },]

                  this.update();

                  setTimeout(() => {
                    Utility.LoadingHide();
                  }, 300);
                }} />
              </div>
              <div className="col"></div>
            </div>
          </div>
          <div className="col1"></div>
        </div>
      </div>
    );
  }
}

export default hot(module)(VoteManager)