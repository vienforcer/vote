import React from 'react';
import ReactLoader from 'react-loadable';
const loading = () => {
  return (
    <div></div>
  );
}

import Utility from '../common/Utility';
import XtnFixedFullBox from './FixedBox/FullBox';
import XtnButton from './Button/Button';
import XtnInputText from './InputText/InputText';
import XtnLoading from './Loading/Loading';
import XtnToast from './Toast/Toast';
import XtnCheckBox from './CheckBox/CheckBox';
import XtnRadio from './Radio/Radio';
import XtnDialogConfirm from './Dialog/Confirm';



export {
  Utility, XtnDialogConfirm, XtnFixedFullBox, XtnButton, XtnInputText, XtnLoading, XtnToast, XtnCheckBox, XtnRadio
}