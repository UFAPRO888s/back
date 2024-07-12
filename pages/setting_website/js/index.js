$(document).ready(async function() {
    await list_banner();
    await list_popup();
    await list_vipgroup();
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
            list_banner();
            list_popup();
            list_vipgroup();
        }
    });
}

async function edit_setting_banner() {
    if (canEdit) {
        let name_banner = el("name_banner").value;
        let banner_checkhome = el("banner_checkhome").checked ? 1 : 0;
        let banner_checkuser = el("banner_checkuser").checked ? 1 : 0;
        let banner_order = el("banner_order").value;
        let img_name = el("url_file").value;
        let banner_status = el("banner_status").checked ? 1 : 0;
        let data = {
            dir: "webauto_banner",
            name_banner: name_banner,
            banner_checkhome: banner_checkhome,
            banner_checkuser: banner_checkuser,
            banner_order: banner_order,
            img_name: img_name,
            banner_status: banner_status,
        };
        var files = document.getElementById("file").files;
        if (files.length > 0) {
            var formData = new FormData();
            formData.append("dir", "webauto_banner");
            formData.append("file", files[0]);
            let res = await fetch(`${apiPort.apiUpload}`, {
                method: "POST",
                body: formData,
            }).then(async(response) => {
                return response.json();
            });
            if (res.imageUrl) {
                data.img_name = res.imageUrl;
                let resSettingWinloss = callXMLHttpRequest(
                    `${apiPort.apiUpdateSettingBanner}`,
                    data
                );
                if (resSettingWinloss.statusCodeText == textRespone.ok.CodeText) {
                    Swal.fire({
                        title: "แจ้งเตือน",
                        text: "อัพเดตแบนเนอร์เรียบร้อยแล้ว",
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
                } else if (resSettingWinloss.statusCodeText == "401") {
                    Swal.fire({
                        title: "แจ้งเตือน",
                        text: resSettingWinloss.description,
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
                        text: resSettingWinloss.description,
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "OK",
                    });
                }
            }
        } else {
            Swal.fire({
                title: "แจ้งเตือน",
                text: "กรุณาอัพโหลดรูปที่จำเป็น",
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

async function edit_setting_popup() {
    if (canEdit) {
        let name_popup = el("name_popup").value;
        let des_popup = el("des_popup").value;
        let img_name = el("url_file_popup").value;
        let popup_status = el("popup_status").checked ? 1 : 0;
        let data = {
            name_popup: name_popup,
            des_popup: des_popup,
            img_name: img_name,
            popup_status: popup_status,
        };
        var files = document.getElementById("file_popup").files;
        if (files.length > 0) {
            var formData = new FormData();
            formData.append("dir", "webauto_popup");
            formData.append("file", files[0]);
            let res = await fetch(`${apiPort.apiUpload}`, {
                method: "POST",
                body: formData,
            }).then(async(response) => {
                return response.json();
            });
            if (res.imageUrl) {
                data.img_name = res.imageUrl;
                let resSettingWinloss = callXMLHttpRequest(
                    `${apiPort.apiUpdateSettingPopup}`,
                    data
                );
                if (resSettingWinloss.statusCodeText == textRespone.ok.CodeText) {
                    Swal.fire({
                        title: "แจ้งเตือน",
                        text: "อัพเดตป๊อบอัพเรียบร้อยแล้ว",
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
                } else if (resSettingWinloss.statusCodeText == "401") {
                    Swal.fire({
                        title: "แจ้งเตือน",
                        text: resSettingWinloss.description,
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
                        text: resSettingWinloss.description,
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "OK",
                    });
                }
            }
        } else {
            Swal.fire({
                title: "แจ้งเตือน",
                text: "กรุณาอัพโหลดรูปที่จำเป็น",
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

async function edit_groupvip_setting() {
    if (canEdit) {
        let line_groupvip = el("line_groupvip").value;
        let text_groupvip = el("text_groupvip").value;
        let data = {
            line_groupvip: line_groupvip,
            text_groupvip: text_groupvip,
        };
        let resSettingWinloss = callXMLHttpRequest(
            `${apiPort.apiUpdateSettingVip}`,
            data
        );
        console.log(resSettingWinloss);
        if (resSettingWinloss.statusCodeText == 200) {
            Swal.fire({
                title: "แจ้งเตือน",
                text: "อัพเดตเรียบร้อยแล้ว",
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
        } else if (resSettingWinloss.statusCodeText == "401") {
            Swal.fire({
                title: "แจ้งเตือน",
                text: resSettingWinloss.description,
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
                text: resSettingWinloss.description,
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

async function list_vipgroup() {
    let resMember = await callXMLHttpRequest(`${apiPort.apiQuerySettingVip}`, {});
    if (resMember.statusCodeText == textRespone.ok.CodeText) {
        data = resMember.data;
        $("#line_groupvip").val(data[0].line);
        $("#text_groupvip").val(data[0].description);
    }
}

async function list_banner() {
    let column = [{
            title: "ชื่อแบนเนอร์",
            className: "text-center",
        },
        {
            title: "รูปภาพ",
            className: "text-center",
        },
        {
            title: "หน้าHome",
            className: "text-center",
        },
        {
            title: "หน้าUser",
            className: "text-center",
        },
        {
            title: "ลำดับการแสดง",
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
    let resMember = await callXMLHttpRequest(
        `${apiPort.apiQuerySettingBanner}`, {}
    );
    if (resMember.statusCodeText == textRespone.ok.CodeText) {
        data = resMember.data;
        for (let i = 0; i < data.length; i++) {
            let status = data[i].state === 1 ? "เปิดใช้งาน" : "ปิดใช้งาน";
            let chome = data[i].checkhome ? "checked" : "";
            let cuser = data[i].checkuser ? "checked" : "";
            tableData.push([
                data[i].bname,
                `<img src="${data[i].img_name}" class="img-thumbnail"/>`,
                `<label class="switch">
				<input type="checkbox" ${chome} disabled>
				<span class="slider round"></span>
			</label>`,
                `<label class="switch">
				<input type="checkbox" ${cuser} disabled>
				<span class="slider round"></span>
			</label>`,
                data[i].border,
                `<span class="text-${
          data[i].state === 0 ? "warning" : "info"
        }">${status}</span>`,
                `<div class="btn-group" role="group">
                <button type="button" class="btn btn-danger btn-sm" id="delete" data-id="${data[i].id}" onclick="deleteData('${data[i].id}','banner','${data[i].img_name}')">
                        <i class="far fa-trash-alt"></i> ลบ
                    </button>
                </div>`,
            ]);
        }
    }
    initDataTables(tableData, "banner", column);
}

async function list_popup() {
    let column = [{
            title: "ชื่อป๊อบอัพ",
            className: "text-center",
        },
        {
            title: "รายละเอียด",
            className: "text-center",
        },
        {
            title: "รูปภาพ",
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
    let resMember = await callXMLHttpRequest(
        `${apiPort.apiQuerySettingPopup}`, {}
    );
    if (resMember.statusCodeText == textRespone.ok.CodeText) {
        data = resMember.data;
        for (let i = 0; i < data.length; i++) {
            let status = data[i].state === 1 ? "เปิดใช้งาน" : "ปิดใช้งาน";
            tableData.push([
                data[i].bname,
                data[i].description,
                `<img src="${data[i].img_name}" class="img-thumbnail"/>`,
                `<span class="text-${
          data[i].state === 0 ? "warning" : "info"
        }">${status}</span>`,
                `<div class="btn-group" role="group">
                <button type="button" class="btn btn-danger btn-sm" id="delete" data-id="${data[i].id}" onclick="deleteData('${data[i].id}','popup','${data[i].img_name}')">
                        <i class="far fa-trash-alt"></i> ลบ
                    </button>
                </div>`,
            ]);
        }
    }
    initDataTables(tableData, "popup", column);
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
                        return "ป๊อบอัพ: " + data[0];
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

function deleteData(id, mode, img) {
    Swal.fire({
        title: "ต้องการลบลบข้อมูลใช่หรือไม่",
        showCancelButton: true,
        confirmButtonText: "ใช่",
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            let data = {
                id: id,
                mode: mode,
                img: img,
            };
            let resDelete = callXMLHttpRequest(`${apiPort.apiDeleteDataImg}`, data);
            if (resDelete.statusCodeText == textRespone.ok.CodeText) {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: "ลบข้อมูลเรียบร้อย",
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
            }
        }
    });
}