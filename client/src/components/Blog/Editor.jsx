import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.css';


const Editor = (props) => {
  const quillRef = useRef(null);

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        ["link", "image"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ align: [] }],
        ["clean"]
      ],
    }
  };

  return (
    <div className='editor'>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={props.value}
        onChange={props.onChange}
        className='ql-editor'
        modules={modules}
      />
    </div>
  );
};

export default Editor;
