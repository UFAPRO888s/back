// let member = parseJwt(localStorage.getItem('token'));
async function showLoader() {
  $(".loaderbg").fadeIn();
  await this.delay();
}

async function hideLoader() {
  $(".loaderbg").fadeOut("slow");
  await this.delay();
}

async function delay(ms = 500) {
  return new Promise((r) => setTimeout(r, ms));
}
let member = sessionStorage.getItem("token");
$(document).ready(function () {
  if (!member) {
    window.location.href = "../../login";
  }
});
