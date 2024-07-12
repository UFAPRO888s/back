$(document).ready(async function() {
    await setData();
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
            setData();
        }
    });
}

function numberFormat(x) {
    var parts = parseFloat(x).toFixed(2).split(".");
    return parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + (parts[1] ? "." + parts[1] : "");
}

async function setData() {
    let resGame = callXMLHttpRequest(`${apiPort.apiQuerySettingGame}`, {});
    let stsUFA = resGame.data[0].sts;
    let stsLotto = resGame.data[1].sts;
    let stsTransfer = resGame.data[2].sts;
    let amount_auto = resGame.data[2].value;

    if (stsUFA == 1) {
        el("ufa_settings").checked = true;
    } else {
        el("ufa_settings").checked = false;
    }
    if (stsLotto == 1) {
        el("lotto_settings").checked = true;
    } else {
        el("lotto_settings").checked = false;
    }

    if (stsTransfer == 1) {
        el("transfer_auto").checked = true;
    } else {
        el("transfer_auto").checked = false;
    }

    if (amount_auto) {
        el("amount_auto").value = amount_auto;
    } else {
        el("amount_auto").value = 0;
    }

    let resSettings = await callXMLHttpRequest(
        `${apiPort.apiQuerySettingWeb}`, {}
    );
    if (resSettings.statusCodeText == textRespone.ok.CodeText) {
        let data = resSettings.data[0];
        el("sel_days").value = data.days;
        el("amount").value = data.amount;
        el("desc").innerHTML = data.description;
        el("url_file").value = data.img_name;
        if (data.stats == 1) {
            el("winloss_setting").checked = true;
        } else {
            el("winloss_setting").checked = false;
        }
    } else if (resSettings.statusCodeText == "401") {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resSettings.description,
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

    resSettings = await callXMLHttpRequest(
        `${apiPort.apiQuerySettingTruewallet}`, {}
    );
    if (resSettings.statusCodeText == textRespone.ok.CodeText) {
        let data = resSettings.data[0];
        el("truewallet_amount").value = data.limit_exchange;
        el("truewallet_phone_exchange").value = data.accnum;
        if (data.stats == 1) {
            el("truewallet_status").checked = true;
        } else {
            el("truewallet_status").checked = false;
        }
    } else if (resSettings.statusCodeText == "401") {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resSettings.description,
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

    let resDashboard = callXMLHttpRequest(`${apiPort.apiDashboard}`, {});
    if (resDashboard.statusCodeText == textRespone.ok.CodeText) {
        el("dashboard_credit_ufa").innerHTML = numberFormat(resDashboard.data.lblaCredit);
        el("dashboard_member_ufa").innerHTML =
            resDashboard.data.lblaTotalMemberCount;
        el("dashboard_deposit_all").innerHTML =
            formatMoneyNotDecimal(resDashboard.depositall) + " บาท";
        el("dashboard_withdraw_all").innerHTML =
            formatMoneyNotDecimal(resDashboard.withdrawall) + " บาท";

        // el('deposit_summary').innerHTML = formatMoneyNotDecimal(resDashboard.depositall) + ' บาท';
        // el('withdraw_summary').innerHTML = formatMoneyNotDecimal(resDashboard.withdrawall) + ' บาท';

        let total = resDashboard.depositall - resDashboard.withdrawall;
        let txt_total = "";
        if (total >= 0) {
            txt_total =
                '<font color="green">' + formatMoneyNotDecimal(total) + "</font> บาท";
        } else {
            txt_total =
                '<font color="red">' + formatMoneyNotDecimal(total) + "</font> บาท";
        }
        // el('total_summary').innerHTML = txt_total;

        let total_sum = resDashboard.depositall + resDashboard.withdrawall;
        let total_deposit = (resDashboard.depositall / total_sum) * 100;
        let total_withdraw = (resDashboard.withdrawall / total_sum) * 100;

        // el("progress_deposit").ariaValueNow = total_deposit;
        // el('progress_deposit').style = 'width:' + total_deposit + '%';
        // el('progress_deposit').innerHTML = parseInt(total_deposit) + '%';
        // el("progress_withdraw").ariaValueNow = total_withdraw;
        // el('progress_withdraw').style = 'width:' + total_withdraw + '%';
        // el('progress_withdraw').innerHTML = parseInt(total_withdraw) + '%';
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

    let resSetting = callXMLHttpRequest(`${apiPort.apiSettingDashboard}`, {});
    if (resSetting.statusCodeText == textRespone.ok.CodeText) {
        el("line_id").value = resSetting.line;
        el("line_admin").value = resSetting.line_admin;
        el("name_web").value = resSetting.name_web;
        el("d_limit").value = resSetting.d_limit;
        el("w_limit").value = resSetting.w_limit;
        // el('aff_d').value = resSetting.aff_d;
        // el('aff_m').value = resSetting.aff_m;

        el("token_line").value = resSetting.token_line;
        el("token_line_game").value = resSetting.token_line_game;
        el("token_line_depo").value = resSetting.token_line_depo;
        el("token_line_with").value = resSetting.token_line_with;
        el("credit_min").value = resSetting.credit_min;
        el("credit_max").value = resSetting.credit_max;
        el("credit_limit").value = resSetting.credit_limit;
        if (resSetting.auto_status == 1) {
            el("status_1").checked = true;
            el("status_0").checked = false;
        } else {
            el("status_1").checked = false;
            el("status_0").checked = true;
        }
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
}

async function edit_setting_winloss() {
    if (canEdit) {
        let dayArr = [
            "อาทิตย์",
            "จันทร์",
            "อังคาร",
            "พุธ",
            "พฤหัสบดี",
            "ศุกร์",
            "เสาร์",
        ];
        let days = el("sel_days").value;
        let days_th = dayArr[days];
        let amount = el("amount").value;
        let description = el("desc").value;
        let img_name = el("url_file").value;
        let stats = el("winloss_setting").checked ? 1 : 0;
        let data = {
            img_name: img_name,
            description: description,
            days: days,
            days_th: days_th,
            amount: amount,
            stats: stats,
        };
        var files = document.getElementById("file").files;
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
                    `${apiPort.apiUpdateSettingWinLoss}`,
                    data
                );
                if (resSettingWinloss.statusCodeText == textRespone.ok.CodeText) {
                    Swal.fire({
                        title: "แจ้งเตือน",
                        text: "อัพเดตตั้งค่า คืนยอดเสีย เรียบร้อยแล้ว",
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
            let resSettingWinloss = callXMLHttpRequest(
                `${apiPort.apiUpdateSettingWinLoss}`,
                data
            );
            if (resSettingWinloss.statusCodeText == textRespone.ok.CodeText) {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: "อัพเดตตั้งค่า คืนยอดเสีย เรียบร้อยแล้ว",
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
            text: "ไม่มีสิทธิ์เข้าถึง",
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
        });
    }
}

async function otp_truewallet() {
    if (canEdit) {
        let data = {
            type: "otp",
            phone: el("truewallet_phone").value,
        };
        let resOTP = await callXMLHttpRequest(`${apiPort.TrueWalletAPI}`, data);
        if (resOTP.statusCodeText == textRespone.ok.CodeText) {
            if (resOTP.data.code == "MAS-200") {
                el("truewallet_ref").value = resOTP.data.data.otp_reference;
                el("truewallet_phone").disabled = true;
                el("div_otp").style.display = "block";
            } else {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: "ไม่พบเบอร์ลงทะเบียน",
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
                text: resOTP.data,
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

async function otp_register() {
    if (canEdit) {
        let data = {
            type: "register",
            phone: el("truewallet_phone").value,
            ref: el("truewallet_ref").value,
            otp: el("truewallet_otp").value,
        };
        let resOTP = await callXMLHttpRequest(`${apiPort.TrueWalletAPI}`, data);
        if (resOTP.statusCodeText == textRespone.ok.CodeText) {
            if (resOTP.data.code == "MAS-200") {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: "ยืนยัน OTP Truewallet เรียบร้อยแล้ว",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "OK",
                });
            } else {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: "OTP ผิด",
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
                text: resOTP.data,
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

$("#edit_general_setting").on("click", function() {
    if (canEdit) {
        let line_id = el("line_id").value;
        let line_admin = el("line_admin").value;
        let name_web = el("name_web").value;
        let d_limit = el("d_limit").value;
        let w_limit = el("w_limit").value;
        let w_limit_twl = el("w_limit_twl").value;
        // let aff_d = el('aff_d').value;
        // let aff_m = el('aff_m').value;

        let data = {
            line: line_id,
            line_admin: line_admin,
            name_web: name_web,
            d_limit: d_limit,
            w_limit: w_limit,
            w_limit_twl: w_limit_twl,
            // aff_d: aff_d,
            // aff_m: aff_m,
        };

        let resEditGeneralSetting = callXMLHttpRequest(
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
        } else if (resEditGeneralSetting.statusCodeText == "401") {
            Swal.fire({
                title: "แจ้งเตือน",
                text: resEditGeneralSetting.description,
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
                text: resEditGeneralSetting.description,
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
});

$("#edit_auto_setting").on("click", function() {
    if (canEdit) {
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

        let resEditGeneralSetting = callXMLHttpRequest(
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
        } else if (resEditGeneralSetting.statusCodeText == "401") {
            Swal.fire({
                title: "แจ้งเตือน",
                text: resEditGeneralSetting.description,
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
                text: resEditGeneralSetting.description,
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
});

$("#edit_notify_setting").on("click", function() {
    if (canEdit) {
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

        let resEditGeneralSetting = callXMLHttpRequest(
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
        } else if (resEditGeneralSetting.statusCodeText == "401") {
            Swal.fire({
                title: "แจ้งเตือน",
                text: resEditGeneralSetting.description,
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
                text: resEditGeneralSetting.description,
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
});

async function save_truewallet() {
    if (canEdit) {
        let phone = el("truewallet_amount").value;
        let accnum = el("truewallet_phone_exchange").value;
        let stats = el("truewallet_status").checked ? 1 : 0;

        let data = {
            phone: phone,
            accnum: accnum,
            stats: stats,
        };

        let resEditGeneralSetting = callXMLHttpRequest(
            `${apiPort.apiUpdateSettingTruewallet}`,
            data
        );
        if (resEditGeneralSetting.statusCodeText == textRespone.ok.CodeText) {
            Swal.fire({
                title: "แจ้งเตือน",
                text: "อัพเดต ระบบ True Wallet เรียบร้อยแล้ว",
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
        } else if (resEditGeneralSetting.statusCodeText == "401") {
            Swal.fire({
                title: "แจ้งเตือน",
                text: resEditGeneralSetting.description,
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
            s;
            Swal.fire({
                title: "แจ้งเตือน",
                text: resEditGeneralSetting.description,
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

async function ExchangeAccount(type) {
    if (canEdit) {
        let amount = parseFloat(el("change_money").value);
        let data = {
            amount: amount,
            type: type,
            deposit: el("bank_deposit").value,
            withdraw: el("bank_withdraw").value,
        };

        let resExchangeAccount = await callXMLHttpRequest(
            `${apiPort.apiExchangeTransfer}`,
            data
        );
        if (resExchangeAccount.statusCodeText == textRespone.ok.CodeText) {
            Swal.fire({
                title: "แจ้งเตือน",
                text: "โยกเงินเสร็จเรียบร้อยแล้ว",
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
        } else if (resExchangeAccount.statusCodeText == "401") {
            Swal.fire({
                title: "แจ้งเตือน",
                text: resExchangeAccount.description,
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
                text: resExchangeAccount.description,
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

async function updateStatusWeb() {
    if (canEdit) {
        let ufa = el("ufa_settings").checked ? 1 : 0;
        let lotto = el("lotto_settings").checked ? 1 : 0;
        let transfer_auto = el("transfer_auto").checked ? 1 : 0;
        let amount_auto = el("amount_auto").value ?
            parseInt(el("amount_auto").value) :
            0;

        let data = {
            ufa: ufa,
            lotto: lotto,
            autotransfer: transfer_auto,
            amount_auto: amount_auto,
        };
        let resUpdateSettingGame = await callXMLHttpRequest(
            `${apiPort.apiUpdateGameWebStatus}`,
            data
        );
        if (resUpdateSettingGame.statusCodeText == textRespone.ok.CodeText) {
            Swal.fire({
                title: "แจ้งเตือน",
                text: "Update เรียบร้อยแล้ว",
                icon: "success",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "OK",
            });
        } else if (resUpdateSettingGame.statusCodeText == "401") {
            Swal.fire({
                title: "แจ้งเตือน",
                text: resUpdateSettingGame.description,
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
                text: resUpdateSettingGame.description,
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

async function onChangeSelBankType() {
    let sel_bank = el("bank_setting_sel").value;
    let id = 0;
    if (sel_bank == "truewallet") {
        id = 1;
    } else {
        id = 0;
    }

    let resBankSetting = await callXMLHttpRequest(`${apiPort.apiqueryeBank}`, {
        id: id,
    });
    if (resBankSetting.statusCodeText == textRespone.ok.CodeText) {
        let htm = "<option>เลือกธนาคาร</option>";
        for (let i = 0; i < resBankSetting.deposit.length; i++) {
            htm += `<option value="${resBankSetting.deposit[i].id}">${resBankSetting.deposit[i].type} ${resBankSetting.deposit[i].accnum} ${resBankSetting.deposit[i].name}</option>`;
        }
        el("bank_deposit").innerHTML = htm;
        el("bank_deposit").disabled = false;

        htm = "<option>เลือกธนาคาร</option>";
        for (let i = 0; i < resBankSetting.withdraw.length; i++) {
            htm += `<option value="${resBankSetting.withdraw[i].id}">${resBankSetting.withdraw[i].type} ${resBankSetting.withdraw[i].accnum} ${resBankSetting.withdraw[i].name}</option>`;
        }
        el("bank_withdraw").innerHTML = htm;
        el("bank_withdraw").disabled = false;
    } else if (resBankSetting.statusCodeText == "401") {
        Swal.fire({
            title: "แจ้งเตือน",
            text: resBankSetting.description,
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
            text: resBankSetting.description,
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
        });
    }
}