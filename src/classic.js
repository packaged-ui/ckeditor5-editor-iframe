import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import getDataFromElement from "@ckeditor/ckeditor5-utils/src/dom/getdatafromelement";
import {createEditorCallback, createIframe} from "./shared";

export default class ClassicIFrameEditor extends ClassicEditor
{
  static create(sourceElementOrData, config)
  {
    throw 'Classic Editor is not currently supported';
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

export {ClassicIFrameEditor};