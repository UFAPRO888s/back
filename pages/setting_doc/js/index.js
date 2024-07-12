$(document).ready(async function () {
  await list_banner();
  await list_popup();
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
      list_banner();
      list_popup();
    }
  });
}

async function edit_setting_doc() {
  if (canEdit) {
    let name_doc = el("name_doc").value;
    let url_doc = el("url_doc").value;
    let doc_status = el("doc_status").checked ? 1 : 0;
    let data = {
      name_doc: name_doc,
      url_doc: url_doc,
      doc_status: doc_status,
    };
    let resSettingWinloss = callXMLHttpRequest(
      `${apiPort.apiUpdateSettingDoc}`,
      data
    );
    if (resSettingWinloss.statusCodeText == 200) {
      Swal.fire({
        title: "แจ้งเตือน",
        text: "อัพเดตเรียบร้อยแล้ว",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.value) {
          window.location.reload();
        }
      });
    } else if (resSettingWinloss.statusCodeText == "401") {
      Swal.fire({
        title: "แจ้งเตือน",
        text: resSettingWinloss.description,
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
    } else {
      Swal.fire({
        title: "แจ้งเตือน",
        text: resSettingWinloss.description,
        icon: "error",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
  } else {
    Swal.fire({
      title: "แจ้งเตือน",
      text: "ไม่มีสิทธิ์เข้าถึง",
      icon: "error",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "OK",
    });
  }
}

async function list_banner() {
  let column = [
    {
      title: "ชื่อแบนเนอร์",
      className: "text-center",
    },
    {
      title: "ลิ้งวีดีโอ",
      className: "text-center",
    },
    {
      title: "สถานะ",
      className: "text-center",
    },
    {
      title: "จัดการ",
      className: "text-center",
    },
  ];
  let data = [];
  let tableData = [];
  let resMember = callXMLHttpRequest(`${apiPort.apiQuerySettingDoc}`, {});
  if (resMember.statusCodeText == textRespone.ok.CodeText) {
    data = resMember.data;
    for (let i = 0; i < data.length; i++) {
      let status = data[i].state === 1 ? "เปิดใช้งาน" : "ปิดใช้งาน";
      tableData.push([
        data[i].bname,
        data[i].link,
        `<span class="text-${
          data[i].state === 0 ? "warning" : "info"
        }">${status}</span>`,
        `<div class="btn-group" role="group">
                <button type="button" class="btn btn-danger btn-sm" id="delete" data-id="${data[i].id}">
                        <i class="far fa-trash-alt"></i> ลบ
                    </button>
                </div>`,
      ]);
    }
  }
  initDataTables(tableData, "banner", column);
}

async function list_popup() {
  let column = [
    {
      title: "ชื่อป๊อบอัพ",
      className: "text-center",
    },
    {
      title: "รายละเอียด",
      className: "text-center",
    },
    {
      title: "รูปภาพ",
      className: "text-center",
    },
    {
      title: "สถานะ",
      className: "text-center",
    },
    {
      title: "จัดการ",
      className: "text-center",
    },
  ];
  let data = [];
  let tableData = [];
  let resMember = callXMLHttpRequest(`${apiPort.apiQuerySettingPopup}`, {});
  if (resMember.statusCodeText == textRespone.ok.CodeText) {
    data = resMember.data;
    for (let i = 0; i < data.length; i++) {
      let status = data[i].state === 1 ? "เปิดใช้งาน" : "ปิดใช้งาน";
      tableData.push([
        data[i].bname,
        data[i].description,
        `<img src="${data[i].img_name}" class="img-thumbnail"/>`,
        `<span class="text-${
          data[i].state === 0 ? "warning" : "info"
        }">${status}</span>`,
        `<div class="btn-group" role="group">
                <button type="button" class="btn btn-danger btn-sm" id="delete" data-id="${data[i].id}">
                        <i class="far fa-trash-alt"></i> ลบ
                    </button>
                </div>`,
      ]);
    }
  }
  initDataTables(tableData, "popup", column);
}

function initDataTables(tableData, id, column) {
  $("#" + id).DataTable({
    data: tableData,
    columns: column,
    responsive: {
      details: {
        display: $.fn.dataTable.Responsive.display.modal({
          header: function (row) {
            var data = row.data();
            return "ป๊อบอัพ: " + data[0];
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
