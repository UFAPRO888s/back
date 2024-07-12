$(document).ready(async function () {
  await setDataResult();
  hideLoader();
});

function initDataTables(tableData, id, column) {
  $("#" + id).DataTable({
    data: tableData,
    columns: column,
    responsive: {
      details: {
        display: $.fn.dataTable.Responsive.display.modal({
          header: function (row) {
            var data = row.data();
            return "ผู้ใช้งาน: " + data[1];
          },
        }),
        renderer: $.fn.dataTable.Responsive.renderer.tableAll({
          tableClass: "table",
        }),
      },
    },
    language: {
      lengthMenu: "แสดงข้อมูล _MENU_ แถว",
      zeroRecords: "ไม่พบข้อมูลที่ต้องการ",
      info: "แสดงหน้า _PAGE_ จาก _PAGES_",
      infoEmpty: "ไม่พบข้อมูลที่ต้องการ",
      infoFiltered: "(filtered from _MAX_ total records)",
      search: "ค้นหา",
      paginate: {
        previous: "ก่อนหน้านี้",
        next: "หน้าต่อไป",
      },
    },
  });
}

async function setDataResult() {
  let resResults = await callXMLHttpRequest(`${apiPort.apiTopRanking}`, {});
  if (resResults.statusCodeText == textRespone.ok.CodeText) {
    let htm_top_deposit = "";

    for (let i = 0; i < 10; i++) {
      if (i < resResults.top_deposit_today.length) {
        htm_top_deposit += "<tr>";
        htm_top_deposit +=
          '<td style="text-align:center;color:blue">' +
          resResults.top_deposit_today[i].member_username +
          "</td>";
        htm_top_deposit +=
          '<td style="text-align:center;">' +
          formatMoneyNotDecimal(resResults.top_deposit_today[i].amount) +
          "</td>";
        htm_top_deposit += "</tr>";
      } else {
        htm_top_deposit += "<tr>";
        htm_top_deposit += '<td style="text-align:center;color:blue">-</td>';
        htm_top_deposit += '<td style="text-align:center;">-</td>';
        htm_top_deposit += "</tr>";
      }
    }
    el("top_deposit_today").innerHTML = htm_top_deposit;

    let htm_top_withdraw = "";

    for (let i = 0; i < 10; i++) {
      if (i < resResults.top_withdraw_today.length) {
        htm_top_withdraw += "<tr>";
        htm_top_withdraw +=
          '<td style="text-align:center;color:blue">' +
          resResults.top_withdraw_today[i].member_username +
          "</td>";
        htm_top_withdraw +=
          '<td style="text-align:center;">' +
          formatMoneyNotDecimal(resResults.top_withdraw_today[i].amount) +
          "</td>";
        htm_top_withdraw += "</tr>";
      } else {
        htm_top_withdraw += "<tr>";
        htm_top_withdraw += '<td style="text-align:center;color:blue">-</td>';
        htm_top_withdraw += '<td style="text-align:center;">-</td>';
        htm_top_withdraw += "</tr>";
      }
    }
    el("top_withdraw_today").innerHTML = htm_top_withdraw;

    let htm_top_lottowin = "";

    for (let i = 0; i < 10; i++) {
      if (i < resResults.lottoWin_today.length) {
        htm_top_lottowin += "<tr>";
        htm_top_lottowin +=
          '<td style="text-align:center;color:blue">' +
          resResults.lottoWin_today[i].username +
          "</td>";
        htm_top_lottowin +=
          '<td style="text-align:center;">' +
          formatMoneyNotDecimal(resResults.lottoWin_today[i].amount) +
          "</td>";
        htm_top_lottowin += "</tr>";
      } else {
        htm_top_lottowin += "<tr>";
        htm_top_lottowin += '<td style="text-align:center;color:blue">-</td>';
        htm_top_lottowin += '<td style="text-align:center;">-</td>';
        htm_top_lottowin += "</tr>";
      }
    }
    el("top_lottowin_today").innerHTML = htm_top_lottowin;

    let htm_top_gamewin = "";

    for (let i = 0; i < 10; i++) {
      if (i < resResults.gameWin_today.length) {
        htm_top_gamewin += "<tr>";
        htm_top_gamewin +=
          '<td style="text-align:center;color:blue">' +
          resResults.gameWin_today[i].member +
          "</td>";
        htm_top_gamewin +=
          '<td style="text-align:center;">' +
          formatMoneyNotDecimal(resResults.gameWin_today[i].winloss) +
          "</td>";
        htm_top_gamewin += "</tr>";
      } else {
        htm_top_gamewin += "<tr>";
        htm_top_gamewin += '<td style="text-align:center;color:blue">-</td>';
        htm_top_gamewin += '<td style="text-align:center;">-</td>';
        htm_top_gamewin += "</tr>";
      }
    }
    el("top_gamewin_today").innerHTML = htm_top_gamewin;

    let htm_top_lottoloss = "";

    for (let i = 0; i < 10; i++) {
      if (i < resResults.lottoLoss_today.length) {
        htm_top_lottoloss += "<tr>";
        htm_top_lottoloss +=
          '<td style="text-align:center;color:blue">' +
          `${resResults.lottoLoss_today[i].username}` +
          "</td>";
        htm_top_lottoloss +=
          '<td style="text-align:center;">' +
          formatMoneyNotDecimal(resResults.lottoLoss_today[i].amount) +
          "</td>";
        htm_top_lottoloss += "</tr>";
      } else {
        htm_top_lottoloss += "<tr>";
        htm_top_lottoloss += '<td style="text-align:center;color:blue">-</td>';
        htm_top_lottoloss += '<td style="text-align:center;">-</td>';
        htm_top_lottoloss += "</tr>";
      }
    }
    el("top_lottoloss_today").innerHTML = htm_top_lottoloss;

    let htm_top_gameloss = "";

    for (let i = 0; i < 10; i++) {
      if (i < resResults.gameLoss_today.length) {
        htm_top_gameloss += "<tr>";
        htm_top_gameloss +=
          '<td style="text-align:center;color:blue">' +
          resResults.gameLoss_today[i].member +
          "</td>";
        htm_top_gameloss +=
          '<td style="text-align:center;">' +
          formatMoneyNotDecimal(resResults.gameLoss_today[i].winloss) +
          "</td>";
        htm_top_gameloss += "</tr>";
      } else {
        htm_top_gameloss += "<tr>";
        htm_top_gameloss += '<td style="text-align:center;color:blue">-</td>';
        htm_top_gameloss += '<td style="text-align:center;">-</td>';
        htm_top_gameloss += "</tr>";
      }
    }
    el("top_gameloss_today").innerHTML = htm_top_gameloss;

    //เดือน

    let htm_top_deposit_month = "";

    for (let i = 0; i < 10; i++) {
      if (i < resResults.top_deposit_month.length) {
        htm_top_deposit_month += "<tr>";
        htm_top_deposit_month +=
          '<td style="text-align:center;color:blue">' +
          resResults.top_deposit_month[i].member_username +
          "</td>";
        htm_top_deposit_month +=
          '<td style="text-align:center;">' +
          formatMoneyNotDecimal(resResults.top_deposit_month[i].amount) +
          "</td>";
        htm_top_deposit_month += "</tr>";
      } else {
        htm_top_deposit_month += "<tr>";
        htm_top_deposit_month +=
          '<td style="text-align:center;color:blue">-</td>';
        htm_top_deposit_month += '<td style="text-align:center;">-</td>';
        htm_top_deposit_month += "</tr>";
      }
    }
    el("top_deposit_month").innerHTML = htm_top_deposit_month;

    let htm_top_withdraw_month = "";

    for (let i = 0; i < 10; i++) {
      if (i < resResults.top_withdraw_month.length) {
        htm_top_withdraw_month += "<tr>";
        htm_top_withdraw_month +=
          '<td style="text-align:center;color:blue">' +
          resResults.top_withdraw_month[i].member_username +
          "</td>";
        htm_top_withdraw_month +=
          '<td style="text-align:center;">' +
          formatMoneyNotDecimal(resResults.top_withdraw_month[i].amount) +
          "</td>";
        htm_top_withdraw_month += "</tr>";
      } else {
        htm_top_withdraw_month += "<tr>";
        htm_top_withdraw_month +=
          '<td style="text-align:center;color:blue">-</td>';
        htm_top_withdraw_month += '<td style="text-align:center;">-</td>';
        htm_top_withdraw_month += "</tr>";
      }
    }
    el("top_withdraw_month").innerHTML = htm_top_withdraw_month;

    let htm_top_lottowin_month = "";

    for (let i = 0; i < 10; i++) {
      if (i < resResults.lottoWin_month.length) {
        htm_top_lottowin_month += "<tr>";
        htm_top_lottowin_month +=
          '<td style="text-align:center;color:blue">' +
          resResults.lottoWin_month[i].username.substring(7) +
          "</td>";
        htm_top_lottowin_month +=
          '<td style="text-align:center;">' +
          formatMoneyNotDecimal(resResults.lottoWin_month[i].amount) +
          "</td>";
        htm_top_lottowin_month += "</tr>";
      } else {
        htm_top_lottowin_month += "<tr>";
        htm_top_lottowin_month +=
          '<td style="text-align:center;color:blue">-</td>';
        htm_top_lottowin_month += '<td style="text-align:center;">-</td>';
        htm_top_lottowin_month += "</tr>";
      }
    }
    el("top_lottowin_month").innerHTML = htm_top_lottowin_month;

    let htm_top_gamewin_month = "";

    for (let i = 0; i < 10; i++) {
      if (i < resResults.gameWin_Month.length) {
        htm_top_gamewin_month += "<tr>";
        htm_top_gamewin_month +=
          '<td style="text-align:center;color:blue">' +
          resResults.gameWin_Month[i].member +
          "</td>";
        htm_top_gamewin_month +=
          '<td style="text-align:center;">' +
          formatMoneyNotDecimal(resResults.gameWin_Month[i].winloss) +
          "</td>";
        htm_top_gamewin_month += "</tr>";
      } else {
        htm_top_gamewin_month += "<tr>";
        htm_top_gamewin_month +=
          '<td style="text-align:center;color:blue">-</td>';
        htm_top_gamewin_month += '<td style="text-align:center;">-</td>';
        htm_top_gamewin_month += "</tr>";
      }
    }
    el("top_gamewin_month").innerHTML = htm_top_gamewin_month;

    let htm_top_lottoloss_month = "";

    for (let i = 0; i < 10; i++) {
      if (i < resResults.lottoLoss_month.length) {
        htm_top_lottoloss_month += "<tr>";
        htm_top_lottoloss_month +=
          '<td style="text-align:center;color:blue">' +
          `${resResults.lottoLoss_month[i].username.substring(7)}` +
          "</td>";
        htm_top_lottoloss_month +=
          '<td style="text-align:center;">' +
          formatMoneyNotDecimal(resResults.lottoLoss_month[i].amount * -1) +
          "</td>";
        htm_top_lottoloss_month += "</tr>";
      } else {
        htm_top_lottoloss_month += "<tr>";
        htm_top_lottoloss_month +=
          '<td style="text-align:center;color:blue">-</td>';
        htm_top_lottoloss_month += '<td style="text-align:center;">-</td>';
        htm_top_lottoloss_month += "</tr>";
      }
    }
    el("top_lottoloss_month").innerHTML = htm_top_lottoloss_month;

    let htm_top_gameloss_month = "";

    for (let i = 0; i < 10; i++) {
      if (i < resResults.gameLoss_Month.length) {
        htm_top_gameloss_month += "<tr>";
        htm_top_gameloss_month +=
          '<td style="text-align:center;color:blue">' +
          resResults.gameLoss_Month[i].member +
          "</td>";
        htm_top_gameloss_month +=
          '<td style="text-align:center;">' +
          formatMoneyNotDecimal(resResults.gameLoss_Month[i].winloss) +
          "</td>";
        htm_top_gameloss_month += "</tr>";
      } else {
        htm_top_gameloss_month += "<tr>";
        htm_top_gameloss_month +=
          '<td style="text-align:center;color:blue">-</td>';
        htm_top_gameloss_month += '<td style="text-align:center;">-</td>';
        htm_top_gameloss_month += "</tr>";
      }
    }
    el("top_gameloss_month").innerHTML = htm_top_gameloss_month;
  } else if (resResults.statusCodeText == "401") {
    Swal.fire({
      title: "แจ้งเตือน",
      text: resResults.description,
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
