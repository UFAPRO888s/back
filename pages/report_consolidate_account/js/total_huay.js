const htext = document.getElementById("htext");
const ptext = document.getElementById("ptext");
const idTable = "#lottoSumary1";
const idTable1 = "#lottoSumary2";
const idTable2 = "#lottoSumary3";
const div3 = "#LottodivSumary1";

async function function1() {
    await showLoader()
    document.getElementById('div_1').style.display = 'block';
    document.getElementById('div_2').style.display = 'none';
    document.getElementById('div_3').style.display = 'none';

    document.getElementById('btn_1').disabled = true;
    document.getElementById('btn_2').disabled = false;
    document.getElementById('btn_3').disabled = false;
    htext.innerText = "ยอดตามประเภท";
    ptext.innerText = "รายการยอดตามประเภท";
    hideLoader()
}

async function function2() {
    await showLoader()
    document.getElementById('div_1').style.display = 'none';
    document.getElementById('div_2').style.display = 'block';
    document.getElementById('div_3').style.display = 'none';

    document.getElementById('btn_1').disabled = false;
    document.getElementById('btn_2').disabled = true;
    document.getElementById('btn_3').disabled = false;
    htext.innerText = "ยอดตามเลข";
    ptext.innerText = "รายการยอดตามเลข";
    hideLoader()

}

async function function3() {
    await showLoader()
    document.getElementById('div_1').style.display = 'none';
    document.getElementById('div_2').style.display = 'none';
    document.getElementById('div_3').style.display = 'block';

    document.getElementById('btn_1').disabled = false;
    document.getElementById('btn_2').disabled = false;
    document.getElementById('btn_3').disabled = true;
    htext.innerText = "ยอดตามสมาชิก";
    ptext.innerText = "รายการยอดตามสมาชิก";
    hideLoader()
}

$(document).ready(async function() {
    await handleDataTable()
    hideLoader();
    // handleDataTable2()
    // handleDataTable3();
})

// localStorage.setItem("huay_g_id", g_id);
//     localStorage.setItem("huay_t_id", t_id);
//     localStorage.setItem("huay_date_find", date);


function handleDataTable() {
    const dataReq = {
        'lottoDate': localStorage.getItem('huay_date_find'),
        'lottoGroupId': localStorage.getItem('huay_g_id'),
        'lottoType': localStorage.getItem('huay_t_id')
    }
    let result = callXMLHttpRequest(`${apiPort.apiReportLottoSummaryCategory}`, dataReq);
    if (result.statusCodeText == textRespone.ok.CodeText) {
        /*** loop data */
        const dataTable = result.data[0].lotto_detail
        let sumAmount = 0
        let sumAffiliate = 0
        let sumWinnerAmount = 0
        let sumNetAmount = 0
        dataTable.forEach((item, key) => {
            sumAmount += parseFloat(item.amount)
            sumAffiliate += parseFloat(item.affiliate)
            sumWinnerAmount += parseFloat(item.winner_amount)
            sumNetAmount += parseFloat(item.net_amount)
            let txt = ` <tr>
                            <td>${item.description}</td>
                            <td>${item.amount}</td>
                            <td>${item.affiliate}</td>
                            <td>${item.winner_amount}</td>
                            <td class="text-success">${item.net_amount}</td>
                        </tr>`
            $(idTable).append(txt)

        })

        let txt = ` <tr>
        <td>รวม</td>
        <td>${sumAmount.toFixed(2)}</td>
        <td>${sumAffiliate.toFixed(2)}</td>
        <td>${sumWinnerAmount.toFixed(2)}</td>
        <td class="text-success">${sumNetAmount.toFixed(2)}</td>
    </tr>`

        $(idTable).append(txt)



    } else {
        handleApiFaild(result);
    }

}

async function handleDataTable2() {
    const dataReq = {
        'lottoDate': localStorage.getItem('huay_date_find'),
        'lottoGroupId': localStorage.getItem('huay_g_id'),
        'lottoType': localStorage.getItem('huay_t_id')
    }

    let result = await callXMLHttpRequest(`${apiPort.apiReportLottoSummaryNumber}`, dataReq);
    if (result.statusCodeText == textRespone.ok.CodeText) {
        /*** loop data */

        let arr = [];
        for (let i = 0; i < result.data[0].lotto_detail.length; i++) {
            arr.push(result.data[0].lotto_detail[i]);
        }
        const dataTable1 = arr;

        dataTable1.forEach((item, key) => {
            let txt = ` <tr>
                                <td>${item.description}</td>
                                <td>${item.amount}</td>
                                <td>${item.affiliate}</td>
                                <td>${item.winner_amount}</td>
                                <td class="text-success">${item.net_amount}</td>
                            </tr>`
            $(idTable1).append(txt)
        })
    } else {
        handleApiFaild(result);
    }


}

function handleDataTable3() {
    const dataReq = {
        'lottoDate': localStorage.getItem('huay_date_find'),
        'lottoGroupId': localStorage.getItem('huay_g_id'),
        'lottoType': localStorage.getItem('huay_t_id')
    }
    let result = callXMLHttpRequest(`${apiPort.apiReportLottoSummaryMember}`, dataReq);
    if (result.statusCodeText == textRespone.ok.CodeText) {
        const dataTable2 = result.data[0].lotto_detail

        let sumCountAmount = 0
        let sumbill = 0
        dataTable2.forEach((item, key) => {
            sumCountAmount += parseFloat(item.count_amount)
            let txt = ` <tr>
                        <td>${item.data_id}</td>
                        <td>${item.date_time_add}</td>
                        <td>#</td>
                        <td>${item.username}</td>
                        <td>${item.username_partner}</td>
                        <td>${item.lotto_name}</td>
                        <td>${item.count_amount}</td>
                        <td>${item.amount}</td>
                        <td>${item.affiliate}</td>
                        <td>${item.winner_amount}</td>
                        <td class="text-success">${item.net_amount}</td>
                    </tr>`
            $(idTable2).append(txt)

        })
        let txt = `<span class"text-dark">${sumCountAmount}</span>`
        $(div3).append(txt)
    } else {
        handleApiFaild(result);
    }
}