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

// HTML generator for printing/email
const generateHtml = (item) => {
    const mappedPhases = item.phases
      .map(
        (phase, index) =>
          `<tr style="border-bottom:1px solid #E5E7EB">
            <td style="padding:10px;text-align:center;">${index + 1}</td>
            <td style="padding:10px;text-align:center;">${phase.phaseName}</td>
            <td style="padding:10px;text-align:right;">${formatTime(phase.time)}</td>
          </tr>`
      )
      .join("");

    return `
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { font-family: Arial, sans-serif; padding:20px; background:#F4F6F8; text-align:center; }
          h1 { font-size:28px; margin-bottom:20px; color:#1A1A1A; }
          table { width:100%; max-width:600px; margin:auto; border-collapse: collapse; background:#fff; border-radius:12px; overflow:hidden; }
          th { background-color:#007bff; color:white; padding:12px; text-align:center; font-size:16px; }
          td { padding:12px; font-size:16px; color:#111827; }
          p { font-size:14px; color:#6B7280; margin:4px 0; }
        </style>
      </head>
      <body>
        <h1>${item.mainTitle} ${formatTime(item.totalTime)}</h1>
        <table>
          <tr>
            <th>#</th>
            <th>Vaihe</th>
            <th>Aika</th>
          </tr>
          ${mappedPhases}
        </table>
        <p>${makeTimeStamp()}</p>
        <p>Mittaaja: ${item.userName}</p>
      </body>
      </html>
    `;
  };

export {makeTimeStamp, formatTime, generateHtml}