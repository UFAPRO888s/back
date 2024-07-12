$(document).ready(async function() {
    await setDataMemberTopup();
    await setDate("date_start_sort", moment().format("YYYY-MM-DD"));
    await setDate("date_end_sort", moment().format("YYYY-MM-DD"));
    hideLoader();
});

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

function Loading() {
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
            setDataMemberTopup();
        }
    });
}

function initDataTables(tableData, id, column) {
    $("#" + id).DataTable({
        data: tableData,
        columns: column,
        order: [
            [1, "desc"]
        ],
        responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal({
                    header: function(row) {
                        var data = row.data();
                        return "สมาชิก: " + data[3];
                    },
                }),
                renderer: $.fn.dataTable.Responsive.renderer.tableAll({
                    tableClass: "table",
                }),
            },
        },
        language: {
            zeroRecords: "ไม่พบข้อมูลที่ต้องการ",
            info: "แสดงหน้า _PAGE_ จาก _PAGES_",
            infoEmpty: "ไม่พบข้อมูลที่ต้องการ",
            infoFiltered: "(filtered from _MAX_ total records)",
            paginate: {
                previous: "ก่อนหน้านี้",
                next: "หน้าต่อไป",
            },
        },
    });
}

async function setDataMemberTopup(round) {
    let column = [{
            title: "หลักฐานการโอนเงิน",
            className: "align-middle text-center",
        },
        {
            title: "วันที่-เวลาที่ทำรายการ",
            className: "align-middle",
        },
        {
            title: "วันที่-เวลาที่โอน",
            className: "align-middle",
        },
        {
            title: "MemberID",
            className: "align-middle",
        },
        {
            title: "ช่องทางการโอน",
            className: "align-middle",
        },
        {
            title: "จำนวนเงิน",
            className: "align-middle",
        },
        {
            title: "สถานะ",
            className: "align-middle",
        },
        {
            title: "ผู้ทำรายการ",
            className: "align-middle",
        },
    ];
    let tableData = [];
    let resMemberTopup = await callXMLHttpRequest(
        `${apiPort.apiReportMemberTopup}`, {
            sts: el("s_sel").value,
            start: el("date_start_sort").value + " 00:00:00",
            end: el("date_end_sort").value + " 23:59:59",
        }
    );
    if (resMemberTopup.statusCodeText == textRespone.ok.CodeText) {
        for (let i = 0; i < resMemberTopup.data.length; i++) {
            let data = resMemberTopup.data[i];
            let htm = "";
            if (data.remark == "SCB") {
                htm = `<div style="width: 40px;background-color: #4e2e7f;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:12px;"> SCB</div>`;
            } else if (data.remark == "TRUEWALLET") {
                htm = `<div style="width: 40px;background-color: #ff8300;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:10px;"> WALLET</div>`;
            } else if (data.remark == "Manual") {
                htm = `<div style="width: 40px;background-color: #4b545c;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:12px;"> Manual</div>`;
            }
            tableData.push([
                data.file_name ?
                `<div style="width: 40px;background-color: #f7b716;height: 25px;margin-left: 25%;border-radius: 5px;cursor: pointer;" onclick="showSlip('${data.file_name}')"><i class="fas fa-camera"></i></div>` :
                "-",
                formatDate(data.transaction_date) +
                " " +
                formatTime(data.transaction_date),
                data.created_at ?
                formatDate(data.created_at) + " " + formatTime(data.created_at) :
                "-",
                data.member_username,
                htm,
                data.amount,
                data.stats == 0 ?
                `<span style="color:green">สำเร็จ</span>` :
                data.stats == 1 ?
                `<span style="color:yellow">กำลังรอ</span>` :
                `<span style="color:red">ยกเลิก</span>`,
                data.remark != "Manual" ?
                `<span style="color:green">[ Auto System ]</span>` :
                data.created_by,
            ]);
        }
    } else if (resMemberTopup.statusCodeText == "401") {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resMemberTopup.description,
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
}

function showSlip(name) {
    $("#show_slip").modal("show");
    var modalImg = document.getElementById("img01");
    modalImg.src = name;
}

$.datetimepicker.setLocale("th");
var yearL = new Date().getFullYear();
var leap = (yearL % 4 == 0 && yearL % 100 != 0) || yearL % 400 == 0 ? 2 : 3;
var date = new Date();
var day = date.getDate();
var month = str_pad(date.getMonth("m") + 1);
var year = date.getFullYear();
var hours = date.getHours();
var minutes = date.getMinutes();
// $('#date_start').datetimepicker({
//     value: year + '-' + month + '-' + day + " " + hours + ":" + minutes,
//     timepicker: false,
//     format: 'Y-m-d H:i',
//     lang: 'th',
//     dayOfWeekStart: leap,
//     timepicker: true
// });

// $('#date_start_sort').datetimepicker({
//     value: year + '-' + month + '-' + day + " 00:00",
//     timepicker: false,
//     format: 'Y-m-d H:i',
//     lang: 'th',
//     dayOfWeekStart: leap,
//     timepicker: true
// });

// $('#date_end_sort').datetimepicker({
//     value: year + '-' + month + '-' + day + " " + hours + ":" + minutes,
//     timepicker: false,
//     format: 'Y-m-d H:i',
//     lang: 'th',
//     dayOfWeekStart: leap,
//     timepicker: true
// });

function str_pad(n) {
    return String("00" + n).slice(-2);
}

$("#dash_0").click(function() {
    setDataMemberTopup(true);
});

// Upload file
async function uploadFile() {
    showLoader();
    if (canEdit) {
        let idMember = el("member_sel").value;
        let bank = el("bank_sel").value;
        let amountCredit = el("amount").value;
        var files = document.getElementById("file").files;
        if (idMember) {
            if (bank) {
                if (amountCredit) {
                    if (files.length > 0) {
                        var formData = new FormData();
                        formData.append("dir", "webauto_topup");
                        formData.append("file", files[0]);

                        let res = await fetch(`${apiPort.apiUpload}`, {
                            method: "POST",
                            body: formData,
                        }).then(async(response) => {
                            return response.json();
                        });
                        if (res.imageUrl) {
                            let data = {
                                fileName: res.imageUrl,
                                id: idMember,
                                bank: bank,
                                amount: amountCredit,
                                days: el("date_start").value + ":00",
                                admin: member_nav.username,
                            };
                            let resManageCredit = await callXMLHttpRequest(
                                `${apiPort.apiAddCredit}`,
                                data
                            );
                            if (resManageCredit.statusCodeText == textRespone.ok.CodeText) {
                                Swal.fire({
                                    title: "แจ้งเตือน",
                                    text: "เติมเครดิตให้กับ " +
                                        resManageCredit.username +
                                        " จำนวน : " +
                                        amountCredit +
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
                    } else {
                        Swal.fire({
                            title: "แจ้งเตือน",
                            text: "กรุณาอัพโหลดไฟล์ก่อน",
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
                        text: "กรุณาใส่จำนวนเงินค่ะ",
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
                    text: "กรุณาเลือก Bank ค่ะ",
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
                text: "กรุณาเลือก Member ค่ะ",
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
    hideLoader();
}

async function setdataDate(date, round) {
    showLoader();
    let column = [{
            title: "หลักฐานการโอนเงิน",
            className: "align-middle text-center",
        },
        {
            title: "วันที่-เวลาที่ทำรายการ",
            className: "align-middle",
        },
        {
            title: "วันที่-เวลาที่โอน",
            className: "align-middle",
        },
        {
            title: "MemberID",
            className: "align-middle",
        },
        {
            title: "ช่องทางการโอน",
            className: "align-middle",
        },
        {
            title: "จำนวนเงิน",
            className: "align-middle",
        },
        {
            title: "สถานะ",
            className: "align-middle",
        },
        {
            title: "ผู้ทำรายการ",
            className: "align-middle",
        },
    ];
    let tableData = [];
    let resMemberTopup = await callXMLHttpRequest(
        `${apiPort.apiReportMemberTopupSort}`, { date: date, sts: el("s_sel").value }
    );
    if (resMemberTopup.statusCodeText == textRespone.ok.CodeText) {
        for (let i = 0; i < resMemberTopup.data.length; i++) {
            let data = resMemberTopup.data[i];
            let htm = "";
            if (data.remark == "SCB") {
                htm = `<div style="width: 40px;background-color: #4e2e7f;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:12px;"> SCB</div>`;
            } else if (data.remark == "TRUEWALLET") {
                htm = `<div style="width: 40px;background-color: #ff8300;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:10px;"> WALLET</div>`;
            } else if (data.remark == "Manual") {
                htm = `<div style="width: 40px;background-color: #4b545c;color:#fff;height: 20px;margin-left: 25%;border-radius: 5px;cursor: pointer;text-align:center;font-size:12px;"> Manual</div>`;
            }
            tableData.push([
                data.file_name ?
                `<div style="width: 40px;background-color: #f7b716;height: 25px;margin-left: 25%;border-radius: 5px;cursor: pointer;" onclick="showSlip('${data.file_name}')"><i class="fas fa-camera"></i></div>` :
                "-",
                formatDate(data.transaction_date) +
                " " +
                formatTime(data.transaction_date),
                data.created_at ?
                formatDate(data.created_at) + " " + formatTime(data.created_at) :
                "-",
                data.member_username,
                htm,
                data.amount,
                data.stats == 0 ?
                `<span style="color:green">สำเร็จ</span>` :
                data.stats == 1 ?
                `<span style="color:yellow">กำลังรอ</span>` :
                `<span style="color:red">ยกเลิก</span>`,
                data.remark != "Manual" ?
                `<span style="color:green">[ Auto System ]</span>` :
                data.created_by,
            ]);
        }
    } else if (resMemberTopup.statusCodeText == "401") {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resMemberTopup.description,
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