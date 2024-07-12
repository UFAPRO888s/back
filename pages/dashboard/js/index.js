$(document).ready(async function() {
    // hideLoader();
    await setDataAnnounce();
    // await setData(0);
    await setDataDashboard(0)
    hideLoader();
});

async function setDataDashboard(days) {
    await showLoader();
    $("#dash_7").removeClass("btn-info");
    $("#dash_6").removeClass("btn-info");
    $("#dash_5").removeClass("btn-info");
    $("#dash_4").removeClass("btn-info");
    $("#dash_3").removeClass("btn-info");
    $("#dash_2").removeClass("btn-info");
    $("#dash_1").removeClass("btn-info");
    $("#dash_0").removeClass("btn-info");
    $("#dash_31").removeClass("btn-info");

    $("#dash_7").addClass("btn-outline-info");
    $("#dash_6").addClass("btn-outline-info");
    $("#dash_5").addClass("btn-outline-info");
    $("#dash_4").addClass("btn-outline-info");
    $("#dash_3").addClass("btn-outline-info");
    $("#dash_2").addClass("btn-outline-info");
    $("#dash_1").addClass("btn-outline-info");
    $("#dash_0").addClass("btn-outline-info");
    $("#dash_31").addClass("btn-outline-info");

    $("#dash_" + days).removeClass("btn-outline-info");
    $("#dash_" + days).addClass("btn-info");
    // $('#dash_' + days).removeClass('btn-info').addClass('btn-outline-secondary')

    await setData(days);
    hideLoader();
}

async function setData(days) {
    let timeDate = moment().format('DD/MM/YYYY HH:mm:ss');
    if (days != 0 && days != 31) {
        timeDate = moment().subtract(days, 'days').format('DD/MM/YYYY HH:mm:ss');
    }
    $(".updateTime").html(
        "อัพเดทล่าสุด : " + timeDate
    );
    let resDashboard = await callXMLHttpRequest(`${apiPort.apiDashBoardAll}`, {
        days: days,
    });
    if (resDashboard.statusCodeText == textRespone.ok.CodeText) {
        el("NewMemberToday").innerHTML = formatMoneyNotDecimal(
            resDashboard.NewMemberToday
        );
        el("MemberAll").innerHTML = formatMoneyNotDecimal(resDashboard.MemberAll);
        el("MemberOnlineNow").innerHTML = formatMoneyNotDecimal(
            resDashboard.MemberOnlineNow
        );
        el("MemberOnlineToday").innerHTML = formatMoneyNotDecimal(
            resDashboard.MemberOnlineToday
        );
        el("DepositToday").innerHTML =
            resDashboard.DepositToday != null ?
            formatMoney(resDashboard.DepositToday) :
            0;
        el("WithdrawToday").innerHTML =
            resDashboard.WithdrawToday != null ?
            formatMoney(resDashboard.WithdrawToday) :
            0;
        el("winloss").innerHTML =
            resDashboard.winloss <= 0 ?
            '<strong style="color:#2B7A0B">' +
            formatMoney(parseInt(resDashboard.winloss) * -1) +
            "</strong>" :
            '<span style="color:red">' +
            formatMoney(parseInt(resDashboard.winloss) * -1) +
            "</span>";
        el("winloss").innerHTML += `/${formatMoney(
            parseInt(resDashboard.totalTurnoverAll)
        )} (${resDashboard.totalTurnoverAll == 0 ? 0 : resDashboard.winloss / resDashboard.totalTurnoverAll / 100})%`;
        el("winlosslotto").innerHTML = resDashboard.winlossLotto <= 0 ? '<strong style="color:#2B7A0B">' + formatMoney(parseInt(resDashboard.winlossLotto) * -1) + "</strong>" :
            '<span style="color:red">' + formatMoney(parseInt(resDashboard.winlossLotto) * -1) + "</span>";
        el("winlosslotto").innerHTML += `/${formatMoney(parseInt(resDashboard.winlossLottoAll))} (${resDashboard.winlossLottoAll == 0 ? 0 : ((resDashboard.winlossLotto / resDashboard.winlossLottoAll) *
                100
            ).toFixed(2)
            })%`;
        el("CreditAllMember").innerHTML = formatMoney(resDashboard.CreditAllMember);
        el("data_aff").innerHTML = formatMoney(resDashboard.dataAff);
        el("data_bet").innerHTML = formatMoney(resDashboard.bet);
    } else if (resDashboard.statusCodeText == "401") {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resDashboard.description,
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
    }).then(async(result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            await setDataAnnounce();
            setData(0);
            setDataDashboard(0);
        }
    });
}

