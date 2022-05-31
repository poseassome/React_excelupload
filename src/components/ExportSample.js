import React from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'

function ExportSample() {

  const downloadSample = () => {
    axios({
      method: 'GET',
      url : `http://localhost:8080/xls/download/sample`,
      responseType: 'blob'
    })
      .then((response) => {
          console.log(response);

          // 다운로드(서버에서 전달 받은 데이터) 받은 바이너리 데이터를 blob으로 변환
          const blob = new Blob([response.data], { type: response.headers['content-type']});
          // blob을 사용해 객체 URL을 생성
          const url = window.URL.createObjectURL(blob);
          // blob 객체 URL을 설정할 링크 생성
          const link = document.createElement("a");
          link.href = url;
          link.style.display = "none";
          link.setAttribute(
              "download",
              `sample.xlsx`
          );
          // body에 link 생성 -> 다운로드 -> 제거
          document.body.appendChild(link);
          link.click();
          link.remove();
      })
      .catch((error) => {
          console.log(error);
          for (let log in error) {
              console.log("error log: " + JSON.stringify(log));
          }
      })
  }

  return (
    <div>
      <h1>Excel upload</h1>
      <h3>Sample 양식 다운로드  <FontAwesomeIcon icon={faFileArrowDown} style={{cursor:'pointer'}} onClick={downloadSample} /></h3>
      <hr />
    </div>
  )
}

export default ExportSample