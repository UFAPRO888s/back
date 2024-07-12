$(document).ready(async function() {
    setData_member();
    initDataTables([], "turnover_ufa", column_turnover);
    hideLoader();
});
let column_turnover = [{
        title: "User UFA",
        className: "align-middle",
    },
    {
        title: "Turnover",
        className: "align-middle",
    },
    {
        title: "วันที่",
        className: "align-middle",
    },
];

let column_transection = [{
        title: "สมาชิก",
        className: "text-left",
    },
    {
        title: "ประเภทธุรกรรม",
        className: "text-center",
        render(data, type, row) {
            if (data === "ฝาก") {
                return `<span class="mo-bb badge rounded-pill bg-success">${data}</span>`;
            } else if (data === "ถอน") {
                return `<span class="mo-bb badge rounded-pill bg-danger">${data}</span>`;
            } else if (data === "ปรับยอด") {
                return `<span class="mo-bb badge rounded-pill bg-info">${data}</span>`;
            } else {
                return `<span class="mo-bb badge rounded-pill bg-light">${data}</span>`;
            }
        },
    },
    {
        title: "วันที่",
        className: "text-center",
    },
    {
        title: "จำนวนเงิน",
        className: "text-right",
    },
    {
        title: "ยอดแพ้ชนะ",
        className: "text-right",
    },
    {
        title: "สถานะ",
        className: "text-center",
    },
    {
        title: "รายละเอียด",
        className: "text-center",
    },
];

