$(document).ready(function () {
  Loading();
});

async function setData() {
  let resDashboard = await callXMLHttpRequest(
    `${apiPort.apiBoardAnnounce}`,
    {}
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
                    <span>${
                      formatDate1(resDashboard.notice[i].cre_date) +
                      " " +
                      formatTime(resDashboard.notice[i].cre_date)
                    } </span>
                </div>
                <div class="col-9">
                <span
                style="background-color: #00a035;color:#fff;border-radius: 3px;font-size:10px;padding:1px;">
                &nbsp;ประกาศ&nbsp; </span>&nbsp;&nbsp;&nbsp;&nbsp;<span>${
                  resDashboard.notice[i].description
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
                    <span>${
                      formatDate1(resDashboard.game[i].cre_date) +
                      " " +
                      formatTime(resDashboard.game[i].cre_date)
                    } </span>
                </div>
                <div class="col-9">
                <span
                style="background-color: #dc3545;color:#fff;border-radius: 3px;font-size:10px;padding:1px;">
                &nbsp;แจ้งเตือน${type}&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>${
        resDashboard.game[i].description
      }</span>
                </div>
            </div>
        </div>`;
    }

    for (let i = 0; i < resDashboard.registerMember.length; i++) {
      htm_register += `<div style="border-bottom:1px solid #b2b7bb;padding: 5px">
            <div class="row">
                <div class="col-3">
                    <span>${
                      formatDate1(resDashboard.registerMember[i].cre_date) +
                      " " +
                      formatTime(resDashboard.registerMember[i].cre_date)
                    } </span>
                </div>
                <div class="col-9">
                <span
                style="background-color: #28a745;color:#fff;border-radius: 3px;font-size:10px;padding:1px;">
                &nbsp;แจ้งเตือนสมัครสมาชิก&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>${
                  resDashboard.registerMember[i].username
                } ${
        resDashboard.registerMember[i].name
      } <span style="background-color: ${
        resDashboard.registerMember[i].color
      };color:#fff;border-radius: 2px;font-size:12px;">&nbsp;${
        resDashboard.registerMember[i].bank_name
      }&nbsp;</span></span>
                </div>
            </div>
        </div>`;
    }

    for (let i = 0; i < resDashboard.deposit.length; i++) {
      htm_deposit += `<div style="border-bottom:1px solid #b2b7bb;padding: 5px">
            <div class="row">
                <div class="col-3">
                    <span>${
                      formatDate1(resDashboard.deposit[i].transaction_date) +
                      " " +
                      formatTime(resDashboard.deposit[i].transaction_date)
                    } </span>
                </div>
                <div class="col-9">
                <span
                style="background-color: #28a745;color:#fff;border-radius: 3px;font-size:10px;padding:1px;">
                &nbsp;แจ้งเตือนฝากเงิน&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>${
                  resDashboard.deposit[i].member_username
                } จำนวน : ${resDashboard.deposit[i].amount} บาท</span>
                </div>
            </div>
        </div>`;
    }
    for (let i = 0; i < resDashboard.withdraw.length; i++) {
      htm_withdraw += `<div style="border-bottom:1px solid #b2b7bb;padding: 5px">
            <div class="row">
                <div class="col-3">
                    <span>${
                      formatDate1(resDashboard.withdraw[i].transaction_date) +
                      " " +
                      formatTime(resDashboard.withdraw[i].transaction_date)
                    } </span>
                </div>
                <div class="col-9">
                <span
                style="background-color: #dc3545;color:#fff;border-radius: 3px;font-size:10px;padding:1px;">
                &nbsp;แจ้งเตือนถอนเงิน&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>${
                  resDashboard.withdraw[i].member_username
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

async function Loading() {
  let timerInterval;
  Swal.fire({
    title: "Loading...",
    html: "",
    timer: 2000,
    allowOutsideClick: false,
    timerProgressBar: true,
    didOpen: async () => {
      await Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("b");
      timerInterval = setInterval(() => {}, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      setData();
    }
  });
}

setInterval(function () {
  setData();
}, 20000);
