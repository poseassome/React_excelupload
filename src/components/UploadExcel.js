import React, { useRef, useState } from 'react'
import PreviewExcel from './PreviewExcel';

function UploadExcel() {

  const [file, setFile] = useState([]);
  const [nowfile, setNowfile] = useState(false);

  const fileInput = useRef();

  const handleChange = (event) => {
    event.preventDefault();
    setFile(event.target.files);
    setNowfile(true);
  }

  const addFiles = (e) => {
    e.preventDefault();
    fileInput.current.click();
  }

  const deleteFiles = (e) => {
    e.preventDefault();
    fileInput.current.value = "";
    setFile([]);
    setNowfile(false);
  }

  return (
    <div>
      <h2>파일 업로드</h2>

      <form id='formData' type='multipart/form-data'>
          <p>
          {
            file.length > 0 ? 
            file[0].name
            :
            '업로드할 파일을 추가해주세요.'
          }
          </p>
          <input type='file' id="file" name='file' onChange={handleChange} style={{display:'none'}} ref={fileInput}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
          <button onClick={addFiles}>파일추가</button>
          {
            file.length > 0 ?
              <button onClick={deleteFiles}>파일삭제</button>
            :
              null
          }
          {/* <button type='button' onClick={submit}>전송</button> */}
      </form>

      {
        nowfile ?
          <PreviewExcel file={file} />
        :
          null
      }
    </div>
  )
}

export default UploadExcel