$(document).ready(async function() {
    await setDate('startDate', moment().format('YYYY-MM-DD'));
    await setDate('endDate', moment().format('YYYY-MM-DD'));
    hideLoader();
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
    var parts = parseFloat(x).toFixed(2).split(".");
    return parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + (parts[1] ? "." + parts[1] : "");
}

async function getDetail(find, mode, user) {
    await showLoader()
    if (mode === 'transection') {
        // console.log(find)
        let resTransactionId = await callXMLHttpRequest(`${apiPort.apiQueryTransactionWithId}`, { transection: find });
        // console.log(resTransactionId)
        if (resTransactionId.statusCode === 200) {

            let rr = resTransactionId.data;
            if (rr.type === '1') {
                rr.type = `<span class="mo-bb badge bg-success">ฝากเงิน</span>`;
            } else if (rr.type === '2') {
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
            $('#tran_username').html(rr.member_username)
            $('#tran_date').html(moment(rr.created_at).format('YYYY-MM-DD HH:mm:ss'))
            $('#tran_name').html(rr.name)
            $('#tran_amount').html(numberFormat(rr.amount))
            $('#tran_type').html(rr.type)
            $('#tran_state').html(rr.stats) //tran_desciption
            let txt = `ทำรายการโดย - ${rr.created_by ? rr.created_by: 'ไม่พบข้อมูล'} || ${rr.remark} <br>`;
            txt += `${rr.response_api}`;
            $('#tran_desciption').html(txt)
            $('#detail_transection').modal()
        }

    } else if (mode === 'game') {
        let resRefnoId = await callXMLHttpRequest(`${apiPort.apiQueryTransactionGameWithId}`, { refno: find });
        // console.log(resTransactionId)
        if (resRefnoId.statusCode === 200) {

            let rr = resRefnoId.data;
            if (rr.state === 'won') {
                rr.state = `<span class="mo-bb text-warning">ชนะ</span>`;
            } else if (rr.state === 'lost') {
                rr.state = `<span class="mo-bb text-danger">แพ้</span>`;
            } else {
                rr.state = `<span class="mo-bb text-info">เสมอ</span>`;
            }
            if (rr.winloss < 0) {
                rr.winloss = `<span class="mo-bb text-danger">${numberFormat(rr.winloss)}</span>`;
            } else if (rr.winloss > 0) {
                rr.winloss = `<span class="mo-bb text-success">${numberFormat(rr.winloss)}</span>`;
            } else {
                rr.winloss = `<span class="mo-bb text-light">${numberFormat(rr.winloss)}</span>`;
            }
            $('#game_username').html(rr.member_username)
            $('#game_date').html(moment(rr.date).format('YYYY-MM-DD HH:mm:ss'))
            $('#game_name').html(rr.name)
            $('#game_amount').html(numberFormat(rr.bet))
            $('#game_type').html(rr.mode)
            $('#game_game').html(rr.game)
            $('#game_wl').html(rr.winloss)
            $('#game_state').html(rr.state) //tran_desciption
            let txt = `${rr.detail}`;
            $('#game_desciption').html(txt.replace(/\r\n/g, "<br>"))
            $('#detail_game').modal()
        }

    } else if (mode === 'lotto') {
        let resOrderId = await callXMLHttpRequest(`${apiPort.apiQueryTransactionLottoWithId}`, { user: user, orderId: find });
        // console.log(resOrderId)
        // console.log(resOrderId.statusCode)
        if (resOrderId.statusCode === 200) {

            let rr = resOrderId.data;
            let datauser = resOrderId.user.result[0];
            let txt = '';
            let sum_aomunt = 0;
            let sum_wl = 0;
            let datetime = '';
            for (const r of rr) {
                datatime = r.date_time_add;
                txt += `<tr>`;
                sum_aomunt = r.amount + sum_aomunt;
                txt += `<td class="text-center">${r.group_name}:${r.lotto_name}</td>`;
                txt += `<td class="text-center">${r.description}</td>`;
                txt += `<td class="text-center">${r.numbers}</td>`;
                txt += `<td class="text-center">${numberFormat(r.amount)}</td>`;
                if (r.winner_flg === 0) {
                    txt += `<td class="text-center">${numberFormat(r.amount * -1)}</td>`;
                    txt += `<td class="text-center text-danger">ไม่ถูกรางวัล</td>`;
                    sum_wl = (r.amount * -1) + sum_wl;
                } else {
                    txt += `<td>${numberFormat(r.winner_amount)}</td>`;
                    txt += `<td class="text-center text-success">ถูกรางวัล</td>`;
                    sum_wl = r.winner_amount + sum_wl;
                }
                txt += `</tr>`;
            }
            $('#data_lotto').html(txt)
            $('#sum_amount').html(numberFormat(sum_aomunt))
            $('#sum_wl').html(numberFormat(sum_wl))
            $('#lotto_username').html(datauser.username)
            $('#lotto_name').html(datauser.name)
            $('#lotto_date').html(moment(datatime).format('YYYY-MM-DD HH:mm:ss'))
            $('#detail_lotto').modal()
        }

    } else {

    }
    hideLoader()
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
                title: "ประเภทธุรกรรม",
                className: "text-center",
                render(data, type, row) {
                    if (data === 'ฝาก') {
                        return `<span class="mo-bb badge rounded-pill bg-success">${data}</span>`;
                    } else if (data === 'ถอน') {
                        return `<span class="mo-bb badge rounded-pill bg-danger">${data}</span>`;
                    } else if (data === 'ปรับยอด') {
                        return `<span class="mo-bb badge rounded-pill bg-info">${data}</span>`;
                    } else {
                        return `<span class="mo-bb badge rounded-pill bg-light">${data}</span>`;
                    }
                }
            }, {
                title: "วันที่",
                className: "text-center"
            }, {
                title: "จำนวนเงิน",
                className: "text-right"
            }, {
                title: "ยอดแพ้ชนะ",
                className: "text-right",
            }, {
                title: "สถานะ",
                className: "text-center"
            }, {
                title: "รายละเอียด",
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
        let startDate = moment().format('YYYY-MM-DD');
        let endDate = moment().format('YYYY-MM-DD');
        let resTransactionAll = await callXMLHttpRequest(`${apiPort.apiQueryTransactionAll}`, { state: { game: stsUFA, lotto: stsLotto }, startDate: startDate, endDate: endDate });
        // console.log(resTransactionAll);
        if (resTransactionAll.statusCode === 200) {
            this.dataShow = [];
            let i = 1;
            for (let ss of resTransactionAll.data) {
                let ddd = [
                    ss.user,
                    ss.type,
                    `${moment(ss.date).format('YYYY/MM/DD HH:mm:ss')}`,
                    this.numberFormat(ss.amount),
                    ss.wl ? this.getcolorNumber(ss.wl) : '-',
                    this.getColorString(ss.state),
                    `<button type="button" class="btn btn-info btn-sm" onclick="getDetail('${ss.find}','${ss.mode}','${ss.user}')">
					<i class="fa fa-info-circle"></i> รายละเอียด
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
        getcolorNumber(val) {
            if (val < 0) {
                return `<span class="text-red">${this.numberFormat(val)}</span>`;
            } else if (val > 0) {
                return `<span class="text-green">${this.numberFormat(val)}</span>`;
            } else {
                return val;
            }
        },
        callAll() {
            this.initDataTables(this.desserts, 'logs', this.column);
            this.hideLoader();
        },
        callDeposit() {
            this.dataShow = [];
            for (const ss of this.desserts) {
                if (ss[1] === 'ฝาก') {
                    this.dataShow.push(ss)
                }
            }
            this.initDataTables(this.dataShow, 'logs', this.column)
        },
        callWithdraw() {
            this.dataShow = []
            for (const ss of this.desserts) {
                if (ss[1] === 'ถอน') {
                    this.dataShow.push(ss)
                }
            }
            this.initDataTables(this.dataShow, 'logs', this.column)
        },
        callWinloss() {
            this.dataShow = []
            for (const ss of this.desserts) {
                if (ss[1] === 'game' || ss[1] === 'lotto') {
                    this.dataShow.push(ss)
                }
            }
            this.initDataTables(this.dataShow, 'logs', this.column)
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
        randomDate(start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        },
        generateRandomDecimalInRangeFormatted(min, max, places) {
            let value = (Math.random() * (max - min + 1)) + min;
            return Number.parseFloat(value).toFixed(places);
        },
        filterOnlyCapsText(value, search, item) {
            return value != null &&
                search != null &&
                typeof value === 'string' &&
                value.toString().toLocaleUpperCase().indexOf(search) !== -1
        },
        numberFormat(x) {
            var parts = parseFloat(x).toFixed(2).split(".");
            return parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + (parts[1] ? "." + parts[1] : "");
        },
        async today() {
            await this.showLoader();
            let startDate = moment().format('YYYY-MM-DD');
            let endDate = moment().format('YYYY-MM-DD');
            let resTransactionAll = await callXMLHttpRequest(`${apiPort.apiQueryTransactionAll}`, { state: { game: stsUFA, lotto: stsLotto }, startDate: startDate, endDate: endDate });

            this.desserts = [];
            this.dataShow = [];
            let i = 1;
            for (let ss of resTransactionAll.data) {
                let ddd = [
                    ss.user,
                    ss.type,
                    `${moment(ss.date).format('YYYY/MM/DD HH:mm:ss')}`,
                    this.numberFormat(ss.amount),
                    ss.wl ? this.getcolorNumber(ss.wl) : '-',
                    this.getColorString(ss.state),
                    `<button type="button" class="btn btn-info btn-sm" onclick="getDetail('${ss.find}','${ss.mode}','${ss.user}')">
					<i class="fa fa-info-circle"></i> รายละเอียด
					</button>`
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
            let resTransactionAll = await callXMLHttpRequest(`${apiPort.apiQueryTransactionAll}`, { state: { game: stsUFA, lotto: stsLotto }, startDate: startDate, endDate: endDate });

            this.desserts = [];
            this.dataShow = [];
            let i = 1;
            for (let ss of resTransactionAll.data) {
                let ddd = [
                    ss.user,
                    ss.type,
                    `${moment(ss.date).format('YYYY/MM/DD HH:mm:ss')}`,
                    this.numberFormat(ss.amount),
                    ss.wl ? this.getcolorNumber(ss.wl) : '-',
                    this.getColorString(ss.state),
                    `<button type="button" class="btn btn-info btn-sm" onclick="getDetail('${ss.find}','${ss.mode}','${ss.user}')">
					<i class="fa fa-info-circle"></i> รายละเอียด
					</button>`
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
            let resTransactionAll = await callXMLHttpRequest(`${apiPort.apiQueryTransactionAll}`, { state: { game: stsUFA, lotto: stsLotto }, startDate: startDate, endDate: endDate });

            if (resTransactionAll.statusCode === 200) {
                this.desserts = [];
                this.dataShow = [];
                let i = 1;
                for (let ss of resTransactionAll.data) {
                    let ddd = [
                        ss.user,
                        ss.type,
                        `${moment(ss.date).format('YYYY/MM/DD HH:mm:ss')}`,
                        this.numberFormat(ss.amount),
                        ss.wl ? this.getcolorNumber(ss.wl) : '-',
                        this.getColorString(ss.state),
                        `<button type="button" class="btn btn-info btn-sm" onclick="getDetail('${ss.find}','${ss.mode}','${ss.user}')">
					<i class="fa fa-info-circle"></i> รายละเอียด
					</button>`
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
            let resTransactionAll = await callXMLHttpRequest(`${apiPort.apiQueryTransactionAll}`, { state: { game: stsUFA, lotto: stsLotto }, startDate: startDate, endDate: endDate });

            if (resTransactionAll.statusCode === 200) {
                this.desserts = [];
                this.dataShow = [];
                let i = 1;
                for (let ss of resTransactionAll.data) {
                    let ddd = [
                        ss.user,
                        ss.type,
                        `${moment(ss.date).format('YYYY/MM/DD HH:mm:ss')}`,
                        this.numberFormat(ss.amount),
                        ss.wl ? this.getcolorNumber(ss.wl) : '-',
                        this.getColorString(ss.state),
                        `<button type="button" class="btn btn-info btn-sm" onclick="getDetail('${ss.find}','${ss.mode}','${ss.user}')">
					<i class="fa fa-info-circle"></i> รายละเอียด
					</button>`
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
            let resTransactionAll = await callXMLHttpRequest(`${apiPort.apiQueryTransactionAll}`, { state: { game: stsUFA, lotto: stsLotto }, startDate: startDate, endDate: endDate });

            if (resTransactionAll.statusCode === 200) {
                this.desserts = [];
                this.dataShow = [];
                let i = 1;
                for (let ss of resTransactionAll.data) {
                    let ddd = [
                        ss.user,
                        ss.type,
                        `${moment(ss.date).format('YYYY/MM/DD HH:mm:ss')}`,
                        this.numberFormat(ss.amount),
                        ss.wl ? this.getcolorNumber(ss.wl) : '-',
                        this.getColorString(ss.state),
                        `<button type="button" class="btn btn-info btn-sm" onclick="getDetail('${ss.find}','${ss.mode}','${ss.user}')">
					<i class="fa fa-info-circle"></i> รายละเอียด
					</button>`
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
            let resTransactionAll = await callXMLHttpRequest(`${apiPort.apiQueryTransactionAll}`, { state: { game: stsUFA, lotto: stsLotto }, startDate: startDate, endDate: endDate });

            if (resTransactionAll.statusCode === 200) {
                this.desserts = [];
                this.dataShow = [];
                let i = 1;
                for (let ss of resTransactionAll.data) {
                    let ddd = [
                        ss.user,
                        ss.type,
                        `${moment(ss.date).format('YYYY/MM/DD HH:mm:ss')}`,
                        this.numberFormat(ss.amount),
                        ss.wl ? this.getcolorNumber(ss.wl) : '-',
                        this.getColorString(ss.state),
                        `<button type="button" class="btn btn-info btn-sm" onclick="getDetail('${ss.find}','${ss.mode}','${ss.user}')">
					<i class="fa fa-info-circle"></i> รายละเอียด
					</button>`
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
            let resTransactionAll = await callXMLHttpRequest(`${apiPort.apiQueryTransactionAll}`, { state: { game: stsUFA, lotto: stsLotto }, startDate: startDate, endDate: endDate });

            if (resTransactionAll.statusCode === 200) {
                this.desserts = [];
                this.dataShow = [];
                let i = 1;
                for (let ss of resTransactionAll.data) {
                    let ddd = [
                        ss.user,
                        ss.type,
                        `${moment(ss.date).format('YYYY/MM/DD HH:mm:ss')}`,
                        this.numberFormat(ss.amount),
                        ss.wl ? this.getcolorNumber(ss.wl) : '-',
                        this.getColorString(ss.state),
                        `<button type="button" class="btn btn-info btn-sm" onclick="getDetail('${ss.find}','${ss.mode}','${ss.user}')">
					<i class="fa fa-info-circle"></i> รายละเอียด
					</button>`
                    ]
                    this.dataShow.push(ddd);
                    this.desserts.push(ddd);
                }
            }
            await this.callAll();
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