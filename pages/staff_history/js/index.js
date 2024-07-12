$(document).ready(async function () {
  await setDataPromotionHistory();
  hideLoader();
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
    if (result.dismiss === Swal.DismissReason.timer) {
      setDataPromotionHistory();
    }
  });
}

function initDataTables(tableData, id, column) {
  $("#" + id).DataTable({
    data: tableData,
    order: [[2, "desc"]],
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

function setDataPromotionHistory() {
  let column = [
    {
      title: "ชื่อผู้ทำรายการ",
      className: "align-middle text-center",
    },
    {
      title: "รายละเอียด",
      className: "align-middle text-center",
    },
    {
      title: "วันเวลา",
      className: "align-middle text-center",
    },
  ];
  let data = [];
  let tableData = [];
  let resPromotionHistory = callXMLHttpRequest(
    `${apiPort.apiQueryeStaffHistory}`,
    {}
  );
  if (resPromotionHistory.statusCodeText == textRespone.ok.CodeText) {
    data = resPromotionHistory.data;
    for (let i = 0; i < data.length; i++) {
      tableData.push([
        data[i].username,
        data[i].detail,
        formatDate(data[i].date) + " " + formatTime(data[i].date),
      ]);
    }
  } else if (resPromotionHistory.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resPromotionHistory.description,
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
  initDataTables(tableData, "logs", column);
}
