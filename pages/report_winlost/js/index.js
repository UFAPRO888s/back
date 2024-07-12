const idTable = "table-report-winlost";
var yearL = new Date().getFullYear();
var leap = (yearL % 4 == 0 && yearL % 100 != 0) || yearL % 400 == 0 ? 2 : 3;
var date = new Date();
var day = date.getDate();
var month = date.getMonth("m");
var year = date.getFullYear();
var hours = date.getHours();
var minutes = date.getMinutes();
$(document).ready(async function () {
  await setDate("startDate", moment().format("YYYY-MM-DD"));
  await setDate("endDate", moment().format("YYYY-MM-DD"));

  //   $('.date-picker').datetimepicker({
  //     value: day + '/' + month + '/' + year + " " + hours + ":" + minutes,
  //     timepicker: false,
  //     format: 'd/m/Y H:i',
  //     lang: 'th',
  //     dayOfWeekStart: leap,
  //     timepicker: true
  // });

  await handleDataTable();
  hideLoader();
});

function setDate(id, date) {
  const datePicker = MCDatepicker.create({
    el: "#" + id,
    bodyType: "modal", //modal,inline
    disableWeekends: false,
    dateFormat: "dd/mm/yyyy",
    customWeekDays: [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ],
    customMonths: [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฏาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ],
    closeOndblclick: true,
    autoClose: true,
    selectedDate: new Date(),
  });
  date = date.split("-");
  let year = parseInt(date[0]);
  date = `${date[2]}/${date[1]}/${year}`;

  el(id).value = date;
}

function colorForGame(textNumber) {
  if (parseFloat(textNumber) < 0) {
    return `<span class="text-danger">${parseFloat(textNumber)
      .toFixed(2)
      .toLocaleString("en-US")}</span>`;
  } else {
    return `<span class="text-success">${parseFloat(textNumber)
      .toFixed(2)
      .toLocaleString("en-US")}</span>`;
  }
}

function numberReward2(textNumber) {
  if (parseFloat(textNumber) > 0) {
    return `<span class="text-danger">${numberWithCommas(
      parseFloat(textNumber).toFixed(2)
    )}</span>`;
  } else {
    return `<span class="text-success">${numberWithCommas(
      parseFloat(textNumber).toFixed(2)
    )}</span>`;
  }
}

function numberColor2(textNumber) {
  if (parseFloat(textNumber) < 0) {
    return `<span class="text-danger">${numberWithCommas(
      parseFloat(textNumber).toFixed(2)
    )}</span>`;
  } else {
    return `<span class="text-success">${numberWithCommas(
      parseFloat(textNumber).toFixed(2)
    )}</span>`;
  }
}