$("#edit_general_setting").on("click", async function() {
    let line_id = el("line_id").value;
    let name_web = el("name_web").value;
    let d_limit = el("d_limit").value;
    let w_limit = el("w_limit").value;
    let aff_d = el("aff_d").value;
    let aff_m = el("aff_m").value;

    let data = {
        line: line_id,
        name_web: name_web,
        d_limit: d_limit,
        w_limit: w_limit,
        aff_d: aff_d,
        aff_m: aff_m,
    };

    let resEditGeneralSetting = await callXMLHttpRequest(
        `${apiPort.apiUpdateGeneralSetting}`,
        data
    );
    if (resEditGeneralSetting.statusCodeText == textRespone.ok.CodeText) {
        Swal.fire({
            title: "แจ้งเตือน",
            text: "อัพเดต General Setting เรียบร้อยแล้ว",
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
    } else if (resSetting.statusCodeText == "401") {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resSetting.description,
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
            text: resSetting.description,
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
        });
    }
});

$("#edit_auto_setting").on("click", async function() {
    let credit_min = el("credit_min").value;
    let credit_max = el("credit_max").value;
    let credit_limit = el("credit_limit").value;
    let status_1 = el("status_1");
    let status_0 = el("status_0");

    let status = 0;
    if (status_1.checked) {
        status = 1;
    } else if (status_0.checked) {
        status = 0;
    }

    let data = {
        credit_min: credit_min,
        credit_max: credit_max,
        credit_limit: credit_limit,
        status: status,
    };

    let resEditGeneralSetting = await callXMLHttpRequest(
        `${apiPort.apiUpdateAutoSetting}`,
        data
    );
    if (resEditGeneralSetting.statusCodeText == textRespone.ok.CodeText) {
        Swal.fire({
            title: "แจ้งเตือน",
            text: "อัพเดต ระบบถอนออโต้ เรียบร้อยแล้ว",
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
    } else if (resSetting.statusCodeText == "401") {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resSetting.description,
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
            text: resSetting.description,
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
        });
    }
});

$("#edit_notify_setting").on("click", async function() {
    let token_line = el("token_line").value;
    let token_line_game = el("token_line_game").value;
    let token_line_depo = el("token_line_depo").value;
    let token_line_with = el("token_line_with").value;

    let data = {
        token_line: token_line,
        token_line_game: token_line_game,
        token_line_depo: token_line_depo,
        token_line_with: token_line_with,
    };

    let resEditGeneralSetting = await callXMLHttpRequest(
        `${apiPort.apiUpdateNotifySetting}`,
        data
    );
    if (resEditGeneralSetting.statusCodeText == textRespone.ok.CodeText) {
        Swal.fire({
            title: "แจ้งเตือน",
            text: "อัพเดต Token Notify เรียบร้อยแล้ว",
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
    } else if (resSetting.statusCodeText == "401") {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resSetting.description,
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
            text: resSetting.description,
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
        });
    }
});

setInterval(function() {
    setDataAnnounce();
}, 20000);

