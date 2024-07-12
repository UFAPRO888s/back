const idTable = "table-player";
$(document).ready(async function () {
  await setDate("startDate", moment().format("YYYY-MM-DD"));
  await setDate("endDate", moment().format("YYYY-MM-DD"));
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
  console.log(date);
  el(id).value = date;
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
  dataReq.startDate = convertTHDateTime(dataReq.startDate + " 00:00");
  dataReq.endDate = convertTHDateTime(dataReq.endDate + " 23:59");

  let column = [
    {
      title: "ชื่อผู้ใช้",
      className: "align-middle text-center",
    },
    {
      title: "สายรหัสสมาชิก",
      className: "align-middle text-center",
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
      title: "ถูกรางวัล",
      className: "align-middle text-right",
    },
    {
      title: "ยอดสุทธิ",
      className: "align-middle text-right",
    },
  ];
  let data = [];
  let tableData = [];
  let resDeopsit = callXMLHttpRequest(`${apiPort.apiReportPlayer}`, dataReq);
  if (resDeopsit.statusCodeText == textRespone.ok.CodeText) {
    data = resDeopsit.data;
    for (let i = 0; i < data.length; i++) {
      let sumall =
        parseFloat(data[i].net_amount).toFixed(2) +
        parseFloat(data[i].affiliate).toFixed(2);
      tableData.push([
        data[i].username,
        data[i].lotto_name,
        numberColor2(data[i].amount),
        numberColor2(data[i].affiliate),
        numberReward2(data[i].winner_amount),
        numberColor2(sumall),
      ]);
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
