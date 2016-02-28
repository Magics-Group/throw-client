import React from 'react';
import ReactDOM from 'react-dom';
import yargs from 'yargs';
import webUtil from './js/utils/webUtil';
import Framework from './js/components/Framework.react'

webUtil.disableGlobalBackspace();

ReactDOM.render(<Framework />, document.getElementById('app'));