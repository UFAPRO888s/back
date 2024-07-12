const idModal = "#modal-member-partner";
const idTable = "table-member-partner";
const idSelectMember = "#select-member";
const idSelectMemberChildren = "#select-member-children";
const classSelectMemberChildren = ".select-member-children";
const idCloneContent = "#clone-content-list-member-partner";
const idContentListPartner = "#content-list-partner";
const idFromModalMember = "#form-member-partner";
const defualtBtnAdd = "#defualt-btn-add";
const idBtnSubmit = "#btn-submit";
const idPartnerName = "#partnerName";
const idPartnerBank = "#partnerBank";
const idPartnerBankNo = "#partnerBankNo";
const idPartnerPercentLotto = "#partnerPercentLotto";
const idPartnerPercentGame = "#partnerPercentGame";

const idPartnerNameDeatil = "#partnerNameDetail";
const idPartnerBankDetail = "#partnerBankDetail";
const idPartnerBankNoDetail = "#partnerBankNoDetail";
const idPartnerPercentLottoDetail = "#partnerPercentLottoDetail";
const idPartnerPercentGameDetail = "#partnerPercentGameDetail";

const idGroupSelectPartner = "#groupSelectPartner";
const idGroupSelectPartnerDetail = "#groupSelectPartnerDetail";

const idPartnerType = "#partnerType";
const configSelect2 = {
    theme: "bootstrap",
    width: "resolve",
};
$(document).ready(function() {
    handleDataTable();
    genObtionSelectMemberPartner();
    genObtionSelectMember();
    setSelect2();
    handleCheckPartnerType(idPartnerType);
    handleChangePartnerChildren(idSelectMemberChildren);

    $(idModal).on("hidden.bs.modal", function(event) {
        $(idGroupSelectPartner).css("display", "block");
        $(idGroupSelectPartnerDetail).css("display", "none");
    });
});

function setSelect2() {
    $(".select2").select2(configSelect2);
}

function handleDataTable() {
    let column = [{
            title: "ลำดับ",
            className: "align-middle text-center",
        },
        {
            title: "วันที่ทำรายการล่าสุด",
            className: "align-middle",
        },
        {
            title: "หุ้นส่วน",
            className: "align-middle",
        },
        {
            title: "ประเภท",
            className: "align-middle",
        },
        {
            title: "ข้อมูล หุ้นส่วน",
            className: "align-middle",
        },
        {
            title: "สมาชิกทั้งหมด",
            className: "align-middle",
        },
        {
            title: "จัดการ",
            className: "align-middle",
        },
    ];
    let data = [];
    let tableData = [];
    let resDeopsit = callXMLHttpRequest(`${apiPort.apiDataMemberPartner}`, {});
    if (resDeopsit.statusCodeText == textRespone.ok.CodeText) {
        data = resDeopsit.data;
        for (let i = 0; i < data.length; i++) {
            tableData.push([
                i + 1,
                formatDate(data[i].updated_at),
                data[i].username,
                data[i].member_type,
                `ชื่อ: ${data[i].name}<br>
                เบอรโทร: ${data[i].username}<br>
                บัญชี: ${data[i].bank_name}<br>
                เลขบัญชี: ${data[i].accnum}<br>
                `,
                data[i].countmember + " คน",
                `<div class="btn-group" role="group">
                    <button type="button" class="btn btn-warning btn-sm" onclick="editMember(${
                      data[i].member_id
                    },'${encodeURIComponent(JSON.stringify(data[i]))}')">
                    <i class="far fa-edit"></i> แก้ไข
                    </button>
                    &nbsp;
                    <button type="button" class="btn btn-danger btn-sm" onclick="deleteMember(${
                      data[i].member_id
                    })">
                    <i class="far fa-trash-alt"></i> ลบ
                </button>
                </div>`,
            ]);
        }
    } else {
        handleApiFaild(resDeopsit);
    }
    initDataTables(tableData, idTable, column);
}

function resetContentListPartner() {
    const listRow = $(idContentListPartner).children("div.row");
    if (listRow.length > 1) {
        $.each(listRow, (key, item) => {
            if (key > 0) {
                $(item).remove();
            }
        });
    }
    $(idBtnSubmit).text("เพิ่ม");
}

