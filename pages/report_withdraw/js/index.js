$(document).ready(async function () {
  await setData();
  hideLoader();
});

function setDate(id) {
  datePicker = MCDatepicker.create({
    el: "#" + id,
    bodyType: "modal", //modal,inline
    disableWeekends: false,
    dateFormat: "yyyy-mm-dd",
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
  el(id).value = formatDate(new Date());
}

function setData() {
  setDate("date_start");
  setDate("date_end");

  let start_date = el("date_start").value + " 00:00:00";
  let end_date = el("date_end").value + " 23:59:59";
  fetchWithdraw(start_date, end_date);
}

async function ChangeDate() {
  await showLoader();
  $("#tb_deposit").DataTable().destroy();
  start_date = $("#date_start").val() + " 00:00:00";
  end_date = $("#date_end").val() + " 23:59:59";
  await fetchWithdraw(start_date, end_date);
  hideLoader();
}

$("#date_end").change(function () {
  $("#tb_deposit").DataTable().destroy();
  start_date = $("#date_start").val() + " 00:00:00";
  end_date = $("#date_end").val() + " 23:59:59";
  fetchWithdraw(start_date, end_date);
});

async function Loading() {
  let timerInterval;
  Swal.fire({
    title: "Loading...",
    html: "",
    timer: 2000,
    allowOutsideClick: false,
    timerProgressBar: true,
    didOpen: async () => {
      await Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("b");
      timerInterval = setInterval(() => {}, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      setData();
    }
  });
}

function str_pad(n) {
  return String("00" + n).slice(-2);
}

function initDataTables(tableData, id, column) {
  $("#" + id).DataTable({
    order: [[5, "desc"]],
    data: tableData,
    columns: column,
    responsive: {
      details: {
        display: $.fn.dataTable.Responsive.display.modal({
          header: function (row) {
            var data = row.data();
            return "ผู้ใช้งาน: " + data[1];
          },
        }),
        renderer: $.fn.dataTable.Responsive.renderer.tableAll({
          tableClass: "table",
        }),
      },
    },
    language: {
      lengthMenu: "แสดงข้อมูล _MENU_ แถว",
      zeroRecords: "ไม่พบข้อมูลที่ต้องการ",
      info: "แสดงหน้า _PAGE_ จาก _PAGES_",
      infoEmpty: "ไม่พบข้อมูลที่ต้องการ",
      infoFiltered: "(filtered from _MAX_ total records)",
      search: "ค้นหา",
      paginate: {
        previous: "ก่อนหน้านี้",
        next: "หน้าต่อไป",
      },
    },
  });
}

function fetchWithdraw(start_date, end_date) {
  let column = [
    {
      title: "ชื่อผู้ใช้งาน",
      className: "align-middle",
    },
    {
      title: "ชื่อ-สกุล",
      className: "align-middle",
    },
    {
      title: "เลขที่บัญชี",
      className: "align-middle",
    },
    {
      title: "ธนาคาร",
      className: "align-middle",
    },
    {
      title: "จำนวนเงิน",
      className: "align-middle",
    },
    {
      title: "ประเภท",
      className: "align-middle",
    },
    {
      title: "วันที่",
      className: "align-middle",
    },
  ];

  let data = [];
  let tableData = [];
  let resWithdrawReport = callXMLHttpRequest(
    `${apiPort.apiQueryWithdrawReport}`,
    { start_date: start_date, end_date: end_date }
  );
  if (resWithdrawReport.statusCodeText == textRespone.ok.CodeText) {
    data = resWithdrawReport.withdraw;
    for (let i = 0; i < data.length; i++) {
      tableData.push([
        data[i].member_username,
        data[i].name,
        data[i].accnum,
        data[i].bank_name,
        formatMoneyNotDecimal(data[i].amount),
        data[i].stats == 0
          ? '<span style="color:green">[ Admin ]</span>'
          : '<span style="color:red">[ Auto ]</span>',
        formatDate(data[i].transaction_date) +
          " " +
          formatTime(data[i].transaction_date),
      ]);
    }
  } else if (resWithdrawReport.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resWithdrawReport.description,
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
  initDataTables(tableData, "tb_deposit", column);
}
