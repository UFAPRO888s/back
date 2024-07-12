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
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      setDataPromotionHistory();
    }
  });
}

function initDataTables(tableData, id, column) {
  $("#" + id).DataTable({
    data: tableData,
    columns: column,
    order: [[3, "desc"]],
    responsive: {
      details: {
        display: $.fn.dataTable.Responsive.display.modal({
          header: function (row) {
            var data = row.data();
            return "ผู้ใช้งาน: " + data[0];
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

async function setDataPromotionHistory() {
  let column = [
    {
      title: "สมาชิก",
      className: "align-middle text-center",
    },
    {
      title: "ยอดได้เสีย UFA",
      className: "align-middle text-center",
    },
    {
      title: "ผล UFA",
      className: "align-middle text-center",
    },
    {
      title: "ออนไลน์ล่าสุดเมื่อ",
      className: "align-middle text-center",
    },
  ];
  let data = [];
  let tableData = [];
  let resMemberOnline = await callXMLHttpRequest(
    `${apiPort.apiQueryMemberOnline}`,
    {}
  );
  if (resMemberOnline.statusCodeText == textRespone.ok.CodeText) {
    data = resMemberOnline.MemberOnlineNow;
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        tableData.push([
          data[i].member_username,
          data[i].winloss > 0
            ? '<span style="color:green">' +
              numberWithCommas(data[i].winloss) +
              "</span>"
            : data[i].winloss == 0
            ? '<span style="color:blue">' +
              numberWithCommas(data[i].winloss) +
              "</span>"
            : '<span style="color:red">' +
              numberWithCommas(data[i].winloss) +
              "</span>",
          data[i].winloss > 0
            ? '<span style="color:green">ได้</span>'
            : data[i].winloss == 0
            ? '<span style="color:blue">ยังไม่ได้เล่น</span>'
            : '<span style="color:red">เสีย</span>',
          formatDate(data[i].LastUpdate) + " " + formatTime(data[i].LastUpdate),
        ]);
      }
    }
    initDataTables(tableData, "member_online_now", column);

    tableData = [];
    data = resMemberOnline.MemberOnlineMonth;
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        tableData.push([
          data[i].member_username,
          data[i].winloss > 0
            ? '<span style="color:green">' +
              numberWithCommas(data[i].winloss) +
              "</span>"
            : data[i].winloss == 0
            ? '<span style="color:blue">' +
              numberWithCommas(data[i].winloss) +
              "</span>"
            : '<span style="color:red">' +
              numberWithCommas(data[i].winloss) +
              "</span>",
          data[i].winloss > 0
            ? '<span style="color:green">ได้</span>'
            : data[i].winloss == 0
            ? '<span style="color:blue">ยังไม่ได้เล่น</span>'
            : '<span style="color:red">เสีย</span>',
          formatDate(data[i].LastUpdate) + " " + formatTime(data[i].LastUpdate),
        ]);
      }
    }
    initDataTables(tableData, "member_online_month", column);
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
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
