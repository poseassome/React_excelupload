import { faIgloo } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react'
import * as xlsx from 'xlsx';
import RegData from './RegData';

import ExportExcel from './ExportExcel';
import ExportExcel_style from './ExportExcel_style';
import axios from 'axios';


function PreviewExcel(filedata) {
  const Files = filedata.filedata;
  const [file, setFile] = useState();
  const [excelData, setExcelData] = useState();
  const [noexcelData, setNoexcelData] = useState();

  const ParsingFile = () => {
  /*****  [1] Excel 불러오기   ******/
    let result = new Array();
    let invalidResult = new Array();
    const reader = new FileReader();

    reader.onload = () => {
      let fileData = reader.result;
      const wb = xlsx.read(fileData, {type: "binary"});
      const wsName = wb.SheetNames[0]
      let worksheet = wb.Sheets[wsName];
      let row;
      let rowNum;
      let colNum;
      let range = xlsx.utils.decode_range(worksheet["!ref"]);

      for(rowNum=range.s.r; rowNum<=range.e.r; rowNum++){
        row=[];
        for(colNum=range.s.c; colNum<=range.e.c; colNum++){
          var nextCell = worksheet[xlsx.utils.encode_cell({r:rowNum, c:colNum})];
          if(typeof nextCell === "undefined") row.push(void 0);
          else row.push(nextCell.w);
        }
        result.push(row);
        // if(result.indexOf(row)!==0) {
        //   if(RegData(row) === false) {
        //     result.splice(result.indexOf(row), 1);
        //     invalidResult.push(row)
        //   }
        // } else if(result.indexOf(row)===0) invalidResult.push(row);
      }
      setExcelData({...excelData, 'result': result})
      setNoexcelData({...noexcelData, 'result': invalidResult})
    }
    reader.readAsBinaryString(Files);


          /*****  [2]-1 Excel 불러오기   ******/
              // let reader = new FileReader();
              // reader.onload = function(){
              //     let fileData = reader.result;
              //     let wb = xlsx.read(fileData, {type : 'binary'});
              //     let sheetNameList = wb.SheetNames; // 시트 이름 목록 가져오기 
              //     let firstSheetName = sheetNameList[0]; // 첫번째 시트명
              //     let firstSheet = wb.Sheets[firstSheetName]; // 첫번째 시트 
              //     handleExcelDataHtml(firstSheet);      
              // };
              // reader.readAsBinaryString(Files);
  }
          /*****  [2]-2 Excel 불러오기   ******/
            // function handleExcelDataHtml(sheet){
            //   console.log("sssss   ", sheet)
            // }
  useEffect(() => {
    setFile(Files);
  }, [Files])

  useEffect(() => {
    ParsingFile();
  },[file])

  const sendData = () => {
    let DataforSend = [];
    let onlyData = excelData['result'].filter((ele, idx) => idx !== 0);
    const sendUrl = 'http://1.212.9.203:39080/iq200/customers';
    const axiosConfig = {
      headers:{
        "Content-Type": "application/json"
      }
    }

    for(let i=0; i<onlyData.length; i++){
      DataforSend.push({
        companyid: "2",
        custname: onlyData[i][0],
        custcell: onlyData[i][1],
        custphone: onlyData[i][2],
        custfax: onlyData[i][3],
        custdept: onlyData[i][4],
        title: onlyData[i][5],
        custemail: onlyData[i][6],
        custzipcode: onlyData[i][7],
        custaddr1: onlyData[i][8],
        custaddr2: onlyData[i][9],
        custcompany: onlyData[i][10],
        custmemo: onlyData[i][11]
      })
    }

    axios.post(sendUrl, JSON.stringify(DataforSend), axiosConfig)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const regDataStyle = (item, idx) => {

    const regExpCorpid = /^[0-9]*$/;
    const regExpUserid = /^[a-zA-Z0-9]*$/;
    const regExpUsername = /^[가-힣a-zA-Z]+$/;
    const regExpPhone = /^[0-9]*$/;

    if(item === undefined || item.replace(/\s/gi, '').length < 1) return false
    else {
      if(idx === 0) {
        // 회사명
        if(!regExpCorpid.test(item)) return false
      } 
      if(idx === 1) {
        // 아이디
        if(!regExpUserid.test(item)) return false
      } 
      if(idx === 2) {
        // 이름
        if(!regExpUsername.test(item)) return false
      }
      if(idx === 3) {
        // 전화번호
        if(!regExpPhone.test(item)) return false
      }
    }

    return true;
  }


  return (
    <div>
      <h3>유효성 O</h3>
      <button type='button' onClick={sendData}>데이터 전송</button>
      {/* *****  유효성 통과 데이터  ***** */}
      <table style={{width: '800px', margin:'0 auto', borderCollapse:'collapse'}}>
        <thead>
          <tr>
          {
            excelData ?
              excelData['result'][0].map((it, ins) => {
                return <td key={ins} style={{border: '1px solid #000', fontWeight:'bold'}}>{it}</td>
              })
            :
              null
          }
          </tr>
        </thead>
        <tbody>
          { excelData ?
            // ***** column명 포함한 모든 데이터 가져오기 *****
            // excelData['result'].map((item, idx) => {
            //   return (
            //     <tr key={idx}>
            //       {item.map((it, ins) => {
            //         return <td key={ins} style={{border: '1px solid #000'}}>{it}</td>
            //       })}
            //     </tr>
            //   )
            // })

            excelData['result'].filter((data, idx) => idx !== 0).map((item, idx) => {
              return (
                <tr key={idx}>
                  {item.map((it, ins) => {
                    return <td key={ins} style={{border: '1px solid #000'}}>{it}</td>
                  })}
                </tr>
              )
            })
            :
            null
          }
        </tbody>
      </table>
      {/* <button type='button'>전송</button> */}


      <h3 style={{marginTop: '50px'}}>유효성 X</h3>
      {/* *****  유효성 미통과 데이터  ***** */}
      {/* <table id="tableData" style={{width: '800px', margin:'0 auto', borderCollapse:'collapse'}}>
      <thead>
          <tr>
          { noexcelData ?
              noexcelData['result'][0].map((it, ins) => {
                  return <td key={ins} style={{border: '1px solid #000', fontWeight:'bold'}}>{it}</td>
                })
            :
              null
          }
          </tr>
        </thead>
        <tbody>
          { noexcelData ?
            noexcelData['result'].filter((data, idx) => idx !== 0).map((item, idx) => {
              return (
                <tr key={idx}>
                  {item.map((it, ins) => {
                    return (
                      regDataStyle(it, ins) ? 
                        <td key={ins} style={{border: '1px solid #000'}}>{it}</td>
                      :
                        <td key={ins} style={{border: '1px solid #000', background: '#eee'}}>{it}</td>
                    )

                    // return <td key={ins} style={{border: '1px solid #000'}}>{it}</td>
                  })}
                </tr>
              )
            })
            :
            null
          }
        </tbody>
      </table> */}
      { noexcelData && noexcelData['result'].length === 1 ?
          null
        :
          <div>
            <button type='button' onClick={() => ExportExcel(noexcelData)}>엑셀 내려받기</button>
            <button type='button' onClick={() => ExportExcel_style(noexcelData)}>엑셀 내려받기(style)</button>
          </div>
      }
    </div>
  )
}

export default PreviewExcel