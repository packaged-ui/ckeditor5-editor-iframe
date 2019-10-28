import getDataFromElement from '@ckeditor/ckeditor5-utils/src/dom/getdatafromelement';
import setDataInElement from '@ckeditor/ckeditor5-utils/src/dom/setdatainelement';
import BalloonPanelView from "@ckeditor/ckeditor5-ui/src/panel/balloon/balloonpanelview";

/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const oldGOP = BalloonPanelView._getOptimalPosition;
BalloonPanelView._getOptimalPosition = function ({element, target, positions, limiter, fitInViewport})
{
  let result;
  if(target.nodeType && (target.nodeType === Node.ELEMENT_NODE) && target.matches('body') && target.ownerDocument.defaultView.frameElement)
  {
    target = target.ownerDocument.defaultView.frameElement;
    result = oldGOP({element, target, positions, limiter, fitInViewport});
  }
  else if(target instanceof Range)
  {
    result = oldGOP({element, target, positions, limiter, fitInViewport});
    let w = target.commonAncestorContainer.ownerDocument.defaultView || target.commonAncestorContainer.ownerDocument.parentWindow;
    if(w.frameElement)
    {
      result.top += w.frameElement.offsetTop;
      result.left += w.frameElement.offsetLeft;
    }
    result.top -= w.top.scrollY;
  }
  else if(target.ownerDocument)
  {
    result = oldGOP({element, target, positions, limiter, fitInViewport});
    let w = target.ownerDocument.defaultView || target.ownerDocument.parentWindow;
    if(w.frameElement)
    {
      result.top += w.frameElement.offsetTop;
      result.left += w.frameElement.offsetLeft;
    }
    result.top -= w.top.scrollY;
  }
  else
  {
    result = oldGOP({element, target, positions, limiter, fitInViewport});
  }
  return result;
};

export function getIframeDocument(frameElement)
{
  return (frameElement.contentDocument || frameElement.contentWindow.document);
}

export function getIframeElement(element)
{
  return element.ownerDocument.defaultView.frameElement;
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
  ss.innerHTML = 'html,body{height:auto!important;height:intrinsic!important;height:-moz-fit-content!important;height:-webkit-fit-content!important;height:fit-content!important;padding:0!important;margin:0!important;overflow-x:hidden!important;overflow-y:hidden!important}body{box-sizing:border-box;height:fit-content}body:after{content:" ";visibility:hidden;display:block;height:0;clear:both;}';
  iframeDoc.head.appendChild(ss);

  return iframeDoc.body;
}

export function createEditorCallback(editor, sourceElementOrData)
{
  sourceElementOrData.style.display = 'none';

  let editorElement = editor.ui.view.element || editor.ui.view.editable.element;
  let editorWindow = editorElement.ownerDocument.defaultView;
  editor.iframeElement = editorWindow.frameElement;
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

  // iterate stylesheets, find css matching script filename (s/js/css/)
  let currentScript = document.currentScript;
  if(!currentScript)
  {
    const scripts = document.getElementsByTagName('script');
    currentScript = scripts[scripts.length - 1];
  }
  if(currentScript)
  {
    let cssFilename = currentScript.src.replace(/^.+?([^/]+)\.js$/, '$1.css');
    let links = document.getElementsByTagName('link');
    for(let i = 0; i < links.length; i++)
    {
      if(links.hasOwnProperty(i))
      {
        const link = links[i];
        if(link.href.lastIndexOf(cssFilename) === link.href.length - cssFilename.length)
        {
          // clone it and add into iframe head
          getIframeDocument(editor.iframeElement).head.appendChild(link.cloneNode());
        }
      }
    }
  }

  // ensures that newly configured widgets are rendered correctly
  editor.setData(getDataFromElement(sourceElementOrData));
  doResize();
}
