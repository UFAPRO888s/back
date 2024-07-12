$(document).ready(async function() {
    await setDataDepositUnSuccess();
    await setDataDepositSuccess();
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
        didOpen: async() => {
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
            setDataDepositUnSuccess();
            setDataDepositSuccess();
        }
    });
}

function initDataTables(tableData, id, column) {
    $("#" + id).DataTable({
        data: tableData,
        columns: column,
        order: [2, 'desc'],
        responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal({
                    header: function(row) {
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

async function setDataDepositUnSuccess() {
    let column = [{
            title: "ชื่อ-นามสกุล",
            className: "align-middle text-center",
        },
        {
            title: "เบอร์โทรศัพท์",
            className: "align-middle text-center",
        },
        {
            title: "จำนวนเงิน",
            className: "align-middle text-center",
        },
        {
            title: "วันที่",
            className: "align-middle text-center",
        },
        {
            title: "ระบบเติมเงิน",
            className: "align-middle text-center",
        },
        {
            title: "Action",
            className: "align-middle text-center",
        },
    ];
    let data = [];
    let tableData = [];
    let resDeopsit = await callXMLHttpRequest(
        `${apiPort.apiQueryeUnHistoryDepositHistory}`, {}
    );
    if (resDeopsit.statusCodeText == textRespone.ok.CodeText) {
        data = resDeopsit.data;
        for (let i = 0; i < data.length; i++) {
            let htm = "";
            if (data[i].remark == "SCB") {
                htm = `<div style="width: 40px;background-color: #4e2e7f;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:12px;"> SCB</div>`;
            } else if (data[i].remark == "TRUEWALLET") {
                htm = `<div style="width: 40px;background-color: #ff8300;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:10px;"> TRUE WALLET</div>`;
            } else if (data[i].remark == "Manual") {
                htm = `<div style="width: 40px;background-color: #4b545c;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:12px;"> Manual</div>`;
            }
            tableData.push([
                data[i].name ? data[i].name : ' ',
                data[i].phone ? data[i].phone : ' ',
                data[i].amount,
                formatDate(data[i].transaction_date) +
                " " +
                formatTime(data[i].transaction_date),
                htm,
                `<div class="btn-group" role="group">
                    <button type="button" class="btn btn-success btn-sm" id="edit" data-id="${data[i].id}" onclick="modal_open(${data[i].id})">
                         เติมเครดิต
                        </button>
                        &nbsp;
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
    initDataTables(tableData, "logs_unsuccess", column);
}

function modal_open(id) {
    el("trans_id").value = id;
    $("#add_credit").modal("show");
}
async function add_credit() {
    let trans_id = el("trans_id").value;
    let id = el("member_sel").value;
    let data = {
        trans_id: trans_id,
        id: id,
    };
    let resDeopsit = await callXMLHttpRequest(
        `${apiPort.apiAddCreditUnSuccessDeposit}`,
        data
    );
    if (resDeopsit.statusCodeText == textRespone.ok.CodeText) {
        Swal.fire({
            title: "แจ้งเตือน",
            text: "เติมเครดิตให้กับ " +
                resDeopsit.username +
                " จำนวน : " +
                resDeopsit.amount +
                " สำเร็จแล้ว",
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
    } else {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resDeopsit.description,
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
        });
    }
}

async function setDataDepositSuccess() {
    let column = [{
            title: "ชื่อผู้ใช้งาน",
            className: "align-middle text-center",
        },
        {
            title: "เลขที่บัญชี",
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
    ];
    let data = [];
    let tableData = [];
    let resDeopsit = await callXMLHttpRequest(
        `${apiPort.apiQueryeDepositHistory}`, {}
    );
    if (resDeopsit.statusCodeText == textRespone.ok.CodeText) {
        data = resDeopsit.data;
        for (let i = 0; i < data.length; i++) {
            tableData.push([
                data[i].member_username,
                "<span>" + data[i].accnum + " " + data[i].bank_name + "</span>",
                formatDate(data[i].transaction_date) +
                " " +
                formatTime(data[i].transaction_date),
                data[i].amount,
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