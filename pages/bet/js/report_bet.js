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
    $(idTable).html('');
    await handleDataTable();
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
    $(idTable1).html('');
    await handleDataTable2();
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
    $(idTable2).html('');
    await handleDataTable3();
    hideLoader()
}

$(document).ready(async function() {
    await handleDataTable()
    hideLoader()
})




async function handleDataTable() {
    const dataReq = {
        'lottoDate': localStorage.getItem("huay_date_find"),
        'lottoGroupId': localStorage.getItem("huay_g_id"),
        'lottoType': localStorage.getItem("huay_t_id"),
        'flag': 1
    }
    let result = await callXMLHttpRequest(`${apiPort.apiReportLottoSummaryCategory}`, dataReq);
    if (result.statusCodeText == textRespone.ok.CodeText) {
        /*** loop data */
        let sumAmount = 0
        let sumAffiliate = 0
        let sumWinnerAmount = 0
        let sumNetAmount = 0
            // console.log(result.data)
            // console.log(dataReq.lottoType)
            // console.log(result);
        for (const rr of result.data) {
            if (dataReq.lottoType !== 1) {
                if (rr.id >= 38 && rr.id <= 45) {
                    const item = rr.lotto_detail;
                    sumAmount += parseFloat(item.bet)
                    sumAffiliate += parseFloat(item.aff)
                    sumWinnerAmount += parseFloat(item.winner)
                    let sumall = parseFloat(item.bet) + parseFloat(item.aff) + parseFloat(item.winner);
                    sumNetAmount += sumall;
                    let txt = ` <tr>
									<td class="text-center">${item.description}</td>
									<td class="text-right">${numberWithCommas(parseFloat(item.bet).toFixed(2))}</td>
									<td class="text-right">${numberWithCommas(parseFloat(item.aff).toFixed(2))}</td>
									<td class="text-right">${numberWithCommas(parseFloat(item.winner).toFixed(2))}</td>
									<td class="text-right text-success">${numberWithCommas(parseFloat(sumall).toFixed(2))}</td>
								</tr>`
                    $(idTable).append(txt)
                }
            } else {
                if (rr.id < 38) {
                    const item = rr.lotto_detail;
                    sumAmount += parseFloat(item.bet)
                    sumAffiliate += parseFloat(item.aff)
                    sumWinnerAmount += parseFloat(item.winner)
                    let sumall = parseFloat(item.bet) + parseFloat(item.aff) + parseFloat(item.winner);
                    sumNetAmount += sumall;
                    let txt = ` <tr>
									<td class="text-center">${item.description}</td>
									<td class="text-right">${numberWithCommas(parseFloat(item.bet).toFixed(2))}</td>
									<td class="text-right">${numberWithCommas(parseFloat(item.aff).toFixed(2))}</td>
									<td class="text-right">${numberWithCommas(parseFloat(item.winner).toFixed(2))}</td>
									<td class="text-right text-success">${numberWithCommas(parseFloat(sumall).toFixed(2))}</td>
								</tr>`
                    $(idTable).append(txt)
                }
            }
        }
        let txt = ` <tr>
		<td  class="text-center text-bold">รวม</td>
		<td class="text-right">${sumAmount.toFixed(2)}</td>
		<td class="text-right">${sumAffiliate.toFixed(2)}</td>
		<td class="text-right">${sumWinnerAmount.toFixed(2)}</td>
		<td class="text-right text-success">${sumNetAmount.toFixed(2)}</td>
	</tr>`

        $(idTable).append(txt)




    } else {
        handleApiFaild(result);
    }

}

