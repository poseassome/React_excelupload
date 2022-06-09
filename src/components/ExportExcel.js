import * as xlsx from 'xlsx';
import { saveAs } from 'file-saver';


const excelHandler = {
  getExcelFileName : function(){
      return 'AddressTable.xlsx';
  },
  getSheetName : function(){
      return 'Address Sheet';
  },
  getExcelData : function(){
      return document.getElementById('tableData'); 
  },
  getWorksheet : function(){
      return xlsx.utils.table_to_sheet(this.getExcelData());
  }
}

function s2ab(s) { 
  let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
  let view = new Uint8Array(buf);  //create uint8array as viewer
  for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
  return buf;    
}

function ExportExcel(data) {
  // step 1. workbook 생성
  let wb = xlsx.utils.book_new();

  // step 2. 시트 만들기 
  let newWorksheet = excelHandler.getWorksheet();
  
  // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.  
  xlsx.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());

  // step 4. 엑셀 파일 만들기 
  let wbout = xlsx.write(wb, {bookType:'xlsx',  type: 'binary'});

  // step 5. 엑셀 파일 내보내기 
  saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), excelHandler.getExcelFileName());
}



export default ExportExcel