// //convert time to formatted

// function printPostDate() {
//   const dateEle = document.querySelectorAll(".postTime");
//   //   console.log(dateEle);
//   dateEle.forEach((item) => {
//     // console.log("inside date change", item.textContent);
//     console.log(item.textContent);
//     let date = JSON.stringify(item.textContent);
//     console.log(date);
//     date = new Date(date);
//     console.log("after", date);
//     const day = date.getDate();
//     const month = date.getMonth();
//     const year = date.getFullYear();
//     const monthWord = date.toLocaleString("default", {
//       month: "short",
//     });
//     const time = date.toLocaleTimeString("default", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//     const today = day + " " + monthWord + ", " + year;
//     const format = today + " | " + time;
//     item.textContent = format;
//     console.log("converted date", format);
//   });
// }
// printPostDate();
