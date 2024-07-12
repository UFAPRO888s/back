let member_nav = parseJwt(sessionStorage.getItem("token"));
let category = [];
let resNav = callXMLHttpRequest(`${apiPort.apiNav}`, {});
let resGame = callXMLHttpRequest(`${apiPort.apiQuerySettingGame}`, {});
let stsUFA = resGame.data[0].sts;
let stsLotto = resGame.data[1].sts;
let user = member_nav.username;
let stats = member_nav.stats;
let count = resNav.count || 0;
let sound = new Audio(
    "https://s3auto.sgp1.vultrobjects.com/js_wauto/assets/ringtones/withdraw.mp3"
);
let canEdit = true;
const hostName = window.location.host;
let path =
    "/pages/" + window.location.pathname.split("pages")[1].split("/")[1] + "/";
if (hostName === "localhost") {
    path = path.replace(/\/backend_auto/, "");
}
document.getElementsByTagName("title")[0].innerHTML =
    "Backend System .::.  By  Firework";

$(window).on("load", async function() {
    // let timerInterval
    // Swal.fire({
    //     title: 'Loading...',
    //     html: '<b></b> milliseconds.',
    //     timer: 2500,
    //     timerProgressBar: true,
    //     didOpen: () => {
    //         Swal.showLoading()
    //         const b = Swal.getHtmlContainer().querySelector('b')
    //         console.log();
    //         timerInterval = setInterval(() => {
    //             b.textContent = Swal.getTimerLeft()
    //             if(b.textContent == 'Token not Found'){
    //                 console.log(true);
    //             }
    //         }, 100)
    //     },
    //     willClose: () => {
    //         clearInterval(timerInterval)
    //     }
    // }).then((result) => {
    //     /* Read more about handling dismissals below */
    //     if (result.dismiss === Swal.DismissReason.timer) {

    //     }
    // })

    // el('nav-bar').innerHTML = htm;
    await setDataNav();
    if (member_nav.stats == 109 || member_nav.stats == 99) {
        if (el("nav-img"))
            el("nav-img").src =
            "//s3auto.sgp1.vultrobjects.com/js_wauto/assets/images/AdminLogo.png";
    } else {
        if (el("nav-img"))
            el("nav-img").src =
            "//s3auto.sgp1.vultrobjects.com/js_wauto/source/images/staff.png";
    }
    let textadmins = "";
    if (member_nav.stats == 109) {
        textadmins = '<font color="pink">Programmer</font>';
    } else if (member_nav.stats == 99) {
        textadmins = '<font color="green">Admin</font>';
    } else {
        textadmins = '<font color="red">พนักงาน</font>';
    }
    if (el("nav-username")) {
        el('nav-username').innerHTML = `<span onclick="changepass(${member_nav.id})">${member_nav.username} ( ${textadmins} )</span>`;
    }



});

