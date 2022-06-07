import React, { useEffect, useState } from 'react'
import * as xlsx from 'xlsx';
import RegData from './RegData';

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
        if(result.indexOf(row)!==0) {
          if(RegData(row) === false) {
            result.splice(result.indexOf(row), 1);
            invalidResult.push(row)
          }
        }
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

  return (
    <div>
      <h3>유효성 O</h3>
      {/* *****  유효성 통과 데이터  ***** */}
      <table style={{width: '800px', margin:'0 auto', borderCollapse:'collapse'}}>
        <thead>
          <tr>
        { excelData ?
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

      <h3 style={{marginTop: '50px'}}>유효성 X</h3>
      {/* *****  유효성 미통과 데이터  ***** */}
      <table style={{width: '800px', margin:'0 auto', borderCollapse:'collapse'}}>
      <thead>
          <tr>
        { excelData ?
            excelData['result'][0].map((it, ins) => {
                return <td key={ins} style={{border: '1px solid #000', fontWeight:'bold'}}>{it}</td>
              })
            :
            null
          }
          </tr>
        </thead>
        <tbody>
          { noexcelData ?
            noexcelData['result'].map((item, idx) => {
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
    </div>
  )
}

export default PreviewExcel