async function handleDataTable() {
  await showLoader();
  const formData = $("#formSearch").serializeArray();
  let dataReq = genObjectSerializeArray(formData);
  let sd = dataReq.startDate.split("/");
  let ed = dataReq.endDate.split("/");
  // console.log(moment(`${sd[2]}-${sd[1]}-${sd[0]}`).format('YYYY-MM-DD'));
  // console.log(moment(dataReq.startDate).format('YYYY-MM-DD'));
  dataReq.startDate = moment(`${sd[2]}-${sd[1]}-${sd[0]}`).format("YYYY-MM-DD");
  dataReq.endDate = moment(`${ed[2]}-${ed[1]}-${ed[0]}`).format("YYYY-MM-DD");

  let column = [
    {
      title: "รหัสสินค้า",
      className: "align-middle text-center",
    },
    {
      title: "สินค้า",
      className: "align-middle text-right",
    },
    {
      title: "ยอดพนัน",
      className: "align-middle text-right",
    },
    {
      title: "Affiliate",
      className: "align-middle text-right",
    },
    {
      title: "แพ้ชนะ",
      className: "align-middle text-right",
    },
    {
      title: "ยอดสุทธิ",
      className: "align-middle text-right",
    },
  ];
  let data = [];
  let tableData = [];
  let resDeopsit = callXMLHttpRequest(`${apiPort.apiReportWinLost}`, dataReq);
  if (resDeopsit.statusCodeText == textRespone.ok.CodeText) {
    data = resDeopsit.data;
    let lotto_amount = 0;
    let lotto_wl = 0;
    let lotto_affiliate = 0;
    let lotto_net_amount = 0;
    let casino_amount = 0;
    let casino_affiliate = 0;
    let casino_wl = 0;
    let casino_net_amount = 0;
    for (let i = 0; i < data.length; i++) {
      let wl = numberReward2(data[i].winner_amount);
      if (data[i].code === "game") {
        wl = numberColor2(data[i].winner_amount);
        casino_amount = parseFloat(casino_amount + data[i].amount);
        casino_affiliate = parseFloat(casino_affiliate + data[i].affiliate);
        casino_wl = parseFloat(casino_wl + data[i].winner_amount);
        casino_net_amount = parseFloat(casino_net_amount + data[i].net_amount);
      }
      if (data[i].code === "lotto") {
        wl = numberColor2(data[i].winner_amount);
        lotto_amount = parseFloat(lotto_amount + data[i].amount);
        lotto_affiliate = parseFloat(lotto_affiliate + data[i].affiliate);
        lotto_wl = parseFloat(lotto_wl + data[i].winner_amount);
        lotto_net_amount = parseFloat(lotto_net_amount + data[i].net_amount);
      }
      tableData.push([
        data[i].code,
        data[i].lotto_name,
        numberColor2(data[i].amount),
        numberColor2(data[i].affiliate),
        wl,
        numberColor2(data[i].net_amount),
      ]);
    }
    $("#table-report-winlost-foot").html("");
    // console.log(lotto_affiliate)
    if (data.length > 0) {
      let txt = `<tr rowspan="1">`;
      txt += `<td colspan="2" class="text-right" style="text-align: right !important;">รวมยอดหวย</td>`;
      txt += `<td class="text-right">${numberColor2(lotto_amount)}</td>`;
      txt += `<td class="text-right">${numberColor2(lotto_affiliate)}</td>`;
      txt += `<td class="text-right">${numberColor2(lotto_wl)}</td>`;
      txt += `<td class="text-right">${numberColor2(lotto_net_amount)}</td>`;
      txt += `</tr><tr>`;
      txt += `<td colspan="2" class="text-right">รวมยอดคาสิโน</td>`;
      txt += `<td class="text-right">${numberColor2(casino_amount)}</td>`;
      txt += `<td class="text-right">${numberColor2(casino_affiliate)}</td>`;
      txt += `<td class="text-right">${numberColor2(casino_wl)}</td>`;
      txt += `<td class="text-right">${numberColor2(casino_net_amount)}</td>`;
      txt += `</tr><tr>`;
      txt += `<td colspan="2" class="text-right">รวมยอดทั้งหมด</td>`;
      txt += `<td class="text-right">${numberColor2(
        lotto_amount + casino_amount
      )}</td>`;
      txt += `<td class="text-right">${numberColor2(
        lotto_affiliate + casino_affiliate
      )}</td>`;
      txt += `<td class="text-right">${numberColor2(
        lotto_wl + casino_wl * -1
      )}</td>`;
      txt += `<td class="text-right">${numberColor2(
        lotto_net_amount + casino_net_amount
      )}</td>`;
      txt += `</tr>`;
      $("#table-report-winlost-foot").html(txt);
    }
  } else if (resDeopsit.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resDeopsit.description,
      icon: "error",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.value) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("category");
        window.location.href = "../../login";
      }
    });
  }

  if ($.fn.dataTable.isDataTable("#" + idTable)) {
    $("#" + idTable)
      .DataTable()
      .clear()
      .destroy();
    initDataTables(tableData, idTable, column);
  } else {
    initDataTables(tableData, idTable, column);
  }

  hideLoader();
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