function editMember(id, dataDetail) {
    const objDeatil = JSON.parse(decodeURIComponent(dataDetail));

    const {
        name,
        bank_name: bankName,
        accnum: bankNo,
        percent_game: percentGame,
        percent_lotto: percentLotto,
    } = objDeatil;

    $(idPartnerNameDeatil).text(name);
    $(idPartnerBankDetail).text(bankName);
    $(idPartnerBankNoDetail).text(bankNo);
    $(idPartnerPercentLottoDetail).text(percentLotto);
    $(idPartnerPercentGameDetail).text(percentGame);
    resetContentListPartner();
    $(idBtnSubmit).text("อัพเดท");
    const data = {
        id,
    };
    $(idModal).modal("show");

    $(idSelectMember).val(id);
    $(idSelectMember).select2(configSelect2).trigger("change");
    $(idGroupSelectPartner).css("display", "none");
    $(idGroupSelectPartnerDetail).css("display", "block");
    let resData = callXMLHttpRequest(`${apiPort.apiChildrenMemberPartner}`, data);
    if (resData.statusCodeText == textRespone.ok.CodeText) {
        const result = resData.data;
        if (result.length > 0) {
            result.forEach((item, key) => {
                if (key > 0) {
                    $(defualtBtnAdd).click();
                }
            });
            const listRow = $(idContentListPartner).children("div.row");
            $.each(listRow, (key, item) => {
                const childrenPartner = $(item)
                    .children()
                    .find('select[name="member_id"]');
                const partnerType = $(item)
                    .children()
                    .find('select[name="partner_type"]');
                const memberType = $(item)
                    .children()
                    .find('select[name="member_type"]');
                const percentLotto = $(item)
                    .children()
                    .find('input[name="pattner_percent_lotto"]');
                const percentGame = $(item)
                    .children()
                    .find('input[name="pattner_percent_game"]');
                $(childrenPartner).val(result[key].member_id);
                $(childrenPartner).select2(configSelect2).trigger("change");
                $(partnerType).val(result[key].partner_type);
                $(partnerType).select2(configSelect2).trigger("change");
                $(memberType).val(result[key].member_type);
                $(memberType).select2(configSelect2).trigger("change");
                $(percentLotto).val(result[key].percent_lotto);
                $(percentGame).val(result[key].percent_game);
            });
        } else {

        }
    } else {
        handleApiFaild(resData);
    }
}

function deleteMember(id) {
    Swal.fire({
        title: "แจ้งเตือน",
        text: "คุณต้องการที่จะลบข้อมูลนี้หรือไม่ ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#009102",
        confirmButtonText: "Delete",
    }).then((result) => {
        if (result.isConfirmed) {
            let resDeleteMember = callXMLHttpRequest(
                `${apiPort.apiDeleteMemberPartner}`, { id }
            );
            if (resDeleteMember.statusCodeText == textRespone.ok.CodeText) {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: "ลบข้อมูลเรียบร้อยแล้ว",
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
            } else {
                handleApiFaild(resDeleteMember);
            }
        }
    });
}

function handleModal(mode) {
    $(idModal).modal("show");
}

