import React, { useEffect, useState } from 'react'
import * as xlsx from 'xlsx';

function PreviewExcel(file) {

  const [excelData, setExcelData] = useState();
console.log(file)
  const ParsingFile = (file) => {
    let result = new Array();

    const reader = new FileReader();

    reader.onload = () => {
      let data = file;
      const wb = xlsx.read(data, {type: "binary"});
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
    reader.readAsBinaryString(new Blob(file));
  }

  useEffect(() => {
    ParsingFile();
  },[])

  return (
    <div>
      {
        // excelData["result"].map((item, idx) => {
        //   return (
        //     <tr>
        //       {item.map((it, ins) => {
        //         return <td>{it}</td>
        //       })}
        //     </tr>
        //   )
        // })
      }
    </div>
  )
}

export default PreviewExcel