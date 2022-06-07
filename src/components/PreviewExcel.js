import React, { useEffect, useState } from 'react'
import * as xlsx from 'xlsx';

function PreviewExcel(filedata) {
  const Files = filedata.filedata;
  const [excelData, setExcelData] = useState();

  const ParsingFile = () => {
  /*****  [1] Excel 불러오기   ******/
    let result = new Array();
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
      }
      setExcelData({...excelData, 'result': result})
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
    ParsingFile();
  },[])

  return (
    <div>
      <table style={{width: '800px', margin:'0 auto'}}>
        <tbody>
          { excelData ?
            excelData['result'].map((item, idx) => {
              return (
                <tr key={idx}>
                  {item.map((it, ins) => {
                    return <td key={ins}>{it}</td>
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