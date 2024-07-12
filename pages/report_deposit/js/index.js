$(document).ready(async function () {
  await setData();
  hideLoader();
});

function setDate(id) {
  const datePicker = MCDatepicker.create({
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

async function ChangeDate() {
  await showLoader();
  $("#tb_deposit").DataTable().destroy();
  start_date = $("#date_start").val() + " 00:00:00";
  end_date = $("#date_end").val() + " 23:59:59";
  await fetchDeposit(start_date, end_date);
  hideLoader();
}

function setData() {
  setDate("date_start");
  setDate("date_end");

  let start_date = el("date_start").value + " 00:00:00";
  let end_date = el("date_end").value + " 23:59:59";
  fetchDeposit(start_date, end_date);
  $("#date_start").change(function () {
    $("#tb_deposit").DataTable().destroy();
    start_date = $("#date_start").val() + ":00";
    end_date = $("#date_end").val() + ":00";
    fetchDeposit(start_date, end_date);
  });
}

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
    order: [[6, "desc"]],
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

function fetchDeposit(start_date, end_date) {
  let column = [
    {
      title: "ชื่อผู้ใช้งาน",
      className: "align-middle text-center",
    },
    {
      title: "ชื่อ-สกุล",
      className: "align-middle text-center",
    },
    {
      title: "เลขที่บัญชี",
      className: "align-middle text-center",
    },
    {
      title: "ธนาคาร",
      className: "align-middle text-center",
    },
    {
      title: "จำนวนเงิน",
      className: "align-middle text-center",
    },
    {
      title: "ประเภท",
      className: "align-middle text-center",
    },
    {
      title: "วันที่",
      className: "align-middle text-center",
    },
  ];

  let data = [];
  let tableData = [];
  let resWithdrawReport = callXMLHttpRequest(
    `${apiPort.apiQueryDepositReport}`,
    { start_date: start_date, end_date: end_date }
  );
  if (resWithdrawReport.statusCodeText == textRespone.ok.CodeText) {
    data = resWithdrawReport.withdraw;
    for (let i = 0; i < data.length; i++) {
      let htm = "";
      if (data[i].remark == "SCB") {
        htm = `<div style="width: 40px;background-color: #4e2e7f;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:12px;"> SCB</div>`;
      } else if (data[i].remark == "TRUEWALLET") {
        htm = `<div style="width: 40px;background-color: #ff8300;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:10px;"> WALLET</div>`;
      } else if (data[i].remark == "Manual") {
        htm = `<div style="width: 40px;background-color: #4b545c;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:12px;"> Manual</div>`;
      }
      tableData.push([
        data[i].member_username,
        data[i].name,
        data[i].accnum,
        data[i].bank_name,
        formatMoneyNotDecimal(data[i].amount),
        htm,
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
