import InlineEditor from "@ckeditor/ckeditor5-editor-inline/src/inlineeditor";
import getDataFromElement from '@ckeditor/ckeditor5-utils/src/dom/getdatafromelement';
import {createEditorCallback, createIframe} from "./shared";

export default class InlineIFrameEditor extends InlineEditor
{
  static create(sourceElementOrData, config)
  {
    return new Promise(
      resolve =>
      {
        let frameBody = createIframe(sourceElementOrData);
        frameBody.innerHTML = getDataFromElement(sourceElementOrData);
        super.create(frameBody, config)
             .then(editor =>
                   {
                     createEditorCallback(editor, sourceElementOrData);
                     resolve(editor);
                   }
             );
      });
  }
}

export {InlineIFrameEditor};
