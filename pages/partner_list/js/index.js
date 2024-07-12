const idTable = "tablePartnerList";

$(document).ready(async function() {
    await handleRenderContent();
    hideLoader()
});

function handleRenderContent() {
    let column = [{
            title: "ชื่อผู้ใช้",
            className: "align-middle text-center",
        },
        {
            title: "ต้นสาย",
            className: "align-middle text-center",
        },
        {
            title: "จำนวนลูกสาย",
            className: "align-middle text-center",
        },
        {
            title: "ยอดเพื่อนแทงทั้งหมด",
            className: "align-middle text-center",
        },
        {
            title: "ยอดแนะนำเพื่อนแทง",
            className: "align-middle text-center",
        },
        {
            title: "ยอดถอนแนะนำเพื่อน",
            className: "align-middle text-center",
        },
        {
            title: "ยอดแนะนำเพื่อนคงเหลือ",
            className: "align-middle text-center",
        },
    ];

    let tableData = [];
    let result = callXMLHttpRequest(`${apiPort.apiMemberPartnerListOld}`, {});

    if (result.statusCodeText == textRespone.ok.CodeText && result.data.length > 0) {
        // console.log(result.data);
        // FIXME-LOTTO wait mapping data from database  */
        let namePartnerId = result.data[0].member_id_partner
        result.data.forEach(item => {
            let namePartner = item.name_partner
                // if(namePartnerId == item.member_id_partner){
                //   namePartner = ''
                // }
            namePartnerId = item.member_id_partner
            tableData.push([
                item.name_member,
                namePartner,
                item.count_member,
                numberFormat(item.sum_all_type),
                numberFormat(item.sum_all_aff),
                numberFormat(item.aff_withdraw),
                numberFormat(item.aff_remain)
            ])
        });
    } else {
        handleApiFaild(result);
    }
    initDataTables(tableData, idTable, column);
}


function numberFormat(x) {
    var parts = x.toFixed(2).split(".");
    return parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + (parts[1] ? "." + parts[1] : "");
}