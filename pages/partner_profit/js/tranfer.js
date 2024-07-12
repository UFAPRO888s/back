// const idTbody = "#tbodyPartnerProfit";
// const idTable = "#tableParnerProfile";
// const idFrom = "#formSubmit";

var yearL = new Date().getFullYear();
var leap = (yearL % 4 == 0 && yearL % 100 != 0) || yearL % 400 == 0 ? 2 : 3;
var date = new Date();
var day = date.getDate();
var month = date.getMonth("m") + 1;
var year = date.getFullYear();
var hours = date.getHours();
var minutes = date.getMinutes();

$(document).ready(async function() {
    await setDate('startDate', moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD'));
    await setDate('endDate', moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD'));
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

// function handleSearchDate(dateType) {
//     const d = new Date();
//     let day = d.getDate();
//     let month = String(d.getMonth() + 1).padStart(2, '0');
//     let year = d.getFullYear();
//     let startDate, endDate

//     switch (dateType) {
//         case "day":
//             startDate = day + '/' + month + '/' + year
//             endDate = startDate
//             break;
//         case "yesterday":
//             let dayYes = dayjs().add(-1, 'day')
//             startDate = dayYes.format('DD/MM/YYYY')
//             endDate = startDate
//             break;
//         case "week":
//             let dayWeek = dayjs().add(-7, 'day')
//             startDate = dayWeek.format('DD/MM/YYYY')
//             endDate = dayjs().format('DD/MM/YYYY')
//             break;
//         case "lastweek":
//             let dayLastWeek = dayjs().add(-14, 'day')
//             startDate = dayLastWeek.format('DD/MM/YYYY')
//             endDate = dayjs().format('DD/MM/YYYY')
//             break;
//         case "month":
//             let dayMonth = dayjs().daysInMonth()
//             startDate = dayjs(year + '-' + month + '-01').format('DD/MM/YYYY')
//             endDate = dayjs(year + '-' + month + '-' + dayMonth).format('DD/MM/YYYY')
//             break;
//         case "lastmonth":
//             let dayLastMonth = dayjs().add(-1, 'month')
//             let month2 = dayLastMonth.format('MM')
//             let dayLastMonth2 = dayLastMonth.daysInMonth()
//             startDate = dayjs(year + '-' + month2 + '-01').format('DD/MM/YYYY')
//             endDate = dayjs(year + '-' + month2 + '-' + dayLastMonth2).format('DD/MM/YYYY')
//             break;
//     }

//     handleRenderContent({ startDate, endDate })

// }

// function handleRenderContent(reqData) {
//     const fromArr = $(idFrom).serializeArray();
//     let data = genObjectSerializeArray(fromArr);

//     if (reqData) { data = reqData }

//     data.startDate = convertTHDateNoTime(data.startDate);
//     data.endDate = convertTHDateNoTime(data.endDate);

//     let result = callXMLHttpRequest(`${apiPort.apiMemberPartnerList}`, data);
//     if (result.statusCodeText == textRespone.ok.CodeText && result.data) {
//         $(idTbody).children().remove();
//         result.data.forEach((item) => {
//             let txt = `
//         <tr>
//         <td>${item.name_member}</td>
//         <td>${item.name_partner}</td>
//         <td>${item.count_member}</td>
//         <td>${item.percent_lotto}%</td>
//         <td>${numberFormat(item.count_amount)}</td>
//         <td>${numberFormat(item.count_aff)}</td>
//         <td>${numberFormat(item.wl)}</td>
// 		<td>${numberFormat(item.sumall)}</td>  
//         <td>${item.percent_game}%</td>
//         <td>${numberFormat(item.count_turnover_game)}</td>
//         <td>${numberFormat(item.count_aff_game)}</td>
//         <td>${numberFormat(item.count_wl_game)}</td>
//         <td>${numberFormat(item.sumall_game)}</td>
//         </tr>
//         `;
//             $(idTbody).append(txt);
//         });

//         $(idTable).DataTable().destroy();
//         $(idTable).DataTable({
//             dom: "Bfrtip",
//             buttons: ["excel"],
//         });
//     } else {
//         handleApiFaild(result);
//     }
// }

var app = new Vue({
    el: '#app',
    data() {
        return {
            btnBack: false,
            dataShow: [],
            desserts: [],
            idTbody: "#tbodyPartnerProfit",
            idTable: "#tableParnerProfile",
            idFrom: "#formSubmit",
            totalPage: 0,
            pagedata: [],
            sDate: '',
            eDate: '',
            levelPartner: 'Senior',
            partNer: 1,
            page: 1,
            lengthPage: 1,
            chunk: [],
            endDate: moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD'),
            startDate: moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD')
        }
    },
    async mounted() {
        $('#table-show').show();
        await this.callAll()
            // let resTransactionAll = callXMLHttpRequest(`${apiPort.apiQueryTransactionAll}`, { state: { game: stsUFA, lotto: stsLotto } });
            // console.log(resTransactionAll);
            // if (resTransactionAll.statusCode === 200) {
            //     this.dataShow = [];
            //     let i = 1;
            //     for (let ss of resTransactionAll.data) {
            //         let ddd = [
            //             ss.user,
            //             ss.type,
            //             `${moment(ss.date).format('YYYY/MM/DD-HH:mm:ss')}`,
            //             this.numberFormat(ss.amount),
            //             ss.wl ? this.getcolorNumber(ss.wl) : '-',
            //             this.getColorString(ss.state),
            //             `<button type="button" class="btn btn-info btn-sm" onclick="getDetail('${ss.find}','${ss.mode}','${ss.user}')">
            // 			<i class="fa fa-info-circle"></i> รายละเอียด
            // 			</button>`,
            //         ]
            //         this.dataShow.push(ddd);
            //         this.desserts.push(ddd);
            //     }
            // }
            // await this.callAll();
    },
    watch: {
        partNer(val) {
            if (val == 1) {
                this.levelPartner = 'Senior'
            } else if (val == 2) {
                this.levelPartner = 'Master'
            } else if (val == 3) {
                this.levelPartner = 'Agent'
            } else {
                this.levelPartner = 'SubAgent'
            }
        },
        page(val) {
            this.dataShow = this.chunk[val - 1];
        },
    },
    methods: {
        async callAll() {
            await this.showLoader()
            this.page = 1
            this.chunk = [];
            this.btnBack = false
            this.partNer = 1
            this.dataShow = [];
            this.sDate = this.startDate;
            this.eDate = this.endDate;
            let data = {
                partner: this.partNer,
                startDate: this.startDate,
                endDate: this.endDate
            };
            let result = await callXMLHttpRequest(`${apiPort.apiMemberPartnerListYod}`, data);
            if (result.statusCodeText == textRespone.ok.CodeText && result.data) {
                // console.log(result.data)
                const chunkSize = 10;
                for (let i = 0; i < result.data.length; i += chunkSize) {
                    this.chunk.push(result.data.slice(i, i + chunkSize));
                }

                this.dataShow = this.chunk[this.page - 1];
                this.calPage(result.data.length);
            } else {
                handleApiFaild(result);
            }
            this.hideLoader()
        },
        async callMaster() {
            await this.showLoader()
            this.page = 1
            this.chunk = [];
            this.btnBack = false
            this.partNer = 2
            this.dataShow = [];
            this.sDate = this.startDate;
            this.eDate = this.endDate;
            let data = {
                partner: this.partNer,
                startDate: this.startDate,
                endDate: this.endDate
            };
            let result = await callXMLHttpRequest(`${apiPort.apiMemberPartnerList}`, data);
            if (result.statusCodeText == textRespone.ok.CodeText && result.data) {
                // console.log(result.data)
                const chunkSize = 10;
                for (let i = 0; i < result.data.length; i += chunkSize) {
                    this.chunk.push(result.data.slice(i, i + chunkSize));
                }

                this.dataShow = this.chunk[this.page - 1];
                this.calPage(result.data.length);
            } else {
                handleApiFaild(result);
            }
            this.hideLoader()
        },
        async callAgent() {
            await this.showLoader()
            this.page = 1
            this.chunk = [];
            this.btnBack = false
            this.partNer = 3
            this.dataShow = [];
            this.sDate = this.startDate;
            this.eDate = this.endDate;
            let data = {
                partner: this.partNer,
                startDate: this.startDate,
                endDate: this.endDate
            };
            let result = await callXMLHttpRequest(`${apiPort.apiMemberPartnerList}`, data);
            if (result.statusCodeText == textRespone.ok.CodeText && result.data) {
                // console.log(result.data)
                const chunkSize = 10;
                for (let i = 0; i < result.data.length; i += chunkSize) {
                    this.chunk.push(result.data.slice(i, i + chunkSize));
                }

                this.dataShow = this.chunk[this.page - 1];
                this.calPage(result.data.length);
            } else {
                handleApiFaild(result);
            }
            this.hideLoader()
        },
        async callSubAgent() {
            await this.showLoader()
            this.page = 1
            this.chunk = [];
            this.btnBack = false
            this.partNer = 4
            this.dataShow = [];
            this.sDate = this.startDate;
            this.eDate = this.endDate;
            let data = {
                partner: this.partNer,
                startDate: this.startDate,
                endDate: this.endDate
            };
            let result = await callXMLHttpRequest(`${apiPort.apiMemberPartnerList}`, data);
            if (result.statusCodeText == textRespone.ok.CodeText && result.data) {
                // console.log(result.data)
                const chunkSize = 10;
                for (let i = 0; i < result.data.length; i += chunkSize) {
                    this.chunk.push(result.data.slice(i, i + chunkSize));
                }

                this.dataShow = this.chunk[this.page - 1];
                this.calPage(result.data.length);
            } else {
                handleApiFaild(result);
            }
            this.hideLoader()
        },
        callWithPartner(partner) {
            this.btnBack = true
            this.dataShow = [];
            let endDate = this.eDate
            let startDate = this.sDate;
            let data = {
                partner: partner,
                startDate: this.startDate,
                endDate: this.endDate
            };
            let result = callXMLHttpRequest(`${apiPort.apiMemberPartnerList}`, data);
            if (result.statusCodeText == textRespone.ok.CodeText && result.data) {
                this.dataShow = result.data
            } else {
                handleApiFaild(result);
            }
        },
        calPage(val) {
            this.pagedata = []
            if (val <= 10) {
                this.pagedata = [{
                    show: 'page-item disabled',
                    name: 'ก่อนหน้านี้',
                    page: 1
                }, {
                    show: 'page-item active',
                    name: 1,
                    page: 1
                }, {
                    show: 'page-item disabled',
                    name: 'หน้าถัดไป',
                    page: 1
                }];
            } else {
                let totalPage = Math.ceil(val / 10);
                this.pagedata.push({
                    show: 'page-item',
                    name: 'ก่อนหน้านี้',
                    page: 1
                })
                for (let index = 1; index <= totalPage; index++) {
                    this.pagedata.push({
                        show: (this.page == index) ? 'page-item' : 'page-item',
                        name: index,
                        page: index
                    })
                }
                this.pagedata.push({
                    show: 'page-item disabled',
                    name: 'หน้าถัดไป',
                    page: 1
                })
            }
        },
        getChunk(val) {
            this.page = val
            this.dataShow = this.chunk[val - 1];
            for (let index = 1; index < this.pagedata.length; index++) {
                if (index === (val)) {
                    this.pagedata[index].show = 'page-item active'
                } else {
                    this.pagedata[index].show = 'page-item'
                }

            }
            // console.log(this.pagedata[val].show = 'page-item active')
        },
        initDataTables() {
            $(this.idTable).DataTable({
                "autoWidth": false,
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
            var parts = x.toFixed(2).split(".");
            return parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + (parts[1] ? "." + parts[1] : "");
        },
        async today() {
            await this.showLoader()
            this.chunk = [];
            this.btnBack = false
            this.startDate = moment().format('YYYY-MM-DD');
            this.endDate = moment().format('YYYY-MM-DD');
            this.sDate = this.startDate;
            this.eDate = this.endDate;
            this.btnBack = false
            this.dataShow = [];
            let data = {
                partner: this.partNer,
                startDate: this.startDate,
                endDate: this.endDate
            };
            let result = await callXMLHttpRequest(`${apiPort.apiMemberPartnerList}`, data);
            if (result.statusCodeText == textRespone.ok.CodeText && result.data) {
                // console.log(result.data)
                const chunkSize = 10;
                for (let i = 0; i < result.data.length; i += chunkSize) {
                    this.chunk.push(result.data.slice(i, i + chunkSize));
                }

                this.dataShow = this.chunk[this.page - 1];
                this.calPage(result.data.length);
            } else {
                handleApiFaild(result);
            }
            this.hideLoader()
        },
        async yesterday() {
            await this.showLoader()
            this.chunk = [];
            this.btnBack = false
            this.endDate = moment().subtract(1, "days").format('YYYY-MM-DD');
            this.startDate = moment().subtract(1, "days").format('YYYY-MM-DD');
            this.sDate = this.startDate;
            this.eDate = this.endDate;
            this.btnBack = false
            this.dataShow = [];
            let data = {
                partner: this.partNer,
                startDate: this.startDate,
                endDate: this.endDate
            };
            let result = await callXMLHttpRequest(`${apiPort.apiMemberPartnerList}`, data);
            if (result.statusCodeText == textRespone.ok.CodeText && result.data) {
                // console.log(result.data)
                const chunkSize = 10;
                for (let i = 0; i < result.data.length; i += chunkSize) {
                    this.chunk.push(result.data.slice(i, i + chunkSize));
                }

                this.dataShow = this.chunk[this.page - 1];
                this.calPage(result.data.length);
            } else {
                handleApiFaild(result);
            }
            this.hideLoader()
        },
        async thisweek() {
            await this.showLoader()
            this.chunk = [];
            this.btnBack = false
            this.endDate = moment().endOf('isoWeek').format('YYYY-MM-DD');
            this.startDate = moment().startOf('isoWeek').format('YYYY-MM-DD');
            this.sDate = this.startDate;
            this.eDate = this.endDate;
            this.btnBack = false
            this.dataShow = [];
            let data = {
                partner: this.partNer,
                startDate: this.startDate,
                endDate: this.endDate
            };
            let result = await callXMLHttpRequest(`${apiPort.apiMemberPartnerList}`, data);
            if (result.statusCodeText == textRespone.ok.CodeText && result.data) {
                // console.log(result.data)
                const chunkSize = 10;
                for (let i = 0; i < result.data.length; i += chunkSize) {
                    this.chunk.push(result.data.slice(i, i + chunkSize));
                }

                this.dataShow = this.chunk[this.page - 1];
                this.calPage(result.data.length);
            } else {
                handleApiFaild(result);
            }
            this.hideLoader()
        },
        async lastweek() {
            await this.showLoader()
            this.chunk = [];
            this.btnBack = false
            this.endDate = moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD');
            this.startDate = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
            this.sDate = this.startDate;
            this.eDate = this.endDate;
            this.btnBack = false
            this.dataShow = [];
            let data = {
                partner: this.partNer,
                startDate: this.startDate,
                endDate: this.endDate
            };
            let result = await callXMLHttpRequest(`${apiPort.apiMemberPartnerList}`, data);
            if (result.statusCodeText == textRespone.ok.CodeText && result.data) {
                // console.log(result.data)
                const chunkSize = 10;
                for (let i = 0; i < result.data.length; i += chunkSize) {
                    this.chunk.push(result.data.slice(i, i + chunkSize));
                }

                this.dataShow = this.chunk[this.page - 1];
                this.calPage(result.data.length);
            } else {
                handleApiFaild(result);
            }
            this.hideLoader()
        },
        async thismonth() {
            await this.showLoader()
            this.chunk = [];
            this.btnBack = false
            this.endDate = moment().endOf('month').format('YYYY-MM-DD');
            this.startDate = moment().startOf('month').format('YYYY-MM-DD');
            this.sDate = this.startDate;
            this.eDate = this.endDate;
            this.btnBack = false
            this.dataShow = [];
            let data = {
                partner: this.partNer,
                startDate: this.startDate,
                endDate: this.endDate
            };
            let result = await callXMLHttpRequest(`${apiPort.apiMemberPartnerList}`, data);
            if (result.statusCodeText == textRespone.ok.CodeText && result.data) {
                // console.log(result.data)
                const chunkSize = 10;
                for (let i = 0; i < result.data.length; i += chunkSize) {
                    this.chunk.push(result.data.slice(i, i + chunkSize));
                }

                this.dataShow = this.chunk[this.page - 1];
                this.calPage(result.data.length);
            } else {
                handleApiFaild(result);
            }
            this.hideLoader()
        },
        async lastmonth() {
            await this.showLoader()
            this.chunk = [];
            this.btnBack = false
            this.endDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
            this.startDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
            this.sDate = this.startDate;
            this.eDate = this.endDate;
            this.btnBack = false
            this.dataShow = [];
            let data = {
                partner: this.partNer,
                startDate: this.startDate,
                endDate: this.endDate
            };
            let result = await callXMLHttpRequest(`${apiPort.apiMemberPartnerList}`, data);
            if (result.statusCodeText == textRespone.ok.CodeText && result.data) {
                // console.log(result.data)
                const chunkSize = 10;
                for (let i = 0; i < result.data.length; i += chunkSize) {
                    this.chunk.push(result.data.slice(i, i + chunkSize));
                }

                this.dataShow = this.chunk[this.page - 1];
                this.calPage(result.data.length);
            } else {
                handleApiFaild(result);
            }
            this.hideLoader()
        },
        async search() {
            await this.showLoader()
            this.chunk = [];
            this.btnBack = false
            let endDate = el('endDate').value;
            endDate = endDate.split('-');
            endDate = `${endDate[0] - 543}-${endDate[1]}-${endDate[2]}`;
            let startDate = el('startDate').value;
            startDate = startDate.split('-');
            startDate = `${startDate[0] - 543}-${startDate[1]}-${startDate[2]}`;
            this.sDate = this.startDate;
            this.eDate = this.endDate;
            this.btnBack = false
            this.dataShow = [];
            let data = {
                partner: this.partNer,
                startDate: this.startDate,
                endDate: this.endDate
            };
            let result = await callXMLHttpRequest(`${apiPort.apiMemberPartnerList}`, data);
            if (result.statusCodeText == textRespone.ok.CodeText && result.data) {
                // console.log(result.data)
                const chunkSize = 10;
                for (let i = 0; i < result.data.length; i += chunkSize) {
                    this.chunk.push(result.data.slice(i, i + chunkSize));
                }

                this.dataShow = this.chunk[this.page - 1];
                this.calPage(result.data.length);
            } else {
                handleApiFaild(result);
            }
            this.hideLoader()
        },
        showError() {
            Swal.fire({
                title: 'แจ้งเตือน',
                text: 'ยังไม่พร้อมใช้งาน',
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
            }).then((result) => {});
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