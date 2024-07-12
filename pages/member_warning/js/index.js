$(document).ready(async function() {
    await setDate('startDate', moment().format('YYYY-MM-DD'));
    await setDate('endDate', moment().format('YYYY-MM-DD'));
    hideLoader()
});

function setDate(id, date) {
    const datePicker = MCDatepicker.create({
        el: '#' + id,
        bodyType: 'modal', //modal,inline
        disableWeekends: false,
        dateFormat: 'yyyy-mm-dd',
        customWeekDays: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
        customMonths: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฏาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
        closeOndblclick: true,
        autoClose: true,
        selectedDate: new Date()
    });
    date = date.split('-');
    let year = parseInt(date[0]) + 543
    date = `${year}-${date[1]}-${date[2]}`;
    el(id).value = date;
}

function numberFormat(x) {
    var parts = x.toFixed(2).split(".");
    return parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + (parts[1] ? "." + parts[1] : "");
}

async function getDetail(username, detail, status) {
    let selected = (status === '2') ? 'selected' : '';
    let selected2 = (status === '1') ? 'selected' : '';
    $('#selectStatus').html(`<option value="2" ${selected}>เปิด Warning</option><option value="1" ${selected2}>ปิด Warning</option>`);
    $('#update_username').val(username)
    $('#update_detail').val(detail)
    $('#update_warning').modal('show')
}


