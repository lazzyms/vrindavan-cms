import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import React from 'react';

const MarkDownInput = React.forwardRef(({ defaultValue, onChange, onBlur }, ref) => <CKEditor
  config={{
    initialData: defaultValue,
    toolbar: ['undo',
      'redo',
      'heading',
      '|',
      'bold',
      'italic',
      'blockQuote',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      '|'],
      ui: {
        poweredBy: {
          label: null,
          position: 'inside',
          verticalOffset: -10,
          horizontalOffset: -10
        }
      }
  }}
  editor={ClassicEditor}
  data={defaultValue}
  onChange={(event, editor) => {
    const data = editor.getData();
    onChange(data);
  }}
  onBlur={onBlur}
  onError={(event, editor) => {
    console.error(event, editor)
  }}
/>)

export default MarkDownInput;
