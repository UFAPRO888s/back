$(document).ready(async function () {
  await setOption("statusLottoType");
  Loading();
});
async function onChangeSelectLottoType(idTable, idValue) {
  let id = el(idValue).value;
  if (id != "all" || id != 0) {
    let resOption = await callXMLHttpRequest(`${apiPort.apiGetLottoDate}`, {
      lottoType: id,
    });
    if (resOption.statusCodeText == textRespone.ok.CodeText) {
      let htm = "";
      if (resOption.data.length > 0) {
        htm = '<option value="0">--เลือกงวดหวย--</option>';
        for (let i = 0; i < resOption.data.length; i++) {
          htm +=
            '<option value="' +
            formatDate(resOption.data[i].lotto_date) +
            '">' +
            formatDate(resOption.data[i].lotto_date) +
            "</option>";
        }
      } else {
        htm = '<option value="0">--ไม่พบข้อมูล---</option>';
      }
      el(idTable).innerHTML = htm;
    } else if (resOption.statusCodeText == "401") {
      Swal.fire({
        title: "แจ้งเตือน",
        text: resOption.description,
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
}

async function setOption(id) {
  let resOption = await callXMLHttpRequest(`${apiPort.apiGetLottoType}`, {});
  if (resOption.statusCodeText == textRespone.ok.CodeText) {
    let htm = '<option value="all">--เลือกประเภทหวย--</option>';
    let data = resOption.data;
    for (let i = 0; i < resOption.data.length; i++) {
      htm +=
        '<option value="' +
        data[i].id +
        '">' +
        data[i].lotto_name +
        "</option>";
    }
    el(id).innerHTML = htm;
  } else if (resOption.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resOption.description,
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
      initDataTables([], "logs_lotto_limit", column);
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
let column = [
  {
    title: "ลำดับ",
    className: "align-middle text-center",
  },
  {
    title: "เลข",
    className: "align-middle text-center",
  },
  {
    title: "ราคาจ่าย",
    className: "align-middle text-center",
  },
  {
    title: "งวด",
    className: "align-middle text-center",
  },
  {
    title: "ประเภท",
    className: "align-middle text-center",
  },
  {
    title: "เครื่องมือ",
    className: "align-middle text-center",
  },
];

function setData() {
  onChangeAddLottoType();
  var table = $("#logs_lotto_limit").DataTable();
  table.destroy();
  let data = [];
  let tableData = [];
  let lottoType = el("statusLottoType").value;
  let lottoDate = el("lotto-date").value;
  let resDetail = callXMLHttpRequest(`${apiPort.apiGetDetailLotto}`, {
    lottoType: lottoType,
    lottoDate: lottoDate,
  });
  if (resDetail.statusCodeText == textRespone.ok.CodeText) {
    data = resDetail.data;
    for (let i = 0; i < data.length; i++) {
      tableData.push([
        i + 1,
        data[i].number,
        data[i].reward,
        formatDate(data[i].lotto_date),
        data[i].description,
        `<div class="btn-group" role="group">
                <button type="button" class="btn btn-danger btn-sm" id="delete" data-id="${data[i].id}" onclick="delete_member(${data[i].id},'${data[i].username}')">
                        <i class="far fa-trash-alt"></i> ลบ
                    </button>
                    &nbsp;
                    <button type="button" class="btn btn-warning btn-sm" id="edit" data-id="${data[i].id}" onclick="openModalEdit('${lottoType}','${data[i].id}','${data[i].number}','${data[i].reward}','${data[i].lotto_date}','${data[i].lotto_reward_type}')">
                        <i class="far fa-edit"></i> แก้ไข
                        </button>
                </div>`,
      ]);
    }
  } else if (resDetail.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resDetail.description,
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
  initDataTables(tableData, "logs_lotto_limit", column);
}

async function onChangeAddLottoType() {
  el("add_number").disabled = true;
  let resDetail = await callXMLHttpRequest(`${apiPort.apiGetRewardLotto}`, {
    lottoType: el("statusLottoType").value,
  });
  if (resDetail.statusCodeText == textRespone.ok.CodeText) {
    let htm = "";
    if (resDetail.data.length > 0) {
      htm = '<option value="0">--เลือกประเภท--</option>';
      for (let i = 0; i < resDetail.data.length; i++) {
        htm +=
          '<option value="' +
          resDetail.data[i].reward_name +
          "-" +
          resDetail.data[i].id +
          '" >' +
          resDetail.data[i].description +
          "</option>";
      }
    } else {
      htm = '<option value="0">--ไม่พบข้อมูล---</option>';
    }
    el("addLottoTypeReward").innerHTML = htm;
  }
  el("addLottoTypeDate").disabled = false;
  el("addLottoTypeReward").disabled = false;
}

async function addLottoLimit() {
  if (canEdit) {
    let lotto_type = el("statusLottoType").value;
    let lotto_date = el("lotto-date").value;
    let lotto_reward_type = type_id;
    let number = list_number;
    let reward = 0;
    let data = {
      id: 0,
      lotto_type: lotto_type,
      lotto_date: lotto_date,
      lotto_reward_type: lotto_reward_type,
      number: number,
      reward: reward,
    };
    let resultCreateLottoLimit = callXMLHttpRequest(
      `${apiPort.apiCreateLottoLimit}`,
      data
    );
    if (resultCreateLottoLimit.statusCodeText == textRespone.ok.CodeText) {
      Swal.fire({
        title: "แจ้งเตือน",
        text: "เพิ่มเลขอั้นเรียบร้อยแล้ว",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.value) {
          setData();
          $("#add_lotto_limit").modal("hide");
        }
      });
    } else if (resultCreateLottoLimit.statusCodeText == "401") {
      Swal.fire({
        title: "แจ้งเตือน",
        text: resultCreateLottoLimit.description,
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
        text: "Error",
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

async function upDateLottoLimit() {
  if (canEdit) {
    let id = el("edit_id_member").value;
    let lotto_type = el("editLottoType").value;
    let lotto_date = el("editLottoTypeDate").value;
    let lotto_reward_type = el("editLottoTypeReward").value;
    let number = el("editLottoTypeNumber").value;
    let reward = el("editLottoTypeRate").value;
    let data = {
      id: id,
      lotto_type: lotto_type,
      lotto_date: lotto_date,
      lotto_reward_type: lotto_reward_type,
      number: number,
      reward: reward,
    };
    let resultCreateLottoLimit = callXMLHttpRequest(
      `${apiPort.apiUpdateLottoLimit}`,
      data
    );
    if (resultCreateLottoLimit.statusCodeText == textRespone.ok.CodeText) {
      Swal.fire({
        title: "แจ้งเตือน",
        text: "แก้ไขเลขอั้นเรียบร้อยแล้ว",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.value) {
          setData();
          $("#edit_lotto_limit").modal("hide");
        }
      });
    } else if (resultCreateLottoLimit.statusCodeText == "401") {
      Swal.fire({
        title: "แจ้งเตือน",
        text: resultCreateLottoLimit.description,
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
        text: "Error",
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

async function openModalEdit(
  type,
  id,
  number,
  reward,
  lotto_date,
  lotto_reward_type
) {
  if (canEdit) {
    el("edit_id_member").value = id;
    let resOption = await callXMLHttpRequest(`${apiPort.apiGetLottoType}`, {});
    let htm = '<option value="all">--เลือกประเภทหวย--</option>';
    let data = resOption.data;
    for (let i = 0; i < resOption.data.length; i++) {
      if (resOption.data[i].id == type) {
        htm +=
          '<option value="' +
          data[i].id +
          '" selected>' +
          data[i].lottoType +
          "</option>";
      } else {
        htm +=
          '<option value="' +
          data[i].id +
          '">' +
          data[i].lottoType +
          "</option>";
      }
    }
    el("editLottoType").innerHTML = htm;
    await onChangeSelectLottoType("editLottoTypeDate", "editLottoType");
    resOption = await callXMLHttpRequest(`${apiPort.apiGetLottoDate}`, {
      lottoType: type,
    });
    htm = "";
    if (resOption.data.length > 0) {
      htm = '<option value="0">--เลือกงวดหวย--</option>';
      for (let i = 0; i < resOption.data.length; i++) {
        if (resOption.data[i].lotto_date == lotto_date) {
          htm +=
            '<option value="' +
            formatDate(resOption.data[i].lotto_date) +
            '" selected>' +
            formatDate(resOption.data[i].lotto_date) +
            "</option>";
        } else {
          htm +=
            '<option value="' +
            formatDate(resOption.data[i].lotto_date) +
            '">' +
            formatDate(resOption.data[i].lotto_date) +
            "</option>";
        }
      }
    } else {
      htm = '<option value="0">--ไม่พบข้อมูล---</option>';
    }
    el("editLottoTypeDate").innerHTML = htm;
    let resDetail = await callXMLHttpRequest(`${apiPort.apiGetRewardLotto}`, {
      lottoType: el("editLottoType").value,
    });
    if (resDetail.statusCodeText == textRespone.ok.CodeText) {
      let htm = "";
      if (resDetail.data.length > 0) {
        htm = '<option value="0">--เลือกประเภท--</option>';
        for (let i = 0; i < resDetail.data.length; i++) {
          if (resDetail.data[i].id == lotto_reward_type) {
            htm +=
              '<option value="' +
              resDetail.data[i].id +
              '" selected>' +
              resDetail.data[i].description +
              "</option>";
          } else {
            htm +=
              '<option value="' +
              resDetail.data[i].id +
              '">' +
              resDetail.data[i].description +
              "</option>";
          }
        }
      } else {
        htm = '<option value="0">--ไม่พบข้อมูล---</option>';
      }
      el("editLottoTypeReward").innerHTML = htm;
    }
    el("editLottoTypeNumber").value = number;
    el("editLottoTypeRate").value = reward;
    $("#edit_lotto_limit").modal("show");
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

async function onChangeEditLottoType() {
  await onChangeSelectLottoType("editLottoTypeDate", "editLottoType");
  let resDetail = await callXMLHttpRequest(`${apiPort.apiGetRewardLotto}`, {
    lottoType: el("editLottoType").value,
  });
  if (resDetail.statusCodeText == textRespone.ok.CodeText) {
    let htm = "";
    if (resDetail.data.length > 0) {
      htm = '<option value="0">--เลือกประเภท--</option>';
      for (let i = 0; i < resDetail.data.length; i++) {
        htm +=
          '<option value="' +
          resDetail.data[i].id +
          '" >' +
          resDetail.data[i].description +
          "</option>";
      }
    } else {
      htm = '<option value="0">--ไม่พบข้อมูล---</option>';
    }
    el("editLottoTypeReward").innerHTML = htm;
  }
}

async function openModalAdd() {
  if (canEdit) {
    el("addLottoType").innerHTML = "";
    el("addLottoTypeDate").innerHTML = "";
    el("addLottoTypeDate").disabled = true;
    el("addLottoTypeReward").innerHTML = "";
    el("addLottoTypeReward").disabled = true;
    el("addLottoTypeNumber").value = "";
    el("addLottoTypeRate").value = "";
    await setOption("addLottoType");
    $("#add_lotto_limit").modal("show");
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

$("#add_number").keyup(function () {
  var value = $("#add_number").val();
  setValueNumber(value);
});
let type_lotto = "";
let type_id = "";
async function onChangeRewardType() {
  el("add_number").disabled = false;
  let split_type = el("addLottoTypeReward").value.split("-");
  type_lotto = split_type[0];
  type_id = split_type[1];
  setInputFilter(
    document.getElementById("add_number"),
    function (value) {
      return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
    },
    "Only digits and '.' are allowed"
  );

  if (type_lotto.includes("3")) {
    el("three_type").style.display = "block";
    el("two_type").style.display = "none";
  } else if (type_lotto.includes("2")) {
    el("three_type").style.display = "none";
    el("two_type").style.display = "block";
  } else {
    el("three_type").style.display = "none";
    el("two_type").style.display = "none";
  }
}
let list_number = [];
async function setValueNumber(value) {
  if (type_lotto.includes("3")) {
    if ((value.length === 3 && parseInt(value)) || value === "000") {
      if (reversnumber == 6) {
        list_number = list_number.concat(reversSetNumber(value, 6));
      } else {
        if (reversnumber == 3) {
          list_number = list_number.concat(reversSetNumber(value, 3));
        } else {
          list_number.push(value);
        }
      }

      $("#add_number").val("");
    }
  } else if (type_lotto.includes("2")) {
    if ((value.length === 2 && parseInt(value)) || value === "00") {
      list_number.push(value);
      if (reversnumber == 2) {
        let number = reversSetNumber(value, 2);
        if (number) {
          list_number.push(number);
        }
      }
      $("#add_number").val("");
      // setListBtnNumber()
    }
  } else {
    if ((value.length === 1 && parseInt(value)) || value === "0") {
      list_number.push(value);
      $("#add_number").val("");
      // setListBtnNumber()
    }
  }
  listNum();
}
async function listNum() {
  if (list_number.length > 0) {
    let htm = "";
    for (let i = 0; i < list_number.length; i++) {
      htm +=
        '<span class="mo-bb badge bg-info" style="font-size:20px;margin-right:5px;">' +
        list_number[i] +
        "</span>";
    }
    el("list_num_show").innerHTML = htm;
    el("list_num_show").style.display = "block";
    el("list_num_show_btn").style.display = "block";
  } else {
    el("list_num_show").style.display = "none";
    el("list_num_show_btn").style.display = "none";
  }
}

function reversSetNumber(value, length) {
  if (length === 2) {
    let num1 = value.substring(0, 1);
    let num2 = value.substring(1, 2);
    if (num1 !== num2) {
      return (rever_number = num2 + "" + num1);
    } else return null;
  } else if (length === 3) {
    let arr_number = [];
    let num1 = value.substring(0, 1);
    let num2 = value.substring(1, 2);
    let num3 = value.substring(2, 3);

    if (num1 == num2) {
      arr_number.push(num1 + "" + num2 + "" + num3);
      arr_number.push(num1 + "" + num3 + "" + num2);
      arr_number.push(num3 + "" + num1 + "" + num2);
    } else if (num2 == num3) {
      arr_number.push(num1 + "" + num2 + "" + num3);
      arr_number.push(num2 + "" + num1 + "" + num2);
      arr_number.push(num3 + "" + num2 + "" + num2);
    } else if (num1 == num3) {
      arr_number.push(num1 + "" + num2 + "" + num3);
      arr_number.push(num1 + "" + num3 + "" + num2);
      arr_number.push(num2 + "" + num1 + "" + num2);
    }
    arr_number = Array.from(new Set(arr_number));
    return arr_number;
  } else if (length === 6) {
    let arr_number = [];
    let num1 = value.substring(0, 1);
    let num2 = value.substring(1, 2);
    let num3 = value.substring(2, 3);

    arr_number.push(num1 + "" + num2 + "" + num3);
    arr_number.push(num1 + "" + num3 + "" + num2);
    arr_number.push(num2 + "" + num1 + "" + num3);
    arr_number.push(num2 + "" + num3 + "" + num1);
    arr_number.push(num3 + "" + num1 + "" + num2);
    arr_number.push(num3 + "" + num2 + "" + num1);

    arr_number = Array.from(new Set(arr_number));
    return arr_number;
  }
}

function setInputFilter(textbox, inputFilter, errMsg) {
  [
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mouseup",
    "select",
    "contextmenu",
    "drop",
    "focusout",
  ].forEach(function (event) {
    textbox.addEventListener(event, function (e) {
      if (inputFilter(this.value)) {
        // Accepted value
        if (["keydown", "mousedown", "focusout"].indexOf(e.type) >= 0) {
          this.classList.remove("input-error");
          this.setCustomValidity("");
        }
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        // Rejected value - restore the previous one
        this.reportValidity();
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        // Rejected value - nothing to restore
        this.value = "";
      }
    });
  });
}
let reversnumber = 0;
async function reveseBtn(id, type) {
  $("#three_six").removeClass("btn-outline-secondary");
  $("#three_three").removeClass("btn-outline-secondary");
  $("#two_res").removeClass("btn-outline-secondary");

  $("#three_six").addClass("btn-secondary");
  $("#three_three").addClass("btn-secondary");
  $("#two_res").addClass("btn-secondary");

  $("#" + id).removeClass("btn-secondary");
  $("#" + id).addClass("btn-outline-secondary");

  reversnumber = type;
}

async function resetLimit() {
  list_number = [];
  setData();
  el("list_num_show").innerHTML = "";
  el("list_num_show").style.display = "none";
  el("list_num_show_btn").style.display = "none";

  el("three_type").style.display = "none";
  el("two_type").style.display = "none";

  $("#three_six").removeClass("btn-outline-secondary");
  $("#three_three").removeClass("btn-outline-secondary");
  $("#two_res").removeClass("btn-outline-secondary");

  $("#three_six").addClass("btn-secondary");
  $("#three_three").addClass("btn-secondary");
  $("#two_res").addClass("btn-secondary");
}
