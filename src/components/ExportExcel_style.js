import React from 'react'
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const regDataStyle = (item, idx) => {

  const regExpCorpid = /^[0-9]*$/;
  const regExpUserid = /^[a-zA-Z0-9]*$/;
  const regExpUsername = /^[가-힣a-zA-Z]+$/;
  const regExpPhone = /^[0-9]*$/;

  if(item === '') return false
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

async function ExportExcel_style(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Address Sheet"); // sheet 이름

    worksheet.columns = [
      { header: "companyid", key: "id", width: 20 },
      { header: "userid", key: "userid", width: 32 },
      { header: "name", key: "name", width: 32 },
      { header: "phone", key: "phone", width: 32 },
    ];

    for(let i=1; i<data['result'].length; i++){
      let Rowdata = data['result'][i].map((element, idx) => {
        return (
          element === undefined ? '' : element
        )
      });
      worksheet.addRow(Rowdata)
    }
    // worksheet.addRow({ id: 1, name: "John Doe", dob: new Date(1970, 1, 1) });
    // worksheet.addRow({ id: 2, name: "Jane Doe", dob: new Date(1965, 1, 7) });
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        
        if (rowNumber === 1) {
          // First set the background of header row
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'f5b914'}
          }
          cell.style = {
            font: {
              bold: true,
            },
            fill : {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'f5b914'}
            }
          }
        }
 
        // Set border of each cell 
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };

        // error data
        if(rowNumber !== 1 && regDataStyle(cell.value, colNumber-1) === false){
          cell.style = {
            border: {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            },
            fill : {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'f8bbd0'}
            }
          }
        }
      })
    })
    

    // 다운로드
    const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], mimeType);
    saveAs(blob, "testExcel.xlsx");
}

export default ExportExcel_style