var app = new Vue({
    el: '#app',
    data() {
        return {
            dataShow: [],
            desserts: [],
            column: [{
                title: "สมาชิก",
                className: "text-left"
            }, {
                title: "รายละเอียด Warning",
                className: "text-center",
            }, {
                title: "ทำรายการโดย",
                className: "text-center",
            }, {
                title: "สถานะ",
                className: "text-center",
            }, {
                title: "สร้างวันที่",
                className: "text-center"
            }, {
                title: "อัพเดทล่าสุด",
                className: "text-center",
            }, {
                title: "#",
                className: "text-center"
            }, ],
        }
    },
    watch: {
        callAll(val) {
            // console.log(val)
        },
    },
    async mounted() {
        let resMemberWarning = callXMLHttpRequest(`${apiPort.apiQueryMemberWarning}`, {});
        console.log(resMemberWarning);
        if (resMemberWarning.statusCode === 200) {
            this.dataShow = [];
            let i = 1;
            for (let ss of resMemberWarning.data) {
                let ddd = [
                    ss.username,
                    ss.detail,
                    ss.create_by,
                    this.getStatusName(ss.status),
                    `${moment(ss.created_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                    `${moment(ss.updated_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                    `<button type="button" class="btn btn-warning btn-sm" onclick="getDetail('${ss.username}','${ss.detail}','${ss.status}')">
        			<i class="fa-regular fa-pen-to-square"></i> แก้ไขข้อมูล
        			</button>`,
                ]
                this.dataShow.push(ddd);
                this.desserts.push(ddd);
            }
        }
        await this.callAll();
    },
    methods: {
        getColorString(val) {
            if (val === 'ฝาก') {
                return `<span class="mo-bb badge rounded-pill bg-success">${val}</span>`;
            } else if (val === 'ถอน' || val === 'ยกเลิก') {
                return `<span class="mo-bb badge rounded-pill bg-danger">${val}</span>`;
            } else if (val === 'ปรับยอด') {
                return `<span class="mo-bb badge rounded-pill bg-info">${val}</span>`;
            } else if (val === 'สำเร็จ') {
                return `<span class="text-success">${val}</span>`;
            } else if (val === 'กำลังรอ') {
                return `<span class="text-warning">${val}</span>`;
            } else if (val === 'ยกเลิก') {
                return `<span class="text-danger">${val}</span>`;
            } else {
                return val;
            }
        },
        getStatusName(val) {
            if (val === 2) {
                return `<span class="badge bg-warning">เปิด Warning</span>`;
            } else {
                return `<span class="badge bg-secondary">ปิด Warning</span>`;
            }
        },
        callAll() {
            this.initDataTables(this.desserts, 'logs', this.column);
            this.hideLoader();
        },
        initDataTables(tableData, id, column) {
            $('#' + id).DataTable({
                destroy: true,
                data: tableData,
                columns: column,
                responsive: {
                    details: {
                        display: $.fn.dataTable.Responsive.display.modal({
                            header: function(row) {
                                var data = row.data()
                                return 'สมาชิก: ' + data[2]
                            }
                        }),
                        renderer: $.fn.dataTable.Responsive.renderer.tableAll({
                            tableClass: 'table'
                        })
                    }
                },
                language: {
                    "lengthMenu": "แสดงข้อมูล _MENU_ แถว",
                    "zeroRecords": "ไม่พบข้อมูลที่ต้องการ",
                    "info": "แสดงหน้า _PAGE_ จาก _PAGES_",
                    "infoEmpty": "ไม่พบข้อมูลที่ต้องการ",
                    "infoFiltered": "(filtered from _MAX_ total records)",
                    "search": 'ค้นหาสมาชิก',
                    "paginate": {
                        "previous": "ก่อนหน้านี้",
                        "next": "หน้าต่อไป"
                    }
                }
            })
        },
        numberFormat(x) {
            var parts = x.toFixed(2).split(".");
            return parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + (parts[1] ? "." + parts[1] : "");
        },
        async today() {
            await this.showLoader();
            let today = moment().format('YYYY-MM-DD');
            let resMemberWarning = callXMLHttpRequest(`${apiPort.apiQueryMemberWarning}`, { today: today });
            console.log(resMemberWarning)
            this.desserts = [];
            this.dataShow = [];
            let i = 1;
            for (let ss of resMemberWarning.data) {
                let ddd = [
                    ss.username,
                    ss.detail,
                    ss.create_by,
                    this.getStatusName(ss.status),
                    `${moment(ss.created_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                    `${moment(ss.updated_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                    `<button type="button" class="btn btn-warning btn-sm" onclick="getDetail('${ss.username}','${ss.detail}','${ss.status}')">
        			<i class="fa-regular fa-pen-to-square"></i> แก้ไขข้อมูล
        			</button>`,
                ]
                this.dataShow.push(ddd);
                this.desserts.push(ddd);
            }
            await this.callAll();
        },
        async yesterday() {
            await this.showLoader();
            let endDate = moment().subtract(1, "days").format('YYYY-MM-DD');
            let startDate = moment().subtract(1, "days").format('YYYY-MM-DD');
            let resMemberWarning = callXMLHttpRequest(`${apiPort.apiQueryMemberWarning}`, { startDate: startDate, endDate: endDate });
            console.log(resMemberWarning)
            this.desserts = [];
            this.dataShow = [];
            let i = 1;
            for (let ss of resMemberWarning.data) {
                let ddd = [
                    ss.username,
                    ss.detail,
                    ss.create_by,
                    this.getStatusName(ss.status),
                    `${moment(ss.created_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                    `${moment(ss.updated_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                    `<button type="button" class="btn btn-warning btn-sm" onclick="getDetail('${ss.username}','${ss.detail}','${ss.status}')">
        			<i class="fa-regular fa-pen-to-square"></i> แก้ไขข้อมูล
        			</button>`,
                ]
                this.dataShow.push(ddd);
                this.desserts.push(ddd);
            }
            await this.callAll();
        },
        async thisweek() {
            await this.showLoader();
            let endDate = moment().endOf('isoWeek').format('YYYY-MM-DD');
            let startDate = moment().startOf('isoWeek').format('YYYY-MM-DD');
            let resMemberWarning = callXMLHttpRequest(`${apiPort.apiQueryMemberWarning}`, { startDate: startDate, endDate: endDate });
            console.log(resMemberWarning)
            this.desserts = [];
            this.dataShow = [];
            if (resMemberWarning.statusCode === 200) {
                let i = 1;
                for (let ss of resMemberWarning.data) {
                    let ddd = [
                        ss.username,
                        ss.detail,
                        ss.create_by,
                        this.getStatusName(ss.status),
                        `${moment(ss.created_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                        `${moment(ss.updated_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                        `<button type="button" class="btn btn-warning btn-sm" onclick="getDetail('${ss.username}','${ss.detail}','${ss.status}')">
						<i class="fa-regular fa-pen-to-square"></i> แก้ไขข้อมูล
						</button>`,
                    ]
                    this.dataShow.push(ddd);
                    this.desserts.push(ddd);
                }
            }
            await this.callAll();
            // 			console.log(moment().subtract(1, 'weeks').startOf('isoWeek').format('dddd'));
            // console.log(moment().subtract(1, 'weeks').endOf('isoWeek').format('dddd'));
        },
        async lastweek() {
            await this.showLoader();
            let endDate = moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD');
            let startDate = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
            let resMemberWarning = callXMLHttpRequest(`${apiPort.apiQueryMemberWarning}`, { startDate: startDate, endDate: endDate });
            console.log(resMemberWarning)
            this.desserts = [];
            this.dataShow = [];
            if (resMemberWarning.statusCode === 200) {
                for (let ss of resMemberWarning.data) {
                    let ddd = [
                        ss.username,
                        ss.detail,
                        ss.create_by,
                        this.getStatusName(ss.status),
                        `${moment(ss.created_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                        `${moment(ss.updated_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                        `<button type="button" class="btn btn-warning btn-sm" onclick="getDetail('${ss.username}','${ss.detail}','${ss.status}')">
						<i class="fa-regular fa-pen-to-square"></i> แก้ไขข้อมูล
						</button>`,
                    ]
                    this.dataShow.push(ddd);
                    this.desserts.push(ddd);
                }
            }
            await this.callAll();
            // 			console.log(moment().subtract(1, 'weeks').startOf('isoWeek').format('dddd'));
            // console.log(moment().subtract(1, 'weeks').endOf('isoWeek').format('dddd'));
        },
        async thismonth() {
            await this.showLoader();
            let endDate = moment().endOf('month').format('YYYY-MM-DD');
            let startDate = moment().startOf('month').format('YYYY-MM-DD');
            let resMemberWarning = callXMLHttpRequest(`${apiPort.apiQueryMemberWarning}`, { startDate: startDate, endDate: endDate });
            console.log(resMemberWarning)
            this.desserts = [];
            this.dataShow = [];
            if (resMemberWarning.statusCode === 200) {
                for (let ss of resMemberWarning.data) {
                    let ddd = [
                        ss.username,
                        ss.detail,
                        ss.create_by,
                        this.getStatusName(ss.status),
                        `${moment(ss.created_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                        `${moment(ss.updated_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                        `<button type="button" class="btn btn-warning btn-sm" onclick="getDetail('${ss.username}','${ss.detail}','${ss.status}')">
						<i class="fa-regular fa-pen-to-square"></i> แก้ไขข้อมูล
						</button>`,
                    ]
                    this.dataShow.push(ddd);
                    this.desserts.push(ddd);
                }
            }
            await this.callAll();
            // 			console.log(moment().subtract(1, 'weeks').startOf('isoWeek').format('dddd'));
            // console.log(moment().subtract(1, 'weeks').endOf('isoWeek').format('dddd'));
        },
        async lastmonth() {
            await this.showLoader();
            let endDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
            let startDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
            let resMemberWarning = callXMLHttpRequest(`${apiPort.apiQueryMemberWarning}`, { startDate: startDate, endDate: endDate });
            console.log(resMemberWarning)
            this.desserts = [];
            this.dataShow = [];
            if (resMemberWarning.statusCode === 200) {
                for (let ss of resMemberWarning.data) {
                    let ddd = [
                        ss.username,
                        ss.detail,
                        ss.create_by,
                        this.getStatusName(ss.status),
                        `${moment(ss.created_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                        `${moment(ss.updated_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                        `<button type="button" class="btn btn-warning btn-sm" onclick="getDetail('${ss.username}','${ss.detail}','${ss.status}')">
						<i class="fa-regular fa-pen-to-square"></i> แก้ไขข้อมูล
						</button>`,
                    ]
                    this.dataShow.push(ddd);
                    this.desserts.push(ddd);
                }
            }
            await this.callAll();
        },
        async search() {
            await this.showLoader();
            // console.log(el('startDate').value);
            // console.log(el('endDate').value);
            let endDate = el('endDate').value;
            endDate = endDate.split('-');
            endDate = `${endDate[0] - 543}-${endDate[1]}-${endDate[2]}`;
            let startDate = el('startDate').value;
            startDate = startDate.split('-');
            startDate = `${startDate[0] - 543}-${startDate[1]}-${startDate[2]}`;
            // console.log(endDate)
            // console.log(startDate)
            // let startDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
            let resMemberWarning = callXMLHttpRequest(`${apiPort.apiQueryMemberWarning}`, { startDate: startDate, endDate: endDate });
            console.log(resMemberWarning)
            this.desserts = [];
            this.dataShow = [];
            if (resMemberWarning.statusCode === 200) {
                for (let ss of resMemberWarning.data) {
                    let ddd = [
                        ss.username,
                        ss.detail,
                        ss.create_by,
                        this.getStatusName(ss.status),
                        `${moment(ss.created_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                        `${moment(ss.updated_at).format('YYYY/MM/DD-HH:mm:ss')}`,
                        `<button type="button" class="btn btn-warning btn-sm" onclick="getDetail('${ss.username}','${ss.detail}','${ss.status}')">
						<i class="fa-regular fa-pen-to-square"></i> แก้ไขข้อมูล
						</button>`,
                    ]
                    this.dataShow.push(ddd);
                    this.desserts.push(ddd);
                }
            }
            await this.callAll();
        },
        swalmsg(msg) {
            Swal.fire({
                icon: 'error',
                title: 'แจ้งเตือน...',
                text: `${msg}`,
            }).then((result) => {});
        },
        addWarning() {
            $('#add_warning').modal('show');
        },
        async sendWarning() {
            let user = $('#add_username').val();
            let detail = $('#add_detail').val();
            if (user === '' || detail === '') {
                this.swalmsg('กรุณาใส่ข้อมูลให้ครบถ้วน');
                return
            }
            let checkUser = await callXMLHttpRequest(`${apiPort.apiQueryMemberByUser}`, { user: user });
            if (checkUser.statusCode === 200) {
                if (checkUser.data) {
                    let addWaring = await callXMLHttpRequest(`${apiPort.apiQueryAddWarning}`, { user: user, detail_warning: detail });
                    console.log(addWaring)
                    if (addWaring.statusCode === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'สำเร็จ',
                            text: `เพิ่มข้อมูลเรียบร้อย`,
                        }).then((result) => {
                            window.location.reload();
                        });
                    }
                } else {
                    this.swalmsg('ไม่พบข้อมูลผู้ใช้');
                }
            } else {
                this.swalmsg('ไม่พบข้อมูลผู้ใช้');
            }

        },
        async updateWarning() {
            let user = $('#update_username').val();
            let detail = $('#update_detail').val();
            let selected = $('#selectStatus').val();
            if (user === '' || detail === '') {
                this.swalmsg('กรุณาใส่ข้อมูลให้ครบถ้วน');
                return
            }
            let addWaring = await callXMLHttpRequest(`${apiPort.apiQueryUpdateWarning}`, { user: user, detail_warning: detail, update_status: selected });
            console.log(addWaring)
            if (addWaring.statusCode === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: `อัพเดทข้อมูลเรียบร้อย`,
                }).then((result) => {
                    window.location.reload();
                });
            }

        },
        async showLoader() {
            $(".loaderbg").fadeIn();
            await this.delay();
        },
        async hideLoader() {
            $(".loaderbg").fadeOut("slow");
            await this.delay();
        },
        async delay(ms = 500) {
            return new Promise((r) => setTimeout(r, ms));
        }
    },

});