$(document).ready(function () {
  Loading();
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
      setDatPromotion();
    }
  });
}

function add_promotion_modal() {
  if (canEdit) {
    el("url_img_1_add").value = "";
    el("name_1_add").value = "";
    el("percen_1_add").value = "";
    el("x_1_add").value = 0;
    el("token_add").value = "";
    el("limit_1_add").value = 0;
    el("text_1_add").innerHTML = "";
    el("withdraw_u_add").value = 0;
    el("deposit_u_add").value = 0;
    el("limit_r_add").value = 0;
    el("receive_pro_add").value = 0;
    let resPromotion = callXMLHttpRequest(
      `${apiPort.apiQueryPromotionType}`,
      {}
    );
    if (resPromotion.statusCodeText == textRespone.ok.CodeText) {
      let htm = "";
      for (let i = 0; i < resPromotion.data.length; i++) {
        htm +=
          '<option value="' +
          resPromotion.data[i].id +
          '">' +
          resPromotion.data[i].pro_type +
          "</option>";
      }
      el("pro_type_add").innerHTML = htm;
    }
    $("#add_promotion").modal("show");
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

function initDataTables(tableData, id, column) {
  $("#" + id).DataTable({
    data: tableData,
    columns: column,
    responsive: {
      details: {
        display: $.fn.dataTable.Responsive.display.modal({
          header: function (row) {
            var data = row.data();
            return "สมาชิก: " + data[2];
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

function setDatPromotion() {
  let column = [
    {
      title: "ลำดับ",
      className: "align-middle text-center",
    },
    {
      title: "ประเภท",
      className: "align-middle",
    },
    {
      title: "ชื่อโปรโมชั่น",
      className: "align-middle",
    },
    {
      title: "โบนัส",
      className: "align-middle",
    },
    {
      title: "จำนวนเทิร์น",
      className: "align-middle",
    },
    {
      title: "ฝากสูงสุด",
      className: "align-middle",
    },
    {
      title: "จัดการ",
      className: "align-middle",
    },
  ];
  let data = [];
  let tableData = [];
  let resPromotion = callXMLHttpRequest(`${apiPort.apiQueryPromotion}`, {});
  if (resPromotion.statusCodeText == textRespone.ok.CodeText) {
    data = resPromotion.data;
    for (let i = 0; i < data.length; i++) {
      tableData.push([
        i + 1,
        data[i].pro_type,
        data[i].name,
        data[i].percen + "%",
        data[i].x,
        formatMoneyNotDecimal(data[i].limit_d),
        `<div class="btn-group" role="group">
                <button type="button" class="btn btn-info btn-sm" onclick="detail_promotion('${data[i].pro_id}')">
                <i class="fa-regular fa-address-card"></i> รายละเอียด
                </button>
                &nbsp;
                    <button type="button" class="btn btn-warning btn-sm" onclick="edit_promotion_modal(${data[i].pro_id})">
                    <i class="far fa-edit"></i> แก้ไข
                    </button>
                    &nbsp;
                    <button type="button" class="btn btn-danger btn-sm" onclick="delete_promotion(${data[i].pro_id})">
                    <i class="far fa-trash-alt"></i> ลบ
                </button>
                </div>`,
      ]);
    }
  } else if (resPromotion.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resPromotion.description,
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

function add_promotion() {
  if (canEdit) {
    let pro_type = el("pro_type_add").value;
    let img_name = el("url_img_1_add").value;
    let name = el("name_1_add").value;
    let percen = el("percen_1_add").value;
    let x = el("x_1_add").value;
    let token = el("token_add").value;
    let limit_d = el("limit_1_add").value;
    let text = el("text_1_add").value;
    let withdraw_u = el("withdraw_u_add").value;
    let deposit_u = el("deposit_u_add").value;
    let limit_r = el("limit_r_add").value;
    let receive_pro = el("receive_pro_add").value;
    let stats = el("stats_1_add").value;
    let turn = 0;
    if (pro_type == 3) {
      percen = 0;
      turn = x;
      x = 0;
    }

    let data = {
      pro_type: pro_type,
      img_name: img_name,
      token: token,
      name: name,
      percen: percen,
      x: x,
      limit_d: limit_d,
      text: text,
      stats: stats,
      withdraw_u: withdraw_u,
      deposit_u: deposit_u,
      limit_r: limit_r,
      receive_pro: receive_pro,
      turn: turn,
    };

    let resAlliance = callXMLHttpRequest(`${apiPort.apiAddPromotion}`, data);
    if (resAlliance.statusCodeText == textRespone.ok.CodeText) {
      Swal.fire({
        title: "แจ้งเตือน",
        text: "เพิ่ม โปรโมชั่น เรียบร้อยแล้ว",
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
    } else if (resAlliance.statusCodeText == "401") {
      Swal.fire({
        title: "แจ้งเตือน",
        text: resAlliance.description,
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
        text: resAlliance.description,
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

function detail_promotion(id) {
  let resPromotion = callXMLHttpRequest(`${apiPort.apiQueryPromotionByID}`, {
    id: id,
  });
  if (resPromotion.statusCodeText == textRespone.ok.CodeText) {
    el("pro_type").value = resPromotion.data[0].pro_type;
    el("img_1").src = resPromotion.data[0].img_name;
    el("url_img_1").value = resPromotion.data[0].img_name;
    el("name_1").value = resPromotion.data[0].name;
    el("percen_1").value = resPromotion.data[0].percen;
    if (resPromotion.data[0].protype_id != 3) {
      el("x_1").value = resPromotion.data[0].x;
    } else {
      el("x_1").value = resPromotion.data[0].turn;
    }
    el("limit_1").value = resPromotion.data[0].limit_d;
    el("deposit_u").value = resPromotion.data[0].deposit_u;
    el("limit_r").value = resPromotion.data[0].limit_r;
    el("receive_pro").value = resPromotion.data[0].receive_pro;
    el("withdraw_u").value = resPromotion.data[0].withdraw_u;
    el("text_1").innerHTML = resPromotion.data[0].text;
    el("token_detail").value = resPromotion.data[0].token;

    if (resPromotion.data[0].stats == 1) {
      el("stats_1").innerHTML = '<option value="1">เปิด</option>';
    } else {
      el("stats_1").innerHTML = '<option value="0">ปิด</option>';
    }

    $("#detaial_promotion").modal("show");
  } else if (resPromotion.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resPromotion.description,
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
      text: resPromotion.description,
      icon: "error",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "OK",
    });
  }
}

function edit_promotion_modal(id) {
  if (canEdit) {
    let resPromotion = callXMLHttpRequest(
      `${apiPort.apiQueryPromotionEditByID}`,
      { id: id }
    );
    if (resPromotion.statusCodeText == textRespone.ok.CodeText) {
      let htm = "";
      for (let i = 0; i < resPromotion.promotion.length; i++) {
        if (resPromotion.promotion[i].id == resPromotion.data[0].protype_id) {
          htm +=
            '<option value="' +
            resPromotion.promotion[i].id +
            '" selected>' +
            resPromotion.promotion[i].pro_type +
            "</option>";
        } else {
          htm +=
            '<option value="' +
            resPromotion.promotion[i].id +
            '">' +
            resPromotion.promotion[i].pro_type +
            "</option>";
        }
      }

      el("pro_type_edit").innerHTML = htm;
      el("img_1_edit").src = resPromotion.data[0].img_name;
      el("url_img_1_edit").value = resPromotion.data[0].img_name;
      el("name_1_edit").value = resPromotion.data[0].name;
      el("percen_1_edit").value = resPromotion.data[0].percen;
      el("token_edit").value = resPromotion.data[0].token;
      if (resPromotion.data[0].protype_id != 3) {
        el("x_1_edit").value = resPromotion.data[0].x;
      } else {
        el("x_1_edit").value = resPromotion.data[0].turn;
      }
      el("limit_1_edit").value = resPromotion.data[0].limit_d;
      el("text_1_edit").innerHTML = resPromotion.data[0].text;
      el("edit_id").value = resPromotion.data[0].pro_id;
      el("deposit_u_edit").value = resPromotion.data[0].deposit_u;
      el("limit_r_edit").value = resPromotion.data[0].limit_r;
      el("receive_pro_edit").value = resPromotion.data[0].receive_pro;
      el("withdraw_u_edit").value = resPromotion.data[0].withdraw_u;

      if (resPromotion.data[0].stats == 1) {
        el("stats_1_edit").innerHTML =
          '<option value="1" selected>เปิด</option><option value="0">ปิด</option>';
      } else {
        el("stats_1_edit").innerHTML =
          '<option value="1" >เปิด</option><option value="0" selected>ปิด</option>';
      }

      $("#edit_promotion").modal("show");
    } else if (resPromotion.statusCodeText == "401") {
      Swal.fire({
        title: "แจ้งเตือน",
        text: resPromotion.description,
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
        text: resPromotion.description,
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

function edit_promotion() {
  if (canEdit) {
    let pro_type = el("pro_type_edit").value;
    let img_name = el("url_img_1_edit").value;
    let name = el("name_1_edit").value;
    let percen = el("percen_1_edit").value;
    let x = el("x_1_edit").value;
    let token = el("token_edit").value;
    let limit_d = el("limit_1_edit").value;
    let text = el("text_1_edit").value;
    let withdraw_u = el("withdraw_u_edit").value;
    let deposit_u = el("deposit_u_edit").value;
    let limit_r = el("limit_r_edit").value;
    let receive_pro = el("receive_pro_edit").value;
    let stats = el("stats_1_edit").value;
    let id = el("edit_id").value;
    let turn = 0;
    if (pro_type == 3) {
      turn = x;
      x = 0;
    }
    let data = {
      pro_type: pro_type,
      img_name: img_name,
      token: token,
      name: name,
      percen: percen,
      x: x,
      limit_d: limit_d,
      text: text,
      stats: stats,
      id: id,
      withdraw_u: withdraw_u,
      deposit_u: deposit_u,
      limit_r: limit_r,
      receive_pro: receive_pro,
      turn: turn,
    };
    let resPromotion = callXMLHttpRequest(
      `${apiPort.apiUpdatePromotionbyID}`,
      data
    );
    if (resPromotion.statusCodeText == textRespone.ok.CodeText) {
      Swal.fire({
        title: "แจ้งเตือน",
        text: "อัพเดต โปรโมชั่น เรียบร้อยแล้ว",
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
    } else if (resPromotion.statusCodeText == "401") {
      Swal.fire({
        title: "แจ้งเตือน",
        text: resPromotion.description,
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
        text: resPromotion.description,
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

function delete_promotion(id) {
  if (canEdit) {
    Swal.fire({
      title: "แจ้งเตือน",
      text: "คุณต้องการที่จะลบข้อมูลนี้หรือไม่ ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#009102",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        let resDeleteMember = callXMLHttpRequest(
          `${apiPort.apiDeletePromotion}`,
          { id: id }
        );
        if (resDeleteMember.statusCodeText == textRespone.ok.CodeText) {
          Swal.fire({
            title: "แจ้งเตือน",
            text: "ลบข้อมูลเรียบร้อยแล้ว",
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
        } else {
          Swal.fire({
            title: "แจ้งเตือน",
            text: resDeleteMember.description,
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
    });
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
