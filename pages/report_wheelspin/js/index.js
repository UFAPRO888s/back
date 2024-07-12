$(document).ready(async function () {
  // Loading();
  await setDate("date_start_sort", moment().format("YYYY-MM-DD"));
  await setDate("date_end_sort", moment().format("YYYY-MM-DD"));
  await setData();
  hideLoader();
});

function setDate(id, date) {
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
  date = date.split("-");
  let year = parseInt(date[0]);
  date = `${year}-${date[1]}-${date[2]}`;
  el(id).value = date;
}
let start_date = formatDate(new Date()) + " 00:00:00";
let end_date = formatDate(new Date()) + " " + formatTime(new Date());

function setData() {
  fetchWithdraw(start_date, end_date);
}

async function onChangeData() {
  await showLoader();
  $("#tb_deposit").DataTable().destroy();
  start_date = $("#date_start_sort").val() + " 00:00:00";
  end_date = $("#date_end_sort").val() + " 23:59:59";
  await fetchWithdraw(start_date, end_date);
  hideLoader();
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
    order: [[2, "desc"]],
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

async function fetchWithdraw(start_date, end_date) {
  let column = [
    {
      title: "ชื่อผู้ใช้งาน",
      className: "align-middle text-center",
    },
    {
      title: "จำนวนเครดิต",
      className: "align-middle text-center",
    },
    {
      title: "วันที่",
      className: "align-middle text-center",
    },
  ];
  sd = start_date.split(" ");
  ed = end_date.split(" ");
  start_date = sd[0].split("/").reverse().join("-") + " " + sd[1];
  end_date = ed[0].split("/").reverse().join("-") + " " + ed[1];

  let data = [];
  let tableData = [];
  let resWithdrawReport = await callXMLHttpRequest(
    `${apiPort.apiQueryWheelReport}`,
    { start_date: start_date, end_date: end_date }
  );
  if (resWithdrawReport.statusCodeText == textRespone.ok.CodeText) {
    data = resWithdrawReport.withdraw;
    for (let i = 0; i < data.length; i++) {
      tableData.push([
        data[i].user,
        data[i].credit,
        formatDate(data[i].create_date) + " " + formatTime(data[i].create_date),
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
  hideLoader();
}
