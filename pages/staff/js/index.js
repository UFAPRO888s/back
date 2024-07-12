$(document).ready(async function() {
    await setData_member();
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
        if (result.dismiss === Swal.DismissReason.timer) {
            setData_member();
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
        let resMenuStaff = callXMLHttpRequest(`${apiPort.apiMenubarStaff}`, {});
        let htm = "";
        if (resMenuStaff.statusCodeText == textRespone.ok.CodeText) {
            el("menuLength").value = resMenuStaff.data.length;
            let num = 0;
            for (let i = 0; i < resMenuStaff.data.length; i++) {
                let data = resMenuStaff.data[i];
                let headNav = "";
                if (data.path_menu == "#") {
                    headNav = `<b><span style="color:green">${data.name_menu} [ หัวข้อ ]</span></b>`;
                } else {
                    headNav = `${data.name_menu}`;
                }
                htm += `<tr>
<td class="text-start">${headNav}</td>
<td><input type="checkbox" class="menu-check-1" id="menu[${num}][view]">
<input type="hidden" class="menu-check-1" id="menu[${num}][id]" value="${
          data.id
        }">
<input type="hidden" class="menu-check-1" id="menu[${num}][name]" value="${
          data.name_menu
        }">
</td>
<td>
    <input type="checkbox" class="menu-check-1" id="menu[${num++}][edit]">
</td>
</tr>`;
                if (data.parent_lv1 != 0) {
                    el("menuLength").value =
                        parseInt(el("menuLength").value) + data.parent_lv1.length;
                    for (let j = 0; j < data.parent_lv1.length; j++) {
                        htm += `<tr>
        <td class="text-start">${data.parent_lv1[j].name_menu}</td>
        <td><input type="checkbox" class="menu-check-1" id="menu[${num}][view]">
        <input type="hidden" class="menu-check-1" id="menu[${num}][id]" value="${
              data.parent_lv1[j].id
            }">
        <input type="hidden" class="menu-check-1" id="menu[${num}][name]" value="${
              data.parent_lv1[j].name_menu
            }">
        </td>
        <td>
            <input type="checkbox" class="menu-check-1" id="menu[${num++}][edit]">
        </td>
        </tr>`;
                    }
                }
            }
            el("staffMenu").innerHTML = htm;
        } else if (resMenuStaff.statusCodeText == "401") {
            Swal.fire({
                title: "แจ้งเตือน",
                text: resMenuStaff.description,
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
                text: resMenuStaff.description,
                icon: "error",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "OK",
            });
        }

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
        let lengthMenu = el("menuLength").value;
        let arrMenu = [];
        for (let i = 0; i < lengthMenu; i++) {
            console.log("0", `menu[${i}][view]`);
            console.log("1", el(`menu[${i}][view]`).checked);
            console.log("2", el(`menu[${i}][edit]`).checked);
            if (el(`menu[${i}][view]`).checked || el(`menu[${i}][edit]`).checked) {
                arrMenu.push({
                    id: el(`menu[${i}][id]`).value,
                    name: el(`menu[${i}][name]`).value,
                    view: el(`menu[${i}][view]`).checked ? 1 : 0,
                    edit: el(`menu[${i}][edit]`).checked ? 1 : 0,
                });
            }
        }
        let username = el("add_username").value;
        let password = el("add_password").value;
        let mappingApi = el("mapping-api").value;
        let data = {
            username: username,
            password: password,
            permission: arrMenu,
            mappingApi,
        };
        let resEditMember = callXMLHttpRequest(`${apiPort.apiAddStaff}`, data);
        if (resEditMember.statusCodeText == textRespone.ok.CodeText) {
            Swal.fire({
                title: "แจ้งเตือน",
                text: "เพิ่ม Staff เรียบร้อยแล้ว",
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

function edit_member(id) {
    if (canEdit) {
        let resEditStaff = callXMLHttpRequest(`${apiPort.apiQueryEditStaff}`, {
            id: id,
        });
        let htm = "";
        if (resEditStaff.statusCodeText == textRespone.ok.CodeText) {
            el("menuLengthEdit").value = resEditStaff.data.length;
            for (let i = 0; i < resEditStaff.data.length; i++) {
                let data = resEditStaff.data[i];
                let headNav = "";
                let viewMenu = "";
                let editMenu = "";
                if (data.path_menu == "#") {
                    headNav = `<b><span style="color:green">${data.name_menu} [ หัวข้อ ]</span></b>`;
                } else {
                    headNav = `${data.name_menu}`;
                }
                if (data.menu_view == 1) {
                    viewMenu = `<input type="checkbox" class="menu-check-1" id="menu[${i}][view][modify]" checked>`;
                } else {
                    viewMenu = `<input type="checkbox" class="menu-check-1" id="menu[${i}][view][modify]">`;
                }
                if (data.menu_edit == 1) {
                    editMenu = `<input type="checkbox" class="menu-check-1" id="menu[${i}][edit][modify]" checked>`;
                } else {
                    editMenu = `<input type="checkbox" class="menu-check-1" id="menu[${i}][edit][modify]">`;
                }
                htm += `<tr>
<td class="text-start">${headNav}</td>
<td>${viewMenu}
<input type="hidden" class="menu-check-1" id="menu[${i}][id][modify]" value="${data.perID}">
<input type="hidden" class="menu-check-1" id="menu[${i}][name][modify]" value="${data.name_menu}">
</td>
<td>
${editMenu}
</td>
</tr>`;
            }
            el("id_member_edit").value = id;
            el("edit_username").value = resEditStaff.username;
            el("edit_password").value = '';
            el("staffMenuEdit").innerHTML = htm;
        } else if (resEditStaff.statusCodeText == "401") {
            Swal.fire({
                title: "แจ้งเตือน",
                text: resEditStaff.description,
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
                text: resEditStaff.description,
                icon: "error",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "OK",
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

function edit_member_model() {
    if (canEdit) {
        let id = el("id_member_edit").value;
        let username = el("edit_username").value;
        let password = el("edit_password").value;

        let lengthMenu = el("menuLengthEdit").value;
        let arrMenu = [];
        for (let i = 0; i < lengthMenu; i++) {
            arrMenu.push({
                id: el(`menu[${i}][id][modify]`).value,
                name: el(`menu[${i}][name][modify]`).value,
                view: el(`menu[${i}][view][modify]`).checked ? 1 : 0,
                edit: el(`menu[${i}][edit][modify]`).checked ? 1 : 0,
            });
        }

        let data = {
            id: id,
            username: username,
            password: password,
            permission: arrMenu,
        };

        let resEditMember = callXMLHttpRequest(`${apiPort.apiUpdateStaff}`, data);
        if (resEditMember.statusCodeText == textRespone.ok.CodeText) {
            Swal.fire({
                title: "แจ้งเตือน",
                text: "แก้ไข Staff เรียบร้อยแล้ว",
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
            className: "align-middle text-center",
        },
        {
            title: "การใช้งาน",
            className: "align-middle text-left",
        },
        {
            title: "จัดการ",
            className: "align-middle text-center",
        },
    ];
    let data = [];
    let tableData = [];
    let resMember = callXMLHttpRequest(`${apiPort.apiQueryStaff}`, {});
    if (resMember.statusCodeText == textRespone.ok.CodeText) {
        data = resMember.data;
        for (let i = 0; i < data.length; i++) {
            let cat = data[i].category.split(",");
            let txt = "";
            let f = 1;
            for (const cc of cat) {
                if (cc !== "") {
                    if (f === 6) {
                        f = 0;
                        txt += `<span class="badge bg-info bage-font mx-1">${cc}</span><br>`;
                    } else {
                        txt += `<span class="badge bg-info bage-font mx-1">${cc}</span>`;
                    }
                    f++;
                }
            }
            console.log(cat);
            tableData.push([
                data[i].username,
                txt,
                `<div class="btn-group" role="group">
                <a href="#" onclick="deleteStaff(${data[i].id})" class="btn btn-outline-danger btn-lg waves-effect waves-light"><i class="fas fa-trash-alt"></i></a>
                    &nbsp;
                    <a href="#" onclick="edit_member(${data[i].id})" class="btn btn-outline-success btn-lg waves-effect waves-light"><i class="fas fa-edit"></i></a>
                </div>`,
            ]);
        }
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
    initDataTables(tableData, "logs", column);
}

function deleteStaff(id) {
    if (canEdit) {
        Swal.fire({
            title: "แจ้งเตือน",
            text: "คุณต้องการจะลบ Staff คนนี้ใช่หรือไม่?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
        }).then((result) => {
            if (result.value) {
                let resEditMember = callXMLHttpRequest(`${apiPort.apiDeleteStaff}`, {
                    id: id,
                });
                if (resEditMember.statusCodeText == textRespone.ok.CodeText) {
                    Swal.fire({
                        title: "แจ้งเตือน",
                        text: "ลบ Staff เรียบร้อยแล้ว",
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