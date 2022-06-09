import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import PreviewExcel from './PreviewExcel';

function UploadExcel() {

  const [file, setFile] = useState();
  const [prevfile, setPrevfile] = useState();
  const [nowfile, setNowfile] = useState(false);

  const fileInput = useRef();

  const handleChange = (event) => {
    event.preventDefault();
    setFile(event.target.files[0]);
    setNowfile(true);
  }

  const addFile = (e) => {
    e.preventDefault();
    fileInput.current.click();
  }

  const deleteFile = (e) => {
    e.preventDefault();
    fileInput.current.value = "";
    setFile();
    setNowfile(false);
  }

  const submitFile = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    
    axios({
      method: 'POST',
      url : `http://localhost:8080/xls/upload`,
      data: formData,
      headers: {
        'Content-Type' : 'multipart/form-data' 
      }
    })
    .then((response) => { 
        console.log(response);
        alert("전송 성공 !");
    })
    .catch((error) => {
        console.log(error);
        alert("전송 실패 !");
    })
  }


  return (
    <div>
      <h2>파일 업로드</h2>

      <form id='formData' type='multipart/form-data' style={{marginBottom: '30px'}}>
          <p>
          {
            file ? 
            file.name
            :
            '업로드할 파일을 추가해주세요.'
          }
          </p>
          <input type='file' id="file" name='file' onChange={handleChange} style={{display:'none'}} ref={fileInput}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
          <button onClick={addFile}>{file ? '파일변경' : '파일추가'}</button>
          {
            file ?
              <div>
                <button onClick={deleteFile}>파일삭제</button>
                <button type='button' onClick={submitFile} >엑셀 파일 자체 전송</button>
                {/* <button type='button' onClick={exportExcelFile} >Excel 저장</button> */}
              </div>
            :
              null
          }
      </form>

      {
        nowfile ?
          <PreviewExcel filedata={file} />
        :
          null
      }
      
    </div>
  )
}

export default UploadExcel