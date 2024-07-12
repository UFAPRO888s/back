const idTable = "tableReferalBonus";
const idFrom = "#formSubmit";

var yearL = new Date().getFullYear();
var leap = (((yearL % 4 == 0) && (yearL % 100 != 0)) || (yearL % 400 == 0)) ? 2 : 3;
var date = new Date();
var day = date.getDate();
var month = date.getMonth('m')
var year = date.getFullYear();
var hours = date.getHours();
var minutes = date.getMinutes();

$(document).ready(async function() {

    // $('.date-picker').datetimepicker({
    //     value: day + '/' + month + '/' + year + " " + hours + ":" + minutes,
    //     timepicker: false,
    //     format: 'd/m/Y H:i',
    //     lang: 'th',
    //     dayOfWeekStart: leap,
    //     timepicker: true
    // });


    await setDate('startDate', moment().format('YYYY-MM-DD'));
    await setDate('endDate', moment().format('YYYY-MM-DD'));
    await handleDataTable();
    hideLoader()
});

function setDate(id, date) {
    const datePicker = MCDatepicker.create({
        el: '#' + id,
        bodyType: 'modal', //modal,inline
        disableWeekends: false,
        dateFormat: 'dd/mm/yyyy',
        customWeekDays: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
        customMonths: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฏาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
        closeOndblclick: true,
        autoClose: true,
        selectedDate: new Date()
    });
    date = date.split('-');
    let year = parseInt(date[0]);
    date = `${date[2]}/${date[1]}/${year}`;

    el(id).value = date;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function handleDataTable() {
    await showLoader()
    const fromArr = $(idFrom).serializeArray();
    const checkAll = $("#checkAll").prop('checked');
    const checkLotto = $("#checkLotto").prop('checked');
    const checkGame = $("#checkGame").prop('checked');

    let data = genObjectSerializeArray(fromArr)
    data.checkAll = checkAll;
    data.checkLotto = checkLotto;
    data.checkGame = checkGame;
    data.startDate = convertTHDateNoTime(data.startDate);
    data.endDate = convertTHDateNoTime(data.endDate);
    // convertTHDateNoTime

    let column = [{
            title: "ชื่อผู้ใช้",
            className: "align-middle text-center",
        },
        {
            title: "สร้างเมื่อ",
            className: "align-middle text-center",
        },
        {
            title: "ประเภท",
            className: "align-middle text-center",
        },
        {
            title: "จาก",
            className: "align-middle text-center",
        },
        {
            title: "จำนวน",
            className: "align-middle text-right",
        }
    ];

    let tableData = [];
    initDataTables(tableData, idTable, column);
    let resData = await callXMLHttpRequest(`${apiPort.ApiMemberAff}`, data);

    const result = resData.data;

    if (resData.statusCodeText == textRespone.ok.CodeText && result.length > 0) {
        console.log(result);
        result.forEach((item, key) => {
            tableData.push([
                item.ref_name,
                item.timeRecive,
                item.type,
                item.username,
                numberWithCommas(parseFloat(item.sum_aff_amont).toFixed(2))
            ])

        });
    } else {
        handleApiFaild(resData);
    }
    initDataTables(tableData, idTable, column);
    hideLoader()
}

var app = new Vue({
    el: '#app',
    data: {
        checkAll: true,
        checkLotto: false,
        checkGame: false,
    },
    watch: {
        checkAll(val) {
            if (val) {
                this.checkLotto = false;
                this.checkGame = false;
            }
        },
        checkLotto(val) {
            if (val) {
                this.checkAll = false;
                this.checkGame = false;
            }
        },
        checkGame(val) {
            if (val) {
                this.checkAll = false;
                this.checkLotto = false;
            }
        },
    }
})