$(document).ready(async function () {
  await setDate("startDate", moment().format("YYYY-MM-DD"));
  await setDate("endDate", moment().format("YYYY-MM-DD"));
  await setDataTransaction();
  hideLoader();
});
async function Loading() {
  let timerInterval;
  Swal.fire({
    title: "Loading...",
    html: "",
    timer: 500,
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
      setDataTransaction();
    }
  });
}

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

function numberFormat(x) {
  var parts = x.toFixed(2).split(".");
  return (
    parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
    (parts[1] ? "." + parts[1] : "")
  );
}

async function Allcheck() {
  if (el("checkAll").checked) {
    el("checkDeposit").checked = true;
    el("checkWithdraw").checked = true;
    el("checkPub").checked = true;
  } else {
    el("checkDeposit").checked = false;
    el("checkWithdraw").checked = false;
    el("checkPub").checked = false;
  }
}

async function setDataTransaction(round) {
  await showLoader();
  let column = [
    {
      title: "สมาชิก",
      className: "align-middle text-center",
    },
    {
      title: "ประเภทธุรกรรม",
      className: "align-middle text-center",
    },
    {
      title: "วันที่",
      className: "align-middle text-center",
    },
    {
      title: "จำนวนเงิน",
      className: "align-middle text-center",
    },
    {
      title: "สถานะ",
      className: "align-middle text-center",
    },
    {
      title: "ชื่อ - นามสกุล",
      className: "align-middle text-center",
    },
    {
      title: "กระทำโดย",
      className: "align-middle text-center",
    },
    {
      title: "",
      className: "align-middle text-center",
    },
  ];
  let deposit = el("checkDeposit").checked == true ? 1 : 0;
  let withdraw = el("checkWithdraw").checked == true ? 1 : 0;
  let pubyod = el("checkPub").checked == true ? 1 : 0;

  let startDate = el("startDate").value;
  let endDate = el("endDate").value;
  let username = el("username").value;
  let data = {
    deposit: deposit,
    withdraw: withdraw,
    pubyod: pubyod,
    startDate: startDate,
    endDate: endDate,
    username: username,
  };

  let datas = [];
  let tableData = [];
  let resTransaction = await callXMLHttpRequest(
    `${apiPort.apiGetTransactionMember}`,
    data
  );
  if (resTransaction.statusCodeText === textRespone.ok.CodeText) {
    datas = resTransaction.data;
    console.log(datas);
    let type = "";
    let stats = "";
    let bank = "";
    for (let i = 0; i < datas.length; i++) {
      if (datas[i].type === "1") {
        type = `<span class="mo-bb badge bg-success">ฝากเงิน</span>`;
      } else if (datas[i].type === "2") {
        type = `<span class="mo-bb badge bg-info">ปรับยอดเงิน</span>`;
      } else {
        type = `<span class="mo-bb badge bg-danger">ถอนเงิน</span>`;
      }
      if (datas[i].stats === 1) {
        stats = `<span class="mo-bb text-warning">กำลังรอ</span>`;
      } else if (datas[i].stats === 2) {
        stats = `<span class="mo-bb text-danger">ยกเลิก</span>`;
      } else if (datas[i].stats === 3) {
        stats = `<span class="mo-bb text-primary">ออโต้ถอน</span>`;
      } else {
        stats = `<span class="mo-bb text-success">สำเร็จ</span>`;
      }
      if (datas[i].remark == "Manual" || datas[i].remark == "Admin Auto") {
        bank = `<span class="badge">${datas[i].remark}</span>`;
      } else if (datas[i].type === "2") {
        bank = `<span class="badge">Admin</span>`;
      } else {
        bank = `<span class="badge" style="background-color:${datas[i].color};color:white">${datas[i].remark}</span>`;
      }
      tableData.push([
        datas[i].username,
        type,
        formatDate(datas[i].transaction_date) +
          " " +
          formatTime(datas[i].transaction_date),
        formatMoney(datas[i].amount),
        stats,
        datas[i].name != null ? datas[i].name : "-",
        bank,
        datas[i].name != null
          ? ""
          : `<button class="btn btn-outline-success btn-xs" onclick="refillCredit('${datas[i].username}',${datas[i].tid})">เติมเครดิต</button>`,
      ]);
    }
  } else if (resTransaction.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resTransaction.description,
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
  let ttt = round ? round : false;
  if (ttt) {
    var table = $("#logs").DataTable();
    table.destroy();
  }
  initDataTables(tableData, "logs", column);

  hideLoader();
}

async function refillCredit(username, tid) {
  let split = username.split(",");
  let opt = '<select class="form-control" id="sel-username">';
  for (let i = 0; i < split.length; i++) {
    opt += '<option value = "' + split[i] + '">' + split[i] + "</option>";
  }
  opt += "</select>";
  console.log(opt);
  Swal.fire({
    title: "เลือก username",
    html: `<div class="form-group">${opt}</div><input type="hidden" id="trans_id" value="${tid}">`,
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "เติมเครดิต",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    showLoaderOnConfirm: true,
    allowOutsideClick: false,
  }).then(async (result) => {
    if (result.isConfirmed) {
      //เติมเครดิต
      let username = el("sel-username").value;
      let trans_id = el("trans_id").value;
      let data = {
        username: username,
        trans_id: trans_id,
      };

      let resTransaction = await callXMLHttpRequest(
        `${apiPort.apiaddCreditTransaction}`,
        data
      );
      if (resTransaction.statusCodeText === textRespone.ok.CodeText) {
        Swal.fire({
          title: "แจ้งเตือน",
          text: "อัพเดต ธุรกรรม สำเร็จแล้ว",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.value) {
            setDataTransaction(true);
          }
        });
      } else if (resTransaction.statusCodeText == "401") {
        Swal.fire({
          title: "แจ้งเตือน",
          text: resTransaction.description,
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
          text: resTransaction.description,
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      }
    }
  });
}

function initDataTables(tableData, id, column) {
  $("#" + id).DataTable({
    data: tableData,
    columns: column,
    order: [[2, "desc"]],
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

var timer = null;
interval = 10000;
async function setIntervalData() {
  let chk = el("auto_refresh").checked;
  if (chk) {
    if (timer !== null) return;
    timer = setInterval(function () {
      setDataTransaction(true);
    }, interval);
  } else {
    clearInterval(timer);
    timer = null;
  }
}

// $(function() {

//     $("#start").click(function() {
//       if (timer !== null) return;
//       timer = setInterval(function() {
//         $("#input").val(++value);
//       }, interval);
//     });

//     $("#stop").click(function() {
//       clearInterval(timer);
//       timer = null
//     });
//   });
