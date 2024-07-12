const idTable = "table-member-partner";

$(document).ready(function () {
  handleDataTable();
});

function handleDataTable() {
  let column = [
    {
      title: "ลำดับ",
      className: "align-middle text-center",
    },
    {
      title: "วันที่ทำรายการล่าสุด",
      className: "align-middle",
    },
    {
      title: "partner",
      className: "align-middle",
    },
    {
      title: "ข้อมูล partner",
      className: "align-middle",
    },
    {
      title: "สมาชิกทั้งหมด",
      className: "align-middle",
    },
    {
      title: "จัดการ",
      className: "align-middle",
    },
  ];
  let data = [];
  let tableData = [];
  let resDeopsit = callXMLHttpRequest(`${apiPort.apiDataMemberPartner}`, {});
  if (resDeopsit.statusCodeText == textRespone.ok.CodeText) {
    data = resDeopsit.data;
    for (let i = 0; i < data.length; i++) {
      tableData.push([
        i + 1,
        formatDate(data[i].updated_at),
        data[i].username,
        `ชื่อ: ${data[i].name}<br>
                  เบอรโทร: ${data[i].username}<br>
                  บัญชี: ${data[i].bank_name}<br>
                  เลขบัญชี: ${data[i].accnum}<br>
                  `,
        data[i].countmember + " คน",
        `<div class="btn-group" role="group">
                      <button type="button" class="btn btn-warning btn-sm" onclick="editMember(${data[i].member_id_partner})">
                      <i class="far fa-edit"></i> แก้ไข
                      </button>
                      &nbsp;
                      <button type="button" class="btn btn-danger btn-sm" onclick="deleteMember(${data[i].member_id_partner})">
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
  initDataTables(tableData, idTable, column);
}
