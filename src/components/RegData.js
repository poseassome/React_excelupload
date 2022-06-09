function RegData(data) {

  let arr = [];

  const regExpCorpid = /^[0-9]*$/;
  const regExpUserid = /^[a-zA-Z0-9]*$/;
  const regExpUsername = /^[가-힣a-zA-Z]+$/;
  const regExpPhone = /^[0-9]*$/;

  data.forEach((item, idx) => {
    if(item === undefined || item.replace(/\s/gi, '').length < 1) arr.push(idx);
    else {
      if(idx === 0) {
        // 회사명
        if(!regExpCorpid.test(item)) arr.push(idx);
      } 
      if(idx === 1) {
        // 아이디
        if(!regExpUserid.test(item)) arr.push(idx);
      } 
      if(idx === 2) {
        // 이름
        if(!regExpUsername.test(item)) arr.push(idx);
      }
      if(idx === 3) {
        // 전화번호
        if(!regExpPhone.test(item)) arr.push(idx);
      }
    }
  })

  if(arr.length > 0) return false;
  else return true;
}

export default RegData