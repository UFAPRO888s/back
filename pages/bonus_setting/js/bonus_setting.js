const htext1 = document.getElementById("htext1");
const htext2 = document.getElementById("htext2");

const idTable = "#tableAffiliate";
const idContentGame = "contentGame";
const idForm = "#formData";
const idInputAffCasino = "#IAffCasino";

$(document).ready(async function() {
    handleRenderContent();
    handleAffCasino();
    hideLoader()
});

async function handleRenderContent() {
    let result = await callXMLHttpRequest(
        `${apiPort.apiReportLottoAllianceSettingBonus}`, {}
    );

    if (result.statusCodeText == textRespone.ok.CodeText && result.data) {
        $(idTable).children().remove();
        result.data.lotto_alliance.forEach((item) => {
            if (item.lotto_type !== null) {
                const { lotto_name, id } = item.lotto_type;
                let txt = `<tr>
				<th>${lotto_name}</th>
				<td>
					<div class="col-auto">
						<div class="input-group mb-2">
							<input type="text" class="form-control"
								name="affiliaterate[${id}]" style="width: 70%; background-color: azure;" value="${item.affiliate_rate}">
							<div class="input-group-prepend">
								<div class="input-group-text">%</div>
							</div>
						</div>
					</div>
				</td>
				</tr>`;
                $(idTable).append(txt);
            }
        });
    } else {
        handleApiFaild(result);
    }
}

async function handleAffCasino() {
    let resAffCasino = await callXMLHttpRequest(`${apiPort.ApiDataAffCasino}`, {});
    if (resAffCasino.statusCodeText == textRespone.ok.CodeText) {
        $(idInputAffCasino).val(resAffCasino.data[0].aff_m);
    } else {
        handleApiFaild(resAffCasino);
    }
}

async function function1() {
    var x = document.getElementById("table_affiliate");
    if (x.style.display === "none") {
        x.style.display = "block";
        htext1.innerText = "ซ่อน";
    } else {
        x.style.display = "none";
        htext1.innerText = "เปิด";
    }
}

function function2() {
    var x = document.getElementById("table_affiliate_slot");
    if (x.style.display === "none") {
        x.style.display = "block";
        htext2.innerText = "ซ่อน";
    } else {
        x.style.display = "none";
        htext2.innerText = "เปิด";
    }
}

async function handleSubmit2() {

    $("#btnSave").text('กำลังบันทึก...')

    const fromArr = $(idForm).serializeArray();

    let result = await callXMLHttpRequest(`${apiPort.apiUpdateLottoAllianceSettingBonus}`, fromArr);
    if (result.statusCodeText == textRespone.ok.CodeText && result.data) {

        Swal.fire({
            title: 'แจ้งเตือน',
            text: 'ทำรายการ เรียบร้อยแล้ว',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.value) {
                window.location.reload();
            }
        });
    } else {
        handleApiFaild(result);
    }
}

async function handleSubmitAffCasino() {
    $("#btnSaveCasino").text('กำลังบันทึก...');

    let result = await callXMLHttpRequest(`${apiPort.ApiSetAffCasino}`, { aff_m: $(idInputAffCasino).val() });
    if (result.statusCodeText == textRespone.ok.CodeText) {

        Swal.fire({
            title: 'แจ้งเตือน',
            text: 'ทำรายการ เรียบร้อยแล้ว',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.value) {
                window.location.reload();
            }
        });
    } else {
        handleApiFaild(result);
    }
}