async function setDataAnnounce() {
    let resDashboard = await callXMLHttpRequest(
        `${apiPort.apiBoardAnnounce}`, {}
    );
    if (resDashboard.statusCodeText == textRespone.ok.CodeText) {
        let htm_admin = "";
        let htm_customer = "";
        let htm_register = "";
        let htm_deposit = "";
        let htm_withdraw = "";
        for (let i = 0; i < resDashboard.notice.length; i++) {
            htm_admin += `<div style="border-bottom:1px solid #b2b7bb;padding: 5px">
            <div class="row">
                <div class="col-3">
                    <span>${formatDate1(resDashboard.notice[i].cre_date) +
                " " +
                formatTime(resDashboard.notice[i].cre_date)
                } </span>
                </div>
                <div class="col-9">
                <span
                style="background-color: #00a035;color:#fff;border-radius: 3px;font-size:10px;padding:1px;">
                &nbsp;ประกาศ&nbsp; </span>&nbsp;&nbsp;&nbsp;&nbsp;<span>${resDashboard.notice[i].description
                }</span>
                </div>
            </div>
        </div>`;
        }

        for (let i = 0; i < resDashboard.game.length; i++) {
            let type = "";
            if (resDashboard.game[i].type == 1) {
                type = "เกม";
            } else {
                type = "หวย";
            }
            htm_customer += `<div style="border-bottom:1px solid #b2b7bb;padding: 5px">
            <div class="row">
                <div class="col-3">
                    <span>${formatDate1(resDashboard.game[i].cre_date) +
                " " +
                formatTime(resDashboard.game[i].cre_date)
                } </span>
                </div>
                <div class="col-9">
                <span
                style="background-color: #dc3545;color:#fff;border-radius: 3px;font-size:10px;padding:1px;">
                &nbsp;แจ้งเตือน${type}&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>${resDashboard.game[i].description
                }</span>
                </div>
            </div>
        </div>`;
        }

        for (let i = 0; i < resDashboard.registerMember.length; i++) {
            htm_register += `<div style="border-bottom:1px solid #b2b7bb;padding: 5px">
            <div class="row">
                <div class="col-3">
                    <span>${formatDate1(resDashboard.registerMember[i].cre_date) +
                " " +
                formatTime(resDashboard.registerMember[i].cre_date)
                } </span>
                </div>
                <div class="col-9">
                <span
                style="background-color: #28a745;color:#fff;border-radius: 3px;font-size:10px;padding:1px;">
                &nbsp;แจ้งเตือนสมัครสมาชิก&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>${resDashboard.registerMember[i].username
                } ${resDashboard.registerMember[i].name
                } <span style="background-color: ${resDashboard.registerMember[i].color
                };color:#fff;border-radius: 2px;font-size:12px;">&nbsp;${resDashboard.registerMember[i].bank_name
                }&nbsp;</span></span>
                </div>
            </div>
        </div>`;
        }

        for (let i = 0; i < resDashboard.deposit.length; i++) {
            htm_deposit += `<div style="border-bottom:1px solid #b2b7bb;padding: 5px">
            <div class="row">
                <div class="col-3">
                    <span>${formatDate1(resDashboard.deposit[i].transaction_date) +
                " " +
                formatTime(resDashboard.deposit[i].transaction_date)
                } </span>
                </div>
                <div class="col-9">
                <span
                style="background-color: #28a745;color:#fff;border-radius: 3px;font-size:10px;padding:1px;">
                &nbsp;แจ้งเตือนฝากเงิน&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>${resDashboard.deposit[i].member_username
                } จำนวน : ${resDashboard.deposit[i].amount} บาท</span>
                </div>
            </div>
        </div>`;
        }
        for (let i = 0; i < resDashboard.withdraw.length; i++) {
            htm_withdraw += `<div style="border-bottom:1px solid #b2b7bb;padding: 5px">
            <div class="row">
                <div class="col-3">
                    <span>${formatDate1(resDashboard.withdraw[i].transaction_date) +
                " " +
                formatTime(resDashboard.withdraw[i].transaction_date)
                } </span>
                </div>
                <div class="col-9">
                <span
                style="background-color: #dc3545;color:#fff;border-radius: 3px;font-size:10px;padding:1px;">
                &nbsp;แจ้งเตือนถอนเงิน&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>${resDashboard.withdraw[i].member_username
                } จำนวน : ${resDashboard.withdraw[i].amount} บาท</span>
                </div>
            </div>
        </div>`;
        }

        el("board_admin").innerHTML = htm_admin;
        el("board_customer").innerHTML = htm_customer;
        el("board_register").innerHTML = htm_register;
        el("board_deposit").innerHTML = htm_deposit;
        el("board_withdraw").innerHTML = htm_withdraw;
    } else if (resDashboard.statusCodeText == "401") {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resDashboard.description,
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