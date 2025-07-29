const makeTimeStamp = () => {
    const date = new Date()
    const time =
    //get date month year
    "Pvm: "+date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear()+'<br/>'+"Klo: "+
    //get hour, if hours < 10 then add a 0 infront of the number
    (date.getHours() < 10 ? '0'+date.getHours() : date.getHours())+':'+
    //get minutes, if minutes < 10 then add a 0 infront of the number
    (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes())
    return time
}

const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');   
    return `${hours}:${minutes}:${seconds}`;
  }

export {makeTimeStamp, formatTime}