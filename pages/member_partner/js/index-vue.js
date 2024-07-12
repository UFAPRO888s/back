const configSelect2 = {
    theme: "bootstrap",
    width: "resolve",
};
$(document).ready(async function() {
    $('#table-member-partner').DataTable();
    setSelect2();
    hideLoader()
});

function setSelect2() {
    $(".select2").select2(configSelect2);
}

Vue.directive('select', {
    twoWay: true,
    bind: function(el) {
        $(el).select2().on("select2:select", (e) => {
            // v-model looks for
            //  - an event named "change"
            //  - a value with property path "$event.target.value"
            el.dispatchEvent(new Event('change', { target: e.target }));
        });
    },
    componentUpdated: function(el) {
        // update the selection if the value is changed externally
        $(el).trigger("change");
    }
});

const app = new Vue({
    el: "#app",
    data: {
        idElement: {
            idModal: "#modal-member-partner",
            idTable: "table-member-partner"
        },
        initData: {
            selectTypePartner: [],
            selectTypePartnerChild: [],
            selectPartner: [],
            selectChildPartner: [],
            isShowSelectPartner: true
        },
        formData: {
            valPartnerType: 1,
            valPartnerId: 0,
            percentLottoMaxPartner: 100,
            percentGameMaxPartner: 100,
            childPartner: [{
                member_id_partner: 0,
                member_type_id: 1,
                member_id: 0,
                percent_lotto: 0,
                percent_game: 0,
                partner_type: 'PN',
                updated_at: 0,
            }],
            detailPartner: {}
        },
        resetFormData: {},
        searchData: {
            memberIdPartner: 0,
            historyDetailChild: []
        },
        tableData: {},
        titleModel: {
            edit: "เพิ่ม Senior",
            new: "แบ่งหุ้นสมาชิค"
        },
        stateTitleModal: 0,
    },
    created() {
        this.getInitialData() // get data api and set to initialData
        this.handleTable()
    },
    watch: {
        stateTitleModal(val) {
            // console.log(val);
        }
    },
    computed: {
        showTitleModal() {
            if (this.stateTitleModal === 0) {
                return this.titleModel.new
            } else {
                return this.titleModel.edit
            }
        },
    },
    methods: {
        getInitialData: function() {
            this.resetFormData = JSON.parse(JSON.stringify(this.formData))
            const res = callXMLHttpRequest(`${apiPort.apiDataMemberPartnerType}`, { id: 0 });
            if (res.statusCodeText == textRespone.ok.CodeText) {
                this.initData.selectTypePartner = res.data
                this.initData.selectTypePartnerChild = res.data
                this.handleCheckPartnerType()
            }

            const { valPartnerType } = this.formData
            const reqData = {
                partnerType: valPartnerType,
                mode: ''
            }
            const resPartner = callXMLHttpRequest(`${apiPort.apiGetMember}`, reqData);
            if (resPartner.statusCodeText == textRespone.ok.CodeText) {
                this.initData.selectPartner = resPartner.data
            }
            this.setSelectChildPartner({ mode: 'create' })
        },
        resetForm: function() {
            this.formData = JSON.parse(JSON.stringify(this.resetFormData))
        },
        setSelectChildPartner: function(reqData) {
            const resChildPartner = callXMLHttpRequest(`${apiPort.apiGetMember}`, reqData);
            if (resChildPartner.statusCodeText == textRespone.ok.CodeText) {
                this.initData.selectChildPartner = resChildPartner.data
            }
        },
        showModal: function() {
            const { idModal } = this.idElement
            $(idModal).modal("show");
        },
        handleShow: function() {
            this.stateTitleModal = 1;
            this.resetForm()
            this.showModal()
            this.reRenderSelect2()
        },
        handleTable: function(memberIdPartner = 0, modeBack = 'show') {
            this.searchData.memberIdPartner = memberIdPartner

            if (modeBack !== 'back') {
                this.searchData.historyDetailChild.push(memberIdPartner)
            }
            const res = callXMLHttpRequest(`${apiPort.apiDataMemberPartner}`, this.searchData);
            if (res.statusCodeText == textRespone.ok.CodeText) {
                this.tableData = res.data
            }
        },
        handleEdit: function(item) {
            // console.log(item)
            this.stateTitleModal = 0
            const reqData = {
                id: item.member_id,
                mode: 'edit',
                partnerType: item.member_id
            }
            this.setSelectChildPartner(reqData)
            this.formData.valPartnerType = item.member_type_id
            this.formData.valPartnerId = item.member_id
                // const defaltChildPrrtnerData = this.formData.childPartner;
            const res = callXMLHttpRequest(`${apiPort.apiChildrenMemberPartner}`, reqData);
            if (res.statusCodeText == textRespone.ok.CodeText) {
                this.formData.childPartner = res.data.length > 0 ? res.data : this.formData.childPartner
                this.initData.selectPartner
            }
            this.reRenderSelect2()
            this.showModal()
            this.checkSelectPartner(item)
        },
        handleSubmit: function() {
            const result = callXMLHttpRequest(`${apiPort.apiMemberPartner}`, this.formData);
            if (result.statusCodeText == textRespone.ok.CodeText) {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: "ทำรายการ แบ่งหุ้นสมาชิก เรียบร้อยแล้ว",
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
        },
        handleDelete: function(index) {
            const id = index.member_id
            Swal.fire({
                title: "แจ้งเตือน",
                text: "คุณต้องการที่จะลบข้อมูลนี้หรือไม่ ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#dc3545",
                cancelButtonColor: "#009102",
                confirmButtonText: "Delete",
            }).then((result) => {
                if (result.isConfirmed) {
                    let resDeleteMember = callXMLHttpRequest(
                        `${apiPort.apiDeleteMemberPartner}`, { id }
                    );
                    if (resDeleteMember.statusCodeText == textRespone.ok.CodeText) {
                        Swal.fire({
                            title: "แจ้งเตือน",
                            text: "ลบข้อมูลเรียบร้อยแล้ว",
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
                        handleApiFaild(resDeleteMember);
                    }
                }
            });
        },
        handleCheckPartnerType: function() {
            const { valPartnerId, valPartnerType } = this.formData
            const reqData = {
                partnerType: valPartnerType,
                mode: ''
            }

            const orderPartnerType = this.initData.selectTypePartner.find((item) => item.id === valPartnerType)

            const { number_order: numberOrderPartner } = orderPartnerType
            if (valPartnerId) {

                this.initData.selectTypePartnerChild.forEach((item) => {

                    if (item.number_order > numberOrderPartner) {
                        item.sts = 1
                    } else {
                        item.sts = 0
                    }
                })
            }
            const res = callXMLHttpRequest(`${apiPort.apiGetMember}`, reqData);
            if (res.statusCodeText == textRespone.ok.CodeText) {
                this.initData.selectPartner = res.data
            }
        },
        addList: function(index) {
            this.formData.childPartner.push({...this.formData.childPartner[index] })
            this.reRenderSelect2()
        },
        reRenderSelect2: function() {
            this.$nextTick(function() {
                $(".select2").select2(configSelect2);
            })
        },
        removeList: function(index) {
            console.log(index);
            this.formData.childPartner.splice(index, 1)
        },
        checkMax: function(event, type, index) {
            const { percentGameMaxPartner, percentLottoMaxPartner } = this.formData
            if (type === 'lotto' && event.target.value > percentLottoMaxPartner) {
                event.target.value = percentLottoMaxPartner
                this.formData.childPartner[index].percent_lotto = percentLottoMaxPartner
            }

            if (type === 'game' && event.target.value > percentGameMaxPartner) {
                event.target.value = percentGameMaxPartner
                this.formData.childPartner[index].percent_game = percentGameMaxPartner
            }
        },
        checkSelectPartner: function(items) {
            const find = this.initData.selectPartner.find((item) => {
                // console.log(item)
                return item.id === this.formData.valPartnerId
            })
            if (!find) {
                // console.log(items)
                // find = items.find((item) => {
                //     console.log(item)
                //     return item. === this.formData.valPartnerId
                // })
            }

            if (find) {
                this.formData.detailPartner = find
                this.formData.percentLottoMaxPartner = find.percent_lotto
                this.formData.percentGameMaxPartner = find.percent_game
            } else {
                this.formData.detailPartner = items
                this.formData.percentLottoMaxPartner = items.percent_lotto
                this.formData.percentGameMaxPartner = items.percent_game
            }

            this.handleCheckPartnerType()
        },
        btnBack: function() {
            let backIndex = this.searchData.historyDetailChild.length - 2
            let memberIdPartnerBack = this.searchData.historyDetailChild[backIndex]
            this.searchData.historyDetailChild.pop()
            if (this.searchData.historyDetailChild.length === 0) {
                this.handleTable(0, 'back')
            } else {
                this.handleTable(memberIdPartnerBack, 'back')
            }

        },
        addMode(data) {
            if (this.stateTitleModal === 1 && data.id === 1) {
                return true;
            } else if (this.stateTitleModal === 0 && data.id !== 1) {
                return true;
            } else {
                return false;
            }
        }
    }
});