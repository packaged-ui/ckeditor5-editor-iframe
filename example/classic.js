import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import ClassicIFrameEditor from "../src/classic";

document.addEventListener('DOMContentLoaded', function ()
{
  ClassicIFrameEditor.create(
    document.getElementById('classic-example'),
    {
      plugins: [Essentials, Bold, Italic, Paragraph],
      toolbar: ['bold', 'italic'],
      language: 'en'
    }
  ).then((editor) => {console.log('editor', editor, editor.iframeElement);});
});
