$(document).ready(function () {
    setdataPage();
});
async function setdataPage() {

    let resMemberTopup = callXMLHttpRequest(`${apiPort.apiGetBank}`, {});
    if (resMemberTopup.statusCodeText == textRespone.ok.CodeText) {
        let htm = '<option value = "0">กรุณาเลือกบัญชีที่โอนเข้า</option>';
        for (let i = 0; i < resMemberTopup.data.length; i++) {
            htm += '<option data-tokens="' + resMemberTopup.data[i].bank_name + '" value="' + resMemberTopup.data[i].bank_id + '">' + resMemberTopup.data[i].bank_name + '</option>';
        }
        el('bank_sel').innerHTML = htm;
    }
    let resMemberTopups = callXMLHttpRequest(`${apiPort.apiQuerymemberSel}`, {});
    if (resMemberTopups.statusCodeText == textRespone.ok.CodeText) {
        let html = '<option value = "0">กรุณาเลือกสมาชิก</option>';
        for (let i = 0; i < resMemberTopups.data.length; i++) {
            html += '<option data-tokens="' + resMemberTopups.data[i].name + '" value="' + resMemberTopups.data[i].id + '">' + resMemberTopups.data[i].name + '</option>';
        }
        el('member_sel').innerHTML = html;
    }
}

