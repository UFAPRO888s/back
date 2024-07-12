$(document).ready(async function () {
  setDatCoupon();
  setDatGroupCoupon();
  setDatCouponGroup();
  await setDate("date_exp");
  await setDate("group_date_exp");

  el("date_exp").value = formatDate(new Date());
  hideLoader();
});

function setDate(id) {
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
  el(id).value = formatDate(new Date());
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
  }).then(async (result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      setDatCoupon();
      setDatGroupCoupon();
      setDatCouponGroup();
      await setDate("date_exp");
      await setDate("group_date_exp");

      el("date_exp").value = formatDate(new Date());
    }
  });
}

function add_coupon_modal() {
  el("coupon_name").value = "";
  el("coupon_code").value = "";
  el("coupon_bonus").value = "";
  el("coupon_amount").value = 0;
  el("date_exp").value = "";
  el("status").checked = true;

  $("#add_coupon").modal("show");
}

function add_group_coupon_modal() {
  el("group_name").value = "";
  el("group_bonus").value = "";
  el("group_amount").value = 0;
  el("date_exp").value = "";
  el("status").checked = true;

  $("#add_group_coupon").modal("show");
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
            return "ลำดับ: " + data[0];
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

async function setDatGroupCoupon() {
  let column = [
    {
      title: "ลำดับ",
      className: "align-middle text-center",
    },
    {
      title: "Name",
      className: "align-middle text-center",
    },
    {
      title: "Exp.",
      className: "align-middle text-center",
    },
    {
      title: "Status",
      className: "align-middle text-center",
    },
    {
      title: "วันสร้าง",
      className: "align-middle text-center",
    },
    {
      title: "Action",
      className: "align-middle text-center",
    },
  ];
  let data = [];
  let tableData = [];
  let i = 1;

  let resDeopsit = await callXMLHttpRequest(
    `${apiPort.apiQueryGroupCoupon}`,
    {}
  );
  if (resDeopsit.statusCodeText == textRespone.ok.CodeText) {
    data = resDeopsit.data;
    for (let i = 0; i < data.length; i++) {
      let htm = "";
      let item = data[i];
      if (formatDate(item.limit_date) <= formatDate(new Date())) {
        htm = `<div class="widget-content p-0">
                <div class="widget-content-wrapper">
                
                <div class="widget-content-left flex2">
                <div class="widget-heading">${formatDate(item.limit_date)}</div>
                </div>
                </div>
                </div>`;
      } else {
        htm = `<div class="widget-content p-0">
                <div class="widget-content-wrapper">
                
                <div class="widget-content-left flex2">
                <div class="widget-heading">${formatDate(item.limit_date)}</div>
                <div class="widget-subheading opacity-7">(หมดอายุ)</div>
                </div>
                </div>
                </div>`;
      }
      tableData.push([
        i + 1,
        item.name,
        formatDate(item.date_exp),
        item.stats == 1
          ? ` <div>
        <span>
             <label class="switch" style="margin-left: 15.7px;">
                <input type="checkbox" onclick="changeGroupStatus(${item.id})" id="statusg_${item.id}" checked>
                <span class="slider round"></span>
            </label>
        </span>
    </div>`
          : ` <div>
    <span>
         <label class="switch" style="margin-left: 15.7px;">
            <input type="checkbox"  onclick="changeGroupStatus(${item.id})" id="statusg_${item.id}">
            <span class="slider round"></span>
        </label>
    </span>
</div>`,
        formatDate(item.cr_date),
        `<div class="btn-group" role="group">
                <button type="button" class="btn btn-info btn-sm" onclick="detail_coupon(${item.id})">
                <i class="far fa-eye"></i> ดูข้อมูล
            </button>
                <button type="button" class="btn btn-danger btn-sm" onclick="delete_couponGroup(${item.id})">
                <i class="far fa-trash-alt"></i> ลบ
            </button>
            </div>`,
      ]);
    }
  } else if (resDeopsit.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resDeopsit.description,
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

async function detail_coupon(id) {
  await showLoader();
  let resDeopsit = await callXMLHttpRequest(`${apiPort.apiQueryCoupon}`, {
    group: id,
  });
  if (resDeopsit.statusCodeText == textRespone.ok.CodeText) {
    let htm = "";
    for (let i = 0; i < resDeopsit.data.length; i++) {
      let data = resDeopsit.data[i];
      let res = "";
      if (data.count < data.limit_receive) {
        res = '<span style="color:green">ยังไม่ใช้งาน</span>';
      } else {
        res = '<span style="color:red">ใช้งานแล้ว</span>';
      }
      htm += ` <tr>
            <td>${data.coupon}</td>
            <td>${res}</td>
        </tr> `;
    }
    el("tbl_coupon").innerHTML = htm;
  } else if (resDeopsit.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resDeopsit.description,
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
  $("#show_coupon").modal("show");
  hideLoader();
}

async function setDatCoupon() {
  let column = [
    {
      title: "ลำดับ",
      className: "align-middle text-center",
    },
    {
      title: "Name",
      className: "align-middle text-center",
    },
    {
      title: "Code",
      className: "align-middle text-center",
    },
    {
      title: "Bonus",
      className: "align-middle text-center",
    },
    {
      title: "Amount",
      className: "align-middle text-center",
    },
    {
      title: "Exp.",
      className: "align-middle text-center",
    },
    {
      title: "Status",
      className: "align-middle text-center",
    },
    {
      title: "สร้างโดย",
      className: "align-middle text-center",
    },
    {
      title: "Action",
      className: "align-middle text-center",
    },
  ];
  let data = [];
  let tableData = [];
  let i = 1;

  let resDeopsit = await callXMLHttpRequest(`${apiPort.apiQueryCoupon}`, {
    group: 0,
  });
  if (resDeopsit.statusCodeText == textRespone.ok.CodeText) {
    data = resDeopsit.data;
    for (let i = 0; i < data.length; i++) {
      let htm = "";
      let item = data[i];
      if (formatDate(item.limit_date) <= formatDate(new Date())) {
        htm = `<div class="widget-content p-0">
                <div class="widget-content-wrapper">
                
                <div class="widget-content-left flex2">
                <div class="widget-heading">${formatDate(item.limit_date)}</div>
                </div>
                </div>
                </div>`;
      } else {
        htm = `<div class="widget-content p-0">
                <div class="widget-content-wrapper">
                
                <div class="widget-content-left flex2">
                <div class="widget-heading">${formatDate(item.limit_date)}</div>
                <div class="widget-subheading opacity-7">(หมดอายุ)</div>
                </div>
                </div>
                </div>`;
      }
      tableData.push([
        i + 1,
        item.coupon_name,
        item.coupon,
        item.coupon_bonus,
        item.count + "/" + item.limit_receive,
        htm,
        item.stats == 1
          ? ` <div>
        <span>
             <label class="switch" style="margin-left: 15.7px;">
                <input type="checkbox" onclick="changeStatus(${item.id})" id="status_${item.id}" checked>
                <span class="slider round"></span>
            </label>
        </span>
    </div>`
          : ` <div>
    <span>
         <label class="switch" style="margin-left: 15.7px;">
            <input type="checkbox"  onclick="changeStatus(${item.id})" id="status_${item.id}">
            <span class="slider round"></span>
        </label>
    </span>
</div>`,
        item.cr_by,
        `<div class="btn-group" role="group">
            <button type="button" class="btn btn-danger btn-sm" onclick="delete_coupon(${item.id})">
            <i class="far fa-trash-alt"></i> ลบ
        </button>
        </div>`,
      ]);
    }
  } else if (resDeopsit.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resDeopsit.description,
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

async function setDatCouponGroup() {
  let column = [
    {
      title: "ลำดับ",
      className: "align-middle text-center",
    },
    {
      title: "ชื่อ",
      className: "align-middle text-center",
    },
    {
      title: "User",
      className: "align-middle text-center",
    },
    {
      title: "Coupon",
      className: "align-middle text-center",
    },
    {
      title: "Coupon Name",
      className: "align-middle text-center",
    },
    {
      title: "จำนวนโบนัส.",
      className: "align-middle text-center",
    },
    {
      title: "วันที่รับ",
      className: "align-middle text-center",
    },
  ];
  let data = [];
  let tableData = [];
  let i = 1;

  let resDeopsit = await callXMLHttpRequest(`${apiPort.apiQueryCouponLog}`, {});
  if (resDeopsit.statusCodeText == textRespone.ok.CodeText) {
    data = resDeopsit.data;
    for (let i = 0; i < data.length; i++) {
      let htm = "";
      let item = data[i];
      tableData.push([
        i + 1,
        item.name,
        item.username,
        item.coupon,
        item.coupon_name,
        item.coupon_bonus,
        formatDate(item.cr_date) + " " + formatTime(item.cr_date),
      ]);
    }
  } else if (resDeopsit.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resDeopsit.description,
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
  initDataTables(tableData, "logs_Log", column);
}

async function add_coupon() {
  let coupon_name = el("coupon_name").value;
  let coupon_code = el("coupon_code").value;
  let coupon_bonus = el("coupon_bonus").value;
  let coupon_amount = el("coupon_amount").value;
  let date_exp = el("date_exp").value;
  let status = el("status").checked;

  if (status) {
    status = 1;
  } else {
    status = 0;
  }

  let data = {
    coupon_name: coupon_name,
    coupon_code: coupon_code,
    coupon_bonus: coupon_bonus,
    coupon_amount: coupon_amount,
    date_exp: date_exp,
    status: status,
    group: 0,
    type: 1,
  };

  let resAlliance = await callXMLHttpRequest(`${apiPort.apiaddCoupon}`, data);
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

async function delete_coupon(id) {
  Swal.fire({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะลบข้อมูลนี้หรือไม่ ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#009102",
    confirmButtonText: "Delete",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let resDeleteMember = await callXMLHttpRequest(
        `${apiPort.apideleteCoupon}`,
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

async function delete_couponGroup(id) {
  Swal.fire({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะลบข้อมูลนี้หรือไม่ ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#009102",
    confirmButtonText: "Delete",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let resDeleteMember = await callXMLHttpRequest(
        `${apiPort.apideleteCouponGroup}`,
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

async function randomCode() {
  let length = 6;
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  length = 2;
  characters = "0123456789";
  charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  el("coupon_code").value = result;
}

async function randomCode1() {
  let length = 6;
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  length = 2;
  characters = "0123456789";
  charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function changeStatus(id) {
  let chk = el("status_" + id).checked;
  if (chk) {
    chk = 1;
  } else {
    chk = 0;
  }

  let data = {
    id: id,
    stats: chk,
  };
  let resPromotion = callXMLHttpRequest(
    `${apiPort.apiUpdateStatusCoupon}`,
    data
  );
  if (resPromotion.statusCodeText == "401") {
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
}

async function changeGroupStatus(id) {
  let chk = el("statusg_" + id).checked;
  if (chk) {
    chk = 1;
  } else {
    chk = 0;
  }

  let data = {
    id: id,
    stats: chk,
  };
  let resPromotion = callXMLHttpRequest(
    `${apiPort.apiUpdateStatusCouponGroup}`,
    data
  );
  if (resPromotion.statusCodeText == "401") {
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
}

async function add_group_coupon() {
  let coupon_name = el("group_name").value;
  let coupon_code = [];
  let coupon_bonus = el("group_bonus").value;
  let coupon_amount = el("group_amount").value;
  let date_exp = el("group_date_exp").value;
  let status = el("group_status").checked;
  for (let i = 0; i < coupon_amount; i++) {
    coupon_code.push(await randomCode1());
  }

  if (status) {
    status = 1;
  } else {
    status = 0;
  }

  let data = {
    coupon_name: coupon_name,
    coupon_code: coupon_code,
    coupon_bonus: coupon_bonus,
    coupon_amount: 1,
    date_exp: date_exp,
    status: status,
    type: 2,
  };

  let resAlliance = await callXMLHttpRequest(`${apiPort.apiaddCoupon}`, data);
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
