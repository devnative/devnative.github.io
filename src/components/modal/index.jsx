import React from "react";
import {Modal, Tag,} from "antd";

import './index.scss';


const COLORSET = [
  '#571ED3',
  '#E2384C',
  '#07A8E3',
  '#ED7800',
  '#00A391',
  '#135DE7',
  '#1EBB0B',
];

/**
 * 弹窗
 * @param props
 * @returns {*}
 * @constructor
 */
export default function CustomModal (props){
  let {
    visible,
    handleVisble,
    item: {
      name,
      owner,
      url,
      comment,
      logoUrl,
      organization,
      labels,
      webSite,
      repository,
      git_star_num = 0,
      firstCommit,
      latestCommit,
      contributors,
      latestRelease,
      company,
    }
  } = props;
  if((typeof labels) !== 'string'){
    labels = '';
  }
  const labelArr = labels.split(',');
  return (
    <Modal
      visible={visible}
      title={null}
      footer={null}
      centered
      onCancel={handleVisble}
      width='auto'
    >
      <div className="modal-container">
        <div className="modal-up">
          <div className="up-left">
            <img src={logoUrl} alt=""/>
          </div>
          <div className="up-right">
            <div className="title">{name}</div>
            <div className="normal-text organization">{organization}</div>
            <div className="normal-text company">{company}</div>
            <div className="labels">
              {
                labelArr.map((item, i) => {
                  return <Tag className="label-tag" color={COLORSET[i%COLORSET.length]}>{item}</Tag>
                })
              }
            </div>
          </div>
        </div>
        <div className="modal-down">
          <div className="part down-left">
            <div className="line-text"><span className="label">Website</span><a className="normal-text" href={webSite} target="_blank">{webSite}</a></div>
            <div className="line-text"><span className="label">Repository</span><a className="normal-text" href={repository} target="_blank">{repository}</a></div>
            <div className="line-text"><span className="label">First Commit</span><span className="normal-text">{firstCommit}</span></div>
            <div className="line-text"><span className="label">Contributors</span><span className="normal-text">{contributors}</span></div>
          </div>
          <div className="part down-right">
            <div className="line-text"><span className="label">Latest Commit</span><span className="normal-text">{latestCommit}</span></div>
            <div className="line-text"><span className="label">Latest Release</span><span className="normal-text">{latestRelease}</span></div>
          </div>
        </div>
      </div>
    </Modal>
  )
};