async function handleDataTable2() {
    const dataReq = {
        'lottoDate': localStorage.getItem("huay_date_find"),
        'lottoGroupId': localStorage.getItem("huay_g_id"),
        'lottoType': localStorage.getItem("huay_t_id"),
        'flag': 1
    }

    let result = await callXMLHttpRequest(`${apiPort.apiReportLottoSummaryNumber}`, dataReq);
    if (result.statusCodeText == textRespone.ok.CodeText) {
        /*** loop data */

        let arr = [];
        const { lotto_detail, lotto_detail_number, lottoNumber, lotto_reward_detail } = result.data[0];
        let sumAmount = 0
        let sumAffiliate = 0
        let sumWinnerAmount = 0
        let sumNetAmount = 0
        let threeTong = [];
        let threeDown = [];
        let threeTod = [];
        let TwoUP = [];
        let TwoDown = [];
        let RunUP = [];
        let RunDown = [];
        console.log(result.data[0])
        for (const rr of lotto_reward_detail) {
            for (const rrr of lotto_detail) {
                // console.log(rrr)
                if (rrr.lotto_detail.reward_name === '3tong' && rr.reward_name === rrr.lotto_detail.reward_name) {
                    // console.log(rrr.lotto_detail)
                    threeTong.data = rrr;
                    threeTong.sumAmount = parseFloat(rrr.lotto_detail.bet);
                    threeTong.sumAffiliate = parseFloat(rrr.lotto_detail.aff);
                    threeTong.sumWinnerAmount = parseFloat(rrr.lotto_detail.winner);
                    threeTong.sumNetAmount = threeTong.sumAmount + threeTong.sumAffiliate;
                } else if (rrr.lotto_detail.reward_name === '3tod' && rr.reward_name === rrr.lotto_detail.reward_name) {
                    // txt += `<td>${parseFloat(rrr.lotto_detail.bet)}</td>`;
                    threeTod.data = rrr;
                    threeTod.sumAmount = parseFloat(rrr.lotto_detail.bet);
                    threeTod.sumAffiliate = parseFloat(rrr.lotto_detail.aff);
                    threeTod.sumWinnerAmount = parseFloat(rrr.lotto_detail.winner);
                    threeTod.sumNetAmount = threeTod.sumAmount + threeTod.sumAffiliate;
                } else if (rrr.lotto_detail.reward_name === '3down' && rr.reward_name === rrr.lotto_detail.reward_name) {
                    // txt += `<td>${parseFloat(rrr.lotto_detail.bet)}</td>`;
                    threeDown.data = rrr;
                    threeDown.sumAmount = parseFloat(rrr.lotto_detail.bet);
                    threeDown.sumAffiliate = parseFloat(rrr.lotto_detail.aff);
                    threeDown.sumWinnerAmount = parseFloat(rrr.lotto_detail.winner);
                    threeDown.sumNetAmount = threeDown.sumAmount + threeDown.sumAffiliate;
                } else if (rrr.lotto_detail.reward_name === '2up' && rr.reward_name === rrr.lotto_detail.reward_name) {
                    // txt += `<td>${parseFloat(rrr.lotto_detail.bet)}</td>`;
                    TwoUP.data = rrr;
                    TwoUP.sumAmount = parseFloat(rrr.lotto_detail.bet);
                    TwoUP.sumAffiliate = parseFloat(rrr.lotto_detail.aff);
                    TwoUP.sumWinnerAmount = parseFloat(rrr.lotto_detail.winner);
                    TwoUP.sumNetAmount = TwoUP.sumAmount + TwoUP.sumAffiliate;
                } else if (rrr.lotto_detail.reward_name === '2down' && rr.reward_name === rrr.lotto_detail.reward_name) {
                    // txt += `<td>${parseFloat(rrr.lotto_detail.bet)}</td>`;
                    TwoDown.data = rrr;
                    TwoDown.sumAmount = parseFloat(rrr.lotto_detail.bet);
                    TwoDown.sumAffiliate = parseFloat(rrr.lotto_detail.aff);
                    TwoDown.sumWinnerAmount = parseFloat(rrr.lotto_detail.winner);
                    TwoDown.sumNetAmount = TwoDown.sumAmount + TwoDown.sumAffiliate;
                } else if (rrr.lotto_detail.reward_name === 'runup' && rr.reward_name === rrr.lotto_detail.reward_name) {
                    // txt += `<td>${parseFloat(rrr.lotto_detail.bet)}</td>`;
                    RunUP.data = rrr;
                    RunUP.sumAmount = parseFloat(rrr.lotto_detail.bet);
                    RunUP.sumAffiliate = parseFloat(rrr.lotto_detail.aff);
                    RunUP.sumWinnerAmount = parseFloat(rrr.lotto_detail.winner);
                    RunUP.sumNetAmount = RunUP.sumAmount + RunUP.sumAffiliate;
                } else if (rrr.lotto_detail.reward_name === 'rundown' && rr.reward_name === rrr.lotto_detail.reward_name) {
                    // txt += `<td>${parseFloat(rrr.lotto_detail.bet)}</td>`;
                    RunDown.data = rrr;
                    RunDown.sumAmount = parseFloat(rrr.lotto_detail.bet);
                    RunDown.sumAffiliate = parseFloat(rrr.lotto_detail.aff);
                    RunDown.sumWinnerAmount = parseFloat(rrr.lotto_detail.winner);
                    RunDown.sumNetAmount = RunDown.sumAmount + RunDown.sumAffiliate;
                }
            }
        }
        let txt = `<tr><td>ยอดพนัน</td>`;
        txt += `<td class="text-right">${(threeTong.data) ? numberWithCommas(parseFloat(threeTong.sumAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right">${(threeTod.data) ? numberWithCommas(parseFloat(threeTod.sumAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right">${(TwoUP.data) ? numberWithCommas(parseFloat(TwoUP.sumAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right">${(TwoDown.data) ? numberWithCommas(parseFloat(TwoDown.sumAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right">${(RunUP.data) ? numberWithCommas(parseFloat(RunUP.sumAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right">${(RunDown.data) ? numberWithCommas(parseFloat(RunDown.sumAmount).toFixed(2)):0}</td>`;
        txt += `</tr>`
        $(idTable1).append(txt)
        txt = `<tr><td>Affiliate</td>`;
        txt += `<td class="text-right">${(threeTong.data) ? numberWithCommas(parseFloat(threeTong.sumAffiliate).toFixed(2)):0}</td>`;
        txt += `<td class="text-right">${(threeTod.data) ? numberWithCommas(parseFloat(threeTod.sumAffiliate).toFixed(2)):0}</td>`;
        txt += `<td class="text-right">${(TwoUP.data) ? numberWithCommas(parseFloat(TwoUP.sumAffiliate).toFixed(2)):0}</td>`;
        txt += `<td class="text-right">${(TwoDown.data) ? numberWithCommas(parseFloat(TwoDown.sumAffiliate).toFixed(2)):0}</td>`;
        txt += `<td class="text-right">${(RunUP.data) ? numberWithCommas(parseFloat(RunUP.sumAffiliate).toFixed(2)):0}</td>`;
        txt += `<td class="text-right">${(RunDown.data) ? numberWithCommas(parseFloat(RunDown.sumAffiliate).toFixed(2)):0}</td>`;
        txt += `</tr>`
        $(idTable1).append(txt)
        txt = `<tr><td>ยอดสุทธิ</td>`;
        txt += `<td class="text-right text-green">${(threeTong.data) ? numberWithCommas(parseFloat(threeTong.sumNetAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right text-green">${(threeTod.data) ? numberWithCommas(parseFloat(threeTod.sumNetAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right text-green">${(TwoUP.data) ? numberWithCommas(parseFloat(TwoUP.sumNetAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right text-green">${(TwoDown.data) ? numberWithCommas(parseFloat(TwoDown.sumNetAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right text-green">${(RunUP.data) ? numberWithCommas(parseFloat(RunUP.sumNetAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right text-green">${(RunDown.data) ? numberWithCommas(parseFloat(RunDown.sumNetAmount).toFixed(2)):0}</td>`;
        txt += `</tr>`
        $(idTable1).append(txt)
        txt = `<tr><td>ยอดจ่ายสูงสุด</td>`;
        txt += `<td class="text-right text-red">${(threeTong.data) ? numberWithCommas(parseFloat(threeTong.sumWinnerAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right text-red">${(threeTod.data) ?numberWithCommas(parseFloat(threeTod.sumWinnerAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right text-red">${(TwoUP.data) ? numberWithCommas(parseFloat(TwoUP.sumWinnerAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right text-red">${(TwoDown.data) ? numberWithCommas(parseFloat(TwoDown.sumWinnerAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right text-red">${(RunUP.data) ? numberWithCommas(parseFloat(RunUP.sumWinnerAmount).toFixed(2)):0}</td>`;
        txt += `<td class="text-right text-red">${(RunDown.data) ? numberWithCommas(parseFloat(RunDown.sumWinnerAmount).toFixed(2)):0}</td>`;
        txt += `</tr>`
        $(idTable1).append(txt)


        ///Section Down
        let htm = '';
        let threetong = '';
        let threetod = '';
        let twoup = '';
        let twodown = '';
        let runup = '';
        let rundown = '';
        if (lottoNumber) {
            for (let i = 0; i < 1000; i++) {
                let data = lottoNumber;

                for (let j = 0; j < data.length; j++) {
                    if (data[j].key == '3tong') {
                        if (i < data[j].value.length) {
                            // threetong = `<td>${data[j].value[i]['numbers']}=${data[j].value[i].amount}/${data[j].value[i].winner_amount}/${data[j].value[i].numbrt_cnt}</td>`;
                            threetong = [data[j].value[i]['numbers'], data[j].value[i].amount, data[j].value[i].winner_amount, data[j].value[i].numbrt_cnt];
                        } else {
                            threetong = `<td>0/0</td>`;
                        }

                    } else {
                        if (!threetong) {
                            threetong = `<td>0/0</td>`;
                        }
                    }

                    if (data[j].key == '3tod') {
                        if (i < data[j].value.length) {
                            threetod = [data[j].value[i]['numbers'], data[j].value[i].amount, data[j].value[i].winner_amount, data[j].value[i].numbrt_cnt];
                        } else {
                            threetod = `<td>0/0</td>`;
                        }
                    } else {
                        if (!threetod) {
                            threetod = `<td>0/0</td>`;
                        }
                    }

                    if (data[j].key == '2up') {
                        if (i < data[j].value.length) {
                            twoup = [data[j].value[i]['numbers'], data[j].value[i].amount, data[j].value[i].winner_amount, data[j].value[i].numbrt_cnt];
                        } else {
                            twoup = `<td>0/0</td>`;
                        }
                    } else {
                        if (!twoup) {
                            twoup = `<td>0/0</td>`;
                        }
                    }

                    if (data[j].key == '2down') {
                        if (i < data[j].value.length) {
                            twodown = [data[j].value[i]['numbers'], data[j].value[i].amount, data[j].value[i].winner_amount, data[j].value[i].numbrt_cnt];
                        } else {
                            twodown = `<td>0/0</td>`;
                        }
                    } else {
                        if (!twodown) {
                            twodown = `<td>0/0</td>`;
                        }
                    }

                    if (data[j].key == 'runup') {
                        if (i < data[j].value.length) {
                            runup = [data[j].value[i]['numbers'], data[j].value[i].amount, data[j].value[i].winner_amount, data[j].value[i].numbrt_cnt];
                        } else {
                            runup = `<td>0/0</td>`;
                        }
                    } else {
                        if (!runup) {
                            runup = `<td>0/0</td>`;
                        }
                    }

                    if (data[j].key == 'rundown') {
                        if (i < data[j].value.length) {
                            rundown = [data[j].value[i]['numbers'], data[j].value[i].amount, data[j].value[i].winner_amount, data[j].value[i].numbrt_cnt];
                        } else {
                            rundown = `<td>0/0</td>`;
                        }
                    } else {
                        if (!rundown) {
                            rundown = `<td>0/0</td>`;
                        }
                    }

                }
                if (threetong == '<td>0/0</td>' && threetod == '<td>0/0</td>' && twoup == '<td>0/0</td>' && twodown == '<td>0/0</td>' && runup == '<td>0/0</td>' && rundown == '<td>0/0</td>') {
                    break;
                } else {
                    htm += `<tr><td style="font-weight:500;">#${(i + 1)}</td>`;
                    htm += (threetong === '<td>0/0</td>') ? threetong : `<td><span class="text-info">${threetong[0]}</span>=${numberWithCommas(threetong[1])}/<span class="text-red">${numberWithCommas(threetong[2])}</span>/${threetong[3]}</td>`;
                    htm += (threetod === '<td>0/0</td>') ? threetod : `<td><span class="text-info">${threetod[0]}</span>=${numberWithCommas(threetod[1])}/<span class="text-red">${numberWithCommas(threetod[2])}</span>/${threetod[3]}</td>`;
                    htm += (twoup === '<td>0/0</td>') ? twoup : `<td><span class="text-info">${twoup[0]}</span>=${numberWithCommas(twoup[1])}/<span class="text-red">${numberWithCommas(twoup[2])}</span>/${twoup[3]}</td>`;
                    htm += (twodown === '<td>0/0</td>') ? twodown : `<td><span class="text-info">${twodown[0]}</span>=${numberWithCommas(twodown[1])}/<span class="text-red">${numberWithCommas(twodown[2])}</span>/${twodown[3]}</td>`;
                    htm += (runup === '<td>0/0</td>') ? runup : `<td><span class="text-info">${runup[0]}</span>=${numberWithCommas(runup[1])}/<span class="text-red">${numberWithCommas(runup[2])}</span>/${runup[3]}</td>`;
                    htm += (rundown === '<td>0/0</td>') ? rundown : `<td><span class="text-info">${rundown[0]}</span>=${numberWithCommas(rundown[1])}/<span class="text-red">${numberWithCommas(rundown[2])}</span>/${rundown[3]}</td>`;
                    htm += '</tr>';

                    threetong = '';
                    threetod = '';
                    twoup = '';
                    twodown = '';
                    runup = '';
                }


            }
        } else {
            htm += `<tr><td style="font-weight:500;">#</td>`;
            htm += `<td>0/0</td>`;
            htm += `<td>0/0</td>`;
            htm += `<td>0/0</td>`;
            htm += `<td>0/0</td>`;
            htm += `<td>0/0</td>`;
            htm += `<td>0/0</td>`;
            htm += '</tr>';
        }
        document.getElementById('lottoNumber').innerHTML = htm;

    } else {
        handleApiFaild(result);
    }


}

