function getDomainName(hostName) {
    return hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
}
const uat = window.location.host == '127.0.0.1:5501' ? 'http://127.0.0.1:11010' : `https://api.${getDomainName(window.location.host)}`;
const uat_lotto = window.location.host == '127.0.0.1:5501' ? 'http://127.0.0.1:11010' : `https://api.${getDomainName(window.location.host)}`;
const urlBackend = `https://backed.${getDomainName(window.location.host)}`;


const apiPort = {
    apiLogin: uat + '/Login',
    apiNav: uat + '/Apinav',
    apiDashboard: uat + '/Apidashboard',
    apiSettingDashboard: uat + '/ApiSettingDashboard',
    apiQueryMember: uat + '/Apiquerymember',
    apiQueryMemberByUser: uat + '/ApiquerymemberByUser',
    apiQueryMemberWarning: uat + '/ApiquerymemberWarning',
    apiQueryAddWarning: uat + '/ApiqueryAddWarning',
    apiQueryUpdateWarning: uat + '/ApiqueryUpdateWarning',
    apiQueryNewMember: uat + '/Apiquerynewmember',
    apiQueryMemberUFA: uat + '/ApiquerymemberUFA',
    apiUpdateGeneralSetting: uat + '/ApiupdateGeneralSetting',
    apiUpdateAutoSetting: uat + '/ApiupdateAutoSetting',
    apiUpdateNotifySetting: uat + '/ApiupdateNotifySetting',
    apiDeleteMember: uat + '/ApideleteMember',
    apiMember: uat + '/ApiqueryeMember',
    apiUpdateMember: uat + '/ApiupdateMember',
    apiUpdateMemberStatus: uat + '/ApiUpdateMemberStatus',
    apiUpdatePlayPowyingshup: uat + '/ApiupdatePlayPowyingshup',
    apiViewCreditUserUFA: uat + '/ApiviewCreditUserUFA',
    apiManageCredit: uat + '/ApimanageCredit',
    apiAddCredit: uat + '/ApiaddCredit',
    apiMinusCredit: uat + '/ApiminusCredit',
    apiQueryePromotion: uat + '/ApiqueryePromotion',
    apiUpdatePromotion: uat + '/ApiupdatePromotion',
    apiQueryePromotionHistory: uat + '/ApiqueryePromotionHistory',
    apiQueryeDepositHistory: uat + '/ApiqueryeDepositHistory',
    apiQueryeWithdrawHistory: uat + '/ApiqueryeWithdrawHistory',
    apiWithdrawUserAuto: uat + '/ApiwithdrawUserAuto',
    apiUpdateStatusWithdraw: uat + '/ApiupdateStatusWithdraw',
    apiUpdateUnStatusWithdraw: uat + '/ApiupdateUnStatusWithdraw',
    apiQueryWithdrawSuccess: uat + '/ApiqueryWithdrawSuccess',
    apiQueryWithdrawUnSuccess: uat + '/ApiqueryWithdrawUnSuccess',
    apiQueryResult: uat + '/ApiqueryResult',
    apiQueryWithdrawReport: uat + '/ApiqueryWithdrawReport',
    apiQueryWithdrawAutoReport: uat + '/ApiqueryWithdrawAutoReport',
    apiQueryDepositReport: uat + '/ApiqueryDepositReport',
    apiQueryFinanceReport: uat + '/ApiqueryFinanceReport',
    apiQueryTransactionManual: uat + '/ApiqueryTransactionManual',
    apiQueryTransactionAll: uat + '/ApiqueryTransactionAll',
    apiRegisterMemberManual: uat + '/ApiregisterMemberManual',
    apiQueryStaff: uat + '/ApiqueryStaff',
    apiAddStaff: uat + '/ApiaddStaff',
    apiDeleteStaff: uat + '/ApideleteStaff',
    apiQueryeStaffHistory: uat + '/ApiqueryeStaffHistory',
    apiQueryeSettingWheel: uat + '/ApiqueryeSettingWheel',
    apiUpdateSetting_w: uat + '/ApiupdateSetting_w',
    apiUpdateSettingWheel: uat + '/ApiupdateSettingWheel',
    apiUpdateSettingBanner: uat + '/ApiUpdateSettingBanner',
    apiUpdateSettingPopup: uat + '/ApiUpdateSettingPopup',
    apiQuerySettingPopup: uat + '/ApiQuerySettingPopup',
    apiQuerySettingBanner: uat + '/ApiQuerySettingBanner',
    apiUpdateSettingVip: uat + '/ApiUpdateSettingVip',
    apiQuerySettingVip: uat + '/ApiQuerySettingVip',
    apiUpdateSettingDoc: uat + '/ApiUpdateSettingDoc',
    apiQuerySettingDoc: uat + '/ApiQuerySettingDoc',
    apiQueryWheelReport: uat + '/ApiqueryWheelReport',
    apiQuerySettingPowYingShup: uat + '/ApiquerySettingPowYingShup',
    apiUpdatePowYingShup: uat + '/ApiupdatePowYingShup',
    apiQueryPowYingShupReport: uat + '/ApiqueryPowYingShupReport',
    apiCheckStatusSCB: uat + '/ApicheckStatusSCB',
    apiAddAlliance: uat + '/ApiaddAlliance',
    apiQueryAlliance: uat + '/ApiqueryAlliance',
    apiQueryDetailAlliance: uat + '/ApiqueryDetailAlliance',
    apiAddAllianceLog: uat + '/ApiaddAllianceLog',
    apiQueryAllianceLog: uat + '/ApiqueryAllianceLog',
    apiQueryAllianceByID: uat + '/ApiqueryAllianceByID',
    apiDeleteMemberAlliance: uat + '/ApideleteMemberAlliance',
    apiUpdateMemberAlliance: uat + '/ApiupdateMemberAlliance',
    apiQueryStaffByID: uat + '/ApiqueryStaffByID',
    apiUpdateStaff: uat + '/ApiupdateStaff',
    apiQueryTurnover: uat + '/ApiqueryTurnover',
    apiCreateSite: uat + '/createSite',
    apiChangePass: `${uat}/ApiChangePass`,
    apiMemberPartner: uat + '/ApiMemberPartner',
    apiGetMember: uat + '/ApiGetMember',
    apiDataMemberPartner: uat + '/ApiDataMemberPartner',
    apiChildrenMemberPartner: uat + '/ApiChildrenMemberPartner',
    apiMemberPartnerList: uat + '/ApiMemberPartnerList',
    apiMemberPartnerListOld: uat + '/ApiMemberPartnerListOld',

    apiQueryPromotion: uat + '/ApiqueryPromotion',
    apiQueryPromotionByID: uat + '/ApiqueryPromotionByID',
    apiQueryPromotionEditByID: uat + '/ApiqueryPromotionEditByID',
    apiUpdatePromotionbyID: uat + '/ApiupdatePromotionbyID',
    apiDeletePromotion: uat + '/ApideletePromotion',
    apiAddPromotion: uat + '/ApiaddPromotion',
    apiQueryPromotionType: uat + '/ApiqueryPromotionType',
    apiDeleteMemberPartner: uat + '/ApiDeleteMemberPartner',

    apiQueryAccountDeposit: uat + '/ApiqueryAccountDeposit',
    apiQueryAccountWithdraw: uat + '/ApiqueryAccountWithdraw',

    apiUpdateAccountDeposit: uat + '/ApiupdateAccountDeposit',
    apiUpdateAccountWithdraw: uat + '/ApiupdateAccountWithdraw',

    apiUpdateAccountDepositDetail: uat + '/ApiupdateAccountDepositDetail',
    apiUpdateAccountWithdrawDetail: uat + '/ApiupdateAccountWithdrawDetail',

    apiDeleteDeopsit: uat + '/ApideleteDeopsit',
    apiDeleteWithdraw: uat + '/ApideleteWithdraw',

    apiAddDeposit: uat + '/ApiaddDeposit',
    apiAddWithdraw: uat + '/ApiaddWithdraw',

    apiReportWinLost: uat + '/ApiReportWinLost',
    apiReportPlayer: uat + '/ApiReportPlayer',
    apiReportLottoSummary: uat + '/ApiReportLottoSummary',
    apiReportLottoSummaryNumber: uat + '/ApiReportLottoSummaryNumber',
    apiReportLottoSummaryMember: uat + '/ApiReportLottoSummaryMember',
    apiReportLottoSummaryCategory: uat + '/ApiReportLottoSummaryCatogy',

    apiReportLottoRemain: uat + '/ApiReportLottoRemain',
    apiReportLottoRemainNumber: uat + '/ApiReportLottoRemainNumber',
    apiReportLottoRemainMember: uat + '/ApiReportLottoRemainMember',
    apiReportLottoRemainCategory: uat + '/ApiReportLottoRemainCatogy',

    apiReportLottoSetting: uat + '/ApiReportLottoSetting',
    apiUpdateLottoSetting: uat_lotto + '/ApiUpdateLottoSetting',
    ApiReportLottoSettingManage: uat + '/ApiReportLottoSettingManage',
    ApiReportLottoSettingSts: uat + '/ApiReportLottoSettingSts',
    ApiReportLottoAlliance: uat + '/ApiReportLottoAlliance',

    apiQuerySettingGame: uat + '/ApiQuerySettingGame',


    apiGetBank: uat + '/ApiGetBank',
    apiQuerymemberSel: uat + '/ApiquerymemberSel',

    apiReportMemberTopup: uat + '/ApiReportMemberTopup',

    apiDashBoardAll: uat + '/ApiDashBoardAll',




    apiQuerySettingWeb: uat + '/ApiQuerySettingWeb',

    apiUpdateSettingWinLoss: uat + '/ApiUpdateSettingWinLoss',
    apiQueryMemberOnline: uat + '/ApiQueryMemberOnline',
    apiReportLottoAllianceSettingBonus: uat + '/ApiReportLottoAllianceSettingBonus',
    apiUpdateLottoAllianceSettingBonus: uat + '/ApiUpdateLottoAllianceSettingBonus',

    apiQueryeUnHistoryDepositHistory: uat + '/ApiqueryeUnHistoryDepositHistory',


    apiAddCreditUnSuccessDeposit: uat + '/ApiAddCreditUnSuccessDeposit',
    TrueWalletAPI: uat + '/TrueWalletAPI',
    apiCheckBalanceBank: uat + '/ApicheckBalanceBank',
    apiQuerySettingTruewallet: uat + '/ApiQuerySettingTruewallet',
    apiUpdateSettingTruewallet: uat + '/ApiUpdateSettingTruewallet',
    apiExchangeTransfer: uat + '/ApiExchangeTransfer',
    apiUpdateGameWebStatus: uat + '/ApiUpdateGameWebStatus',
    apiDataMemberChildPartner: uat + '/ApiDataMemberChildPartner',
    apiDataMemberPartnerType: uat + '/ApiDataMemberPartnerType',


    apiGetLottoType: uat + '/ApiGetLottoType',
    apiGetLottoDate: uat + '/ApiGetLottoDate',
    apiGetDetailLotto: uat + '/ApiGetDetailLotto',
    apiGetRewardLotto: uat + '/ApiGetRewardLotto',
    apiCreateLottoLimit: uat + '/ApiCreateLottoLimit',
    apiUpdateLottoLimit: uat + '/ApiUpdateLottoLimit',
    apiDeleteLottoLimit: uat + '/ApiDeleteLottoLimit',
    apiConvertMember: uat + '/ApiConvertMember',
    apiConvertMemberPartner: uat + '/ApiConvertMemberPartner',




    apiUpdateLottoSetting: uat_lotto + '/ApiUpdateLottoSetting',
    apiQueryLottoGroupType: uat_lotto + '/ApiQueryLottoGroupType',
    apiQueryLottoGroupTypeWait: uat_lotto + '/ApiQueryLottoGroupTypeWait',


    apiMenubar: uat + '/ApiMenubar',
    apiMenubarStaff: uat + '/ApiMenubarStaff',
    apiQueryEditStaff: uat + '/ApiQueryEditStaff',

    //Ref
    ApiMemberAff: `${uat}/ApiMemberAff`,
    ApiDataAffCasino: `${uat}/ApiDataAffCasino`,
    ApiSetAffCasino: `${uat}/ApiSetAffCasino`,

    //Custom
    ApiReportLottoSettingManageYeeKee: `${uat}/ApiReportLottoSettingManageYeeKee`,
    ApiUpdateLottoSettingYeeKee: `${uat}/ApiUpdateLottoSettingYeeKee`,
    apiQueryTransactionWithId: `${uat}/ApiQueryTransactionWithId`,
    apiQueryTransactionLottoWithId: `${uat}/ApiQueryTransactionLottoWithId`,
    apiQueryTransactionGameWithId: `${uat}/ApiQueryTransactionGameWithId`,


    apiBoardAnnounce: `${uat}/ApiBoardAnnounce`,
    apiGetTransactionMember: `${uat}/ApiGetTransactionMember`,
    apiTopRanking: `${uat}/ApiTopRanking`,

    apiaddCreditTransaction: `${uat}/ApiaddCreditTransaction`,
    apiReportMemberTopupSort: `${uat}/ApiReportMemberTopupSort`,


    apiqueryeBank: `${uat}/ApiqueryeBank`,

    apiDeleteDataImg: `${uat}/ApiDeleteDataImg`,


    // Coupon

    apiQueryCoupon: `${uat}/ApiQueryCoupon`,
    apiaddCoupon: `${uat}/ApiaddCoupon`,
    apiUpdateStatusCoupon: `${uat}/ApiUpdateStatusCoupon`,
    apideleteCoupon: `${uat}/ApideleteCoupon`,
    apiQueryGroupCoupon: `${uat}/ApiQueryGroupCoupon`,
    apiUpdateStatusCouponGroup: `${uat}/ApiUpdateStatusCouponGroup`,
    apiQueryCouponLog: `${uat}/ApiQueryCouponLog`,

    apideleteCouponGroup: `${uat}/ApideleteCouponGroup`,
    apiMemberPartnerListYod: `${uat}/ApiMemberPartnerListYod`,
    apiCheckRemark: `${uat}/ApiCheckRemark`,
    apiTranferYod: `${uat}/ApiTranferYod`,
    apiUpload: `${uat}/ApiUpload`,


}