$(document).ready(async function () {
  await setOption("statusLottoType");
  // Loading();
  initDataTables([], "logs_lotto_limit", column);
  setDataNumberThree("three_up");
  setDataNumberTwo("two_up");
  setDataNumberOne("one_up");
  hideLoader();
});
let reward = [];
let lotto_id = "";
async function onChangeSelectLottoType(idTable, idValue) {
  let id = el(idValue).value;
  lotto_id = id;
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

async function setData() {
  onChangeAddLottoType();
  var table = $("#logs_lotto_limit").DataTable();
  table.destroy();
  let data = [];
  let tableData = [];
  let lottoType = el("statusLottoType").value;
  let lottoDate = el("lotto-date").value;
  let resDetail = await callXMLHttpRequest(`${apiPort.apiGetDetailLotto}`, {
    lottoType: lottoType,
    lottoDate: lottoDate,
  });
  if (resDetail.statusCodeText == textRespone.ok.CodeText) {
    console.log(resDetail.data);
    data = resDetail.data;
    for (let i = 0; i < data.length; i++) {
      tableData.push([
        i + 1,
        data[i].number,
        data[i].reward,
        formatDate(data[i].lotto_date),
        data[i].description,
        `<div class="btn-group" role="group">
                <button type="button" class="btn btn-danger btn-sm" id="delete" data-id="${data[i].id}" onclick="delectLottoLimit(${data[i].id_number},'${data[i].number}')">
                        <i class="far fa-trash-alt"></i> ลบ
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
    let resultCreateLottoLimit = await callXMLHttpRequest(
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
          list_number = [];
          setData();
          el("htm3up").innerHTML = "";
          el("htm3tod").innerHTML = "";
          el("htm3down").innerHTML = "";
          el("htm2up").innerHTML = "";
          el("htm2down").innerHTML = "";
          el("htm1up").innerHTML = "";
          el("htm1down").innerHTML = "";
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

async function delectLottoLimit(id, number) {
  if (canEdit) {
    let data = {
      id: id,
      number: number,
    };
    let resultCreateLottoLimit = await callXMLHttpRequest(
      `${apiPort.apiDeleteLottoLimit}`,
      data
    );
    if (resultCreateLottoLimit.statusCodeText == textRespone.ok.CodeText) {
      Swal.fire({
        title: "แจ้งเตือน",
        text: "ลบเลขอั้นเรียบร้อยแล้ว",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
      }).then((result) => {
        window.location.reload();
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
    let resultCreateLottoLimit = await callXMLHttpRequest(
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
        reward.push({
          id: resDetail.data[i].id,
          reward_name: resDetail.data[i].reward_name,
        });
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

let type_lotto = "";
let type_id = "";
async function onChangeRewardType() {
  let split_type = el("addLottoTypeReward").value.split("-");
  type_lotto = split_type[0];
  type_id = split_type[1];

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
      // setListBtnNumber()
    }
  } else {
    if ((value.length === 1 && parseInt(value)) || value === "0") {
      list_number.push(value);

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
        '<span class="mo-bb badge bg-info" style="font-size:15px;margin-right:5px;">' +
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

let three_id = "";
let arrThree = "";
let threeReward = "";
async function setDataNumberThree(id) {
  if (lotto_id != 1 || lotto_id != 2) {
    if (id == "three_up") {
      threeReward = 1;
    } else if (id == "three_tod") {
      threeReward = 2;
    } else if (id == "three_down") {
      threeReward = 4;
    }
  } else {
    if (id == "three_up") {
      threeReward = 38;
    } else if (id == "three_tod") {
      threeReward = 39;
    }
  }

  if (three_id != id) {
    three_id = id;

    $("#three_up").removeClass("btn-success");
    $("#three_up").removeClass("btn-secondary");
    $("#three_up").addClass("btn-secondary");

    $("#three_tod").removeClass("btn-success");
    $("#three_tod").removeClass("btn-secondary");
    $("#three_tod").addClass("btn-secondary");

    $("#three_down").removeClass("btn-success");
    $("#three_down").removeClass("btn-secondary");
    $("#three_down").addClass("btn-secondary");
    $("#" + id).removeClass("btn-secondary");
    $("#" + id).addClass("btn-success");
  }
}

let two_id = "";
let twoReward = "";
async function setDataNumberTwo(id) {
  if (lotto_id != 1 || lotto_id != 2) {
    if (id == "two_up") {
      twoReward = 5;
    } else if (id == "two_down") {
      twoReward = 6;
    }
  } else {
    if (id == "two_up") {
      twoReward = 42;
    } else if (id == "two_down") {
      twoReward = 43;
    }
  }
  if (two_id != id) {
    two_id = id;
    $("#two_up").removeClass("btn-success");
    $("#two_up").removeClass("btn-secondary");
    $("#two_up").addClass("btn-secondary");

    $("#two_down").removeClass("btn-success");
    $("#two_down").removeClass("btn-secondary");
    $("#two_down").addClass("btn-secondary");

    $("#" + id).removeClass("btn-secondary");
    $("#" + id).addClass("btn-success");
  }
}
let one_id = "";
let oneReward = "";
async function setDataNumberOne(id) {
  if (lotto_id != 1 || lotto_id != 2) {
    if (id == "one_up") {
      oneReward = 7;
    } else if (id == "one_down") {
      oneReward = 8;
    }
  } else {
    if (id == "one_up") {
      oneReward = 44;
    } else if (id == "one_down") {
      oneReward = 45;
    }
  }
  if (one_id != id) {
    one_id = id;
    $("#one_up").removeClass("btn-success");
    $("#one_up").removeClass("btn-secondary");
    $("#one_up").addClass("btn-secondary");

    $("#one_down").removeClass("btn-success");
    $("#one_down").removeClass("btn-secondary");
    $("#one_down").addClass("btn-secondary");

    $("#" + id).removeClass("btn-secondary");
    $("#" + id).addClass("btn-success");
  }
}

$("#three_input").keyup(function () {
  var value = $("#three_input").val();
  setValueNumberNew(value, 3);
});

$("#two_input").keyup(function () {
  var value = $("#two_input").val();
  setValueNumberNew(value, 2);
});

$("#one_input").keyup(function () {
  var value = $("#one_input").val();
  setValueNumberNew(value, 1);
});
let threeArray = [];
let twoArray = [];
async function setValueNumberNew(value, length) {
  if (length == 3) {
    if ((value.length === 3 && parseInt(value)) || value === "000") {
      threeArray = [];
      if (reversnumberThree == 6) {
        threeArray = threeArray.concat(reversSetNumberNew(value, 6));
        for (let i = 0; i < threeArray.length; i++) {
          list_number.push({
            id: threeReward,
            number: threeArray[i],
            type: 3,
          });
        }
      } else {
        if (reversnumberThree == 3) {
          list_number = {
            id: threeReward,
            number: list_number.concat(reversSetNumberNew(value, 3)),
            type: 3,
          };
        } else {
          list_number.push({
            id: threeReward,
            number: value,
            type: 3,
          });
        }
      }

      $("#three_input").val("");
      $("#two_input").val("");
      $("#one_input").val("");
    }
  } else if (length == 2) {
    if ((value.length === 2 && parseInt(value)) || value === "00") {
      list_number.push({
        id: twoReward,
        number: value,
        type: 2,
      });
      if (reversnumberTwo == 2) {
        let number = reversSetNumber(value, 2);
        if (number) {
          list_number.push({
            id: twoReward,
            number: number,
            type: 2,
          });
        }
      }
      $("#three_input").val("");
      $("#two_input").val("");
      $("#one_input").val("");
      // setListBtnNumber()
    }
  } else {
    if ((value.length === 1 && parseInt(value)) || value === "0") {
      list_number.push({
        id: oneReward,
        number: value,
        type: 1,
      });
      $("#three_input").val("");
      $("#two_input").val("");
      $("#one_input").val("");
      // setListBtnNumber()
    }
  }
  listNumNew();
}

function reversSetNumberNew(value, length) {
  if (length === 2) {
    let num1 = value.substring(0, 1);
    let num2 = value.substring(1, 2);
    if (num1 !== num2) {
      return (rever_number = num2 + "" + num1);
    } else return null;
  } else {
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

async function listNumNew() {
  if (list_number.length > 0) {
    let htm3up = "";
    let htm3tod = "";
    let htm3down = "";
    let htm2up = "";
    let htm2down = "";
    let htm1up = "";
    let htm1down = "";
    for (let i = 0; i < list_number.length; i++) {
      if (list_number[i].id == 1 || list_number[i].id == 38) {
        htm3up +=
          '<span class="mo-bb badge bg-info" style="font-size:15px;margin-right:5px;">' +
          list_number[i].number +
          "</span>";
      }

      if (list_number[i].id == 2 || list_number[i].id == 39) {
        htm3tod +=
          '<span class="mo-bb badge bg-info" style="font-size:15px;margin-right:5px;">' +
          list_number[i].number +
          "</span>";
      }

      if (list_number[i].id == 4) {
        htm3down +=
          '<span class="mo-bb badge bg-info" style="font-size:15px;margin-right:5px;">' +
          list_number[i].number +
          "</span>";
      }

      if (list_number[i].id == 5 || list_number[i].id == 42) {
        htm2up +=
          '<span class="mo-bb badge bg-info" style="font-size:15px;margin-right:5px;">' +
          list_number[i].number +
          "</span>";
      }

      if (list_number[i].id == 6 || list_number[i].id == 43) {
        htm2down +=
          '<span class="mo-bb badge bg-info" style="font-size:15px;margin-right:5px;">' +
          list_number[i].number +
          "</span>";
      }

      if (list_number[i].id == 7 || list_number[i].id == 44) {
        htm1up +=
          '<span class="mo-bb badge bg-info" style="font-size:15px;margin-right:5px;">' +
          list_number[i].number +
          "</span>";
      }

      if (list_number[i].id == 8 || list_number[i].id == 45) {
        htm1down +=
          '<span class="mo-bb badge bg-info" style="font-size:15px;margin-right:5px;">' +
          list_number[i].number +
          "</span>";
      }
    }
    el("htm3up").innerHTML = htm3up;
    el("htm3tod").innerHTML = htm3tod;
    el("htm3down").innerHTML = htm3down;
    el("htm2up").innerHTML = htm2up;
    el("htm2down").innerHTML = htm2down;
    el("htm1up").innerHTML = htm1up;
    el("htm1down").innerHTML = htm1down;
    el("list_num_show_btn").style.display = "block";
  } else {
    // el('list_num_show').style.display = 'none';
    el("list_num_show_btn").style.display = "none";
  }
}
let reversnumberThree = "";
let reversnumberTwo = "";
async function reveseBtnNew(id, type, length) {
  if (length == 3) {
    if (!reversnumberThree) {
      reversnumberThree = type;
    } else {
      reversnumberThree = "";
    }
  }

  if (length == 2) {
    if (!reversnumberTwo) {
      el(id).style = "background-color: rgb(243 253 0);cursor: pointer;";
      reversnumberTwo = type;
    } else {
      el(id).style = "background-color: rgb(236, 172, 135);cursor: pointer;";
      reversnumberTwo = "";
    }
  }
  console.log(reversnumberThree);
  // $('#' + id).removeClass('btn-secondary');
  // $('#' + id).addClass('btn-outline-secondary');
}

async function resetLimit() {
  list_number = [];
  setData();
  el("htm3up").innerHTML = "";
  el("htm3tod").innerHTML = "";
  el("htm3down").innerHTML = "";
  el("htm2up").innerHTML = "";
  el("htm2down").innerHTML = "";
  el("htm1up").innerHTML = "";
  el("htm1down").innerHTML = "";
}