function handleDataTable3() {
    const dataReq = {
        'lottoDate': localStorage.getItem("huay_date_find"),
        'lottoGroupId': localStorage.getItem("huay_g_id"),
        'lottoType': localStorage.getItem("huay_t_id"),
        'flag': 1
    }
    let result = callXMLHttpRequest(`${apiPort.apiReportLottoSummaryMember}`, dataReq);
    if (result.statusCodeText == textRespone.ok.CodeText) {
        let count_cnt = 0;
        let sumAmount = 0
        let sumAffiliate = 0
        let sumWinnerAmount = 0
        let sumNetAmount = 0

        for (const item of result.data) {
            let winner = (item.winner_flg === 1) ? item.win_amt : 0;
            count_cnt = count_cnt + item.numbrt_cnt;
            sumAmount += parseFloat(item.bet)
            sumAffiliate += parseFloat(item.aff_amount) * -1
            sumWinnerAmount += parseFloat(winner)
            let sumall = parseFloat(item.bet) - parseFloat(item.aff_amount) - parseFloat(winner);
            sumNetAmount += parseFloat(sumall)
            let txt = ` <tr>
			                <td>#</td>
			                <td class="text-center">${item.bill_code}</td>
			                <td class="text-center">${item.username}</td>
			                <td class="text-center">${item.partner}</td>
			                <td class="text-center">${item.lotto_name}</td>
			                <td class="text-center">${item.numbrt_cnt}</td>
			                <td class="text-right">${numberWithCommas(parseFloat(item.bet).toFixed(2))}</td>
			                <td class="text-right">${numberWithCommas((parseFloat(item.aff_amount) * -1).toFixed(2))}</td>
			                <td class="text-right">${numberWithCommas(parseFloat(winner).toFixed(2))}</td>
			                <td class="text-success text-right">${numberWithCommas(parseFloat(sumall).toFixed(2))}</td>
			            </tr>`
            $(idTable2).append(txt)
        }
        let txt = ` <tr>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td class="text-center text-bold">รวม</td>
		<td class="text-center">${numberWithCommas(parseFloat(count_cnt))}</td>
		<td class="text-right">${numberWithCommas(sumAmount.toFixed(2))}</td>
		<td class="text-right">${numberWithCommas(sumAffiliate.toFixed(2))}</td>
		<td class="text-right">${numberWithCommas(sumWinnerAmount.toFixed(2))}</td>
		<td class="text-right text-success">${numberWithCommas(sumNetAmount.toFixed(2))}</td>
	</tr>`

        $(idTable2).append(txt)
        $('#LottodivSumary1').html(count_cnt)
        $('#LottodivOrder').html(result.data.length)
            // const dataTable2 = result.data[0].lotto_detail

        // let sumCountAmount = 0
        // let sumbill = 0
        // dataTable2.forEach((item, key) => {
        //     sumCountAmount += parseFloat(item.count_amount)
        //     let txt = ` <tr>
        //                 <td>${item.data_id}</td>
        //                 <td>${item.date_time_add}</td>
        //                 <td>#</td>
        //                 <td>${item.username}</td>
        //                 <td>${item.username_partner}</td>
        //                 <td>${item.lotto_name}</td>
        //                 <td>${item.count_amount}</td>
        //                 <td>${item.amount}</td>
        //                 <td>${item.affiliate}</td>
        //                 <td>${item.winner_amount}</td>
        //                 <td class="text-success">${item.net_amount}</td>
        //             </tr>`
        //     $(idTable2).append(txt)

        // })
        // let txt = `<span class"text-dark">${sumCountAmount}</span>`
        // $(div3).append(txt)
    } else {
        handleApiFaild(result);
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}