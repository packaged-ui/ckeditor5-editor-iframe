import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import {createEditorCallback, createIframe} from "./shared";
import getDataFromElement from "@ckeditor/ckeditor5-utils/src/dom/getdatafromelement";

export default class ClassicIFrameEditor extends ClassicEditor
{
  static create(sourceElementOrData, config)
  {
    let iframeBody = createIframe(sourceElementOrData);
    let div = iframeBody.ownerDocument.createElement('div');
    div.innerHTML = getDataFromElement(sourceElementOrData);
    iframeBody.appendChild(div);
    return new Promise(
      resolve =>
      {
        super.create(div, config)
             .then(editor =>
                   {
                     createEditorCallback(editor, sourceElementOrData);
                     resolve(editor);
                   }
             );
      });
  }
}