function handleSubmit() {
    const fromArr = $(idFromModalMember).serializeArray();

    const attHidArray = ["id", "partner_member_id"];
    const data = genObjectSerializeArray2(fromArr, attHidArray)
    const result = callXMLHttpRequest(`${apiPort.apiMemberPartner}`, data);
    if (result.statusCodeText == textRespone.ok.CodeText) {
        Swal.fire({
            title: "แจ้งเตือน",
            text: "ทำรายการ แบ่งหุ้นสมาชิก เรียบร้อยแล้ว",
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
    } else {
        handleApiFaild(result);
    }
}

async function addList(node) {
    const content = $(idCloneContent).html();

    $(node).parents().eq(1).after(content);

    $(node).parents().eq(1).next().find("select").select2({
        theme: "bootstrap",
        width: "resolve",
    });
    handleCheckPartnerType(idPartnerType);
}

function removeList(node) {
    $(node).parents().eq(1).remove();
}

function genContentListMemberPartner() {}

function blankStucture() {
    let resData = callXMLHttpRequest(`${apiPort.apiGetMember}`, {});
    if (resData.statusCodeText == textRespone.ok.CodeText) {
        /** => add code  */
    } else {
        handleApiFaild(resData);
    }
}

function genObtionSelectMember(name = "member", val) {
    let resData = callXMLHttpRequest(`${apiPort.apiGetMember}`, {});
    if (resData.statusCodeText == textRespone.ok.CodeText) {
        if (resData.data.length > 0) {
            let data = resData.data;

            for (let i = 0; i < data.length; i++) {
                let txt = `<option value="${data[i].id}"
        data-partner-name = "${data[i].name}"
        data-partner-bank = "${data[i].bank_name}"
        data-partner-bankno = "${data[i].accnum}"
        >${data[i].username}:${data[i].name}</option>`;
                $(idSelectMemberChildren).append(txt);
                $(classSelectMemberChildren).append(txt);
            }
            setSelect2();
        } else {
            let txt = `<option value="0">--ไม่พบข้อมูล--</option>`;
            $(idSelectMemberChildren).append(txt);
            $(classSelectMemberChildren).append(txt);
            setSelect2();
        }
    } else {
        handleApiFaild(resData);
    }
}

function handleChangePartner(node) {
    const optionSelected = $(node).find(":selected");
    const partnerName = optionSelected.attr("data-partner-name");
    const partnerBank = optionSelected.attr("data-partner-bank");
    const partnerBankNo = optionSelected.attr("data-partner-bankno");
    const partnerLotto = optionSelected.attr("data-partner-lotto");
    const partnerGame = optionSelected.attr("data-partner-game");
    $(idPartnerName).text(partnerName);
    $(idPartnerBank).text(partnerBank);
    $(idPartnerBankNo).text(partnerBankNo);
    $(idPartnerPercentLotto).text(partnerLotto);
    $(idPartnerPercentGame).text(partnerGame);
}

function handleChangePartnerChildren(node) {
    const optionSelected = $(node).find(":selected");
    const partnerBank = optionSelected.attr("data-partner-bank");
    const partnerBankNo = optionSelected.attr("data-partner-bankno");
    const divParent = $(node).parent();
    $(divParent).children('label[name="bankno"]').text(partnerBankNo);
    $(divParent).children('label[name="bank"]').text(partnerBank);
}

function genObtionSelectMemberPartner() {
    let resData = callXMLHttpRequest(`${apiPort.apiGetMember}`, {
        partnerType: "PN",
    });
    if (resData.statusCodeText == textRespone.ok.CodeText) {
        if (resData.data.length > 0) {
            let data = resData.data;

            for (let i = 0; i < data.length; i++) {
                let txt = `<option value="${data[i].id}"
        data-partner-name = "${data[i].name}"
        data-partner-bank = "${data[i].bank_name}"
        data-partner-bankno = "${data[i].accnum}"
        data-partner-lotto = "${data[i].percent_lotto}"
        data-partner-game = "${data[i].percent_game}"
        >${data[i].username}:${data[i].name} (${data[i].member_type})</option>`;
                $(idSelectMember).append(txt);
            }
            setSelect2();
            handleChangePartner(idSelectMember);
        } else {
            let txt = `<option value="0">--ไม่พบข้อมูล--</option>`;
            $(idSelectMember).append(txt);
            setSelect2();
            $(idGroupSelectPartner).css("display", "none");
        }
    } else {
        handleApiFaild(resData);
    }
}

function handleCheckPartnerType(node) {
    const partnerTypeVal = $(node).val();
    const parentRow = $(node).parents().eq(2);
    const percentLotto = $(parentRow)
        .children()
        .find('input[name="pattner_percent_lotto"]');
    const percentGame = $(parentRow)
        .children()
        .find('input[name="pattner_percent_game"]');
    if (partnerTypeVal === "AF") {
        $(percentLotto).val("");
        $(percentGame).val("");
        $(percentLotto).prop("readonly", true);
        $(percentGame).prop("readonly", true);
    } else {
        $(percentLotto).prop("readonly", false);
        $(percentGame).prop("readonly", false);
    }
}