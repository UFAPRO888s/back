$(document).ready(function () {
    setdataPage();
});
async function setdataPage() {
    let resMemberTopups = await callXMLHttpRequest(`${apiPort.apiQuerymemberSel}`, {});
    if (resMemberTopups.statusCodeText == textRespone.ok.CodeText) {
        let html = '<option value = "0">กรุณาเลือกสมาชิก</option>';
        for (let i = 0; i < resMemberTopups.data.length; i++) {
            html += '<option data-tokens="' + resMemberTopups.data[i].name + '" value="' + resMemberTopups.data[i].id + '">' + resMemberTopups.data[i].name + '</option>';
        }
        el('member_sel').innerHTML = html;
    }
}

