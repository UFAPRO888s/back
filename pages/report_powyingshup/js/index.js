$(document).ready(function () {
  Loading();
});

function setData() {
  var yearL = new Date().getFullYear();
  var leap = (yearL % 4 == 0 && yearL % 100 != 0) || yearL % 400 == 0 ? 2 : 3;
  var date = new Date();
  var day = date.getDate();
  var month = str_pad(date.getMonth("m") + 1);
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();

  $.datetimepicker.setLocale("th");
  $("#date_start").datetimepicker({
    value: day + "/" + month + "/" + year + " 00:00",
    timepicker: false,
    format: "d/m/Y H:i",
    lang: "th",
    dayOfWeekStart: leap,
    timepicker: true,
  });

  $("#date_end").datetimepicker({
    value: day + "/" + month + "/" + year + " " + hours + ":" + minutes,
    timepicker: false,
    format: "d/m/Y H:i",
    lang: "th",
    dayOfWeekStart: leap,
    timepicker: true,
  });

  $("#date_start_1").datetimepicker({
    value: day + "/" + month + "/" + year + " 00:00",
    timepicker: false,
    format: "d/m/Y H:i",
    lang: "th",
    dayOfWeekStart: leap,
    timepicker: true,
  });

  $("#date_end_1").datetimepicker({
    value: day + "/" + month + "/" + year + " " + hours + ":" + minutes,
    timepicker: false,
    format: "d/m/Y H:i",
    lang: "th",
    dayOfWeekStart: leap,
    timepicker: true,
  });

  var start_date = day + "/" + month + "/" + year + " 00:00:00";
  var end_date =
    day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":00";

  fetchWithdraw(start_date, end_date);
  $("#date_start").change(function () {
    $("#tb_deposit").DataTable().destroy();
    start_date = $("#date_start").val() + ":00";
    end_date = $("#date_end").val() + ":00";
    fetchWithdraw(start_date, end_date);
  });

  fetchWithdrawAuto(start_date, end_date);
  $("#date_start_1").change(function () {
    $("#tb_deposit_auto").DataTable().destroy();
    start_date = $("#date_start_1").val() + ":00";
    end_date = $("#date_end_1").val() + ":00";
    fetchWithdrawAuto(start_date, end_date);
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
    order: [[3, "desc"]],
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
      className: "align-middle text-center",
    },
    {
      title: "จำนวนเครดิต",
      className: "align-middle text-center",
    },
    {
      title: "ผลที่ออก",
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
  let resWithdrawReport = callXMLHttpRequest(
    `${apiPort.apiQueryPowYingShupReport}`,
    { start_date: start_date, end_date: end_date }
  );
  if (resWithdrawReport.statusCodeText == textRespone.ok.CodeText) {
    data = resWithdrawReport.withdraw;
    for (let i = 0; i < data.length; i++) {
      tableData.push([
        data[i].member_username,
        data[i].credit,
        data[i].result == 0
          ? '<span style="color:red">แพ้</span>'
          : data[i].result == 1
          ? '<span style="color:#f9b10f">เสมอ</span>'
          : '<span style="color:green">ชนะ</span>',
        formatDate(data[i].date) + " " + formatTime(data[i].date),
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
