import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Image from '@ckeditor/ckeditor5-image/src/image';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ClassicIFrameEditor from "../src/classic";
import './test.css';

document.addEventListener('DOMContentLoaded', function ()
{
  ClassicIFrameEditor.create(
    document.getElementById('ck-example'),
    {
      plugins: [Essentials, Bold, Italic, Paragraph, Image, ImageCaption, ImageStyle, ImageToolbar],
      toolbar: ['bold', 'italic'],
      language: 'en',
      image: {
        styles: [
          'full', 'alignLeft', 'alignCenter', 'alignRight'
        ],
        toolbar: [
          'imageStyle:full',
          'imageStyle:alignLeft',
          'imageStyle:alignCenter',
          'imageStyle:alignRight',
          '|',
          'imageTextAlternative'
        ]
      },
    }
  ).then((editor) => {console.log('editor', editor, editor.iframeElement);});
});
