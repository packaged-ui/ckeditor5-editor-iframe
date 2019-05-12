/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

// The editor creator to use.
import getDataFromElement from '@ckeditor/ckeditor5-utils/src/dom/getdatafromelement';
import setDataInElement from '@ckeditor/ckeditor5-utils/src/dom/setdatainelement';

let thisScript = document.currentScript;

export function getIframeDocument(frameElement)
{
  return (frameElement.contentDocument || frameElement.contentWindow.document);
}

export function createIframe(sourceElementOrData)
{
  // create iframe and hide original textarea
  let frameElement = document.createElement('iframe');
  frameElement.className = sourceElementOrData.className;
  sourceElementOrData.parentElement.insertBefore(frameElement, sourceElementOrData);

  let iframeDoc = getIframeDocument(frameElement);

  // clearfix
  let ss = document.createElement('style');
  ss.innerHTML = 'body{margin:0;box-sizing:border-box;height:fit-content;padding:10px;overflow-y:hidden;overflow-x:auto}body:after{content: " ";visibility: hidden;display: block;height: 0;clear: both;}';
  iframeDoc.head.appendChild(ss);

  // import ck into iframe
  let sc = document.createElement('script');
  sc.src = thisScript.src;
  iframeDoc.head.appendChild(sc);

  return iframeDoc.body;
}

export function createEditorCallback(sourceElementOrData)
{
  return function (editor)
  {
    sourceElementOrData.style.display = 'none';

    let editorElement = editor.ui.view.element || editor.ui.view.editable.element;
    let editorWindow = editorElement.ownerDocument.defaultView;
    let doResize = function () {setTimeout(resizeIframe, 0);};
    let addResizeEvent = function ()
    {
      removeResizeEvent();
      editorWindow.addEventListener('resize', doResize);
    };
    let removeResizeEvent = function ()
    {
      editorWindow.removeEventListener('resize', doResize);
    };
    editorWindow.addEventListener('resize', doResize);

    let resizeIframe = function ()
    {
      removeResizeEvent();
      let ele = editor.ui.view.element || editor.ui.view.editable.element;
      editorWindow.frameElement.style.height = ele.offsetHeight + 'px';
      addResizeEvent();
    };

    // resize Iframe when content changes
    editor.model.document.on('ready', doResize);
    editor.model.document.on('change', doResize);
    editor.model.document.on('change', () => setDataInElement(sourceElementOrData, editor.getData()));

    // ensures that newly configured widgets are rendered correctly
    editor.setData(getDataFromElement(sourceElementOrData));
    doResize();
  }
}
