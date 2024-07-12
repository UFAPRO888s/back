const idContentLotto = "#tbodyContentLottoType";
const idLottoConfigLimit = "#lottoConfigLimit";
const idLottoName = "#lottoName";
const idLottoDate = "#lottoDate";
const idLottoDateClose = "#lottoDateClose";
const idLottoProfitMin = "#lottoProfitMin";
const idLottoProfitMax = "#lottoProfitMax";
const idLottoTypeId = "#lottoTypeId";
const idForm = "#formSetting";

$(document).ready(async function() {
    await handleRenderContent();
    hideLoader()
});

function handleRenderContent() {
    const lottoType = localStorage.getItem("lottoType");
    let result = callXMLHttpRequest(`${apiPort.ApiReportLottoSettingManage}`, {
        lottoType,
    });

    if (result.statusCodeText == textRespone.ok.CodeText) {
        if (result.data) {




            $(idContentLotto).children().remove();
            $(idLottoConfigLimit).children().remove();

            const resLottoType = result.data.lotto_type;
            if (resLottoType.lotto_group_id === 7) {
                $(".yeekee").css("dispaly", "block");
            } else {
                $(".yeekee").css("dispaly", "none");
            }
            $(idLottoTypeId).val(resLottoType.id);
            $(idLottoName).val(resLottoType.lotto_name);
            $(idLottoDate).val(resLottoType.lotto_date_open);
            $(idLottoDateClose).val(
                resLottoType.lotto_date + " " + resLottoType.time_close
            );
            $(idLottoProfitMin).val(resLottoType.profit_min);
            $(idLottoProfitMax).val(resLottoType.profit_max);
            result.data.lotto_config.forEach((item) => {
                let txt = `
                <tr>
                <th scope="row">${item.lotto_reward_type.description}</th>
                <td><label class="switch">
                    <input type="checkbox" name="lotto_config[${item.id}][use_flag]" checked>
                    <span class="slider round"></span>
                  </label><a style="margin-left: 30px;"></a>สถานะ :</td>
                <td>
                  <input class="form-control" style="width: 40%;" name="lotto_config[${item.id}][play_min]" value="${item.play_min}">
                </td>
                <td> <input class="form-control" style="width: 40%;" name="lotto_config[${item.id}][play_max]" value="${item.play_max}"></td>
                <td> <input class="form-control" style="width: 40%;" name="lotto_config[${item.id}][reward]" value="${item.reward}"></td>
              </tr>
              `;
                $(idContentLotto).append(txt);
            });
            result.data.lotto_config_limit.forEach((item) => {
                let txtTr = "";
                let countSum = 0;
                item.lotto_config_limit.forEach((item, key) => {
                    let countReward = item.reward * item.max;
                    countSum += countReward;
                    txtTr += ` <tr>
          <td>
          <input type="hidden" value="${item.min}" name="lotto_limit[${item.id}][min]">
            <input type="text" value="${item.reward}" name="lotto_limit[${item.id}][reward]" class="form-control" style="width: 70%; text-align: right;">
          </td>
          <td> <input type="text" value="${item.max}" name="lotto_limit[${item.id}][max]" class="form-control"  style="width: 70%; text-align: right;">
          </td>
          <td>${countReward}</td>
        </tr>`;
                });
                txtTr += ` <tr>
          <td class="text-right" colspan="2">รวมความเสี่ยงทั้งหมด</td>
          <td>${countSum}</td>
        </tr>`;
                let txt = `
        <div>
        <p>
          ${item.lotto_reward_type.description}
        </p>
      </div>
      <br>
      <table class="table">
        <thead>
          <tr>
            <th scope="col" class="text-center">จ่าย</th>
            <th scope="col" class="text-center">ลิมิต</th>
            <th scope="col" class="text-center">ความเสี่ยง</th>
          </tr>
         
        </thead>
        <tbody>
        ${txtTr}
        </tbody>
      </table>
      <br>
        `;
                $(idLottoConfigLimit).append(txt);
            });
            let lottoName = document.getElementById('lottoName').value;
            if (lottoName.search('หวยยี่กี') != -1) {
                document.getElementById('lottoProfitMin').disabled = false;
                document.getElementById('lottoProfitMax').disabled = false;
                document.getElementById('yikee_div').style.display = 'block';
            } else {
                document.getElementById('lottoProfitMin').disabled = true;

                document.getElementById('lottoProfitMax').disabled = true;
                document.getElementById('yikee_div').style.display = 'none';

            }
        } else {
            handleApiFaild(result);
        }
    }
}

async function handleSubmit() {
    await showLoader()
    if (canEdit) {
        const formArr = $(idForm).serializeArray();

        let result = callXMLHttpRequest(`${apiPort.apiUpdateLottoSetting}`, formArr);

        if (result.statusCodeText == textRespone.ok.CodeText) {

            Swal.fire({
                title: "แจ้งเตือน",
                text: "ทำรายการ เรียบร้อยแล้ว",
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
    } else {
        Swal.fire({
            title: 'แจ้งเตือน',
            text: 'ไม่มีสิทธิ์เข้าถึง',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
        })
    }
    hideLoader()
}