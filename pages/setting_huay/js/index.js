const idContentLotto = "#contensLotto"

$(document).ready(async function() {
    await handleRenderContent();
    hideLoader()
});

function handleSetting(lottoId) {
    localStorage.setItem("lottoType", lottoId);
    window.location.href = 'huay_setting.html'
}

async function handleSettingSts(lottoId, sts) {
    let result = await callXMLHttpRequest(`${apiPort.ApiReportLottoSettingSts}`, {
        id: lottoId,
        sts: sts
    });
    if (result.statusCode == 200) {
        Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'อัพเดทข้อมูลสำเร็จ'
        }).then((result) => {
            window.location.reload();
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'กรุณาลองใหม่อีกครั้ง'
        }).then((result) => {
            window.location.reload();
        });
    }


}

function handleSettingCustom() {
    localStorage.setItem("lottoType", 1);
    window.location.href = 'yeekee_setting.html'
}

function handleRenderContent() {

    let result = callXMLHttpRequest(`${apiPort.apiReportLottoSetting}`, {});
    if (result.statusCodeText == textRespone.ok.CodeText) {
        /*** loop data */
        if (result.data) {
            let btnManage = `<a href="mange_huay.html" class="btn btn-success" style="float: right; margin-left: 20px;">mange</a>`
            $(idContentLotto).children().remove()
            result.data.forEach((item, key) => {
                let txtSub = ''
                if (item.lotto_detail.length > 0) {

                    // console.log(item)
                    if (item.lotto_group_id == 7) {
                        txtSub += ` <div class="col-6 col-sm-4">
                        <div class="card shadow" style="border-radius: 0px !important;">
                            <div class="card-header">
                            <div class="row">
                                <div class="col-6 col-sm-10">
                                <h class="card-text" >
                                    <img src="//s3auto.sgp1.vultrobjects.com/js_wauto/assets/imglogo-lotto/YK.png" class="mr-1" width="24px">หวยยี่กีทั้งหมด
                                </h>
                                </div>
                            </div>
                            </div>
                            
                            <div class="card-body">
                            <span class="badge bg-teal" style="position:absolute; top:0; right:0;">เปิดใช้งาน</span>
                            <a href="#" onclick="handleSettingCustom()" class="btn btn-primary" style="float: right; margin-left: 10px;">setting</a>
                            
                        </div> 
                            </div>
                        </div>`
                    }
                    item.lotto_detail.forEach((item2, key2) => {
                        let label_sts = (item2.sts == 1) ? 'success' : 'danger';
                        let label_sts2 = (item2.sts == 1) ? 'danger' : 'success';
                        console.log(label_sts)
                        txtSub += ` <div class="col-6 col-sm-4">
                        <div class="card shadow" style="border-radius: 0px !important;">
                            <div class="card-header">
                            <div class="row">
                                <div class="col-6 col-sm-10 pr-0">
                                <div class="card-text" >
								<span class="flag-icon flag-icon-${item2.lotto_image}"></span> ${item2.lotto_name}
                                </div>
                                </div>
								<div class="col-6 col-sm-2 pl-1 mt-2">
								<a href="#" onclick="handleSettingSts(${item2.id},${item2.sts})" class="btn btn-sm btn-${label_sts2}">${(item2.sts == 1)? 'ปิดหวย': 'เปิดหวย'}</a>
                                </div>
                            </div>
                            </div>
                            
                            <div class="card-body">
                            <span class="badge badge-${label_sts}" style="position:absolute; top:0; right:0;">${(item2.sts == 1)? 'เปิดใข้งาน': 'ปิดใข้งาน'}</span>
							
                            <a href="#" onclick="handleSetting(${item2.id})" class="btn btn-primary" style="float: right; margin-left: 10px;">setting</a>
                            
                        </div> 
                            </div>
                        </div>`
                    })

                }

                let txt = `<div class="card card-outline card-dark" style="border-radius: 0px !important;">
                          <div class="card-header">
                              <h3 class="card-title">${item.lotto_group_name}</h3>
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
}