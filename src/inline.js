import InlineEditor from "@ckeditor/ckeditor5-editor-inline/src/inlineeditor";
import {createEditorCallback, createIframe} from "./shared";
import BalloonPanelView from "@ckeditor/ckeditor5-ui/src/panel/balloon/balloonpanelview";
import getDataFromElement from "@ckeditor/ckeditor5-utils/src/dom/getdatafromelement";

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
  }
  else
  {
    result = oldGOP({element, target, positions, limiter, fitInViewport});
  }
  return result;
};

export default class InlineIFrameEditor extends InlineEditor
{
  static create(sourceElementOrData, config)
  {
    let frameBody = createIframe(sourceElementOrData);
    frameBody.innerHTML = getDataFromElement(sourceElementOrData);
    return super.create(frameBody, config)
                .then(createEditorCallback(sourceElementOrData));
  }
}
