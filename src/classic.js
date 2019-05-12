import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import {createIframe} from "./shared";
import getDataFromElement from "@ckeditor/ckeditor5-utils/src/dom/getdatafromelement";

export default class ClassicIFrameEditor extends ClassicEditor
{
  static create(sourceElementOrData, config)
  {
    throw 'currently unavailable';

    let iframeBody = createIframe(sourceElementOrData);
    let div = iframeBody.ownerDocument.createElement('div');
    div.innerHTML = getDataFromElement(sourceElementOrData);
    iframeBody.appendChild(div);
    return super.create(div, config)
                .then(createEditorCallback(sourceElementOrData));
  }
}
