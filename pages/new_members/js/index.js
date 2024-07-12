$(document).ready(function() {
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
            zeroRecords: "ไม่พบข้อมูลสมาชิกใหม่",
            info: "แสดงหน้า _PAGE_ จาก _PAGES_",
            infoEmpty: "ไม่พบข้อมูลสมาชิกใหม่",
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
    let today = moment().format("YYYY-MM-DD");
    let resMember = callXMLHttpRequest(`${apiPort.apiQueryNewMember}`, {
        find: today,
    });
    console.log(resMember);
    if (resMember.statusCodeText == textRespone.ok.CodeText) {
        console.log(resMember.data);
        data = resMember.data;
        for (let i = 0; i < data.length; i++) {
            let account = "";
            let bankname = "";
            account = data[i].accnum ? data[i].accnum : "";
            bankname = data[i].bank_name ? data[i].bank_name : "";
            let status = data[i].status === 2 ? "Warning" : "ปกติ";
            let ref = data[i].ref_user !== null ? data[i].ref_user : "-";
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