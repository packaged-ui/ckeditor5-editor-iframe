import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import InlineIFrameEditor from "../src/inline";

document.addEventListener('DOMContentLoaded', function ()
{
  InlineIFrameEditor.create(
    document.getElementById('inline-example'),
    {
      plugins: [Essentials, Bold, Italic, Paragraph],
      toolbar: ['bold', 'italic'],
      language: 'en'
    }
  ).then((editor) => {console.log('editor', editor, editor.iframeElement);});
});
