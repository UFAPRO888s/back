$(document).ready(async function () {
  await setDataccountDeposit();
  await setDatAccountWithdraw();
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
      setDataccountDeposit();
      setDatAccountWithdraw();
    }
  });
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

function setDataccountDeposit() {
  let column = [
    {
      title: "ลำดับ",
      className: "align-middle text-center",
    },
    {
      title: "เลขบัญชี",
      className: "align-middle text-center",
    },
    {
      title: "ชื่อบัญชี",
      className: "align-middle text-center",
    },
    {
      title: "ประเภท",
      className: "align-middle text-center",
    },
    {
      title: "ยอดเงิน",
      className: "align-middle text-center",
    },
    {
      title: "สถานะ",
      className: "align-middle text-center",
    },
    {
      title: "Action",
      className: "align-middle text-center",
    },
  ];
  let data = [];
  let tableData = [];
  let resAccount = callXMLHttpRequest(`${apiPort.apiQueryAccountDeposit}`, {});
  if (resAccount.statusCodeText == textRespone.ok.CodeText) {
    data = resAccount.data;
    for (let i = 0; i < data.length; i++) {
      let htms = "";
      if (data[i].type == "scb") {
        htms = `<div style="width: 40px;background-color: #4e2e7f;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:12px;"> SCB</div>`;
      } else if (data[i].type == "kbank") {
        htms = `<div style="width: 40px;background-color: #48bb0e;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:12px;"> KBANK</div>`;
      }  else if (data[i].type == "kbiz") {
        htms = `<div style="width: 40px;background-color: #48bb0e;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:12px;"> KBIZ</div>`;
      } else if (data[i].type == "truewallet") {
        htms = `<div style="width: 40px;background-color: #ff8300;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:10px;"> WALLET</div>`;
      } else if (data[i].type == "Manual") {
        htms = `<div style="width: 40px;background-color: #4b545c;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:12px;"> Manual</div>`;
      }
      let htm = '<div class="btn-group" role="group">';
      if (data[i].status == 1) {
        htm += `<button type="button" class="btn btn-danger btn-sm" onclick="changeStatusDeposit('${data[i].id}',0)">
                 ปิดใช้งาน
                </button>`;
      } else {
        htm += `<button type="button" class="btn btn-success btn-sm" onclick="changeStatusDeposit('${data[i].id}',1)">
                เปิดใช้งาน
                </button>`;
      }
      htm += ` &nbsp;
            <button type="button" class="btn btn-warning btn-sm" onclick="edit_deposit_modal(${data[i].id},'${data[i].name}','${data[i].accnum}', '${data[i].type}')">
            <i class="far fa-edit"></i> แก้ไข
            </button>
            &nbsp;
            <button type="button" class="btn btn-danger btn-sm" onclick="delete_deposit(${data[i].id})">
            <i class="far fa-trash-alt"></i> ลบ
        </button>
        </div>`;
      tableData.push([
        i + 1,
        data[i].accnum,
        data[i].name,
        htms,
        `<span class="badge badge-sm bg-gradient-info" style="cursor:pointer;" onclick="checkMoney(0,'${data[i].id}','${data[i].type}')">คลิ้ก</span>`,
        data[i].status == 1
          ? `<span class="badge badge-sm bg-gradient-success">ใช้งานอยู่</span>`
          : `<span class="badge badge-sm bg-gradient-danger">ไม่ใช้งาน</span>`,
        htm,
      ]);
    }
  } else if (resAccount.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resAccount.description,
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

function changeStatusDeposit(id, status) {
  if (canEdit) {
    let data = {
      id: id,
      status: status,
    };
    let resDeposit = callXMLHttpRequest(
      `${apiPort.apiUpdateAccountDeposit}`,
      data
    );
    if (resDeposit.statusCodeText == textRespone.ok.CodeText) {
      Swal.fire({
        title: "แจ้งเตือน",
        text: "เปลี่ยนการใช้งานเรียบร้อยแล้ว",
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
    } else if (resDeposit.statusCodeText == "401") {
      Swal.fire({
        title: "แจ้งเตือน",
        text: resDeposit.description,
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
        text: resDeposit.description,
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

function changeStatusWithdraw(id, status) {
  if (canEdit) {
    let data = {
      id: id,
      status: status,
    };
    let resDeposit = callXMLHttpRequest(
      `${apiPort.apiUpdateAccountWithdraw}`,
      data
    );
    if (resDeposit.statusCodeText == textRespone.ok.CodeText) {
      Swal.fire({
        title: "แจ้งเตือน",
        text: "เปลี่ยนการใช้งานเรียบร้อยแล้ว",
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
    } else if (resDeposit.statusCodeText == "401") {
      Swal.fire({
        title: "แจ้งเตือน",
        text: resDeposit.description,
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
        text: resDeposit.description,
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

function setDatAccountWithdraw() {
  let column = [
    {
      title: "ลำดับ",
      className: "align-middle text-center",
    },
    {
      title: "เลขบัญชี",
      className: "align-middle text-center",
    },
    {
      title: "ชื่อบัญชี",
      className: "align-middle text-center",
    },
    {
      title: "ประเภท",
      className: "align-middle text-center",
    },
    {
      title: "ยอดเงิน",
      className: "align-middle text-center",
    },
    {
      title: "สถานะ",
      className: "align-middle text-center",
    },
    {
      title: "Action",
      className: "align-middle text-center",
    },
  ];
  let data = [];
  let tableData = [];
  let resAccount = callXMLHttpRequest(`${apiPort.apiQueryAccountWithdraw}`, {});
  if (resAccount.statusCodeText == textRespone.ok.CodeText) {
    data = resAccount.data;
    for (let i = 0; i < data.length; i++) {
      let htms = "";
      if (data[i].type == "scb") {
        htms = `<div style="width: 40px;background-color: #4e2e7f;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:12px;"> SCB</div>`;
      } else if (data[i].type == "truewallet") {
        htms = `<div style="width: 40px;background-color: #ff8300;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:10px;"> WALLET</div>`;
      } else if (data[i].type == "Manual") {
        htms = `<div style="width: 40px;background-color: #4b545c;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:12px;"> Manual</div>`;
      }
      let htm = '<div class="btn-group" role="group">';
      if (data[i].status == 1) {
        htm += `<button type="button" class="btn btn-danger btn-sm" onclick="changeStatusWithdraw('${data[i].id}',0)">
                 ปิดใช้งาน
                </button>`;
      } else {
        htm += `<button type="button" class="btn btn-success btn-sm" onclick="changeStatusWithdraw('${data[i].id}',1)">
                เปิดใช้งาน
                </button>`;
      }
      htm += ` &nbsp;
            <button type="button" class="btn btn-warning btn-sm" onclick="edit_withdraw_modal(${data[i].id},'${data[i].name}','${data[i].accnum}')">
            <i class="far fa-edit"></i> แก้ไข
            </button>
            &nbsp;
            <button type="button" class="btn btn-danger btn-sm" onclick="delete_withdraw(${data[i].id})">
            <i class="far fa-trash-alt"></i> ลบ
        </button>
        </div>`;
      tableData.push([
        i + 1,
        data[i].accnum,
        data[i].name,
        htms,
        `<span class="badge badge-sm bg-gradient-info" style="cursor:pointer;" onclick="checkMoney(1,'${data[i].id}','${data[i].type}')">คลิ้ก</span>`,
        data[i].status == 1
          ? `<span class="badge badge-sm bg-gradient-success">ใช้งานอยู่</span>`
          : `<span class="badge badge-sm bg-gradient-danger">ไม่ใช้งาน</span>`,
        htm,
      ]);
    }
  } else if (resAccount.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resAccount.description,
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
  initDataTables(tableData, "logs1", column);
}

function edit_deposit_modal(id, name, acc, type) {
  if (canEdit) {
    el("edit_deposit").value = id;
    el("head_deposit").innerHTML = name + " " + acc;
    el("device_deposit").value = "";
    el("pin_deposit").value = "";
    $("#edit_Deposit").modal("show");

    if (type == 'truewallet') {
      $('#edit_deposit_txt_device').html('Username')
      $('#edit_deposit_txt_pin').html('Password')
      $('#edit_deposit_ipt_token').show()
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

function edit_withdraw_modal(id, name, acc) {
  if (canEdit) {
    el("edit_withdraw").value = id;
    el("head_withdraw").innerHTML = name + " " + acc;
    el("device_withdraw").value = "";
    el("pin_withdraw").value = "";
    $("#edit_withdraw").modal("show");
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

function edit_Deposit() {
  if (canEdit) {
    let username = el("device_deposit").value;
    let password = el("pin_deposit").value;
    let token = el("token_deposit").value ? el("token_deposit").value : '';
    let id = el("edit_deposit").value;
    let data = {
      username: username,
      password: password,
      id: id,
      token: token
    };
    let resDeposit = callXMLHttpRequest(
      `${apiPort.apiUpdateAccountDepositDetail}`,
      data
    );
    if (resDeposit.statusCodeText == textRespone.ok.CodeText) {
      Swal.fire({
        title: "แจ้งเตือน",
        text: "อัพเดต บัญชีฝาก เรียบร้อยแล้ว",
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
    } else if (resDeposit.statusCodeText == "401") {
      Swal.fire({
        title: "แจ้งเตือน",
        text: resDeposit.description,
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
        text: resDeposit.description,
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

function edit_withdraw() {
  if (canEdit) {
    let username = el("device_withdraw").value;
    let password = el("pin_withdraw").value;
    let id = el("edit_withdraw").value;
    let data = {
      username: username,
      password: password,
      id: id,
    };
    let resCheckMoney = callXMLHttpRequest(
      `${apiPort.apiUpdateAccountWithdrawDetail}`,
      data
    );
    if (resCheckMoney.statusCodeText == textRespone.ok.CodeText) {
      Swal.fire({
        title: "แจ้งเตือน",
        text: "อัพเดต บัญชีถอน เรียบร้อยแล้ว",
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
    } else if (resCheckMoney.statusCodeText == "401") {
      Swal.fire({
        title: "แจ้งเตือน",
        text: resCheckMoney.description,
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

function delete_deposit(id) {
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
          `${apiPort.apiDeleteDeopsit}`,
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

function delete_withdraw(id) {
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
          `${apiPort.apiDeleteWithdraw}`,
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

function add_deposit_modal() {
  if (canEdit) {
    el("name_deposit_add").value = "";
    el("acc_deposit_add").value = "";
    el("device_deposit_add").value = "";
    el("pin_deposit_add").value = "";
    $("#add_deposit").modal("show");
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

function add_withdraw_modal() {
  if (canEdit) {
    el("name_withdraw_add").value = "";
    el("acc_withdraw_add").value = "";
    el("device_withdraw_add").value = "";
    el("pin_withdraw_add").value = "";
    $("#add_withdraw").modal("show");
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

$( "#type_deposit_add" ).on( "change", function(e) {
  const value = $(this).val()
  if (value === 'truewallet') {
    $('#add_txt_account').html('เบอร์วอลเล็ต')
    $('#add_txt_username').html('Username')
    $('#add_txt_password').html('Password')
    $('#add_div_token').show()
  } else {
    $('#add_txt_account').html('เลขบัญชี')
    $('#add_txt_username').html('Device ID')
    $('#add_txt_password').html('PIN')
    $('#add_div_token').hide()
  }
} );

function add_deposit() {
  if (canEdit) {
    let name = el("name_deposit_add").value;
    let acc = el("acc_deposit_add").value;
    let device = el("device_deposit_add").value;
    let type = el("type_deposit_add").value;
    let pin = el("pin_deposit_add").value;
    let token = el("token_deposit_add").value ? el("token_deposit_add").value : '';
    let data = {
      name: name,
      acc: acc,
      device: device,
      pin: pin,
      type: type,
      token: token
    };

    let resAddDeposit = callXMLHttpRequest(`${apiPort.apiAddDeposit}`, data);
    if (resAddDeposit.statusCodeText == textRespone.ok.CodeText) {
      Swal.fire({
        title: "แจ้งเตือน",
        text: "เพิ่ม บัญชีฝาก เรียบร้อยแล้ว",
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
    } else if (resAddDeposit.statusCodeText == "401") {
      Swal.fire({
        title: "แจ้งเตือน",
        text: resAddDeposit.description,
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
        text: resAddDeposit.description,
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

function add_withdraw() {
  if (canEdit) {
    let name = el("name_withdraw_add").value;
    let acc = el("acc_withdraw_add").value;
    let device = el("device_withdraw_add").value;
    let type = el("type_withdraw_add").value;
    let pin = el("pin_withdraw_add").value;
    let data = {
      name: name,
      acc: acc,
      device: device,
      pin: pin,
      type: type,
    };

    let resAddWithdraw = callXMLHttpRequest(`${apiPort.apiAddWithdraw}`, data);
    if (resAddWithdraw.statusCodeText == textRespone.ok.CodeText) {
      Swal.fire({
        title: "แจ้งเตือน",
        text: "เพิ่ม บัญชีถอน เรียบร้อยแล้ว",
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
    } else if (resAddWithdraw.statusCodeText == "401") {
      Swal.fire({
        title: "แจ้งเตือน",
        text: resAddWithdraw.description,
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
        text: resAddWithdraw.description,
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

function add_promotion() {
  let pro_type = el("pro_type_add").value;
  let img_name = el("url_img_1_add").value;
  let name = el("name_1_add").value;
  let percen = el("percen_1_add").value;
  let x = el("x_1_add").value;
  let token = el("token_add").value;
  let limit_d = el("limit_1_add").value;
  let text = el("text_1_add").innerHTML;
  let withdraw_u = el("withdraw_u_add").value;
  let deposit_u = el("deposit_u_add").value;
  let limit_r = el("limit_r_add").value;
  let receive_pro = el("receive_pro_add").value;
  let stats = el("stats_1_add").value;
  if (pro_type == 3) {
    percen = 0;
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
    el("x_1").value = resPromotion.data[0].x;
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
    el("x_1_edit").value = resPromotion.data[0].x;
    el("limit_1_edit").value = resPromotion.data[0].limit_d;
    el("text_1_edit").innerHTML = resPromotion.data[0].text;
    el("edit_id").value = resPromotion.data[0].pro_id;
    el("deposit_u_edit").value = resPromotion.data[0].deposit_u;
    el("limit_r_edit").value = resPromotion.data[0].limit_r;
    el("receive_pro_edit").value = resPromotion.data[0].withdraw_u;
    el("withdraw_u_edit").value = resPromotion.data[0].receive_pro;

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
}

function edit_promotion() {
  let pro_type = el("pro_type_edit").value;
  let img_name = el("url_img_1_edit").value;
  let name = el("name_1_edit").value;
  let percen = el("percen_1_edit").value;
  let x = el("x_1_edit").value;
  let token = el("token_edit").value;
  let limit_d = el("limit_1_edit").value;
  let text = el("text_1_edit").innerHTML;
  let withdraw_u = el("withdraw_u_edit").value;
  let deposit_u = el("deposit_u_edit").value;
  let limit_r = el("limit_r_edit").value;
  let receive_pro = el("receive_pro_edit").value;
  let stats = el("stats_1_edit").value;
  let id = el("edit_id").value;
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
}

function delete_promotion(id) {
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
}
async function checkMoney(type, id, bank) {
  let data = {
    type: type,
    id: id,
    bank: bank,
  };
  let htm = "";
  if (type == 0) {
    htm = bank + " (บัญชีฝาก)";
  } else {
    htm = bank + " (บัญชีถอน)";
  }
  if (bank == "scb") {
    el("bg-modal-bank").classList.add("scb");
    el("bg-modal-bank").classList.remove("truewallet");
    el("name_bank").innerHTML = "ธนาคารไทยพาณิช";
    el("img_bank").src =
      "//s3auto.sgp1.vultrobjects.com/js_wauto/source/images/scb.png";
  } else {
    el("bg-modal-bank").classList.add("truewallet");
    el("bg-modal-bank").classList.remove("scb");
    el("name_bank").innerHTML = "ทรูวอเล็ต";
    el("img_bank").src =
      "//s3auto.sgp1.vultrobjects.com/js_wauto/source/images/truewallet.jpg";
  }
  let resCheckMoney = await callXMLHttpRequest(
    `${apiPort.apiCheckBalanceBank}`,
    data
  );
  if (resCheckMoney.statusCodeText == textRespone.ok.CodeText) {
    if (resCheckMoney.name) {
      el("name_account").innerHTML = resCheckMoney.name;
    } else {
      el("name_account").innerHTML = "-";
    }
    if (resCheckMoney.accnum) {
      el("accnum").innerHTML = resCheckMoney.accnum;
    } else {
      el("accnum").innerHTML = "-";
    }
    if (resCheckMoney.credit) {
      el("balance_amount").innerHTML =
        "ยอดเงินในบัญชี " +
        htm +
        ' : <span style="color:#0cf50c;font-size:15px;">' +
        formatMoney(resCheckMoney.credit) +
        " บาท </span>";
    } else {
      el("balance_amount").innerHTML = "-";
    }
    el("name_bank").innerHTML = bank.toUpperCase();
  } else if (resCheckMoney.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resCheckMoney.description,
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
    if (resCheckMoney.name) {
      el("name_scb").innerHTML = resCheckMoney.name;
    } else {
      el("name_scb").innerHTML = "-";
    }
    if (resCheckMoney.accnum) {
      el("acc_scb").innerHTML = resCheckMoney.accnum;
    } else {
      el("acc_scb").innerHTML = "-";
    }
    el("balance_amount").innerHTML =
      "ระบบไม่สามารถเช็คยอดเงินได้ กรุณาเว้นช่วงเวลา หรือลองใหม่อีกครั้ง";
    el("name_bank").innerHTML = bank.toUpperCase();
  }
  $("#balance_info").modal("show");
}