function initDataTables(tableData, id, column) {
    $("#" + id).DataTable({
        data: tableData,
        columns: column,
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

function add_member() {
    if (canEdit) {
        el("add_username").value = "";
        el("add_password").value = "";
        el("add_name").value = "";
        el("add_accnum").value = "";
        el("add_bank").value = "";
        el("add_line").value = "";
        $("#add_member").modal("show");
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

function addMember_modal() {
    if (canEdit) {
        let username = el("add_username").value;
        let password = el("add_password").value;
        let name = el("add_name").value;
        let accnum = el("add_accnum").value;
        let bank = el("add_bank").value;
        let line = el("add_line").value;

        let data = {
            username: username,
            password: password,
            name: name,
            accnum: accnum,
            bank: bank,
            line: line,
        };

        let resEditMember = callXMLHttpRequest(
            `${apiPort.apiRegisterMemberManual}`,
            data
        );
        if (resEditMember.statusCodeText == textRespone.ok.CodeText) {
            Swal.fire({
                title: "แจ้งเตือน",
                text: resEditMember.description,
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
        } else if (resEditMember.statusCodeText == "401") {
            Swal.fire({
                title: "แจ้งเตือน",
                text: resEditMember.description,
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
                text: resEditMember.description,
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

function setData_member() {
    let column = [{
            title: "ชื่อผู้ใช้งาน",
            className: "text-center",
        },
        {
            title: "ชื่อ-สกุล",
            className: "text-center",
        },
        {
            title: "เลขบัญชี",
            className: "text-center",
        },
        {
            title: "ธนาคาร",
            className: "text-center",
        },
        {
            title: "ไอดีไลน์",
            className: "text-center",
        },
        {
            title: "เวลาสมัคร",
            className: "text-center",
        },
        {
            title: "สายรหัส",
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
    let resMember = callXMLHttpRequest(`${apiPort.apiQueryMember}`, {});
    if (resMember.statusCodeText == textRespone.ok.CodeText) {
        console.log(resMember.data);
        data = resMember.data;
        for (let i = 0; i < data.length; i++) {
            let account = "";
            let bankname = "";
            account = data[i].accnum ? data[i].accnum : "";
            bankname = data[i].bank_name ? data[i].bank_name : "";
            let status = data[i].status === 2 ? "Warning" : "ปกติ";
            let ref = data[i].ref !== null ? data[i].ref : "-";
            tableData.push([
                data[i].username,
                data[i].name,
                account,
                bankname,
                data[i].line,
                moment(data[i].cre_date).format("YYYY/MM/DD HH:mm:ss"),
                ref,
                `<span class="text-${
          data[i].status === 2 ? "warning" : "info"
        }">${status}</span>`,
                `<div class="btn-group" role="group">
                <button type="button" class="btn btn-danger btn-sm" id="delete" data-id="${data[i].id}" onclick="delete_member(${data[i].id},'${data[i].username}')">
                        <i class="far fa-trash-alt"></i> ลบ
                    </button>
                    <button type="button" class="btn btn-warning btn-sm" id="edit" data-id="${data[i].id}" onclick="editMember(${data[i].id})">
                        <i class="far fa-edit"></i> แก้ไข
                        </button>
						<button type="button" class="btn btn-info btn-sm" id="edit" data-id="${data[i].id}" onclick="manage_credit_modal('${data[i].username}',${data[i].id})">
                         เครดิต
                        </button>
						<button type="button" class="btn btn-primary btn-sm" data-id="${data[i].id}" onclick="view_transection('${data[i].username}',${data[i].id})">
						<i class="far fa-eye"></i>
                        </button>
                </div>`,
            ]);
        }
    }
    initDataTables(tableData, "logs", column);
}

// function setData_member_ufa() {
//     let column = [{
//         title: "ชื่อผู้ใช้งาน",
//         className: "align-middle"
//     },
//     {
//         title: "USER UFA",
//         className: "align-middle"
//     },
//     {
//         title: "PASSWORD UFA",
//         className: "align-middle"
//     },
//     {
//         title: "จัดการ",
//         className: "align-middle"
//     },
//     ]
//     let data = [];
//     let tableData = [];
//     let resMember = callXMLHttpRequest(`${apiPort.apiQueryMemberUFA}`, {});
//     if (resMember.statusCodeText == textRespone.ok.CodeText) {
//         data = resMember.data;
//         for (let i = 0; i < data.length; i++) {
//             tableData.push([
//                 data[i].member_username,
//                 data[i].username,
//                 data[i].password,
//                 `<div class="btn-group" role="group">
//                 <button type="button" class="btn btn-warning  btn-sm" id="view_credit" data-id="${data[i].username}" onclick="view_credit('${data[i].username}')">
//                 <i class="fa-solid fa-eye"></i> ดูเครดิต
//                     </button>
//                     &nbsp;
//                     <button type="button" class="btn btn-success  btn-sm" id="credit" data-id="${data[i].id}" onclick="manage_credit_modal('${data[i].member_username}','${data[i].username}')">
//                         <i class="far fa-edit"></i> จัดการ
//                         </button>
//                 </div>`
//             ])
//         }

//     } else if (resMember.statusCodeText == "401") {
//         Swal.fire({
//             title: 'แจ้งเตือน',
//             text: resMember.description,
//             icon: 'error',
//             showCancelButton: false,
//             confirmButtonColor: '#3085d6',
//             cancelButtonColor: '#d33',
//             confirmButtonText: 'OK'
//         }).then((result) => {
//             if (result.value) {
//                 sessionStorage.removeItem('token');
//                 sessionStorage.removeItem('category');
//                 window.location.href = '../../login';
//             }
//         });
//     }
//     initDataTables(tableData, 'logs_ufa', column);
// }

function delete_member(idDelete, username) {
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
                let resDeleteMember = callXMLHttpRequest(`${apiPort.apiDeleteMember}`, {
                    id: idDelete,
                    username: username,
                });
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

function editPowyingshup(id, play, username) {
    el("id_member_powyingshup").value = id;
    el("powyingshup_id").innerHTML = username;
    el("powyingshup_play").innerHTML = play;
    $("#edit_powyingshup").modal("show");
}

function editMember(id) {
    if (canEdit) {
        let resMember = callXMLHttpRequest(`${apiPort.apiMember}`, { id: id });
        if (resMember.statusCodeText == textRespone.ok.CodeText) {
            el("username").value = resMember.data[0].username;
            el("password").value = resMember.data[0].password;
            el("name").value = resMember.data[0].name;
            el("accnum").value = resMember.data[0].accnum;
            el("id_member").value = id;
            let option = '<option value="">เลือกธนาคาร</option>';
            for (let i = 0; i < resMember.bank.length; i++) {
                if (resMember.bank[i].bank_id == resMember.data[0].bank) {
                    option +=
                        '<option value="' +
                        resMember.bank[i].bank_id +
                        '" selected>' +
                        resMember.bank[i].bank_name +
                        "</option>";
                }
                option +=
                    '<option value="' +
                    resMember.bank[i].bank_id +
                    '">' +
                    resMember.bank[i].bank_name +
                    "</option>";
            }
            el("bank").innerHTML = option;
        } else if (resMember.statusCodeText == "401") {
            Swal.fire({
                title: "แจ้งเตือน",
                text: resMember.description,
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
        $("#edit_member").modal("show");
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

function editMember_modal() {
    if (canEdit) {
        let id = el("id_member").value;
        let username = el("username").value;
        let password = el("password").value;
        let name = el("name").value;
        let accnum = el("accnum").value;
        let bank = el("bank").value;

        let data = {
            username: username,
            password: password,
            name: name,
            accnum: accnum,
            bank: bank,
            id: id,
        };

        let resEditMember = callXMLHttpRequest(`${apiPort.apiUpdateMember}`, data);
        if (resEditMember.statusCodeText == textRespone.ok.CodeText) {
            Swal.fire({
                title: "แจ้งเตือน",
                text: "อัพเดต สมาชิก เรียบร้อยแล้ว",
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
        } else if (resEditMember.statusCodeText == "401") {
            Swal.fire({
                title: "แจ้งเตือน",
                text: resEditMember.description,
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
                text: resEditMember.description,
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

function edit_powyingshup() {
    let id = el("id_member_powyingshup").value;
    let powyingshup_id = el("powyingshup_id").innerHTML;
    let powyingshup_play = el("powyingshup_play").innerHTML;
    let amount_play = el("amount_play").value;

    let total = parseInt(powyingshup_play) + parseInt(amount_play);
    let data = {
        powyingshup_id: powyingshup_id,
        powyingshup_play: parseInt(powyingshup_play),
        total: total,
        amount_play: amount_play,
        id: id,
    };
    Swal.fire({
        title: "แจ้งเตือน",
        text: "คุณต้องการเพิ่มการเล่น จำนวน " + amount_play + " ครั้ง ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "เพิ่มจำนวน",
    }).then((result) => {
        if (result.isConfirmed) {
            let resEditPowyingshup = callXMLHttpRequest(
                `${apiPort.apiUpdatePlayPowyingshup}`,
                data
            );
            if (resEditPowyingshup.statusCodeText == textRespone.ok.CodeText) {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: "เพิ่มการเล่นเป่่ายิ้งฉุบเรียบร้อยแล้ว",
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
            } else if (resEditPowyingshup.statusCodeText == "401") {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: resEditPowyingshup.description,
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
                    text: resEditPowyingshup.description,
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

function view_credit(username) {
    let resViewCredit = callXMLHttpRequest(`${apiPort.apiViewCreditUserUFA}`, {
        username: username,
    });
    if (resViewCredit.statusCodeText == textRespone.ok.CodeText) {
        Swal.fire({
            title: username,
            text: "Credit : " + resViewCredit.credit,
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
        });
    } else if (resViewCredit.statusCodeText == "401") {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resViewCredit.description,
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

function tableTransec(tableData, id, column) {
    $("#" + id).DataTable({
        destroy: true,
        data: tableData,
        columns: column,
        responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal({
                    header: function(row) {
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
            search: "ค้นหาสมาชิก",
            paginate: {
                previous: "ก่อนหน้านี้",
                next: "หน้าต่อไป",
            },
        },
    });
}

function numberFormat(x) {
    var parts = parseFloat(x).toFixed(2).split(".");
    return (
        parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
        (parts[1] ? "." + parts[1] : "")
    );
}

function getcolorNumber(val) {
    if (val < 0) {
        return `<span class="text-red">${numberFormat(val)}</span>`;
    } else if (val > 0) {
        return `<span class="text-green">${numberFormat(val)}</span>`;
    } else {
        return val;
    }
}

function getColorString(val) {
    if (val === "ฝาก") {
        return `<span class="mo-bb badge rounded-pill bg-success">${val}</span>`;
    } else if (val === "ถอน" || val === "ยกเลิก") {
        return `<span class="mo-bb badge rounded-pill bg-danger">${val}</span>`;
    } else if (val === "ปรับยอด") {
        return `<span class="mo-bb badge rounded-pill bg-info">${val}</span>`;
    } else if (val === "สำเร็จ") {
        return `<span class="text-success">${val}</span>`;
    } else if (val === "กำลังรอ") {
        return `<span class="text-warning">${val}</span>`;
    } else if (val === "ยกเลิก") {
        return `<span class="text-danger">${val}</span>`;
    } else {
        return val;
    }
}

async function getDetail(find, mode, user) {
    await showLoader();
    if (mode === "transection") {
        // console.log(find)
        let resTransactionId = await callXMLHttpRequest(
            `${apiPort.apiQueryTransactionWithId}`, { transection: find }
        );
        // console.log(resTransactionId)
        if (resTransactionId.statusCode === 200) {
            console.log(resTransactionId.data);
            let rr = resTransactionId.data;
            if (rr.length > 0) {
                if (rr.type === "1") {
                    rr.type = `<span class="mo-bb badge bg-success">ฝากเงิน</span>`;
                } else if (rr.type === "2") {
                    rr.type = `<span class="mo-bb badge bg-info">ปรับยอดเงิน</span>`;
                } else {
                    rr.type = `<span class="mo-bb badge bg-danger">ถอนเงิน</span>`;
                }
                if (rr.stats === 1) {
                    rr.stats = `<span class="mo-bb text-warning">กำลังรอ</span>`;
                } else if (rr.stats === 2) {
                    rr.stats = `<span class="mo-bb text-danger">ยกเลิก</span>`;
                } else if (rr.stats === 3) {
                    rr.stats = `<span class="mo-bb text-primary">ออโต้ถอน</span>`;
                } else {
                    rr.stats = `<span class="mo-bb text-success">สำเร็จ</span>`;
                }
            }
            $("#tran_username").html(rr.member_username);
            $("#tran_date").html(moment(rr.created_at).format("YYYY-MM-DD HH:mm:ss"));
            $("#tran_name").html(rr.name);
            $("#tran_amount").html(numberFormat(rr.amount));
            $("#tran_type").html(rr.type);
            $("#tran_state").html(rr.stats); //tran_desciption
            let txt = `ทำรายการโดย - ${
        rr.created_by ? rr.created_by : "ไม่พบข้อมูล"
      } || ${rr.remark} <br>`;
            txt += `${rr.response_api}`;
            $("#tran_desciption").html(txt);
            $("#detail_transection").modal();
        }
    } else if (mode === "game") {
        let resRefnoId = await callXMLHttpRequest(
            `${apiPort.apiQueryTransactionGameWithId}`, { refno: find }
        );
        // console.log(resTransactionId)
        if (resRefnoId.statusCode === 200) {
            console.log(resRefnoId.data);
            let rr = resRefnoId.data;
            if (rr.length > 0) {
                if (rr.state === "won") {
                    rr.state = `<span class="mo-bb text-warning">ชนะ</span>`;
                } else {
                    rr.state = `<span class="mo-bb text-danger">แพ้</span>`;
                }
                if (rr.winloss < 0) {
                    rr.winloss = `<span class="mo-bb text-danger">${numberFormat(
            rr.winloss
          )}</span>`;
                } else if (rr.winloss > 0) {
                    rr.winloss = `<span class="mo-bb text-success">${numberFormat(
            rr.winloss
          )}</span>`;
                } else {
                    rr.winloss = `<span class="mo-bb text-light">${numberFormat(
            rr.winloss
          )}</span>`;
                }
            }
            $("#game_username").html(rr.member_username);
            $("#game_date").html(moment(rr.date).format("YYYY-MM-DD HH:mm:ss"));
            $("#game_name").html(rr.name);
            $("#game_amount").html(numberFormat(rr.bet));
            $("#game_type").html(rr.mode);
            $("#game_game").html(rr.game);
            $("#game_wl").html(rr.winloss);
            $("#game_state").html(rr.state); //tran_desciption
            let txt = `${rr.detail}`;
            $("#game_desciption").html(txt.replace(/\r\n/g, "<br>"));
            $("#detail_game").modal();
        }
    } else if (mode === "lotto") {
        let resOrderId = await callXMLHttpRequest(
            `${apiPort.apiQueryTransactionLottoWithId}`, { user: user, orderId: find }
        );
        // console.log(resOrderId.statusCode)
        if (resOrderId.statusCode === 200) {
            console.log(resOrderId.data);
            let rr = resOrderId.data;
            let datauser = resOrderId.user.result[0];
            let txt = "";
            let sum_aomunt = 0;
            let sum_wl = 0;
            let datetime = "";
            if (rr.length > 0) {
                for (const r of rr) {
                    datatime = r.date_time_add;
                    txt += `<tr>`;
                    sum_aomunt = r.amount + sum_aomunt;
                    txt += `<td class="text-center">${r.group_name}:${r.lotto_name}</td>`;
                    txt += `<td class="text-center">${r.description}</td>`;
                    txt += `<td class="text-center">${r.numbers}</td>`;
                    txt += `<td class="text-center">${numberFormat(r.amount)}</td>`;
                    if (r.winner_flg === 0) {
                        txt += `<td class="text-center">${numberFormat(
              r.amount * -1
            )}</td>`;
                        txt += `<td class="text-center text-danger">ไม่ถูกรางวัล</td>`;
                        sum_wl = r.amount * -1 + sum_wl;
                    } else {
                        txt += `<td>${numberFormat(r.winner_amount)}</td>`;
                        txt += `<td class="text-center text-success">ถูกรางวัล</td>`;
                        sum_wl = r.winner_amount + sum_wl;
                    }
                    txt += `</tr>`;
                }
            }
            $("#data_lotto").html(txt);
            $("#sum_amount").html(numberFormat(sum_aomunt));
            $("#sum_wl").html(numberFormat(sum_wl));
            $("#lotto_username").html(datauser.username);
            $("#lotto_name").html(datauser.name);
            $("#lotto_date").html(moment(datatime).format("YYYY-MM-DD HH:mm:ss"));
            $("#detail_lotto").modal();
        }
    } else {}
    hideLoader();
}

function view_transection(username, id) {
    showLoader();
    $(".modal").modal("hide");
    el("username_transection").innerHTML = username;
    let data = [];
    let tableData = [];
    let resTransections = callXMLHttpRequest(
        `${apiPort.apiQueryTransactionAll}`, { state: { game: stsUFA, lotto: stsLotto }, user: username, mode: "member" }
    );
    console.log(resTransections);

    if (resTransections.statusCodeText == textRespone.ok.CodeText) {
        let datatt = [];
        for (let ss of resTransections.data) {
            let ddd = [
                ss.user,
                ss.type,
                `${moment(ss.date).format("YYYY/MM/DD-HH:mm:ss")}`,
                ss.amount,
                ss.wl ? getcolorNumber(ss.wl) : "-",
                getColorString(ss.state),
                `<button type="button" class="btn btn-info btn-sm" onclick="getDetail('${ss.find}','${ss.mode}','${ss.user}')">
				<i class="fa fa-info-circle"></i> รายละเอียด
				</button>`,
            ];
            datatt.push(ddd);
        }
        tableTransec(datatt, "member_transection", column_transection);
    } else if (resManageCredit.statusCodeText == "401") {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resManageCredit.description,
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
            text: resManageCredit.description,
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
        });
    }
    hideLoader();
    $("#view_transection").modal("show");
}

function manage_credit_modal(username, id) {
    $(".modal").modal("hide");
    el("username_credit").innerHTML = username;
    el("id_member_credit").value = id;
    let data = [];
    let tableData = [];
    let resManageCredit = callXMLHttpRequest(`${apiPort.apiManageCredit}`, {
        id: id,
    });
    if (resManageCredit.statusCodeText == textRespone.ok.CodeText) {
        el("uername_credit").innerHTML =
            formatMoney(resManageCredit.data[0].balance) + " บาท";
        el("credit_now").value = resManageCredit.data[0].balance;
    } else if (resManageCredit.statusCodeText == "401") {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resManageCredit.description,
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
            text: resManageCredit.description,
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
        });
    }
    $("#manage_credit").modal("show");
}

function add_credit() {
    let username = el("username_credit").innerHTML;
    let id = el("id_member_credit").value;
    let amount = el("amount_credit").value;
    let data = {
        username: username,
        id: id,
        amount: amount,
    };
    let resManageCredit = callXMLHttpRequest(`${apiPort.apiAddCredit}`, data);
    if (resManageCredit.statusCodeText == textRespone.ok.CodeText) {
        Swal.fire({
            title: "แจ้งเตือน",
            text: "เติมเครดิตให้กับ " + username + " จำนวน : " + amount + " สำเร็จแล้ว",
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
    } else if (resManageCredit.statusCodeText == "401") {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resManageCredit.description,
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
            text: resManageCredit.description,
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
        });
    }
}

function minus_credit() {
    if (canEdit) {
        let username = el("username_credit").innerHTML;
        let id = el("id_member_credit").value;
        let amount = parseFloat(el("amount_credit").value);
        let credit_now = parseFloat(el("credit_now").value);
        let data = {
            username: username,
            id: id,
            amount: amount,
        };

        if (credit_now >= amount) {
            toastr.success("กำลังถอนเครดิต กรุณารอสักครู่");
            let resManageCredit = callXMLHttpRequest(
                `${apiPort.apiMinusCredit}`,
                data
            );
            if (resManageCredit.statusCodeText == textRespone.ok.CodeText) {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: "ถอนเครดิตให้กับ " +
                        username +
                        " จำนวน : " +
                        amount +
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
            } else {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: resManageCredit.description,
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
        } else {
            toastr.error("ไม่สามารถถอนเครดิตได้");
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

function checkNumCredit() {
    let credit = parseInt(el("amount_credit").value);
    if (credit >= 0) {} else {
        document.getElementById("amount_credit").value = 0;
    }
}