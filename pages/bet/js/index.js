const idTable = "table-member-partner";
const idContentLotto = "#contensLotto"
$(document).ready(async function() {
    await setDate('lottoDate', moment().format('YYYY-MM-DD'));
    await handleRenderContent();
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
    console.log(date);
    el(id).value = date;
}
async function handleRenderContent() {
    await showLoader()
    const formData = $("#formSearch").serializeArray();
    let dataReq = genObjectSerializeArray(formData);
    dataReq.lottoDate = convertTHDateTime(dataReq.lottoDate + " 00:00");
    let result = await callXMLHttpRequest(`${apiPort.apiQueryLottoGroupTypeWait}`, dataReq);
    if (result.statusCodeText == textRespone.ok.CodeText) {
        /*** loop data */
        if (result.data) {
            console.log(result.data)
            $(idContentLotto).children().remove()
            result.data.forEach((item, key) => {
                let txtSub = ''
                if (item.lotto_type.length > 0) {
                    item.lotto_type.forEach((item2, key2) => {
                        txtSub += ` <div class="col-6 col-sm-4">
              <div class="card shadow" style="border-radius: 0px !important;">
                <div class="card-header">
                  <div class="row">
                    <div class="col-6 col-sm-10">
                      <h3 class="card-title">
					  <span class="flag-icon flag-icon-${item2.lotto_image}"></span>  ${item2.lotto_name} ${moment(dataReq.lottoDate).format('YYYY-MM-DD')}
                      </h3>
                    </div>
                    <div class="col-6 col-sm-2">
                      <span class="badge badge-success bg-teal">เปิดใช้งาน</span>
                    </div>
                  </div>
                  <div class="row mt-2">
                    <div class="col-12 text-right">
                      <span >ยอดทั้งหมด ${formatMoney(item2.amount)}</span>
                    </div>
                 
                  </div>
                </div>
                 <div class="card-body">
              <div class="row">
                    <div class="col-6 mt-1">
                    <button onclick="callTotalHuay(1,${item.lotto_group_id},${item2.id},'${dataReq.lottoDate}')" class="btn btn-primary btn-block">ยอดตามประเภท</button>
                    </div>
                    <div class="col-6 mt-1">
                    <button onclick="callTotalHuay(1,${item.lotto_group_id},${item2.id},'${dataReq.lottoDate}')" class="btn btn-success btn-block">ยอดตามหมายเลข</button>
                    </div>
                    <div class="col-6 mt-1">
                    <button onclick="callTotalHuay(1,${item.lotto_group_id},${item2.id},'${dataReq.lottoDate}')" class="btn btn-danger btn-block">ยอดตามสมาชิก</button>
                    </div>
              </div>
                </div>
                </div>
            </div>`
                    })

                } else {
                    txtSub += ` <div class="col-6 col-sm-4">
              <div class="card shadow" style="border-radius: 0px !important;">
                <div class="card-header">
                  <div class="row">
                    <div class="col-6 col-sm-10">
                      <h3 class="card-title">
                        <img src="//s3auto.sgp1.vultrobjects.com/js_wauto/assets/imglogo-lotto/YK.png" class="mr-1" width="24px"> ${item.lotto_group_name} ${moment(dataReq.lottoDate).format('YYYY-MM-DD')}
                      </h3>
                    </div>
                    <div class="col-6 col-sm-2">
                      <span class="badge badge-success bg-teal">เปิดใช้งาน</span>
                    </div>
                  </div>
                  <div class="row mt-2">
                  <div class="col-12 text-right">
                  <span >0.00</span>
                </div>
                  </div>
                </div>
                 <div class="card-body">
                    <div class="row">
                      <div class="col-12 mt-1">
                        <button class="btn btn-secondary btn-block">ไม่พบข้อมูลตามวันที่นี้</button>
                      </div>
                    </div>
                </div>
                </div>
            </div>`
                }

                let txt = `<div class="card card-outline card-primary" style="border-radius: 0px !important;">
                        <div class="card-header">
                            <h3 class="card-title">${item.group_name}</h3>
                          <div class="card-tools">
                              <button type="button" class="btn btn-tool" data-card-widget="collapse">
                              <i class="fas fa-minus"></i>
                              </button>
                          </div>
                        </div>
                        <div class="card-body">
                        <div class="row">
                              ${txtSub}
                          </div>
                        </div>
                      </div>`

                $(idContentLotto).append(txt)


            })
        }

    } else {
        handleApiFaild(result);
    }
    hideLoader()
}

async function delay(ms = 1000) {
    return new Promise((r) => setTimeout(r, ms));
}


async function callTotalHuay(mode, g_id, t_id, date) {
    localStorage.setItem("mode_func", mode);
    localStorage.setItem("huay_g_id", g_id);
    localStorage.setItem("huay_t_id", t_id);
    localStorage.setItem("huay_date_find", date);
    window.location.replace('/pages/bet/report_bet.html');
}