async function setDataNav() {
    let htm = "";

    let resNav = await callXMLHttpRequest(`${apiPort.apiMenubar}`, {});

    let navbar = resNav.data;
    for (let i = 0; i < navbar.length; i++) {
        if (navbar[i].parent_lv1 != 0) {
            let pathlv1 = path.split("/pages/")[1];
            pathlv1 = pathlv1.split("/")[0];
            pathlv1 = "../" + pathlv1;
            let navhead = navbar[i].parent_lv1.find(
                (item) => item.path_menu == pathlv1
            );

            if (navhead) {
                htm += `<li class="nav-item  menu-is-opening menu-open">~
                <a href="#" class="nav-link ">
                <i class="nav-icon  ${navbar[i].menu_icon}"></i>
                <p>
                ${navbar[i].name_menu}
                <i class="right fas fa-angle-left"></i>
                </p>
                </a>
                <ul class="nav nav-treeview">`;
            } else {
                htm += `<li class="nav-item">
                <a href="#" class="nav-link ">
                <i class="nav-icon  ${navbar[i].menu_icon}"></i>
                <p>
                ${navbar[i].name_menu}
                <i class="right fas fa-angle-left"></i>
                </p>
                </a>
                <ul class="nav nav-treeview">`;
            }

            for (let j = 0; j < navbar[i].parent_lv1.length; j++) {
                let paths = navbar[i].parent_lv1[j].path_menu.split("../");
                if (path == "/pages/" + paths[1] + "/") {
                    canEdit = navbar[i].parent_lv1[j].menu_edit == 1 ? true : false;
                    htm += `<li class="nav-item">
                <a href="${navbar[i].parent_lv1[j].path_menu}" class="nav-link active">
                    <i class="nav-icon ${navbar[i].parent_lv1[j].menu_icon}"></i><p>${navbar[i].parent_lv1[j].name_menu}</p></a>
            </li>`;
                } else {
                    htm += `<li class="nav-item">
                    <a href="${navbar[i].parent_lv1[j].path_menu}" class="nav-link">
                        <i class="nav-icon ${navbar[i].parent_lv1[j].menu_icon}"></i><p>${navbar[i].parent_lv1[j].name_menu}</p></a>
                </li>`;
                }
            }
            htm += `</li>
        </ul>`;
        } else {
            let paths = navbar[i].path_menu.split("../");
            let withdraw = "";
            if (navbar[i].name_menu == "ถอนเงิน") {
                withdraw = `<span class="ml-1 badge badge-danger" id="checknotifi4">${count}</span>`;
            }
            if (path == "/pages/" + paths[1] + "/") {
                canEdit = navbar[i].menu_edit == 1 ? true : false;
                htm += `<li class="nav-item">
            <a href="${navbar[i].path_menu}" class="nav-link active">
                <i class="nav-icon ${navbar[i].menu_icon}"></i><p>${navbar[i].name_menu}${withdraw}</p></a>
        </li>`;
            } else {
                htm += `<li class="nav-item">
                <a href="${navbar[i].path_menu}" class="nav-link">
                    <i class="nav-icon ${navbar[i].menu_icon}"></i><p>${navbar[i].name_menu}${withdraw}</p></a>
            </li>`;
            }

            // if (path == '/pages/dashboard/') {
            //     htm = `<li class="nav-item">
            //         <a href="../dashboard" class="nav-link active">
            //             <i class="nav-icon fas fa-tachometer-alt"></i><p>หน้าแรก</p></a>
            //     </li>`;
            // } else {
            //     htm = `<li class="nav-item">
            //             <a href="../dashboard" class="nav-link">
            //                 <i class="nav-icon fas fa-tachometer-alt"></i><p>หน้าแรก</p></a>
            //         </li>`;
            // }
        }
    }

    htm += `<li class="nav-header">ผู้ใช้งาน</li>
    <li class="nav-item">
    <a href="#" class="nav-link" onclick="logout()">
        <i class="nav-icon far fa-solid fa-right-from-bracket"></i><p>ออกจากระบบ</p></a>
    </li>`;

    if (el("nav-bar")) {
        el("nav-bar").innerHTML = htm;
    } else {
        console.log("htm does not exist", el("nav-bar"));
    }
}

setInterval(function() {
    $(".check-notifi-status").addClass("fa-spin");
    resNav = callXMLHttpRequest(`${apiPort.apiNav}`, {});
    if (resNav.statusCodeText == textRespone.ok.CodeText) {
        if (count < resNav.count) {
            sound.play();
        }
        count = resNav.count || 0;
        if (el("checknotifi4")) {
            el("checknotifi4").innerHTML = count;
        }
    } else {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("category");
        window.location.href = "../../login";
    }
}, 10000);

function logout() {
    Swal.fire({
        title: "แจ้งเตือน",
        text: "คุณต้องการที่จะออกจากระบบหรือไม่ ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Logout",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("แจ้งเตือน", "ออกจากระบบเรียบร้อยแล้ว", "success").then(
                (result) => {
                    if (result.value) {
                        sessionStorage.removeItem("token");
                        sessionStorage.removeItem("category");
                        window.location.href = "../../login";
                    }
                }
            );
        }
    });
}

async function changepass(id) {
    Swal.fire({
            title: 'ใส่รหัสผ่านใหม่ที่ต้องการ',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            showLoaderOnConfirm: true,
            preConfirm: async(newpass) => {
                return await callXMLHttpRequest(`${apiPort.apiChangePass}`, { id: id, newpass: newpass });
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            console.log(result);
            if (result.isConfirmed && result.value.statusCode === 200) {
                Swal.fire(
                    'แจ้งเตือน',
                    `${result.value.data}`,
                    'success'
                ).then(() => {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('category');
                    window.location.href = "../../login";
                })
            }
        })
        // let res = await callXMLHttpRequest(`${apiPort.apiChangePass}`, { id: id, newpass: newpass });
}