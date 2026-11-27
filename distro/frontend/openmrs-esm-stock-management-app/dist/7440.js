(globalThis.webpackChunk_openmrs_esm_stock_management_app=globalThis.webpackChunk_openmrs_esm_stock_management_app||[]).push([["7440"],{4126(e,t,a){"use strict";a.d(t,{A:()=>n});let n={headerBtnContainer:"-esm-stock-management__stock-items-table__headerBtnContainer___Lvtqz",tileContainer:"-esm-stock-management__stock-items-table__tileContainer___xZqOk",tile:"-esm-stock-management__stock-items-table__tile___yRrkk",tileContent:"-esm-stock-management__stock-items-table__tileContent___3HzgB",content:"-esm-stock-management__stock-items-table__content___Giie2",helper:"-esm-stock-management__stock-items-table__helper___coPmu",separator:"-esm-stock-management__stock-items-table__separator___Lo7I2",toolbarContent:"-esm-stock-management__stock-items-table__toolbarContent___JQ8Kq",filterContainer:"-esm-stock-management__stock-items-table__filterContainer___sAp1-",dateAlign:"-esm-stock-management__stock-items-table__dateAlign___OFoT8",filtersAlign:"-esm-stock-management__stock-items-table__filtersAlign___h9qb6",toolbarAction:"-esm-stock-management__stock-items-table__toolbarAction___0V8Wh",tableHeader:"-esm-stock-management__stock-items-table__tableHeader___vuIl7",tableScroll:"-esm-stock-management__stock-items-table__tableScroll___sTQZm",nameCell:"-esm-stock-management__stock-items-table__nameCell___EyW9b",stockTableContainer:"-esm-stock-management__stock-items-table__stockTableContainer___7z9fp",paginationOverride:"-esm-stock-management__stock-items-table__paginationOverride___QaJVs"}},4767(e,t,a){var n={"./uk.json":["723","9072"],"./ar.json":["4132","7045"],"./ru_RU.json":["986","8359"],"./uz_UZ.json":["890","7175"],"./fr.json":["4055","6508"],"./sw_KE.json":["8618","903"],"./uz.json":["3584","6377"],"./en.json":["4300","5117"],"./ky.json":["8163","2416"],"./pl.json":["1119","6724"],"./sq.json":["8371","4928"],"./ka.json":["795","1480"],"./si.json":["6859","6904"],"./zh_TW.json":["439","556"],"./de.json":["4944","5145"],"./lg.json":["4618","8695"],"./vi.json":["9214","6371"],"./tr.json":["5241","434"],"./es_MX.json":["8349","1646"],"./tr_TR.json":["9900","1869"],"./zh_CN.json":["9879","5644"],"./en_US.json":["9569","4106"],"./he.json":["4652","2317"],"./id.json":["2690","6047"],"./ku.json":["9895","4348"],"./es.json":["3099","7912"],"./ne.json":["2146","5503"],"./ar_SY.json":["7617","282"],"./uz@Latn.json":["7097","4658"],"./bn.json":["7159","6444"],"./cs.json":["6589","7182"],"./zh.json":["5661","7742"],"./hi_IN.json":["5442","4383"],"./pt_BR.json":["6468","1877"],"./qu.json":["5173","8358"],"./ro_RO.json":["6022","3963"],"./sw.json":["9913","3378"],"./am.json":["1197","9806"],"./pt.json":["6679","5132"],"./it.json":["9538","4111"],"./km.json":["4335","5940"],"./hi.json":["6840","2881"]};function o(e){if(!a.o(n,e))return Promise.resolve().then(function(){var t=Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t});var t=n[e],o=t[0];return a.e(t[1]).then(function(){return a(o)})}o.keys=()=>Object.keys(n),o.id=4767,e.exports=o},7003(e,t,a){"use strict";a.d(t,{Cg:()=>p,Ec:()=>c,Mz:()=>l,Qg:()=>f,R4:()=>S,UE:()=>d,Ul:()=>b,Wh:()=>N,YI:()=>s,Zz:()=>k,bp:()=>E,dt:()=>T,fH:()=>g,fK:()=>C,iD:()=>v,je:()=>I,m0:()=>m,v9:()=>u,vI:()=>h,x9:()=>i,xM:()=>y,yj:()=>_,yu:()=>w});var n=a(7065),o=a.n(n),r=a(6008);window.getOpenmrsSpaBase,o()(new Date().setUTCHours(0,0,0,0)).format("YYYY-MM-DDTHH:mm:ss.SSSZZ"),Intl.DateTimeFormat().resolvedOptions().timeZone;let s="DD/MM/YYYY",l="d/m/Y",i=e=>(0,r.g1)(e,s),c=()=>{let e=new Date;return new Date(e.getFullYear(),e.getMonth(),e.getDate())},m=Object.freeze({SOURCES:"Sources",OPERATION:"Operation",STATUS:"Status"}),d="App: stockmanagement.reports",u="Task: stockmanagement.reports.mutate",p="d210eb66-2188-11ed-9dff-507b9dea1806",_="cca4be4b-2188-11ed-9dff-507b9dea1806",g="84bdd876-4694-11ed-8109-00155dcc3fc0",k="a49be648-6b0a-11ed-93a2-806d973f13a9",b="2083fd40-3391-11ed-a667-507b9dea1806",h=!0,E=!0,y="Health Center",f="moduleResources/stockmanagement/assets/print-logo.svg",T="Main Store",v=!0,N=e=>`/user-role-scopes/${e}`,S="stockItem",C=e=>`/stock-management/items?${S}=${encodeURIComponent(e)}`,w=(e,t)=>`/openmrs/ws/rest/v1/stockmanagement/batchjobartifact?id=${e}${t?"&download=1":""}`;function I(e){let t=e?.responseBody?.error?.fieldErrors;return t?Object.values(t).flatMap(e=>e.map(e=>e.message)):[e?.responseBody?.error?.message??e?.message]}},3767(e,t,a){"use strict";a.d(t,{G:()=>o,q:()=>r});var n,o=((n={}).Default="default",n.Full="full",n.REF="ref",n);function r(e,t=!0){if(!e)return"";let a=Object.keys(e)?.map(a=>{let n=e[a];return t&&(!1===n||!0===n||n)||!t&&(""===n||!1===n||!0===n||n)?`${encodeURIComponent(a)}=${encodeURIComponent(n.toString())}`:null}).filter(e=>null!=e).join("&");return a.length>0?"?"+a:""}},7138(e,t,a){"use strict";a.d(t,{QS:()=>n});let n="LocationStockItemBatchNo"},9684(e,t,a){"use strict";a.d(t,{By:()=>n});let n=["NEW","SUBMITTED","AUTHORIZED","DISPATCHED","COMPLETED","RETURNED","CANCELLED","REJECTED"]},3466(e,t,a){"use strict";a.d(t,{Eh:()=>u,Hu:()=>m,LD:()=>p,R6:()=>l,S5:()=>o,Wf:()=>d,Xb:()=>i,en:()=>c,jQ:()=>s,lj:()=>r,t$:()=>b});var n,o=((n={}).TRANSFER_OUT_OPERATION_TYPE="transferout",n.DISPOSED_OPERATION_TYPE="disposed",n.STOCK_ISSUE_OPERATION_TYPE="stockissue",n.STOCK_TAKE_OPERATION_TYPE="stocktake",n.REQUISITION_OPERATION_TYPE="requisition",n.OPENING_STOCK_OPERATION_TYPE="initial",n.RECEIPT_OPERATION_TYPE="receipt",n.RETURN_OPERATION_TYPE="return",n.ADJUSTMENT_OPERATION_TYPE="adjustment",n);function r(e){return"transferout"===(e=e?.toLowerCase())?"transferout":"disposed"===e?"disposed":"stockissue"===e?"stockissue":"stocktake"===e?"stocktake":"requisition"===e?"requisition":"receipt"===e?"receipt":"return"===e?"return":"adjustment"===e?"adjustment":"initial"===e?"initial":void 0}let s=e=>"adjustment"===e||"stocktake"===e||"disposed"===e,l=e=>"adjustment"===e,i=e=>!c(e)&&"requisition"!==e,c=e=>"receipt"===e||"initial"===e,m=e=>"requisition"===e,d=e=>"receipt"===e||"initial"===e,u=e=>"stockissue"===e||"return"===e,p=e=>"stockissue"===e||_(e)||g(e)||k(e),_=e=>"requisition"===e,g=e=>"receipt"===e,k=e=>"transferout"===e,b=e=>"stockissue"===e},7092(e,t,a){"use strict";a.d(t,{A:()=>p});var n=a(9868),o=a.n(n),r=a(4644),s=a(4520),l=a(4213),i=a(2761),c=a(3654),m=a(815);let d={widgetContainer:"-esm-stock-management__table__widgetContainer___yyK1I",widgetHeaderContainer:"-esm-stock-management__table__widgetHeaderContainer___LXuqs",toggleButtons:"-esm-stock-management__table__toggleButtons___IDXdF",searchField:"-esm-stock-management__table__searchField___JNd9O",searchBox:"-esm-stock-management__table__searchBox___zsTHQ",container:"-esm-stock-management__table__container___r5gjS",tabContainer:"-esm-stock-management__table__tabContainer___T0+Dm",itemListSearch:"-esm-stock-management__table__itemListSearch___kQCXe",tileContainer:"-esm-stock-management__table__tileContainer___y7bJu",tile:"-esm-stock-management__table__tile___tBLDw",tileContent:"-esm-stock-management__table__tileContent___PGTHq",menuItem:"-esm-stock-management__table__menuItem___Y1vXl",radioButtonGroup:"-esm-stock-management__table__radioButtonGroup___o0xvH",radioButton:"-esm-stock-management__table__radioButton___8e61a",section:"-esm-stock-management__table__section___DdCkE",sectionTitle:"-esm-stock-management__table__sectionTitle___2+NJM",modalBody:"-esm-stock-management__table__modalBody___jFvGH",tableContainer:"-esm-stock-management__table__tableContainer___WuS2z",search:"-esm-stock-management__table__search___ysc8+",toolbarContent:"-esm-stock-management__table__toolbarContent___NRN6N",itemListDownload:"-esm-stock-management__table__itemListDownload___jkHl6",content:"-esm-stock-management__table__content___-EUvd",helper:"-esm-stock-management__table__helper___uLyZY"},u=[],p=({columns:e,data:t,children:a,totalItems:p,goToPage:_,hasToolbar:g=!0,page:k,pageSize:b,onPageSizeChange:h})=>{let{t:E}=(0,r.useTranslation)(),y=(0,m.useLayoutType)(),[f,T]=(0,n.useState)([]),v="tablet"===(0,m.useLayoutType)(),[N]=(0,n.useState)(t),S=[10,20,30,40,50],C=void 0!==k,[w,I]=(0,n.useState)(10),D=b??w,{goTo:x,results:U,currentPage:R}=(0,m.usePagination)(N,D),A=C?t??u:U,O=C?k:R;(0,n.useEffect)(()=>{let e=[];A.map((t,a)=>e.push({...t,id:a++})),T(e)},[A]);let L=()=>{let t=new Blob([$(N,e)],{type:"text/csv;charset=utf-8"});(0,l.saveAs)(t,"data.csv")},M=()=>{let e=new Blob([JSON.stringify(N,null,2)],{type:"application/json"});(0,l.saveAs)(e,"data.json")},$=(e,t)=>[t.map(e=>e.header).join(","),...e.map(e=>t.map(t=>JSON.stringify(e[t.key])).join(","))].join("\n");return o().createElement(o().Fragment,null,o().createElement(i.DataTable,{"data-floating-menu-container":!0,rows:f,headers:e,filterRows:({rowIds:e,headers:t,cellsById:a,inputValue:n,getCellId:o})=>e.filter(e=>t.some(({key:t})=>{let r=a[o(e,t)].value,s=n?.toLowerCase();return"boolean"!=typeof r&&(""+r)?.toLowerCase().includes(s)})),overflowMenuOnHover:(0,m.isDesktop)(y),size:v?"lg":"md",useZebraStyles:!0},({rows:e,headers:t,getHeaderProps:n,getTableProps:r,onInputChange:l})=>o().createElement("div",null,o().createElement(i.TableContainer,{className:d.tableContainer},g&&o().createElement(i.TableToolbar,{"aria-label":E("dataTableToolbar","Data table toolbar"),style:{position:"static",overflow:"visible",backgroundColor:"color"}},o().createElement(i.TableToolbarContent,{className:d.toolbarContent},a?a({onInputChange:l}):o().createElement(o().Fragment,null,o().createElement(i.OverflowMenu,{focusTrap:!1,iconDescription:E("downloadOptions","Download options"),renderIcon:c.QN,size:"sm"},o().createElement(i.OverflowMenuItem,{className:d.menuItem,itemText:E("downloadAsCSV","Download As CSV"),onClick:L}),o().createElement(i.OverflowMenuItem,{className:d.menuItem,itemText:E("downloadAsJson","Download As JSON"),onClick:M})),o().createElement(i.TableToolbarSearch,{labelText:E("searchThisList","Search this list"),closeButtonLabelText:E("clearSearch","Clear search input"),className:d.itemListSearch,expanded:!0,onChange:l,placeholder:E("searchThisList","Search this list"),size:"sm"})))),o().createElement(i.Table,r(),o().createElement(i.TableHead,null,o().createElement(i.TableRow,null,t.map(e=>o().createElement(i.TableHeader,{...n({header:e}),key:e.key},e.header)))),o().createElement(i.TableBody,null,e.map(e=>o().createElement(i.TableRow,{key:e.id},e.cells.map(e=>o().createElement(i.TableCell,{key:e.id},e.value)))))),0===e.length?o().createElement("div",{className:d.tileContainer},o().createElement(i.Tile,{className:d.tile},o().createElement("div",{className:d.tileContent},o().createElement("p",{className:d.content},E("noData","No data to display")),o().createElement("p",{className:d.helper},E("checkFilters","Check the filters above"))))):null,o().createElement(i.Pagination,{...(0,s.LI)(E),page:O,pageSize:D,pageSizes:S,totalItems:p||N?.length,className:d.pagination,onChange:({pageSize:e,page:t})=>{if(e!==D){if(h)return void h(e);I(e)}if(t!==O){if(_)return void _(t);x(t)}}})))))}},570(e,t,a){"use strict";a.d(t,{d:()=>o});var n=a(9868);function o(e,t=1e3){let a=(0,n.useRef)();return(0,n.useEffect)(()=>()=>{a.current&&clearTimeout(a.current)},[]),(...n)=>{let o=setTimeout(()=>{e(...n)},t);clearTimeout(a.current),a.current=o}}},6008(e,t,a){"use strict";a.d(t,{Mz:()=>d,P9:()=>c,YI:()=>m,ZM:()=>l,a9:()=>i,g1:()=>s,xp:()=>u});var n=a(7065),o=a.n(n),r=a(815);let s=(e,t)=>e?o()(e).format(t??"DD-MMM-YYYY"):"",l=e=>{if(!e)return"";let t=e instanceof Date?e:(0,r.parseDate)(String(e));return isNaN(t?.getTime())?"":(0,r.formatDate)(t,{time:!1,noToday:!0})},i=l,c=(e,t)=>e?o()(e).format(t??"DD-MMM-YYYY HH:mm"):"",m="DD/MM/YYYY",d="d/m/Y",u=e=>e?o()(e).format("YYYY-MM-DD"):e},8728(e,t,a){"use strict";function n(e){let t=e?.match(/^(.*\S)\s*\((.*)\)$/s);return t&&t[1].trim().toLowerCase()===t[2].trim().toLowerCase()?t[1].trim():e}a.d(t,{U:()=>n})},4520(e,t,a){"use strict";function n(e,t){switch(t){case"NEW":return e("statusNew","New");case"SUBMITTED":return e("submitted","Submitted");case"AUTHORIZED":return e("statusAuthorized","Authorized");case"DISPATCHED":return e("dispatched","Dispatched");case"COMPLETED":return e("completed","Completed");case"RETURNED":return e("returned","Returned");case"CANCELLED":return e("cancelled","Cancelled");case"REJECTED":return e("rejected","Rejected");default:return t}}function o(e){return{itemsPerPageText:e("itemsPerPage","Items per page:"),itemRangeText:(t,a,n)=>e("paginationItemRange","{{min}}–{{max}} of {{total}} items",{min:t,max:a,total:n,count:n}),pageRangeText:(t,a)=>e("paginationPageRange","of {{count}} pages",{count:a}),pageSelectLabelText:t=>e("paginationPageSelectLabel","Page of {{count}} pages",{count:t}),backwardText:e("previousPage","Previous page"),forwardText:e("nextPage","Next page")}}function r(e){return t=>{switch(t){case"carbon.table.row.expand":return e("expandCurrentRow","Expand current row");case"carbon.table.row.collapse":return e("collapseCurrentRow","Collapse current row");case"carbon.table.all.expand":return e("expandAllRows","Expand all rows");case"carbon.table.all.collapse":return e("collapseAllRows","Collapse all rows");case"carbon.table.all.select":return e("selectAllRows","Select all rows");case"carbon.table.all.unselect":return e("unselectAllRows","Unselect all rows");case"carbon.table.row.select":return e("selectRow","Select row");case"carbon.table.row.unselect":return e("unselectRow","Unselect row");default:return t}}}function s(e){return(t,a)=>{let n="string"==typeof a?.header?a.header:"";return a?.isSortHeader&&a.sortDirection===a.sortStates?.ASC?e("sortRowsDescending","Click to sort rows by {{header}} header in descending order",{header:n,interpolation:{escapeValue:!1}}):a?.isSortHeader&&a.sortDirection===a.sortStates?.DESC?e("unsortRows","Click to unsort rows by {{header}} header",{header:n,interpolation:{escapeValue:!1}}):e("sortRowsAscending","Click to sort rows by {{header}} header in ascending order",{header:n,interpolation:{escapeValue:!1}})}}function l(e){return t=>{switch(t){case"clear.selection":return e("clearSelectedItem","Clear selected item");case"clear.all":return e("clearAllSelectedItems","Clear all selected items");case"open.menu":return e("openMenu","Open menu");case"close.menu":return e("closeMenu","Close menu");default:return t}}}function i(e){return{prevMonthAriaLabel:e("previousMonth","Previous month"),nextMonthAriaLabel:e("nextMonth","Next month")}}function c(e){return e?.split(/[-_]/)[0]?.toLowerCase()||"en"}function m(e,t){return t?.status==="AUTHORIZED"||t?.status==="COMPLETED"&&t?.operationType==="requisition"&&t?.submittedDate?e("approved","Approved"):e("completed","Completed")}function d(e,t){switch(t){case"Adjustment":return e("operationTypeAdjustment","Adjustment");case"Disposal":return e("operationTypeDisposal","Disposal");case"Transfer Out":return e("operationTypeTransferOut","Transfer Out");case"Receipt":return e("operationTypeReceipt","Receipt");case"Return":return e("operationTypeReturn","Return");case"Stock Issue":return e("operationTypeStockIssue","Stock Issue");case"Requisition":return e("operationTypeRequisition","Requisition");case"Stock Take":return e("operationTypeStockTake","Stock Take");case"Opening Stock":return e("operationTypeOpeningStock","Opening Stock");case"External Requisition":return e("operationTypeExternalRequisition","External Requisition");case"Loss":return e("operationTypeLoss","Loss");case"Recall":return e("operationTypeRecall","Recall");case"External Return":return e("operationTypeExternalReturn","External Return");case"External Recall":return e("operationTypeExternalRecall","External Recall");default:return t??""}}a.d(t,{D1:()=>l,IQ:()=>r,L9:()=>s,LI:()=>o,Wo:()=>i,e_:()=>n,ft:()=>c,nt:()=>d,qD:()=>m})},1571(e,t,a){"use strict";a.r(t),a.d(t,{root:()=>t6,deletePackagingUnitModal:()=>tX,stockManagementAdminCardLink:()=>t2,stockManagement:()=>a_,stockOperationsModal:()=>ag,stockSourcesLink:()=>al,stockOperationsLink:()=>at,stockItemsLink:()=>an,stockOperations:()=>ae,transactionStockcardPrintPreviewModal:()=>aN,stockLocations:()=>ai,deleteUserScopeModal:()=>tJ,deletePackagingUnitButton:()=>t0,importTranslation:()=>tQ,stockReports:()=>am,importBulkStockItemsModal:()=>t5,stockUserScopesLink:()=>ar,stockOperationFormWorkspace:()=>ab,stockItemFormWorkspace:()=>ah,stockUserScopesFormWorkspace:()=>aT,stockNavMenu:()=>t3,stockUserScopes:()=>ao,deleteStockModal:()=>tK,stockItems:()=>aa,stockOverviewLink:()=>t9,stockSourcesFormWorkspace:()=>ay,issuingStockModal:()=>t4,transactionBincardPrintPreviewModal:()=>av,startupApp:()=>aS,receivingStockModal:()=>t7,stockReportsFormWorkspace:()=>af,stockReportsLink:()=>ad,stockItemRulesFormWorkspace:()=>aE,stockLocationsLink:()=>ac,stockOverview:()=>t8,stockSettingsLink:()=>ap,stockManagementAppMenuItem:()=>ak,stockSettings:()=>au,expiredStockModal:()=>t1,stockSources:()=>as,createLocationModal:()=>aC});var n=a(815);let o={autoPopulateResponsiblePerson:{_type:n.Type.Boolean,_default:!1,_description:"Auto-populate responsible person in stock operations with the currently logged-in user"},dispensingUnitsUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock dispensing units",_default:"162402AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},enablePrintButton:{_type:n.Type.Boolean,_default:!0,_description:"Enable or disable the print button in the stock management UI"},logo:{src:{_type:n.Type.String,_default:null,_description:"A path or URL to an image"},alt:{_type:n.Type.String,_default:"Logo",_description:"Alt text shown on hover"},name:{_type:n.Type.String,_default:null,_description:"The organization name displayed when image is absent"}},hiddenOperationTypes:{_type:n.Type.Array,_elements:{_type:n.Type.String},_default:[],_description:'Codes of the operation types (e.g. "requisition") that are not offered in \xab Start New \xbb and in the Operations \xab Operation \xbb filter. Existing operations of these types stay listed and open; the user scopes are not changed'},packingUnitsUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the packaging unit",_default:"a6d438fe-05c1-4d4d-9755-c11cf6b0b3b9"},printBalanceOnHand:{_type:n.Type.Boolean,_default:!1,_description:"Whether to include balance on hand on the printout"},printItemCost:{_type:n.Type.Boolean,_default:!1,_description:"Whether to include item costs on the printout"},responsiblePersonExcludedRoles:{_type:n.Type.Array,_elements:{_type:n.Type.String},_default:[],_description:'Users holding any of these roles (role names, e.g. "System Developer") are not offered as the responsible person of a stock operation, so that system and integration accounts do not crowd out staff'},stockAdjustmentReasonUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock adjustment reasons",_default:"3a9021d1-d6c1-4fc2-8e30-ca8e204e44de"},stockItemCategoryUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock item category",_default:"8ccf6066-9297-4d76-aaf3-00aa3714d198"},stockSourceTypeUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock source types",_default:"937a0440-95f7-42f6-aaef-16cf611fcf10"},stockTakeReasonUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock take reasons",_default:"faa466c5-0953-4d4f-8ea7-d9a06341c3f3"},useItemCommonNameAsDisplay:{_type:n.Type.Boolean,_description:"Use item common name as display (true) or drug name as display (false)",_default:!0}};var r=a(9868),s=a.n(r),l=a(8308),i=a(4644);function c({dashboardLinkConfig:e}){let{name:t,title:a,titleKey:o}=e,{t:m}=(0,i.useTranslation)(),d=(0,l.useLocation)(),u=`${window.spaBase}/stock-management`,p=(0,r.useMemo)(()=>{let e=d.pathname.split("/");return decodeURIComponent(e[e.length-1])},[d.pathname]);return s().createElement(n.ConfigurableLink,{to:`${u}/${t}`,className:`cds--side-nav__link ${p.match(t)&&"active-left-nav-link"}`},o?m(o,a):a)}let m=e=>()=>s().createElement(l.BrowserRouter,null,s().createElement(c,{dashboardLinkConfig:e}));var d=a(2761),u=a(9564),p=a(3270),_=a(7136),g=a(3335);let k="-esm-stock-management__stock-management-header__value___9tRKk",b=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,n.useSession)(),a=t?.sessionLocation?.display;return s().createElement(n.PageHeader,{className:"-esm-stock-management__stock-management-header__header___LKg86","data-testid":"stock-management-header"},s().createElement(n.PageHeaderContent,{illustration:s().createElement(n.StockManagementPictogram,null),title:e("stockManagement","Stock management")}),s().createElement("div",{className:"-esm-stock-management__stock-management-header__right-justified-items___oK4n1"},s().createElement("div",{className:"-esm-stock-management__stock-management-header__date-and-location___8nnlA"},s().createElement(_.aZ,{size:16}),s().createElement("span",{className:k},a),s().createElement("span",{className:"-esm-stock-management__stock-management-header__middot___MhHzj"},"\xb7"),s().createElement(g.Vv,{size:16}),s().createElement("span",{className:k},(0,n.formatDate)(new Date,{mode:"standard"})))))},h=({dashboardSlot:e,title:t})=>s().createElement(s().Fragment,null,s().createElement(b,null),s().createElement(n.ExtensionSlot,{name:e,state:{dashboardTitle:t}}));function E(){let e=(0,l.useParams)(),t=(0,n.useExtensionSlotMeta)("stock-page-dashboard-slot"),a=(0,n.useLayoutType)(),o=Object.values(t).filter(e=>Object.keys(e).length)||[],r=o.find(t=>t.name===e?.dashboard)||o[0];return s().createElement("div",{className:"-esm-stock-management__home-dashboard__homePageWrapper___TnM9T"},s().createElement("section",{className:(0,n.isDesktop)(a)?"-esm-stock-management__home-dashboard__dashboardContainer___lLkxS":"-esm-stock-management__home-dashboard__dashboardContainerTablet___3pvso"},(0,n.isDesktop)(a)&&s().createElement(n.ExtensionSlot,{name:"stock-sidebar-slot",key:a}),s().createElement(h,{title:r?.name,dashboardSlot:r?.slot})))}var y=a(2383),f=a(3767),T=a(9587);function v(){let[e,t]=(0,r.useState)({startIndex:0,v:f.G.Default,q:null,includeStockItemName:"true"});(0,r.useEffect)(()=>{t({v:f.G.Default,includeStockItemName:"true"})},[]);let{items:a,isLoading:n,error:o}=(0,T.ME)(e);return{items:a.results??[],isLoading:n,error:o}}function N(e,t=new Date){if(!e)return null;let a=new Date(e).getTime();return Number.isFinite(a)?Math.ceil((a-t.getTime())/864e5):null}function S(e,t,a=new Date){return e.filter(e=>{let n=N(e.expiration,a);return null!==n&&n>=0&&n<=t})}function C(e){let[t,a]=(0,r.useState)({v:e||f.G.Default,q:null,totalCount:!0}),{items:n,isLoading:o,error:s}=(0,T.QC)(t);return(0,r.useEffect)(()=>{a({v:f.G.Default,totalCount:!0})},[]),{items:n?.results??[],isLoading:o,error:s}}let w="-esm-stock-management__stock-home-detail-card__content___k1ELO",I="-esm-stock-management__stock-home-detail-card__card___MuR+4",D="-esm-stock-management__stock-home-detail-card__icon___d49jB",x="-esm-stock-management__stock-home-detail-card__cardText___WIaKk";var U=a(7138);let R=()=>{let{t:e}=(0,i.useTranslation)(),{items:t,isLoading:a}=v(),{items:o,isLoading:r}=C(),{items:l}=(0,T.Xu)({v:f.G.Default,groupBy:U.QS,includeBatchNo:!0});if(r||a)return null;if(o?.length===0)return s().createElement("p",{className:w},e("noInventoryAlerts","No inventory alerts to display"));let c=t.filter(e=>e?.expiration).map(e=>{let t=o?.find(t=>e?.stockItemUuid===t.uuid),a=l?.results?.filter(t=>t.stockBatchUuid===e.uuid).reduce((e,t)=>e+(Number(t.quantity)||0),0);return{...t,...e,quantity:a}}),m=S(c,180).slice(0,5);return s().createElement(s().Fragment,null,m.map((t,a)=>s().createElement("div",{className:I,key:a},s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__colorLineRed___hXQea"}),s().createElement("div",{className:D},s().createElement(y.Cs,{size:40,color:"#DA1E28"})),s().createElement("div",{className:x},s().createElement("p",null,e("expiringStock","Expiring stock")),s().createElement("p",null,s().createElement("strong",null,t?.drugName??t?.commonName)," ",e("batchQuantityLabel","Batch number: {{batchNo}}, quantity: {{quantity}} {{unit}}",{batchNo:t?.batchNo,quantity:t?.quantity??"--",unit:t?.dispensingUnitName??"",interpolation:{escapeValue:!1}}))))),s().createElement(d.Button,{kind:"ghost",onClick:()=>{let e=(0,n.showModal)("expired-stock-modal",{closeModal:()=>e(),expiredStock:c})},size:"sm"},e("viewAll","View All")))};var A=a(3654),O=a(4779),L=a(8728),M=a(4520);let $=()=>{let{t:e}=(0,i.useTranslation)(),{items:t,isLoading:a}=function(e){let{items:t,isLoading:a,error:n}=(0,O.kR)(e);return{items:t?.results?.filter(e=>e?.operationType==="stockissue"&&e?.status!=="COMPLETED"),isLoading:a,error:n}}({v:f.G.Full,totalCount:!0});if(a)return null;if(t?.length===0)return s().createElement("p",{className:w},e("noIssuedStock","No issued stock to display"));let o=t?.map((e,t)=>(e?.stockOperationItems||[]).map((a,n)=>({status:e?.status,sourceName:e?.sourceName,destinationName:e?.destinationName,stockItemName:(0,L.U)(a?.stockItemName),stockItemPackagingUOMName:a?.stockItemPackagingUOMName,quantity:a?.quantity,key:`${t}-${n}`}))),r=o?.flat().slice(0,10);return s().createElement(s().Fragment,null,r?.map((t,a)=>s().createElement("div",{className:I,key:a},s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__colorLineGreen___wm9i4"}),s().createElement("div",{className:D},s().createElement(A.t0,{size:40,color:"#198038"})),s().createElement("div",{className:x},s().createElement("p",null,(0,M.e_)(e,t?.status)," \xb7 ",t?.sourceName," \xb7 ",t?.destinationName),s().createElement("p",null,s().createElement("strong",null,t?.stockItemName)," ",t?.stockItemPackagingUOMName,", ",t?.quantity)))),s().createElement(d.Button,{kind:"ghost",onClick:()=>{let e=(0,n.showModal)("issuing-stock-modal",{closeModal:()=>e(),issuingStock:t})},size:"sm"},e("viewAll","View All")))},B=e=>e?new Date(e).getTime():0,F=()=>{let{t:e}=(0,i.useTranslation)(),{items:t,isLoading:a}=function(e){let{items:t,isLoading:a,error:n}=(0,O.kR)({...e,status:"COMPLETED"});return{items:t?.results?.filter(e=>e?.operationType==="receipt"&&e?.status==="COMPLETED").sort((e,t)=>B(t.completedDate??t.operationDate??t.dateCreated)-B(e.completedDate??e.operationDate??e.dateCreated)),isLoading:a,error:n}}({v:f.G.Full,totalCount:!0});return a?null:t?.length===0?s().createElement("p",{className:w},e("noReceivedStock","No received stock to display")):s().createElement(s().Fragment,null,t?.map((t,a)=>t?.stockOperationItems.map(n=>s().createElement("div",{className:I,key:a},s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__colorLineBlue___h+uO1"}),s().createElement("div",{className:D},s().createElement(A.rf,{size:40,color:"#0F62FE"})),s().createElement("div",{className:x},s().createElement("p",null,(0,M.e_)(e,t?.status)," \xb7 ",t?.sourceName," \xb7 ",t?.destinationName),s().createElement("p",null,s().createElement("strong",null,(0,L.U)(n?.stockItemName))," ",n?.stockItemPackagingUOMName,","," ",n?.quantity))))),s().createElement(d.Button,{kind:"ghost",onClick:()=>{let e=(0,n.showModal)("receiving-stock-modal",{closeModal:()=>e(),receivingStock:t})},size:"sm"},e("viewAll","View All")))},P=({title:e,children:t})=>{let a="tablet"===(0,n.useLayoutType)();return s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__tilesContainer___7Uurd"},s().createElement(d.Layer,null,s().createElement(d.Tile,null,s().createElement("div",{className:a?"-esm-stock-management__stock-home-detail-card__tabletHeading___cNMqn":"-esm-stock-management__stock-home-detail-card__desktopHeading___5EUrG"},s().createElement("h4",null,e)),t)))},z=()=>{let{t:e}=(0,i.useTranslation)();return s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__cardContainer___M502h"},s().createElement(P,{title:e("inventoryAlerts","Inventory alerts")},s().createElement(R,null)),s().createElement(P,{title:e("receiving","Receiving")},s().createElement(F,null)),s().createElement(P,{title:e("issuing","Issuing")},s().createElement($,null)))};var q=a(9736),j=a.n(q),H=a(7065),Z=a.n(H),G=a(8906),Y=a.n(G),W=a(6401);let V="-esm-stock-management__metrics-card__countGrid___rz7tr";Z().extend(Y());let Q=({label:e,value:t,headerLabel:a,children:n,count:o,outOfStockCount:r,disposedCount:l})=>{let{t:c}=(0,i.useTranslation)();return s().createElement(d.Tile,{className:"-esm-stock-management__metrics-card__tileContainer___2dbmS"},s().createElement("div",{className:"-esm-stock-management__metrics-card__tileHeader___I+lc1"},s().createElement("div",{className:"-esm-stock-management__metrics-card__headerLabelContainer___FcNbu"},s().createElement("label",{className:"-esm-stock-management__metrics-card__headerLabel___ynB1N"},a),n)),s().createElement("div",{className:"-esm-stock-management__metrics-card__metricsGrid___7NagF"},s().createElement("div",null,s().createElement("label",{className:"-esm-stock-management__metrics-card__totalsLabel___6Mw2w"},e),s().createElement("p",{className:"-esm-stock-management__metrics-card__totalsValue___esjS3"},t)),!(0,W.A)(o)&&s().createElement("div",{className:V},s().createElement("span",null),s().createElement("span",{className:"-esm-stock-management__metrics-card__in6MonthsLabel___7yBr-"},c("in6Months","In 6 months")),s().createElement("p",null),s().createElement("p",{className:"-esm-stock-management__metrics-card__in6MonthsValue___6mIwS"},o.expiry6months?.length)),!(0,W.A)(r)&&s().createElement("div",{className:V},s().createElement("span",{className:"-esm-stock-management__metrics-card__belowMinLabel___28e5i"},c("understockedItems","Understocked items")),s().createElement("span",{className:"-esm-stock-management__metrics-card__aboveMaxLabel___z++jU"},c("overstockedItems","Overstocked items")),s().createElement("p",{className:"-esm-stock-management__metrics-card__belowMinValue___ZZJpg"},r.itemsBelowMin?.length),s().createElement("p",{className:"-esm-stock-management__metrics-card__aboveMaxValue___3W76E"},r.itemsAboveMax?.length)),!(0,W.A)(l)&&s().createElement("div",{className:V},s().createElement("span",{className:"-esm-stock-management__metrics-card__expiredLabel___0WP2Q"},c("expired","Expired")),s().createElement("span",{className:"-esm-stock-management__metrics-card__poorQualityLabel___dA002"},c("poorQuality","Poor Quality")),s().createElement("p",{className:"-esm-stock-management__metrics-card__expiredValue___46Xws"},l.expired?.length),s().createElement("p",{className:"-esm-stock-management__metrics-card__poorQualityValue___fsfCF"},l.poorQuality?.length))))},K=e=>{let{t}=(0,i.useTranslation)(),{stockList:a,error:o}=(()=>{let e=`${n.restBaseUrl}/stockmanagement/stockitem?v=default&totalCount=true`,{data:t,error:a,isLoading:o}=j()(e,n.openmrsFetch);return{stockList:t?.data.results.map(e=>({uuid:e.uuid,hasExpiration:e.hasExpiration,expiryNotice:e.expiryNotice}))??[],isLoading:o,error:a}})(),{items:r}=v(),{items:l}=C(),c=r.filter(e=>e?.expiration).map(e=>({...l?.find(t=>e?.stockItemUuid===t.uuid),...e})),m=c.filter(e=>{let t=N(e.expiration);return null!==t&&t<=(e.expiryNotice||180)}),d=S(c,180),{items:u}=function(e){let{items:t,isLoading:a,error:n}=(0,O.kR)(e);return{items:t?.results?.filter(e=>e?.operationType==="disposed"),isLoading:a,error:n}}({v:f.G.Full,totalCount:!0});if(o)return s().createElement(n.ErrorState,{headerTitle:t("errorStockMetric","Error fetching stock metrics"),error:o});let p=u&&u.filter(e=>"Drug not available due to expired medication"===e.reasonName),_=u&&u.filter(e=>"Poor Quality"===e.reasonName);return s().createElement("div",{className:"-esm-stock-management__stock-home__cardContainer___haC5o"},s().createElement(Q,{count:{expiry6months:d},headerLabel:t("expiringStock","Expiring stock"),label:t("expiringStock","Expiring stock"),value:m?.length||0}),s().createElement(Q,{label:t("outOfStock","Out of stock"),headerLabel:t("outOfStock","Out of stock"),outOfStockCount:{itemsBelowMin:[],itemsAboveMax:[]},value:a?.length}),s().createElement(Q,{disposedCount:{expired:p,poorQuality:_},headerLabel:t("disposedStock","Disposed stock"),label:t("disposedStock","Disposed stock"),value:u?.length||0}))};var J=a(771),X=a(7351),ee=a(7187),et=a(570);let ea=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{(0,ee.m)()},[]);return s().createElement(d.Button,{onClick:t,size:"md",kind:"primary"},e("addStockItem","Add stock item"))},en=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{let e=(0,n.showModal)("import-bulk-stock-items",{closeModal:()=>e()})},[]);return s().createElement(d.Button,{iconDescription:e("import","Import"),kind:"ghost",onClick:t},e("import","Import"))},eo=({data:e})=>{let{t}=(0,i.useTranslation)();return s().createElement(d.Button,{kind:"ghost",size:"md",className:"-esm-stock-management__edit-stock-item-action-menu__nameButton___DO0Vc",onClick:()=>{e.isDrug=!!e.drugUuid,(0,ee.m)(e)},iconDescription:t("editStockItem","Edit stock item")},`${e?.drugName??e.conceptName}`)},er=({filterType:e,changeFilterType:t})=>{let{t:a}=(0,i.useTranslation)();return s().createElement(d.RadioButtonGroup,{name:"is-drug",defaultSelected:e,onChange:e=>t(e),className:"-esm-stock-management__filter-stock-items__spacing___bU+u5"},s().createElement(d.RadioButton,{labelText:a("all","All"),value:"",id:"is-drug-all"}),s().createElement(d.RadioButton,{labelText:a("pharmaceuticals","Pharmaceuticals"),value:"true",id:"is-drug-drug"}),s().createElement(d.RadioButton,{labelText:a("nonPharmaceuticals","Non Pharmaceuticals"),value:"false",id:"is-drug-other"}))};var es=a(4126);let el=["genericName","commonName","tradeName"],ei=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,X.K)(),[a,o]=(0,r.useState)(""),l=()=>{t(`${n.restBaseUrl}/stockmanagement/stockitem`)},{currentPage:c,currentPageSize:m,isDrug:u,isLoading:p,items:_,pageSizes:g,setCurrentPage:k,setDrug:b,setPageSize:h,setSearchString:E,totalCount:y}=function(e){let{t}=(0,i.useTranslation)(),[a,o]=(0,r.useState)(1),[s,l]=(0,r.useState)(10),[c,m]=(0,r.useState)(null),[d,u]=(0,r.useState)(""),[p,_]=(0,r.useState)({startIndex:a-1,v:e||f.G.Default,limit:s,q:null,totalCount:!0}),{items:g,isLoading:k,error:b}=(0,T.QC)(p),h=(0,n.usePagination)(g.results,s);return(0,r.useEffect)(()=>{_({startIndex:a-1,v:f.G.Default,limit:s,q:c,totalCount:!0,isDrug:d})},[c,a,s,d]),{items:h.results,pagination:h,totalCount:g.totalCount,currentPageSize:s,currentPage:a,setCurrentPage:o,setPageSize:l,pageSizes:[10,20,30,40,50],isLoading:k,error:b,isDrug:d,setDrug:e=>{o(1),u(e)},setSearchString:m}}(f.G.Full),v=(0,et.d)(e=>{E(e)},1e3);(0,r.useEffect)(()=>{v(a)},[a,v]);let N=(0,r.useMemo)(()=>[{id:0,header:e("type","Type"),key:"type"},{id:1,header:e("genericName","Generic name"),key:"genericName"},{id:2,header:e("commonName","Common name"),key:"commonName"},{id:3,header:e("tradeName","Trade name"),key:"tradeName"},{id:4,header:e("dispensingUnitName","Dispensing UoM"),key:"dispensingUnitName"},{id:5,header:e("defaultStockOperationsUoMName","Bulk packaging"),key:"defaultStockOperationsUoMName"},{id:6,header:e("reorderLevel","Reorder level"),key:"reorderLevel"},{id:7,header:e("actions","Actions"),key:"actions"}],[e]),S=(0,r.useMemo)(()=>_?.map((t,a)=>({...t,id:t?.uuid,key:`key-${t?.uuid}`,uuid:`${t?.uuid}`,type:t?.drugUuid?e("drug","Drug"):e("other","Other"),genericName:s().createElement(eo,{data:_[a]}),commonName:t?.commonName,tradeName:t?.drugUuid?t?.conceptName:"",preferredVendorName:t?.preferredVendorName,dispensingUoM:t?.defaultStockOperationsUoMName,dispensingUnitName:t?.dispensingUnitName,defaultStockOperationsUoMName:t?.defaultStockOperationsUoMName,reorderLevel:t?.reorderLevelUoMName&&t?.reorderLevel?`${t?.reorderLevel?.toLocaleString()} ${t?.reorderLevelUoMName}`:"",actions:s().createElement(d.IconButton,{kind:"ghost",label:e("editStockItem","Edit stock item"),onClick:()=>{t.isDrug=!!t.drugUuid,(0,ee.m)(t)}},s().createElement(J.ff,{size:16}))})),[_,e]);return p?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):s().createElement(s().Fragment,null,s().createElement("h2",{className:es.A.tableHeader},e("stockItemsTableHeader","Drugs and other stock items managed by the system.")),s().createElement(d.DataTable,{rows:S,headers:N,isSortable:!0,useZebraStyles:!0},({rows:t,headers:r,getHeaderProps:i,getTableProps:c,getRowProps:m,getBatchActionProps:p})=>s().createElement(d.TableContainer,{className:es.A.stockTableContainer},s().createElement(d.TableToolbar,{"aria-label":e("dataTableToolbar","Data table toolbar"),style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableBatchActions,{...p(),translateWithId:(t,a)=>(function(e,t,a){switch(t){case"carbon.table.batch.cancel":return e("cancel","Cancel");case"carbon.table.batch.selectAll":return e("selectAll","Select all");case"carbon.table.batch.item.selected":return e("itemSelected","{{count}} item selected",{count:a});default:return e("itemsSelected","{{count}} items selected",{count:a})}})(e,t,a?.totalSelected)}),s().createElement(d.TableToolbarContent,{className:es.A.toolbarContent},s().createElement(d.TableToolbarSearch,{labelText:e("searchStockItems","Search stock items"),closeButtonLabelText:e("clearSearch","Clear search input"),onChange:e=>{o("string"==typeof e?e:e.target.value)},persistent:!0,placeholder:e("searchStockItems","Search stock items"),value:a}),s().createElement(er,{filterType:u,changeFilterType:b}),s().createElement(en,null),s().createElement(d.TableToolbarMenu,{iconDescription:e("settings","Settings"),"data-testid":"stock-items-menu"},s().createElement(d.TableToolbarAction,{className:es.A.toolbarAction,onClick:l},e("refresh","Refresh"))),s().createElement(ea,null))),s().createElement("div",{className:es.A.tableScroll},s().createElement(d.Table,c(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,r.map(t=>"details"!==t.key&&s().createElement(d.TableHeader,{...i({header:t,isSortable:t.isSortable}),className:n.isDesktop?es.A.desktopHeader:es.A.tabletHeader,key:`${t.key}`,isSortable:"name"!==t.key&&"actions"!==t.key,translateWithId:(0,M.L9)(e)},"object"==typeof t.header&&null!==t.header&&"content"in t.header?t.header.content:t.header)))),s().createElement(d.TableBody,null,t.map(e=>s().createElement(s().Fragment,{key:e.id},s().createElement(d.TableRow,{...m({row:e}),className:n.isDesktop?es.A.desktopRow:es.A.tabletRow,key:e.id},e.cells.map(e=>e?.info?.header!=="details"&&s().createElement(d.TableCell,{key:e.id,className:el.includes(e?.info?.header)?es.A.nameCell:void 0},e.value)))))))),0===t.length?s().createElement("div",{className:es.A.tileContainer},s().createElement(d.Tile,{className:es.A.tile},s().createElement("div",{className:es.A.tileContent},s().createElement("p",{className:es.A.content},e("noStockItemsToDisplay","No stock items to display")),s().createElement("p",{className:es.A.helper},e("checkFilters","Check the filters above"))))):null)),s().createElement(d.Pagination,{...(0,M.LI)(e),className:es.A.paginationOverride,onChange:({page:e,pageSize:t})=>{k(e),h(t)},page:c,pageSize:m,pageSizes:g,totalItems:y}))};var ec=a(2137),em=a(1844),ed=a(7092);let eu=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useRef)();(0,r.useEffect)(()=>()=>t.current?.(),[]);let{tableHeaders:a,tableRows:o,items:l,isLoading:c,mutate:m}=(0,em.zC)({v:f.G.Full}),u=()=>{m()};return c?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):l?.length?s().createElement(ed.A,{columns:a,data:o},({onInputChange:a})=>s().createElement(s().Fragment,null,s().createElement(d.TableToolbarSearch,{labelText:e("filterTable","Filter table"),placeholder:e("filterTable","Filter table"),closeButtonLabelText:e("clearSearch","Clear search input"),persistent:!0,onChange:a}),s().createElement(d.TableToolbarMenu,{iconDescription:e("settings","Settings")},s().createElement(d.TableToolbarAction,{className:es.A.toolbarMenuAction,onClick:u},e("refresh","Refresh"))),s().createElement(d.Button,{kind:"ghost",renderIcon:e=>s().createElement(ec.OM,{size:16,...e}),onClick:()=>{t.current?.(),t.current=(0,n.showModal)("stock-create-location-modal",{mutate:m})}},e("createLocation","Create Location")))):s().createElement("div",{className:es.A.tileContainer},s().createElement(d.Tile,{className:es.A.tile},s().createElement("p",{className:es.A.content},e("noLocationsToDisplay","No locations to display"))))};var ep=a(7003),e_=a(6008),eg=a(683),ek=a(5175);let eb=()=>{let{types:{results:e},isLoading:t,error:a}=(0,ek.G2)(),{userRoles:n,isLoading:o,error:s}=(0,ek.Ul)();return{operationTypes:(0,r.useMemo)(()=>{let t=[...new Set(n?.operationTypes?.map(e=>e.operationTypeUuid)||[])];return e?.filter(e=>t.includes(e.uuid))||[]},[e,n]),isLoading:t||o,error:a||s}},eh=({stockOperation:e,showIcon:t=!0,showprops:a=!0})=>{let{t:o}=(0,i.useTranslation)(),{error:l,isLoading:c,operationTypes:m}=eb(),{isLoading:u,items:p,error:_}=(0,O.Eb)(e?.uuid),g=(0,r.useMemo)(()=>m?.find(e=>e?.uuid===p?.operationTypeUuid),[m,p]),k=(0,r.useCallback)(()=>{(0,eg.AE)(g,p,p?.requisitionStockOperationUuid)},[g,p]);(0,r.useEffect)(()=>{(l||_)&&(0,n.showSnackbar)({kind:"error",title:o("stockOperationLoadError","Error loading stock operation"),subtitle:l?.message||_?.message||""})},[l,_,o]);let b=(0,eg._H)(p??e);return c||u?s().createElement(d.InlineLoading,{status:"active",iconDescription:"Loading"}):l||_?s().createElement(s().Fragment,null,"--"):s().createElement(d.Button,{className:"-esm-stock-management__edit-stock-operation-button__editStockButton___aF9CI",kind:"ghost",size:"sm",onClick:k,renderIcon:t?()=>b?s().createElement(J.ff,{size:16}):s().createElement(y.Ss,{size:16}):void 0,"aria-label":a?void 0:b?o("edit","Edit"):o("view","View")},a&&s().createElement("span",{className:"-esm-stock-management__edit-stock-operation-button__operationNumberText___sw6oi"},p?.operationNumber?.split("-").map((e,t,a)=>s().createElement(s().Fragment,{key:t},e,t<a.length-1&&s().createElement(s().Fragment,null,"-",s().createElement("wbr",null))))))};var eE=a(1673);function ey(e,t){let a=new Set((t??[]).map(e=>e.trim().toLowerCase()));return(e??[]).filter(e=>!a.has((e.operationType??"").trim().toLowerCase()))}var ef=a(3466);let eT=()=>{let{t:e}=(0,i.useTranslation)(),{hiddenOperationTypes:t}=(0,n.useConfig)(),{error:a,isLoading:o,operationTypes:l}=eb(),c=(0,r.useMemo)(()=>ey(l,t),[l,t]),m=(0,r.useCallback)(e=>{e.operationType,ef.S5.STOCK_ISSUE_OPERATION_TYPE,(0,eg.AE)(e,void 0)},[]);return((0,r.useEffect)(()=>{a&&(0,n.showSnackbar)({kind:"error",title:e("stockOperationTypesError","Error loading stock operation types"),subtitle:a?.message})},[a,e]),o)?s().createElement(d.ButtonSkeleton,null):a?null:c&&c.length?s().createElement(d.OverflowMenu,{"aria-label":e("startNew","Start New"),iconDescription:e("startNew","Start New"),renderIcon:()=>s().createElement(s().Fragment,null,e("startNew","Start New"),"\xa0\xa0",s().createElement(eE.CH,{size:16})),menuOffset:{top:0,left:-100},style:{backgroundColor:"#007d79",backgroundImage:"none",color:"#fff",minHeight:"1rem",padding:".95rem !important",width:"auto",paddingInline:"1rem",marginRight:"0.5rem",whiteSpace:"nowrap"}},c.map(t=>({operation:t,label:(0,M.nt)(e,t.name)})).sort((e,t)=>e.label.localeCompare(t.label)).map(({operation:e,label:t})=>s().createElement(d.OverflowMenuItem,{key:e.uuid,itemText:t,onClick:()=>{m(e)}}))):null};var ev=a(9684);let eN=({conceptUuid:e,onFilterChange:t,filterName:a})=>{let{t:o}=(0,i.useTranslation)(),{hiddenOperationTypes:l}=(0,n.useConfig)(),{items:c,isLoading:m}=(0,ek.cj)(e),[u,p]=(0,r.useState)(!1),[_,g]=(0,r.useState)([]);if((0,r.useEffect)(()=>{switch(p(!0),a){case ep.m0.STATUS:g(ev.By.map(e=>({uuid:e,display:e})));break;case ep.m0.SOURCES:c?.answers?.length&&(g([...c.answers]),p(m));break;case ep.m0.OPERATION:(0,ek.bh)().then(e=>{p(!0),e.data?.results.length&&g(ey(e.data.results,l).map(e=>({uuid:e.uuid,display:(0,M.nt)(o,e.name)}))),p(!1)})}p(!1)},[a,m,c.answers,o,l]),u)return s().createElement(d.DropdownSkeleton,null);let k=a===ep.m0.SOURCES?o("sources","Sources"):a===ep.m0.STATUS?o("status","Status"):a===ep.m0.OPERATION?o("operationFilter","Operation"):a;return s().createElement(d.MultiSelect,{translateWithId:(0,M.D1)(o),autoAlign:!0,className:es.A.filtersAlign,disabled:!_.length,id:"multiSelect",label:k,labelInline:!0,items:_,itemToString:e=>e?a===ep.m0.STATUS?(0,M.e_)(o,e.display):e.display:o("notSet","Not Set"),onChange:({selectedItems:e})=>{e&&t(e.map(e=>e.uuid),a)},placeholder:o("filterBy","Filter by {{filterName}}",{filterName:k})})};var eS=a(9184);let eC=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Approve",operation:e,requireReason:!1,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,renderIcon:e=>s().createElement(eS.cR,{size:16,...e})},t("approve","Approve"))},ew=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Dispatch",operation:e,requireReason:!1,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,renderIcon:e=>s().createElement(A.jw,{size:16,...e})},t("dispatch","Dispatch"))},eI=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Cancel",operation:e,requireReason:!0,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,kind:"danger--ghost",renderIcon:e=>s().createElement(J.$D,{size:16,...e})},t("cancel","Cancel "))},eD=({operation:e,reason:t})=>{let{t:a}=(0,i.useTranslation)(),o=(0,r.useCallback)(()=>{let a=(0,n.showModal)("stock-operations-modal",{title:"Complete Dispatch",operation:e,requireReason:t,closeModal:()=>a()})},[e,t]);return s().createElement(d.Button,{onClick:o,renderIcon:e=>s().createElement(ec.cD,{size:16,...e})},a("completeDispatch","Complete dispatch"))},ex=({operation:e})=>{let{t}=(0,i.useTranslation)(),{error:a,isLoading:o,types:l}=(0,ek.G2)(),c=(0,r.useMemo)(()=>l?.results?.find(e=>e.operationType===ef.S5.STOCK_ISSUE_OPERATION_TYPE),[l]);return((0,r.useEffect)(()=>{a&&(0,n.showSnackbar)({kind:"error",title:t("stockOperationTypesError","Error loading stock operation types"),subtitle:a?.message})},[a,t]),o)?s().createElement(d.InlineLoading,{description:"",iconDescription:t("loadingOperationTypes","Loading operation types")}):s().createElement(d.Button,{onClick:()=>{(0,eg.AE)(c,void 0,e.uuid)},kind:"tertiary",renderIcon:e=>s().createElement(A.U$,{size:16,...e})},t("issueStock","Issue Stock "))},eU=`
/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

/* Sections
   ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

body {
  margin: 0;
}

/**
 * Render the main element consistently in IE.
 */

main {
  display: block;
}

/**
 * Correct the font size and margin on h1 elements within section and
 * article contexts in Chrome, Firefox, and Safari.
 */

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* Grouping content
   ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd em font sizing in all browsers.
 */

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/* Text-level semantics
   ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

a {
  background-color: transparent;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

b,
strong {
  font-weight: bold;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd em font sizing in all browsers.
 */

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/**
 * Add the correct font size in all browsers.
 */

small {
  font-size: 80%;
}

/**
 * Prevent sub and sup elements from affecting the line height in
 * all browsers.
 */

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/* Embedded content
   ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

img {
  border-style: none;
}

/* Forms
   ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input { /* 1 */
  overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

button,
select { /* 1 */
  text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

/**
 * Correct the padding in Firefox.
 */

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from fieldset elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    fieldset elements in all browsers.
 */

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

progress {
  vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

textarea {
  overflow: auto;
}

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */

[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to inherit in Safari.
 */

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/* Interactive
   ========================================================================== */

/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */

details {
  display: block;
}

/*
 * Add the correct display in all browsers.
 */

summary {
  display: list-item;
}

/* Misc
   ========================================================================== */

/**
 * Add the correct display in IE 10+.
 */

template {
  display: none;
}

/**
 * Add the correct display in IE 10.
 */

[hidden] {
  display: none;
}
/*!
 * Gutenberg
 *
 * MIT Fabien Sa
 * https://github.com/BafS/Gutenberg
 */

* {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  
  *,
  *:before,
  *:after,
  p:first-letter,
  div:first-letter,
  blockquote:first-letter,
  li:first-letter,
  p:first-line,
  div:first-line,
  blockquote:first-line,
  li:first-line {
    background: transparent !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
  
  html {
    font-size: 16px;
    margin: 0;
    padding: 0;
  }
  
  body {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    background: #fff !important;
    color: #000 !important;
    font-family: Arial, sans-serif, "Helvetica Neue", Helvetica;
    font-size: 1rem;
    line-height: 1.5;
    margin: 0 auto;
    text-rendering: optimizeLegibility;
  }
  
  p,
  blockquote,
  table,
  ul,
  ol,
  dl {
    margin-bottom: 1.5rem;
    margin-top: 0;
  }
  
  p:last-child,
  ul:last-child,
  ol:last-child {
    margin-bottom: 0;
  }
  
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #000;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    line-height: 1.2;
    margin-bottom: 0.75rem;
    margin-top: 0;
  }
  
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  h3 {
    font-size: 1.75rem;
  }
  
  h4 {
    font-size: 1.5rem;
  }
  
  h5 {
    font-size: 1.25rem;
  }
  
  h6 {
    font-size: 1rem;
  }
  
  a,
  a:visited {
    color: #000;
    text-decoration: underline;
    word-wrap: break-word;
  }
  
  table {
    border-collapse: collapse;
  }
  
  thead {
    display: table-header-group;
  }
  
  table,
  th,
  td {
    border-bottom: 1px solid #000;
  }
  
  td,
  th {
    padding: 0px;
    page-break-inside: avoid;
  }
  
  code,
  pre,
  kbd {
    border: 1px solid #bbb;
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    font-size: 85%;
  }
  
  code,
  kbd {
    padding: 3px;
  }
  
  pre {
    margin-bottom: 1.5rem;
    padding: 10px 12px;
  }
  
  pre code,
  pre kbd {
    border: 0;
  }
  
  ::-webkit-input-placeholder {
    color: transparent;
  }
  
  :-moz-placeholder {
    color: transparent;
  }
  
  ::-moz-placeholder {
    color: transparent;
  }
  
  :-ms-input-placeholder {
    color: transparent;
  }
  
  blockquote {
    border: 0;
    border-left: 5px solid #bbb;
    margin-left: 1px;
    padding: 12px 1.5rem;
  }
  
  [dir='rtl'] blockquote {
    border-left: 0;
    border-right: 5px solid #bbb;
    margin-left: 0;
    margin-right: 1px;
  }
  
  blockquote:first-child {
    margin-top: 0;
  }
  
  blockquote p:last-child,
  blockquote ul:last-child,
  blockquote ol:last-child {
    margin-bottom: 0;
  }
  
  blockquote footer {
    display: block;
    font-size: 80%;
  }
  
  img {
    border: 0;
    display: block;
    max-width: 100% !important;
    vertical-align: middle;
  }
  
  hr {
    border: 0;
    border-bottom: 2px solid #bbb;
    height: 0;
    margin: 2.25rem 0;
    padding: 0;
  }
  
  dt {
    font-weight: bold;
  }
  
  dd {
    margin: 0;
    margin-bottom: 0.75rem;
  }
  
  abbr[title],
  acronym[title] {
    border: 0;
    text-decoration: none;
  }
  
  table,
  blockquote,
  pre,
  code,
  figure,
  li,
  hr,
  ul,
  ol,
  a,
  tr {
    page-break-inside: avoid;
  }
  
  h2,
  h3,
  h4,
  p,
  a {
    orphans: 3;
    widows: 3;
  }
  
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    page-break-after: avoid;
    page-break-inside: avoid;
  }
  
  h1+p,
  h2+p,
  h3+p {
    page-break-before: avoid;
  }
  
  img {
    page-break-after: auto;
    page-break-before: auto;
    page-break-inside: avoid;
  }
  
  pre {
    white-space: pre-wrap !important;
    word-wrap: break-word;
  }
  
  body {
    padding-bottom: 1cm;
    padding-left: 1cm;
    padding-right: 1cm;
    padding-top: 0.5cm;
  }
  
  a[href^='http']:after,
  a[href^='ftp']:after {
    content: " (" attr(href) ")";
    font-size: 80%;
  }
  
  a[href$='.jpg']:after,
  a[href$='.jpeg']:after,
  a[href$='.gif']:after,
  a[href$='.png']:after {
    display: none;
  }
  
  abbr[title]:after,
  acronym[title]:after {
    content: " (" attr(title) ")";
  }
  
  .page-break,
  .break-before,
  .page-break-before {
    page-break-before: always;
  }
  
  .break-after,
  .page-break-after {
    page-break-after: always;
  }
  
  .avoid-break-inside {
    page-break-inside: avoid;
  }
  
  .no-print {
    display: none;
  }
  
  a.no-reformat:after {
    content: '';
  }
  
  abbr[title].no-reformat:after,
  acronym[title].no-reformat:after {
    content: '';
  }
  
  .no-reformat abbr:after,
  .no-reformat acronym:after,
  .no-reformat a:after {
    content: '';
  }
  /*Custom CSS*/
  .right {
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
    margin-right: 0;
  }  
  .text {
    margin-top:0in;
    margin-right:0in;
    margin-bottom:3.0pt;
    margin-left:0in;
    line-height:106%;
    font-size:12.5pt;
  } 
  .logo-row {
    width: 99%;
  }
  .logo {
    width: 120;    
    line-height:110%;
    text-align: center;
    margin-top: 4pt;
  }
  .logo img, .logo svg {
    width: 52;
    height: auto;
  }
  span.logo-text {
    font-size:8.0pt;
    display: block;
    white-space:nowrap;
    line-height: 110%;
    margin-top: 4pt;
  } 
  .heading, .heading-row {
    margin-left:12.75pt;
    clear: both;
  }
  .heading {
    font-size:14.5pt;
    line-height:102%;
  }
  .heading-row, .heading-row table {    
    font-size: 13.5pt;
  }
  .heading-row {
    margin-top: 14pt;
  }
  .heading table, .heading-row table, .heading-row td {
    border: 0;
  }
  .table-data {
    border: 0;
    border-collapse:collapse;
    margin-left:6.95pt;
    font-size:12.5pt;
    width: 99%;
    page-break-inside: auto;
  }
  .table-data td, .table-data th {
    padding:0 5.75pt 0 5.15pt;
  }
  .table-data td, .table-data th {
    border-top:none;
    border-left:none;
    border-right:solid black 1.0pt;
    vertical-align: middle;
    height: 30pt;
  }
  .table-data th {
    border-bottom:double black 1.5pt;
  }  
  .table-data td {
    border-bottom:solid black 1.0pt;
  }
  .table-data th:first-child, .table-data td:first-child {
    border-left:solid black 1.0pt;
  }  
  .center {
    text-align: center;
  }  
  .left {
    text-align: left;
  }
  .table-data tr.footer-field td {
    height:32pt;
    vertical-align: middle;
  }
  @page { size: auto;  margin: 0mm; }
`,eR=async()=>{let e=await (0,n.getConfig)("@openmrs/esm-stock-management-app"),t=e?.logo?.src;return new Promise((e,a)=>{if(!t)return void e(null);let n=document.getElementById("hdnTxtPrintLogo");if(n&&n.value?.length>0){let t=n.getAttribute("isSvg");e({image:n.value,isSvg:"1"===t});return}if(t.toLowerCase().endsWith(".svg"))fetch(t,{headers:{"Disable-WWW-Authenticate":"true"}}).then(e=>{if(!e.ok)throw Error("Print logo fetch network response was not OK");return e.text()}).then(t=>{n&&(n.value=t,n.setAttribute("isSvg","1")),e({image:t,isSvg:!0})}).catch(e=>{console.error("Error fetching print logo: ",e),a("Error fetching print logo")});else{let o=new Image;o.addEventListener("load",()=>{try{let t=document.createElement("canvas");t.width=o.width,t.height=o.height;let r=t.getContext("2d");if(r){r.drawImage(o,0,0);let a=t.toDataURL("image/png");n&&(n.value=a,n.setAttribute("isSvg","0")),e({image:a,isSvg:!1})}else a("Failed to allocate canvas context for print logo")}catch(e){a(e)}}),o.addEventListener("error",e=>{a(e)}),o.src=t}})},eA=(e,t,a=!1,n=!0)=>`<html>
<head>
<meta http-equiv=Content-Type content="text/html; charset=utf8">
<title>${t??""}</title>
<style>
${eU}
</style>
</head>
<body onload="${a?"window.print()":""}" style='word-wrap:break-word' ${n?'onafterprint="self.close()"':""}>
    ${e}
</body>
</html>`,eO=async()=>{let e=await (0,n.getConfig)("@openmrs/esm-stock-management-app"),t=e?.logo?.name,a=null;if(ep.Qg)try{a=await eR()}catch(e){console.error(e)}return a||t?`
<div class="logo" >
    ${a?a.isSvg?a.image:`<img alt='' src='${a.image}' />`:""}
    ${t?`<span class='logo-text text'>${t}</span>`:""}
</div>    
    `:""},eL=async()=>{let e=await eO();return`
<div class="logo-row right">
${e}
</div>    
    `},eM=e=>{setTimeout(()=>{let t;(t=window.open("","Print-Window"))&&(t.document.open(),t.document.write(e),t.document.close())},300)},e$=async e=>{let t=Math.max(0,25-(e?.items?.length??0)),a=await eL();return`
    <div>
        ${a}
        <div class="heading text center" style="text-transform: uppercase;font-size: 20pt;">
            <b>Goods Received Note</b>
        </div>
        <div class="heading-row text">
            <span>Name of Health Unit: </span>
            <b><span>${e?.organizationName??""}</span></b>
        </div>
        <div class="heading-row text">
            <table style="width:99%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td style="text-align: left;">
                        <span>Delivered To: </span>
                        <b><span>${e?.location??""}</span></b>
                    </td>
                    <td style="text-align: right;">
                        <span>GRN#: </span>
                        <b><span>${e?.operationNumber}</span></b>
                    </td>
                </tr>
            </table>
        </div>
        <div class="heading-row text">
            <table style="width:99%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td style="text-align: left;">
                        <span>Received From: </span>
                        <b><span>${e?.source??""}</span></b>
                    </td>
                    <td style="text-align: right;">                    
                        <span>Date: </span>
                        <b><span>${(0,e_.g1)(e?.operationDate)}</span></b>
                    </td>
                </tr>
            </table>
        </div>
        <table class="table-data" border="0" cellspacing="0" cellpadding="0">                     
            <tr>
                <th valign="middle" class="left" style="border-top:solid black 1.0pt;"><b>Item Code No.</b></th>
                <th valign="middle" class="left" style="border-top:solid black 1.0pt;"><b>Item Description (name, formulation, strength)</b></th>
                <th valign="middle" style="border-top:solid black 1.0pt;"><b>Batch No.</b></th>
                <th valign="middle" style="border-top:solid black 1.0pt;"><b>Expiry</b></th>
                <th valign="middle" style="border-top:solid black 1.0pt;"><b>Quantity</b></th>                
                <th valign="middle" style="border-top:solid black 1.0pt;"><b>Purchase Price</b></th>
            </tr>            
            ${e?.items?e?.items.map(e=>`
                <tr class="data-row">
                    <td valign="middle">${e.itemCode??""}</td>
                    <td valign="middle">${e.itemDescription??""}</td>                    
                    <td valign="middle" class="center">${e.batchNumber??""}</td>                    
                    <td valign="middle" class="center">${(0,e_.g1)(e.expiryDate)}</td>                    
                    <td valign="middle" class="center">${e.quantityRequired?.toLocaleString()??""} ${e.quantityRequiredUoM??""}</td>
                    <td valign="middle" class="center">${e.purchasePrice?.toLocaleString()??""}</td>
                </tr> 
                `).join(""):""}
            ${t>0?Array(t).fill(0).map(e=>`
        <tr class="data-row">
            <td valign="middle">&nbsp;</td>
            <td valign="middle">&nbsp;</td>
            <td valign="middle" class="center">&nbsp;</td>
            <td valign="middle" class="center">&nbsp;</td>
            <td valign="middle" class="center">&nbsp;</td>
            <td valign="middle" class="center">&nbsp;</td>
        </tr>`).join(""):""}    
            <tr class="footer-field">
                <td valign="middle" colspan="6" style="border:0;padding-top: 15pt;">
                    Remarks:<br/>
                    ${e?.remarks??""}
                </td>                
            </tr>   
            <tr class="footer-field">
                <td valign="middle" colspan="3" style="border:0;padding-top: 15pt;">
                    Received By:<br/>
                    <b>${e?.responsiblePerson??""}</b>
                </td>
                <td valign="middle" colspan="3" style="border:0;padding-top: 15pt;">
                    Checked By:<br/>
                    &nbsp;
                </td>
            </tr>
            <tr class="footer-field">
                <td valign="middle" colspan="3" style="border:0;"><br/><br/>Signature</td>
                <td valign="middle" colspan="3" style="border:0;"><br/><br/>Signature</td>
            </tr>        
        </table>        
    </div>
    `},eB=async e=>{eM(eA(await e$(e),e?.documentTitle,!0,ep.iD))},eF=async e=>{let t=Math.max(0,28-(e?.items?.length??0)),a=await eL();return`
    <div>
        ${a}
        <div class="heading text">
            <b>HMIS FORM 017: REQUISITION AND ISSUE VOUCHER</b>
        </div>
        <div class="heading-row text">
            <span>Name of Health Unit: </span>
            <b><span>${e?.organizationName??""}</span></b>
        </div>
        <div class="heading-row text">
            <table style="width:99%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td style="text-align: left;">
                        <span>Dept/section/ward/dispensary: </span>
                        <b><span>${e?.location??""}</span></b>
                    </td>
                    <td style="text-align: right;">                    
                        <span>Date: </span>
                        <b><span>${(0,e_.g1)(e?.operationDate)}</span></b>
                    </td>
                </tr>
            </table>
        </div>
        <table class="table-data" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td colspan="4" valign="top" style='border:solid black 1.0pt;height:40pt'>
                    <div class='text'><b>Ordered by (Name and signature):</b></div>
                    <p class='text' style='margin-top: 1pt;'>${e.orderedBy??"&nbsp;"}</p>
                </td>
                <td colspan="4" valign="top" style='border:solid black 1.0pt;border-left:none;height:40pt'>
                    <div class='text'><b>Authorized by (Name and Signature):</b></div>
                    <p class='text' style='margin-top: 1pt;'>${e.authorizedBy??"&nbsp;"}</p>
                </td>
            </tr>            
            <tr>
                <th valign="middle" class="left"><b>Item Code No.</b></th>
                <th valign="middle" class="left"><b>Item Description (name, formulation, strength)</b></th>
                <th valign="middle"><b>Balance on Hand</b></th>
                <th valign="middle"><b>Quantity Required</b></th>
                <th valign="middle"><b>Quantity Issued</b></th>
                <th valign="middle"><b>Unit Cost</b></th>
                <th valign="middle"><b>Total Cost</b></th>
            </tr>            
            ${e?.items?e?.items.map(e=>`
                <tr class="data-row">
                    <td valign="middle">${e.itemCode??""}</td>
                    <td valign="middle">${e.itemDescription??""}</td>
                    <td valign="middle" class="center">${ep.vI||!e.balanceOnHand?"":`${e.balanceOnHand?.toLocaleString()}  ${e.balanceOnHandUoM??""}`}</td>
                    <td valign="middle" class="center">${e.quantityRequired?.toLocaleString()??""} ${e.quantityRequiredUoM??""}</td>
                    <td valign="middle" class="center">${e.quantityIssued?.toLocaleString()??""} ${e.quantityIssuedUoM??""}</td>
                    <td valign="middle" class="center">${ep.bp?"":`${e.unitCost?.toLocaleString()??""}${e.unitCostUoM?`/${e.unitCostUoM}`:""}`}</td>
                    <td valign="middle" class="center">${ep.bp?"":`${e.totalCost?.toLocaleString()??""}`}</td>
                </tr> 
                `).join(""):""}
            ${t>0?Array(t).fill(0).map(e=>`
        <tr class="data-row">
            <td valign="middle">&nbsp;</td>
            <td valign="middle">&nbsp;</td>
            <td valign="middle" class="center">&nbsp;</td>
            <td valign="middle" class="center">&nbsp;</td>
            <td valign="middle" class="center">&nbsp;</td>
            <td valign="middle" class="center">&nbsp;</td>
            <td valign="middle" class="center">&nbsp;</td>
        </tr>`).join(""):""}
            <tr class="footer-field">
                <td valign="middle" colspan="3">Issue date:</td>
                <td valign="middle" colspan="4">Receipt date:</td>
            </tr>
            <tr class="footer-field">
                <td valign="middle" colspan="3">Name &amp; Signature receiver:</td>
                <td valign="middle" colspan="4">Name &amp; Signature issuer:</td>
            </tr>
        </table>
    </div>
    `},eP=async e=>{eM(eA(await eF(e),e?.documentTitle,!0,ep.iD))},ez=async(e,t,a,n,o)=>{let r={};return ef.S5.REQUISITION_OPERATION_TYPE!==e.operationType&&(r.authorizedBy=e?.dispatchedDate?`${e.dispatchedByFamilyName??""} ${e.dispatchedByGivenName??""}`:e?.completedDate?`${e.completedByFamilyName??""} ${e.completedByGivenName??""}`:""),r.remarks=e.remarks,r.operationNumber=e?.operationNumber,r.operationDate=a?.operationDate??e?.operationDate,r.location=a?.atLocationName??e?.atLocationName,r.source=e?.sourceName,r.destination=e?.destinationName,r.responsiblePerson=r.orderedBy=a?.responsiblePersonFamilyName?`${a.responsiblePersonFamilyName??""} ${a?.responsiblePersonGivenName??""}`:`${e.responsiblePersonFamilyName??""} ${e.responsiblePersonGivenName??""}`,r.organizationName=ep.xM,r.documentTitle=`${e.operationTypeName} ${e?.operationNumber}${a?` of ${a.operationTypeName} ${a?.operationNumber}`:""}`,r.items=t.map(t=>{let r={};if(r.itemCode=t?.acronym,r.itemDescription=(0,L.U)(t?.stockItemName),r.purchasePrice=t?.purchasePrice,r.batchNumber=t?.batchNo,r.expiryDate=t?.expiration,a?(r.quantityRequired=t?.quantityRequested,r.quantityRequiredUoM=t?.quantityRequestedPackagingUOMName,r.quantityIssued=t?.quantity,r.quantityIssuedUoM=t?.stockItemPackagingUOMName):ef.S5.STOCK_ISSUE_OPERATION_TYPE===e.operationType?(r.quantityIssued=t?.quantity,r.quantityIssuedUoM=t?.stockItemPackagingUOMName):(r.quantityRequired=t?.quantity,r.quantityRequiredUoM=t?.stockItemPackagingUOMName),n){let e=n.find(e=>e.uuid===t.uuid);e&&(r.unitCost=e.unitCost,r.unitCostUoM=e.unitCostUOMName,r.totalCost=e.totalCost)}if(o){let e=o.find(e=>e.stockItemUuid===t.stockItemUuid);e&&(r.balanceOnHand=e.quantity,r.balanceOnHandUoM=e.quantityUoM)}return r}),r},eq=async e=>{let t=Math.max(0,25-(e?.items?.length??0)),a=await eL();return`
    <div>
        ${a}
        <div class="heading text center" style="text-transform: uppercase;font-size: 20pt;">
            <b>Inventory Transfer</b>
        </div>
        <div class="heading-row text">
            <span>Name of Health Unit: </span>
            <b><span>${e?.organizationName??""}</span></b>
        </div>
        <div class="heading-row text">
            <table style="width:99%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td style="text-align: left;">
                        <span>Transfer From: </span>
                        <b><span>${e?.location??""}</span></b>
                    </td>
                    <td style="text-align: right;">
                        <span>Transfer#: </span>
                        <b><span>${e?.operationNumber}</span></b>
                    </td>
                </tr>
            </table>
        </div>
        <div class="heading-row text">
            <table style="width:99%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td style="text-align: left;">
                        <span>Transfer To: </span>
                        <b><span>${e?.destination??""}</span></b>
                    </td>
                    <td style="text-align: right;">                    
                        <span>Date: </span>
                        <b><span>${(0,e_.g1)(e?.operationDate)}</span></b>
                    </td>
                </tr>
            </table>
        </div>
        <table class="table-data" border="0" cellspacing="0" cellpadding="0">                     
            <tr>
                <th valign="middle" class="left" style="border-top:solid black 1.0pt;"><b>Item Code No.</b></th>
                <th valign="middle" class="left" style="border-top:solid black 1.0pt;"><b>Item Description (name, formulation, strength)</b></th>
                <th valign="middle" style="border-top:solid black 1.0pt;"><b>Batch No.</b></th>
                <th valign="middle" style="border-top:solid black 1.0pt;"><b>Expiry</b></th>
                <th valign="middle" style="border-top:solid black 1.0pt;"><b>Quantity</b></th>
                <th valign="middle" style="border-top:solid black 1.0pt;"><b>Unit Cost</b></th>
                <th valign="middle" style="border-top:solid black 1.0pt;"><b>Total Cost</b></th>
            </tr>            
            ${e?.items?e?.items.map(e=>`
                <tr class="data-row">
                    <td valign="middle">${e.itemCode??""}</td>
                    <td valign="middle">${e.itemDescription??""}</td>                    
                    <td valign="middle" class="center">${e.batchNumber??""}</td>                    
                    <td valign="middle" class="center">${(0,e_.g1)(e.expiryDate)}</td>                    
                    <td valign="middle" class="center">${e.quantityRequired?.toLocaleString()??""} ${e.quantityRequiredUoM??""}</td>
                    <td valign="middle" class="center">${ep.bp?"":`${e.unitCost?.toLocaleString()??""}${e.unitCostUoM?`/${e.unitCostUoM}`:""}`}</td>
                    <td valign="middle" class="center">${ep.bp?"":`${e.totalCost?.toLocaleString()??""}`}</td>
                </tr> 
                `).join(""):""}
            ${t>0?Array(t).fill(0).map(e=>`
        <tr class="data-row">
            <td valign="middle">&nbsp;</td>
            <td valign="middle">&nbsp;</td>
            <td valign="middle" class="center">&nbsp;</td>
            <td valign="middle" class="center">&nbsp;</td>
            <td valign="middle" class="center">&nbsp;</td>
            <td valign="middle" class="center">&nbsp;</td>
            <td valign="middle" class="center">&nbsp;</td>
        </tr>`).join(""):""}    
            <tr class="footer-field">
                <td valign="middle" colspan="7" style="border:0;padding-top: 15pt;">
                    Remarks:<br/>
                    ${e?.remarks??""}
                </td>                
            </tr>   
            <tr class="footer-field">
                <td valign="middle" colspan="4" style="border:0;padding-top: 15pt;">
                    Prepared By:<br/>
                    <b>${e?.responsiblePerson??""}</b>
                </td>
                <td valign="middle" colspan="3" style="border:0;padding-top: 15pt;">
                   Authorized By:<br/>
                    &nbsp;
                </td>
            </tr>
            <tr class="footer-field">
                <td valign="middle" colspan="4" style="border:0;"><br/><br/>Signature</td>
                <td valign="middle" colspan="3" style="border:0;"><br/><br/>Signature</td>
            </tr>        
        </table>        
    </div>
    `},ej=async e=>{eM(eA(await eq(e),e?.documentTitle,!0,ep.iD))},eH=({operation:e})=>{let{t}=(0,i.useTranslation)(),{isLoading:a,items:o,error:l}=(0,O.Eb)(e.uuid),[c,m]=(0,r.useState)(!1),p=async()=>{m(!0);try{let t,a=null,n=null;if(o.requisitionStockOperationUuid&&!(t=(await (0,O.Wu)(o.requisitionStockOperationUuid)).data))return;if((t||t?.operationType==="stockissue"||t?.operationType==="transferout")&&1){let e={};o?.uuid&&(e.stockOperationUuid=o.uuid);let t=await (0,O.jp)(e);a=t.data?.results}if(t||t?.operationType==="requisition"){let e={};o?.uuid,e.locationUuid=o.atLocationUuid,e.stockOperationUuid=o.uuid,e.v=f.G.Default,e.groupBy="LocationStockItem",e.includeStockItemName="true",e.date=t?.dateCreated?new Date(t.dateCreated).toISOString():o?.dateCreated?new Date(o.dateCreated).toISOString():null;let a=await (0,O._o)(e);n=a.data?.results}let r=await ez(o,o.stockOperationItems??e?.stockOperationItems??[],t,a,n);r?o?.operationType===ef.S5.RECEIPT_OPERATION_TYPE?await eB(r):o?.operationType===ef.S5.TRANSFER_OUT_OPERATION_TYPE?await ej(r):await eP(r):console.warn(r)}catch(e){console.error(e),(0,n.showSnackbar)({kind:"error",title:t("errorPrintingStockOperation","Error printing stock operation"),subtitle:(0,ep.je)(e).join(", ")})}finally{m(!1)}};return s().createElement(d.Button,{onClick:p,kind:"tertiary",disabled:a||c,renderIcon:e=>s().createElement(u.xj,{size:16,...e})},c||a?s().createElement(d.InlineLoading,{description:t("loadingPlaceholder","Loading..."),iconDescription:t("loading","Loading")}):t("print","Print"))},eZ=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Reject",operation:e,requireReason:!0,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,renderIcon:e=>s().createElement(eS.XE,{size:16,...e})},t("reject","Reject"))},eG=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Return",operation:e,requireReason:!0,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,kind:"tertiary",renderIcon:e=>s().createElement(u.kM,{size:16,...e})},t("return","Return "))};var eY=a(4094);let eW={tileContainer:"-esm-stock-management__stock-operations-table__tileContainer___Hf3bi",tile:"-esm-stock-management__stock-operations-table__tile___Rltv3",tileContent:"-esm-stock-management__stock-operations-table__tileContent___PKYUb",content:"-esm-stock-management__stock-operations-table__content___5YHki",helper:"-esm-stock-management__stock-operations-table__helper___hMVu7",toolbarContent:"-esm-stock-management__stock-operations-table__toolbarContent___ioLvK",stockTableContainer:"-esm-stock-management__stock-operations-table__stockTableContainer___tfcUj",container:"-esm-stock-management__stock-operations-table__container___lqN-P",filterContainer:"-esm-stock-management__stock-operations-table__filterContainer___dgDtc",rowLoadingContainer:"-esm-stock-management__stock-operations-table__rowLoadingContainer___2mLNR",statusContainer:"-esm-stock-management__stock-operations-table__statusContainer___ZOYeD",textHeading:"-esm-stock-management__stock-operations-table__textHeading___xKm0I",statusDescriptions:"-esm-stock-management__stock-operations-table__statusDescriptions___ofld0",text:"-esm-stock-management__stock-operations-table__text___yjDAz",actionBtns:"-esm-stock-management__stock-operations-table__actionBtns___lkAho",relatedLink:"-esm-stock-management__stock-operations-table__relatedLink___ZKj5j",relatedTransactionHeader:"-esm-stock-management__stock-operations-table__relatedTransactionHeader___siCKr",toolbarMenuAction:"-esm-stock-management__stock-operations-table__toolbarMenuAction___7cJiz",dataTableSkeleton:"-esm-stock-management__stock-operations-table__dataTableSkeleton___WNbMf",datePicker:"-esm-stock-management__stock-operations-table__datePicker___xyvJu",arrowIcon:"-esm-stock-management__stock-operations-table__arrowIcon___nKYBV",tableHeader:"-esm-stock-management__stock-operations-table__tableHeader___9b8Dj",itemNamesCell:"-esm-stock-management__stock-operations-table__itemNamesCell___q0g50",paginationOverride:"-esm-stock-management__stock-operations-table__paginationOverride___TtLXN"},eV=({stockOperation:e,stockOperationType:t})=>{let a=(0,eY.A)(t),n=(0,r.useMemo)(()=>(0,ef.lj)(t.operationType),[t]);return s().createElement(s().Fragment,null,(!e.permission?.canEdit&&(e.permission?.canApprove||e.permission?.canReceiveItems)||e.permission?.canEdit||(0,ef.LD)(n)||(e?.permission?.isRequisitionAndCanIssueStock??!1)||e.permission?.isRequisitionAndCanIssueStock)&&s().createElement("div",{className:eW.actionBtns},s().createElement(s().Fragment,null,!e.permission?.canEdit&&e.permission?.canApprove&&s().createElement(s().Fragment,null,!a.requiresDispatchAcknowledgement&&s().createElement(eC,{operation:e}),a.requiresDispatchAcknowledgement&&s().createElement(ew,{operation:e}),s().createElement(eZ,{operation:e}),s().createElement(eG,{operation:e}),s().createElement(eI,{operation:e})),!e.permission?.canEdit&&e.permission?.canReceiveItems&&s().createElement(s().Fragment,null,s().createElement(eD,{operation:e,reason:!1}),s().createElement(eG,{operation:e})),e.permission?.canEdit&&s().createElement(eI,{operation:e}),e.permission?.isRequisitionAndCanIssueStock&&s().createElement(ex,{operation:e}),(e.permission?.isRequisitionAndCanIssueStock||e.operationType===ef.S5.STOCK_ISSUE_OPERATION_TYPE||e.operationType===ef.S5.REQUISITION_OPERATION_TYPE||e.operationType===ef.S5.RECEIPT_OPERATION_TYPE||e.operationType===ef.S5.TRANSFER_OUT_OPERATION_TYPE)&&s().createElement(eH,{operation:e}))))},eQ=({stockOperationUuid:e,operationNumber:t})=>{let{error:a,isLoading:n,types:o}=(0,ek.G2)(),{error:l,isLoading:i,items:c}=(0,O.Eb)(e),m=(0,r.useCallback)(()=>{let e=o?.results?.find(e=>e?.uuid===c?.operationTypeUuid);e&&(0,eg.AE)(e,c,c?.requisitionStockOperationUuid)},[o,c]);return n||a||l||i?null:s().createElement("span",{onClick:m,style:{cursor:"pointer",textDecoration:"underline"}},t)},eK=({stockOperation:e,stockOperationType:t})=>{let{t:a}=(0,i.useTranslation)(),{error:o,isLoading:l,operationLinks:c}=(e=>{let t=`${n.restBaseUrl}/stockmanagement/stockoperationlink?v=default&q=${e}`,{data:a,error:o,isLoading:r,mutate:s}=j()(e?t:null,n.openmrsFetch);return{error:o,isLoading:r,mutate:s,operationLinks:a?.data?.results??[]}})((0,r.useMemo)(()=>t?.operationType===ef.S5.REQUISITION_OPERATION_TYPE||e?.operationType===ef.S5.REQUISITION_OPERATION_TYPE||t?.operationType===ef.S5.STOCK_ISSUE_OPERATION_TYPE||e?.operationType===ef.S5.STOCK_ISSUE_OPERATION_TYPE?e.uuid:null,[t,e]));return l||o?null:s().createElement("div",null," ",c&&c.length>0&&s().createElement("div",null,s().createElement("h6",{className:eW.relatedTransactionHeader},a("relatedTransactions","Related Transactions:")),c.map(n=>(e.uuid===n?.parentUuid||t?.uuid===n?.parentUuid)&&s().createElement("div",{key:n.uuid},s().createElement("span",null,(0,M.nt)(a,n?.childOperationTypeName)),s().createElement("span",{className:n?.childVoided?"voided":""}," ",n?.childVoided&&n?.childOperationNumber,!n?.childVoided&&s().createElement("span",{className:eW.relatedLink},s().createElement(eQ,{stockOperationUuid:n?.childUuid,operationNumber:n?.childOperationNumber})))," ",s().createElement("span",null,"[",(0,M.e_)(a,n?.childStatus),"]"))),c.map(n=>(e.uuid===n?.childUuid||t.uuid===n?.childUuid)&&s().createElement("div",{key:n.uuid},s().createElement("span",null,(0,M.nt)(a,n?.parentOperationTypeName)),s().createElement("span",{className:n?.parentVoided?"voided":""}," ",n?.parentVoided&&n?.parentOperationNumber,!n?.parentVoided&&s().createElement("span",{className:eW.relatedLink},s().createElement(eQ,{stockOperationUuid:n?.parentUuid,operationNumber:n?.parentOperationNumber})))," ",s().createElement("span",null,"[",(0,M.e_)(a,n?.parentStatus),"]")))))},eJ=({items:e})=>{let{t}=(0,i.useTranslation)(),[a,o]=(0,r.useState)(10),l=(0,r.useMemo)(()=>[5,10,20,50,100],[]),[c,m]=(0,r.useState)(""),u=e.filter(e=>{let t=c.trim().toLowerCase();return!t||(e.commonName??"").toLowerCase().includes(t)}),{results:p,totalPages:_,currentPage:g,goTo:k}=(0,n.usePagination)(u,a),b=(0,r.useMemo)(()=>[{header:t("item","Item"),key:"commonName"},{header:t("batchNo","Batch number"),key:"batchNo"},{header:t("expiry","Expiry"),key:"expiration"},{header:t("quantity","Quantity"),key:"quantity"},{header:t("uom","Unit of Measurement"),key:"stockItemPackagingUOMName"}],[t]),h=(0,r.useMemo)(()=>p.map((e,t)=>({id:t,...e,expiration:e.expiration?(0,e_.ZM)(e.expiration):"--"})),[p]);return s().createElement(d.Tile,{className:"-esm-stock-management__stock-items-table__container___EJrwZ"},s().createElement("span",{className:"-esm-stock-management__stock-items-table__title___yPzNC"},t("stockItems","Stock items")),s().createElement(d.Search,{closeButtonLabelText:t("clearSearch","Clear search input"),labelText:t("search","Search"),placeholder:t("search","Search"),value:c,onChange:({target:{value:e}})=>m(e)}),s().createElement(d.DataTable,{useZebraStyles:!0,rows:h,headers:b},({rows:e,headers:t,getTableProps:a,getHeaderProps:n,getRowProps:o})=>s().createElement(d.Table,a(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,t.map(e=>s().createElement(d.TableHeader,n({header:e}),e.header)))),s().createElement(d.TableBody,null,e.map(e=>s().createElement(d.TableRow,o({row:e}),e.cells.map(e=>s().createElement(d.TableCell,{key:e.id},e.value))))))),s().createElement(d.Pagination,{...(0,M.LI)(t),page:g,pageSize:a,pageSizes:l,totalItems:u.length,onChange:({page:e,pageSize:t})=>{k(e),o(t)}}))},eX="-esm-stock-management__stock-operation-expanded-row__text___57AWf",e0="-esm-stock-management__stock-operation-expanded-row__statusContainerRow___NCj+K",e1=({status:e,statusFillerFamilyName:t,statusFillerGivenName:a,statusFilledDate:o,extraStatusinfo:r})=>{let{t:l}=(0,i.useTranslation)();return s().createElement("div",null,s().createElement("span",{className:"-esm-stock-management__stock-operation-expanded-row__textHeading___jsti5"},e,":"),s().createElement("div",{className:"-esm-stock-management__stock-operation-expanded-row__statusDescriptions___Zk1Ht"},s().createElement("span",{className:eX},(0,n.formatDate)((0,n.parseDate)(o),{time:!0,mode:"standard"}))," ",s().createElement("span",{className:eX},l("by","By"))," ",s().createElement("span",{className:eX},[t,a].filter(Boolean).join(" ")),r))},e5=e=>{let{t}=(0,i.useTranslation)(),{types:a,isLoading:n,error:o}=(0,ek.G2)(),l=(0,r.useMemo)(()=>a?.results?.find(({uuid:t})=>e.model?.operationTypeUuid===t),[e.model?.operationTypeUuid,a?.results]);return e.model?s().createElement(s().Fragment,null,s().createElement(d.Layer,{className:"-esm-stock-management__stock-operation-expanded-row__statusContainer___e8ZHc"},s().createElement(d.Row,{className:e0},e.model?.dateCreated&&s().createElement(e1,{status:t("started","Started"),statusFilledDate:e.model?.dateCreated.toString(),statusFillerFamilyName:e.model?.creatorFamilyName,statusFillerGivenName:e.model?.creatorGivenName}),e.model.submittedDate&&s().createElement(e1,{status:t("submitted","Submitted"),statusFilledDate:e.model?.submittedDate.toString(),statusFillerFamilyName:e.model?.submittedByFamilyName,statusFillerGivenName:e.model?.submittedByGivenName}),e.model?.dispatchedDate&&s().createElement(e1,{status:t("dispatched","Dispatched"),statusFilledDate:e.model?.dispatchedDate.toString(),statusFillerFamilyName:e.model?.dispatchedByFamilyName,statusFillerGivenName:e.model?.dispatchedByGivenName}),e.model?.returnedDate&&s().createElement(e1,{status:t("returned","Returned"),statusFilledDate:e.model?.returnedDate.toString(),statusFillerFamilyName:e.model?.returnedByFamilyName,statusFillerGivenName:e.model?.returnedByGivenName,extraStatusinfo:s().createElement("span",{className:eX},e.model?.returnReason)}),e.model?.completedDate&&s().createElement(e1,{status:(0,M.qD)(t,e.model),statusFilledDate:e.model?.completedDate.toString(),statusFillerFamilyName:e.model?.completedByFamilyName,statusFillerGivenName:e.model?.completedByGivenName}),e.model?.status==="CANCELLED"&&s().createElement(e1,{status:t("cancelled","Cancelled"),statusFilledDate:e.model?.cancelledDate.toString(),statusFillerFamilyName:e.model?.cancelledByFamilyName,statusFillerGivenName:e.model?.cancelledByGivenName,extraStatusinfo:s().createElement("span",{className:eX},e.model?.cancelReason)}),e.model?.status==="REJECTED"&&s().createElement(e1,{status:t("rejected","Rejected"),statusFilledDate:e.model?.rejectedDate.toString(),statusFillerFamilyName:e.model?.rejectedByFamilyName,statusFillerGivenName:e.model?.rejectedByGivenName,extraStatusinfo:s().createElement("span",null,e.model?.rejectionReason)})),s().createElement(d.Row,{className:e0},n&&s().createElement(d.InlineLoading,{description:t("loadingStockOperationLinks","Loading stock operation links..."),iconDescription:t("loadingStockOperationLinksIcon","Loading stock operation links")}),l&&s().createElement(eK,{stockOperationType:l,stockOperation:e.model})),s().createElement(d.Row,{className:e0},s().createElement(eJ,{items:e.model.stockOperationItems})),s().createElement(d.Row,{className:e0},n&&s().createElement(d.InlineLoading,{description:t("loadingOperationActions","Loading stock operation actions..."),iconDescription:t("loadingOperationActionsIcon","Loading stock operation actions")}),l&&s().createElement(eV,{stockOperationType:l,stockOperation:e.model})))):null},e4=()=>{let{t:e,i18n:t}=(0,i.useTranslation)(),a=(0,X.K)(),o=()=>{a(`${n.restBaseUrl}/stockmanagement/stockoperation`)},[l,c]=(0,r.useState)(null),[m,u]=(0,r.useState)(null),[p,_]=(0,r.useState)([]),[g,k]=(0,r.useState)([]),[b,h]=(0,r.useState)([]),[E,y]=(0,r.useState)(""),[T,v]=(0,r.useState)(""),[N,S]=(0,r.useState)([]),C=(0,r.useCallback)(()=>S([]),[]),w=(0,r.useCallback)(e=>S(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]),[]),I=(0,et.d)(e=>{C(),v(e.trim())},300),D=e=>{let t="string"==typeof e?e:e?.target?.value??"";y(t),I(t)},{items:x,tableHeaders:U,currentPage:R,pageSizes:A,totalItems:L,goTo:$,currentPageSize:B,setPageSize:F,isLoading:P}=function(e){let[t,a]=(0,r.useState)(10),n=`${JSON.stringify(e)}|${t}`,[o,s]=(0,r.useState)({filterKey:n,page:1});o.filterKey!==n&&s({filterKey:n,page:1});let l=o.filterKey===n?o.page:1,c=(0,r.useCallback)(e=>s({filterKey:n,page:e}),[n]),{items:m,isLoading:d,error:u}=(0,O.kR)({...e,totalCount:!0,startIndex:l-1,limit:t}),p=(0,r.useMemo)(()=>m?.results??[],[m]),{t:_}=(0,i.useTranslation)(),g=(0,r.useMemo)(()=>[{id:0,header:_("type","Type"),key:"operationTypeName"},{id:1,header:_("number","Number"),key:"operationNumber"},{id:2,header:_("stockOperationItemsTableHeader","Items"),key:"stockOperationItems"},{id:3,header:_("status","Status"),key:"status"},{id:4,header:_("location","Location"),key:"location"},{id:5,header:_("responsiblePerson","Responsible Person"),key:"responsiblePerson"},{id:6,header:_("date","Date"),key:"operationDate"},{id:7,key:"actions",header:"",isSortable:!1}],[_]);return{items:p,totalItems:m?.totalCount,currentPage:l,currentPageSize:t,paginatedItems:p,goTo:c,pageSizes:[10,20,30,40,50],isLoading:d,error:u,setPageSize:a,tableHeaders:g}}({v:f.G.Full,totalCount:!0,q:T||void 0,operationDateMin:l?.toISOString(),operationDateMax:m?.toISOString(),status:g.join(","),sourceTypeUuid:p.join(","),operationTypeUuid:b.join(",")}),z=T||l||m||p.length||g.length||b.length,q=(0,r.useCallback)((e,t)=>{C(),t===ep.m0.SOURCES?_(e):t===ep.m0.OPERATION?h(e):k(e)},[C]),j=(0,r.useMemo)(()=>x?.map((t,a)=>{let n=(t?.stockOperationItems?.length??0)>1,o=t?.stockOperationItems?.slice(0,n?1:void 0).map(e=>e.commonName).join(", ")??"";return{...t,id:t?.uuid,key:`key-${t?.uuid}`,operationTypeName:(0,M.nt)(e,t?.operationTypeName),operationNumber:s().createElement(eh,{stockOperation:t,showIcon:!1,showprops:!0}),stockOperationItems:{commonNames:o,more:n?t?.stockOperationItems?.length-1:0},status:(0,M.e_)(e,t?.status),source:`${t?.sourceName??""}`,destination:`${t?.destinationName??""}`,location:s().createElement(s().Fragment,null,t?.sourceName??"",t?.sourceName&&t?.destinationName?s().createElement(ec.Qp,{className:eW.arrowIcon,key:`${a}-0`,size:12}):""," ",t?.destinationName??""),responsiblePerson:`${t?.responsiblePersonFamilyName??t?.responsiblePersonOther??""} ${t?.responsiblePersonGivenName??""}`,operationDate:(0,e_.a9)(t?.operationDate),actions:s().createElement(eh,{stockOperation:t,showIcon:!0,showprops:!1})}}),[x,e]);return P&&!z?s().createElement(d.DataTableSkeleton,{className:eW.dataTableSkeleton,showHeader:!1,rowCount:5,columnCount:5,zebra:!0}):s().createElement(s().Fragment,null,s().createElement("h2",{className:eW.tableHeader},e("stockOperationsTableHeader","Stock operations to track movement of stock.")),s().createElement(d.DataTable,{headers:U,isSortable:!0,rows:j,useZebraStyles:!0,translateWithId:(0,M.IQ)(e)},({getExpandedRowProps:a,getHeaderProps:r,getRowProps:i,getTableProps:p,headers:_,rows:g})=>s().createElement(d.TableContainer,{className:eW.stockTableContainer},s().createElement(d.TableToolbar,{"aria-label":e("dataTableToolbar","Data table toolbar"),style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableToolbarContent,{className:eW.toolbarContent},s().createElement(d.TableToolbarSearch,{expanded:!0,closeButtonLabelText:e("clearSearch","Clear search input"),labelText:e("searchStockOperationsByNumber","Search by operation number or location"),onChange:D,placeholder:e("searchStockOperationsByNumber","Search by operation number or location"),value:E}),s().createElement("div",{className:eW.container},s().createElement(d.DatePicker,{className:eW.datePicker,datePickerType:"range",dateFormat:ep.Mz,locale:(0,M.ft)(t.language),...(0,M.Wo)(e),onChange:([e,t])=>(([e,t])=>{C(),e&&(c(e),m&&e&&m<e&&u(e)),t&&(u(t),l&&t&&l>t&&c(t))})([e,t]),value:[l,m]},s().createElement(d.DatePickerInput,{id:"stock-operations-start-date",labelText:e("startDate","Start date"),placeholder:ep.YI}),s().createElement(d.DatePickerInput,{id:"stock-operations-end-date",labelText:e("endDate","End date"),placeholder:ep.YI})),s().createElement(eN,{filterName:ep.m0.SOURCES,onFilterChange:q}),s().createElement(eN,{filterName:ep.m0.STATUS,onFilterChange:q}),s().createElement(eN,{filterName:ep.m0.OPERATION,onFilterChange:q})),s().createElement(d.TableToolbarMenu,{iconDescription:e("settings","Settings")},s().createElement(d.TableToolbarAction,{className:eW.toolbarMenuAction,onClick:o},e("refresh","Refresh"))),s().createElement(eT,null))),s().createElement(d.Table,p(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,s().createElement(d.TableExpandHeader,null),_.map(t=>"details"!==t.key&&s().createElement(d.TableHeader,{...r({header:t,isSortable:t.isSortable}),className:n.isDesktop?eW.desktopHeader:eW.tabletHeader,key:`${t.key}`,translateWithId:(0,M.L9)(e)},t.header?.content??t.header)))),s().createElement(d.TableBody,null,g?.map(t=>{let o=x?.find(e=>e?.uuid===t.id),r=!!o&&N.includes(t.id),l={...i({row:t}),isExpanded:r,onExpand:()=>w(t.id),"aria-label":r?e("collapseCurrentRow","Collapse current row"):e("expandCurrentRow","Expand current row")};return s().createElement(s().Fragment,{key:t.id},s().createElement(d.TableExpandRow,{className:n.isDesktop?eW.desktopRow:eW.tabletRow,...l},t.cells.map(a=>s().createElement(d.TableCell,{key:a.id,className:a?.info?.header==="stockOperationItems"?eW.itemNamesCell:void 0},a?.info?.header==="stockOperationItems"?s().createElement("span",null,s().createElement("span",null,a.value.commonNames),a.value.more>0&&s().createElement(d.Link,{onClick:()=>w(t.id)},e("moreItems","...({{count}} more)",{count:a.value.more}))):a.value))),r?s().createElement(d.TableExpandedRow,{...a({row:t}),colSpan:_.length+1},s().createElement(e5,{model:o})):s().createElement(d.TableExpandedRow,{className:eW.hiddenRow,colSpan:_.length+1}))}))),0!==g.length||P?null:s().createElement("div",{className:eW.tileContainer},s().createElement(d.Tile,{className:eW.tile},s().createElement("div",{className:eW.tileContent},s().createElement("p",{className:eW.content},e("noOperationsToDisplay","No stock operations to display")),s().createElement("p",{className:eW.helper},e("checkFilters","Check the filters above"))))),!!(z&&P)&&s().createElement("div",{className:eW.rowLoadingContainer},s().createElement(d.InlineLoading,{description:e("loadingPlaceholder","Loading...")})))),x.length>0&&s().createElement(d.Pagination,{...(0,M.LI)(e),page:R,pageSize:B,pageSizes:A,totalItems:L,onChange:({pageSize:e,page:t})=>{e!==B&&F(e),t!==R&&$(t)},className:eW.paginationOverride}))};var e6=a(4535),e7=a(1362),e2=a(1397),e3=a(1651);let e8="Pending",e9="Completed",te="Cancelled",tt=(e,t=[])=>{if(!e)return null;let a={};return e.split(/\r?\n|\r/).forEach(e=>{if(e.startsWith("#")||t&&t.some(t=>e.startsWith(t)))return;let n=e.split("=",2);if(2===n.length)if(n[0].startsWith("param.")){let e=n[0].substring(6),t=e.lastIndexOf(".value.desc");if(t>0&&(e=e.substring(0,t)+".display"),e){let t=e.split("."),o=t.length>1?t.slice(0,t.length-1).join("."):t[0],r=t.length>1?t[t.length-1]:"value";a[o]||(a[o]={}),a[o][r]=n[1]}}else{let e=n[0].split(".",2),t=e[0],o=e.length>1?e[1]:"value";a[t]||(a[t]={}),a[t][o]=n[1]}}),a},ta=({title:e,description:t})=>{let{t:a}=(0,i.useTranslation)();return s().createElement("div",{className:"-esm-stock-management__privileged-view__tileContainer___Yl4Vp"},s().createElement(d.Tile,{className:"-esm-stock-management__privileged-view__tile___IYz7X"},s().createElement("div",{className:"-esm-stock-management__privileged-view__tileContent___Gc2Rz"},s().createElement(A._N,{size:"24"}),s().createElement("p",{className:"-esm-stock-management__privileged-view__content___yTq+x"},a("noPrivilegesTitle",`${e}`)),t&&s().createElement("p",{className:"-esm-stock-management__privileged-view__helper___TmynX"},a("noViewPrivilegesDescription","Description: {{description}}",{description:t})))))},tn=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-reports-form-workspace")},[]);return s().createElement(d.Button,{onClick:t,size:"md",kind:"primary"},e("newReport","New Report"))},to={container:"-esm-stock-management__stock-reports__container___ZKAc9",content:"-esm-stock-management__stock-reports__content___EyyhY",helper:"-esm-stock-management__stock-reports__helper___ZF3Ny",separator:"-esm-stock-management__stock-reports__separator___OJG7M",tileContainer:"-esm-stock-management__stock-reports__tileContainer___EQcu0",tile:"-esm-stock-management__stock-reports__tile___lwOqT",tileContent:"-esm-stock-management__stock-reports__tileContent___NirI4",statusContainer:"-esm-stock-management__stock-reports__statusContainer___-ixXF",reportStatus:"-esm-stock-management__stock-reports__reportStatus___x2TYB",textHeading:"-esm-stock-management__stock-reports__textHeading___RgSrr",statusDescriptions:"-esm-stock-management__stock-reports__statusDescriptions___+7DLu",text:"-esm-stock-management__stock-reports__text___SXJQp",toolbarMenuAction:"-esm-stock-management__stock-reports__toolbarMenuAction___gIZtH",tableHeader:"-esm-stock-management__stock-reports__tableHeader___YQ8V+"},tr=e=>{let t,{t:a}=(0,i.useTranslation)();try{t=((e,t)=>{if(!t)return null;let a=Object.keys(t);return 0===a.length?null:a.map((a,n)=>{let o=t[a].description??a,r=t[a].display??t[a].value;return s().createElement("div",{key:`${e}-param-${n}`},o,": ",r)})})(e.model?.uuid,tt(e.model?.executionState))}catch(e){console.error(e)}return s().createElement("div",{className:to.statusContainer},e.model?.status===te&&s().createElement("div",null,s().createElement("span",{className:to.textHeading},a("cancelled","Cancelled"),":"),s().createElement("div",{className:to.statusDescriptions},s().createElement("span",{className:to.text},(0,n.formatDate)((0,n.parseDate)(e.model?.cancelledDate.toString()),{time:!0,mode:"standard"}),s().createElement("p",null,e.model?.cancelReason)))),e.model?.startTime&&s().createElement("div",null,s().createElement("span",{className:to.textHeading},a("started","Started"),":"),s().createElement("div",{className:to.statusDescriptions},s().createElement("span",{className:to.text},(0,n.formatDate)((0,n.parseDate)(e.model?.startTime.toString()),{time:!0,mode:"standard"})))),e.model?.endTime&&s().createElement("div",null,s().createElement("span",{className:to.textHeading},a("ended","Ended"),":"),s().createElement("div",{className:to.statusDescriptions},s().createElement("span",{className:to.text},(0,n.formatDate)((0,n.parseDate)(e.model?.endTime.toString()),{time:!0,mode:"standard"})))),e.model?.expiration&&s().createElement("div",null,s().createElement("span",{className:to.textHeading},a("expires","Expires"),":"),s().createElement("div",{className:to.statusDescriptions},s().createElement("span",{className:to.text},(0,e_.ZM)(e.model?.expiration)))),t&&s().createElement("div",null,s().createElement("span",{className:to.textHeading},a("executionState","Execution State"),":"),s().createElement("div",{className:to.statusDescriptions},s().createElement("span",{className:to.text},t))),e.model?.completedDate&&s().createElement("div",null,s().createElement("span",{className:to.textHeading},a("completed","Completed"),":"),s().createElement("div",{className:to.statusDescriptions},s().createElement("span",{className:to.text},(0,n.formatDate)((0,n.parseDate)(e.model?.completedDate.toString()),{time:!0,mode:"standard"})))),e.model?.exitMessage&&s().createElement("div",null,s().createElement("span",{className:to.textHeading},a("exitMessage","Message"),":"),s().createElement("div",{className:to.statusDescriptions},s().createElement("span",{className:to.text},s().createElement("p",null,e.model?.exitMessage)))))},ts=e=>{let t;try{t=((e,t)=>{if(!t)return null;let a=Object.keys(t);return 0===a.length?null:a.map((a,n)=>{let o=t[a].description??a,r=t[a].display??t[a].value;return s().createElement("div",{key:`${e}-param-${n}`},o,": ",r)})})(e.model?.uuid,tt(e.model?.parameters,["param.report"]))}catch(e){console.error(e)}return s().createElement("span",null,t)};function tl(e){return/[\t\r\n"]/.test(e)?`"${e.replace(/"/g,'""')}"`:e}async function ti(e,t,a){if(a?.toLowerCase()!=="csv")return void window.open(e,"_blank");try{var n,o,r;let a,s=await fetch(e,{credentials:"same-origin"}),l=s.headers.get("Content-Disposition");if(!s.ok||!l)return void window.open(e,"_blank");let i=(n=await s.text(),function(e){let t=new Uint8Array(2+2*e.length),a=new DataView(t.buffer);a.setUint16(0,65279,!0);for(let t=0;t<e.length;t++)a.setUint16(2+2*t,e.charCodeAt(t),!0);return t}((o=function(e){let t=[],a=[],n="",o=!1,r=!1,s=()=>{a.push(n),n=""},l=()=>{(r||a.length>0)&&(s(),t.push(a)),a=[],r=!1},i=65279===e.charCodeAt(0)?e.slice(1):e;for(let e=0;e<i.length;e++){let t=i[e];o?'"'===t?'"'===i[e+1]?(n+='"',e++):o=!1:n+=t:'"'===t?(o=!0,r=!0):","===t?(s(),r=!0):"\r"===t||"\n"===t?("\r"===t&&"\n"===i[e+1]&&e++,l()):(n+=t,r=!0)}return l(),t}(n)).map(e=>e.map(tl).join("	")).join("\r\n")+(o.length>0?"\r\n":""))),c=new Blob([i],{type:"text/csv;charset=utf-16le"}),m=document.createElement("a"),d=URL.createObjectURL(c);m.href=d,r=`${t}.csv`,m.download=(a=/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(l??""))?decodeURIComponent(a[1]):r,document.body.appendChild(m),m.click(),m.remove(),setTimeout(()=>URL.revokeObjectURL(d),1e4)}catch{window.open(e,"_blank")}}var tc=a(8720),tm=a(5960),td=a(6039);let tu="-esm-stock-management__item-movement-report__helper___2Jrmd",tp="-esm-stock-management__item-movement-report__itemName___IzwHw",t_=({onClose:e})=>{let t,a,{t:o}=(0,i.useTranslation)(),{useItemCommonNameAsDisplay:l}=(0,n.useConfig)(),[c,m]=(0,r.useState)(null),u=(0,r.useMemo)(()=>((e=new Date)=>({from:Z()(e).startOf("month").toDate(),to:Z()(e).endOf("month").startOf("day").toDate()}))(),[]);return s().createElement("div",{className:"-esm-stock-management__item-movement-report__container___IUB96"},s().createElement("div",{className:"-esm-stock-management__item-movement-report__header___M7yDF"},s().createElement("h2",{className:"-esm-stock-management__item-movement-report__title___mQsu1"},o("itemMovementReport","Item movement")),e&&s().createElement(d.Button,{kind:"ghost",size:"md",renderIcon:ec.nk,onClick:e},o("backToReports","Back to reports"))),s().createElement("p",{className:tu},o("itemMovementReportHelp","Search for a stock item, then choose the period and the location: its movements are shown here and can be printed.")),s().createElement("div",{className:"-esm-stock-management__item-movement-report__search___5Ke47"},s().createElement(tc.A,{onSelectedItem:m})),c?s().createElement(s().Fragment,null,s().createElement("h3",{className:tp,"data-testid":"item-movement-item"},(t=l?c.commonName||c.drugName:c.drugName||c.commonName,(a=l?c.drugName:c.commonName)&&a!==t?`${t} (${a})`:t??"")),s().createElement(tm.A,{key:c.uuid,stockItemUuid:c.uuid,defaultPeriod:u,defaultLocationId:td.N})):s().createElement(d.Tile,{className:"-esm-stock-management__item-movement-report__empty___zKqB0"},s().createElement("p",null,o("itemMovementChooseItem","Choose a stock item to see its movements."))))},tg=({onOpen:e})=>{let{t}=(0,i.useTranslation)();return s().createElement(d.Tile,{className:"-esm-stock-management__item-movement-report__entry___nyxvZ"},s().createElement("div",null,s().createElement("h3",{className:tp},t("itemMovementReport","Item movement")),s().createElement("p",{className:tu},t("itemMovementReportDescription","The movements of one stock item over a period, on screen, with the stock card to print when needed."))),s().createElement(d.Button,{kind:"primary",size:"md",renderIcon:ec.Qp,onClick:e},t("itemMovementReportOpen","Open")))};var tk=a(5576);let tb=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-sources-form-workspace")},[]);return s().createElement(d.Button,{onClick:t,size:"md",kind:"primary"},e("addNewStockSource","Add new source"))},th=({data:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-sources-form-workspace",{model:e})},[e]);return s().createElement(d.IconButton,{kind:"ghost",size:"md",onClick:a,label:t("editStockSource","Edit stock source")},s().createElement(J.ff,{size:16}))};var tE=a(8455);let ty=({uuid:e})=>{let{t}=(0,i.useTranslation)(),a=(0,X.K)(),[o,l]=(0,r.useState)(!1),c=s().useCallback(()=>{let o=(0,n.showModal)("delete-stock-modal",{close:()=>o(),uuid:e,onConfirmation:()=>{let r=[];r.push(e),(0,tE.Xh)(r).then(()=>{l(!1),a(`${n.restBaseUrl}/stockmanagement/stocksource`),(0,n.showSnackbar)({isLowContrast:!0,title:t("deletingSource","Delete Source"),kind:"success",subtitle:t("stockSourceDeletedSuccessfully","Stock Source Deleted Successfully")})},e=>{l(!1),(0,n.showSnackbar)({title:t("errorDeletingSource","Error deleting a source"),kind:"error",isLowContrast:!0,subtitle:e?.message})}).catch(),o()}})},[t,e,a]),m=s().createElement(d.Button,{kind:"ghost",size:"md",onClick:c,"aria-label":t("deleteSource","Delete Source")},s().createElement(tk.zH,{size:16}));return o?s().createElement(d.InlineLoading,null):m},tf=({onFilterChange:e})=>{let{t}=(0,i.useTranslation)(),{stockSourceTypeUUID:a}=(0,n.useConfig)(),{items:o,isLoading:r,error:l}=(0,ek.cj)(a);return r?s().createElement(d.DropdownSkeleton,{size:"sm"}):(l&&(0,n.showSnackbar)({title:t("errorFetchingStockSourceTypes","Error fetching stock source types"),subtitle:l.message,kind:"error",isLowContrast:!0}),0===Object.keys(o).length)?null:s().createElement("div",{className:"-esm-stock-management__stock-sources-filter__filterContainer___Bb9v0"},s().createElement(d.Dropdown,{translateWithId:(0,M.D1)(t),id:"stockSourcesFilter",initialSelectedItem:o?.answers?.[0],items:[...o?.answers||[]],itemToString:e=>e?e.display:t("notSet","Not Set"),label:"",onChange:({selectedItem:t})=>e(t?.display),size:"sm",titleText:t("selectSourceType","Select source type"),type:"inline"}))},tT={container:"-esm-stock-management__stock-sources__container___oayXM",headerContainer:"-esm-stock-management__stock-sources__headerContainer___8t1IZ",headerButtons:"-esm-stock-management__stock-sources__headerButtons___UOS+X",heading:"-esm-stock-management__stock-sources__heading___edIfR",filterContainer:"-esm-stock-management__stock-sources__filterContainer___vC26j",tooltip:"-esm-stock-management__stock-sources__tooltip___WBWQs",tag:"-esm-stock-management__stock-sources__tag___yDzTi",backgroundDataFetchingIndicator:"-esm-stock-management__stock-sources__backgroundDataFetchingIndicator___g-a2v",search:"-esm-stock-management__stock-sources__search___Bzrt2",tableContainer:"-esm-stock-management__stock-sources__tableContainer___sLSlE",toolbarContent:"-esm-stock-management__stock-sources__toolbarContent___mzMtt",emptyRow:"-esm-stock-management__stock-sources__emptyRow___5NiWZ",stockSourcesTable:"-esm-stock-management__stock-sources__stockSourcesTable___S3SzO",content:"-esm-stock-management__stock-sources__content___SPY43",helper:"-esm-stock-management__stock-sources__helper___u9ge-",separator:"-esm-stock-management__stock-sources__separator___047KC",tileContainer:"-esm-stock-management__stock-sources__tileContainer___xskbH",tile:"-esm-stock-management__stock-sources__tile___Vgj2L",tileContent:"-esm-stock-management__stock-sources__tileContent___pbxoz",menuItem:"-esm-stock-management__stock-sources__menuItem___MUoew",desktopHeading:"-esm-stock-management__stock-sources__desktopHeading___b1pI5",tabletHeading:"-esm-stock-management__stock-sources__tabletHeading___pLZUa",statusContainer:"-esm-stock-management__stock-sources__statusContainer___te34Z",visitType:"-esm-stock-management__stock-sources__visitType___UXsDD",headerBtnContainer:"-esm-stock-management__stock-sources__headerBtnContainer___IhIgF",addPatientToListBtn:"-esm-stock-management__stock-sources__addPatientToListBtn___tCLhZ",editIcon:"-esm-stock-management__stock-sources__editIcon___AUCBC",toolbarMenuAction:"-esm-stock-management__stock-sources__toolbarMenuAction___LMamR",tableHeader:"-esm-stock-management__stock-sources__tableHeader___Z1JQE"},tv=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,X.K)(),[a,o]=s().useState(""),l=()=>{t(`${n.restBaseUrl}/stockmanagement/stocksource`)},{items:c,totalItems:m,tableHeaders:u,currentPage:p,pageSizes:_,goTo:g,currentPageSize:k,setPageSize:b,isLoading:h}=function(e){let{t}=(0,i.useTranslation)(),{items:a,isLoading:o,error:s}=(0,tE.UP)(e),[l,c]=(0,r.useState)(10),{goTo:m,results:d,currentPage:u}=(0,n.usePagination)(a.results,l),p=(0,r.useMemo)(()=>[{id:1,header:t("name","Name"),key:"name"},{id:2,header:t("acronym","Acronym"),key:"acronym"},{id:3,header:t("sourceType","Source type"),key:"sourceType"},{id:4,header:t("actions","Actions"),key:"actions"}],[t]);return{items:d,totalItems:a?.totalCount,currentPage:u,currentPageSize:l,paginatedItems:d,goTo:m,pageSizes:[10,20,30,40,50],isLoading:o,error:s,setPageSize:c,tableHeaders:p}}({v:f.G.Default,totalCount:!0}),E=(0,r.useMemo)(()=>c?.map((e,t)=>({...e,id:e?.uuid,key:`key-${e?.uuid}`,uuid:e?.uuid,name:e?.name,acronym:e?.acronym,sourceType:e?.sourceType?.display,actions:s().createElement(s().Fragment,null,s().createElement(th,{data:c[t]}),s().createElement(ty,{uuid:c[t].uuid}))})),[c]),y=e=>{o(e)},T=(0,r.useMemo)(()=>a?E.filter(e=>e.sourceType===a):E,[E,a]);return h?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):s().createElement("div",{className:tT.tableOverride},s().createElement("h2",{className:tT.tableHeader},e("stockSourcesTableHeader","List of partners who provide stock to the facility.")),s().createElement(d.DataTable,{rows:T,headers:u,isSortable:!0,useZebraStyles:!0},({rows:t,headers:a,getHeaderProps:o,getTableProps:r,getRowProps:i,onInputChange:c})=>s().createElement(d.TableContainer,null,s().createElement(d.TableToolbar,{"aria-label":e("dataTableToolbar","Data table toolbar"),style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableToolbarContent,{className:tT.toolbarContent},s().createElement(d.TableToolbarSearch,{labelText:e("filterTable","Filter table"),placeholder:e("filterTable","Filter table"),closeButtonLabelText:e("clearSearch","Clear search input"),persistent:!0,onChange:c}),s().createElement("div",{style:{display:"flex",alignItems:"center"}},s().createElement(tf,{onFilterChange:y})),s().createElement(d.TableToolbarMenu,{iconDescription:e("settings","Settings")},s().createElement(d.TableToolbarAction,{className:tT.toolbarMenuAction,onClick:l},e("refresh","Refresh"))),s().createElement(tb,null))),s().createElement(d.Table,r(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,a.map(e=>"details"!==e.key&&s().createElement(d.TableHeader,{...o({header:e,isSortable:e.isSortable}),className:n.isDesktop?tT.desktopHeader:tT.tabletHeader,key:`${e.key}`},"object"==typeof e.header&&null!==e.header&&"content"in e.header?e.header.content:e.header)),s().createElement(d.TableHeader,null))),s().createElement(d.TableBody,null,t.map(e=>s().createElement(s().Fragment,{key:e.id},s().createElement(d.TableRow,{className:n.isDesktop?tT.desktopRow:tT.tabletRow,...i({row:e})},e.cells.map(e=>e?.info?.header!=="details"&&s().createElement(d.TableCell,{key:e.id},e.value))))))),0===t.length?s().createElement("div",{className:tT.tileContainer},s().createElement(d.Tile,{className:tT.tile},s().createElement("div",{className:tT.tileContent},s().createElement("p",{className:tT.content},e("noSourcesToDisplay","No stock sources to display")),s().createElement("p",{className:tT.helper},e("checkFilters","Check the filters above"))))):null)),s().createElement(d.Pagination,{...(0,M.LI)(e),page:p,pageSize:k,pageSizes:_,totalItems:m,onChange:({pageSize:e,page:t})=>{e!==k&&b(e),t!==p&&g(t)},className:tT.paginationOverride}))},tN=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-user-role-scopes-form-workspace")},[]);return s().createElement(d.Button,{kind:"primary",onClick:t,size:"md"},e("addNewUserRoleScope","Add new user role scope"))},tS=({data:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-user-role-scopes-form-workspace",{model:e})},[e]);return s().createElement(d.IconButton,{autoAlign:!0,kind:"ghost",label:t("editUserRoleScope","Edit user role scope"),onClick:a},s().createElement(J.ff,{size:16}))};var tC=a(1347);let tw=({uuid:e})=>{let{t}=(0,i.useTranslation)(),a=(0,X.K)(),[o,l]=(0,r.useState)(!1),c=s().useCallback(()=>{let o=(0,n.showModal)("delete-stock-user-scope-modal",{close:()=>o(),uuid:e,onConfirmation:()=>{let r=[];r.push(e),(0,tC.IV)(r).then(()=>{a(`${n.restBaseUrl}/stockmanagement/userrolescope`),l(!1),(0,n.showSnackbar)({isLowContrast:!0,title:t("deletingStockUserScope","Delete Stock User Scope"),kind:"success",subtitle:t("stockUserScopeDeletedSuccessfully","Stock User Scope Deleted Successfully")})},e=>{l(!1),(0,n.showSnackbar)({title:t("errorDeletingUserScope","Error deleting a user scope"),kind:"error",isLowContrast:!0,subtitle:e?.message})}).catch(),o()}})},[t,e,a]),m=s().createElement(d.IconButton,{autoAlign:!0,kind:"ghost",label:t("deleteUserRoleScope","Delete user role scope"),onClick:c},s().createElement(tk.zH,{size:16}));return o?s().createElement(d.InlineLoading,null):m},tI={content:"-esm-stock-management__stock-user-role-scopes__content___yGACN",helper:"-esm-stock-management__stock-user-role-scopes__helper___StCJF",separator:"-esm-stock-management__stock-user-role-scopes__separator___3sqL6",tileContainer:"-esm-stock-management__stock-user-role-scopes__tileContainer___tjBuD",tile:"-esm-stock-management__stock-user-role-scopes__tile___XEtB5",tileContent:"-esm-stock-management__stock-user-role-scopes__tileContent___DGNm3",toolbarAction:"-esm-stock-management__stock-user-role-scopes__toolbarAction___mn3IJ",arrowIcon:"-esm-stock-management__stock-user-role-scopes__arrowIcon___hWOcY",tableHeader:"-esm-stock-management__stock-user-role-scopes__tableHeader___CU9PH"},tD=function(){let{t:e}=(0,i.useTranslation)(),t=(0,X.K)(),a=(0,n.useSession)(),o=()=>{t(`${n.restBaseUrl}/stockmanagement/userrolescope`)},{items:l,totalItems:c,currentPage:m,pageSizes:u,goTo:p,currentPageSize:_,setPageSize:g,isLoading:k}=function(e){let{items:t,isLoading:a,error:o}=(0,tC.Wh)(e),[s,l]=(0,r.useState)(10),{goTo:i,results:c,currentPage:m}=(0,n.usePagination)(t.results,s);return{items:c,totalItems:t?.totalCount,currentPage:m,currentPageSize:s,paginatedItems:c,goTo:i,pageSizes:[10,20,30,40,50],isLoading:a,error:o,setPageSize:l}}({v:f.G.Default,totalCount:!0}),b=(0,r.useMemo)(()=>[{id:0,header:e("user","User"),key:"user"},{id:1,header:e("role","Role"),key:"role"},{id:2,header:e("locations","Locations"),key:"locations"},{id:3,header:e("stockOperations","Stock operations"),key:"stockOperations"},{id:4,header:e("permanent","Permanent"),key:"permanent"},{id:5,header:e("activeFrom","Active From"),key:"activeFrom"},{id:6,header:e("activeTo","Active To"),key:"activeTo"},{id:7,header:e("enabled","Enabled"),key:"enabled"},{id:8,header:e("actions","Actions"),key:"actions"}],[e]),h=(0,r.useMemo)(()=>l?.map((t,n)=>{let o=a.user.uuid===t.userUuid;return{...t,id:t?.uuid,key:`key-${t?.uuid}`,uuid:`${t?.uuid}`,user:a.user.uuid===t.userUuid?`${t?.userFamilyName} ${t.userGivenName}`:s().createElement(d.Link,{href:(0,ep.Wh)(t?.uuid)},`${t?.userFamilyName} ${t.userGivenName}`),roleName:t?.role,locations:t?.locations?.map(e=>{let a=`loc-${t?.uuid}-${e.locationUuid}`;return s().createElement("span",{key:a},e?.locationName,e?.enableDescendants?s().createElement(ec.PS,{className:tI.arrowIcon,key:`${a}-${n}-0`,size:12}):s().createElement(ec.nk,{className:tI.arrowIcon,key:`${a}-${n}-1`,size:12}))}),stockOperations:t?.operationTypes?.map(t=>(0,M.nt)(e,t?.operationTypeName))?.join(", "),permanent:t?.permanent?e("yes","Yes"):e("no","No"),activeFrom:(0,e_.g1)(t?.activeFrom)??"Not Set",activeTo:(0,e_.g1)(t?.activeTo)??"Not Set",enabled:t?.enabled?e("yes","Yes"):e("no","No"),actions:s().createElement("div",{style:{display:"flex"}},!o&&s().createElement(s().Fragment,null,s().createElement(tS,{data:l[n]}),s().createElement(tw,{uuid:l[n].uuid})))}}),[a.user.uuid,l,e]);return k?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):s().createElement("div",{className:tI.tableOverride},s().createElement("h2",{className:tI.tableHeader},e("stockUserRoleScopesTableHeader","To access stock management features, users must have assigned roles specifying location and stock operation type scopes.")),s().createElement(d.DataTable,{headers:b,isSortable:!0,rows:h??[],useZebraStyles:!0},({rows:t,headers:a,getHeaderProps:r,getTableProps:l,getRowProps:i,onInputChange:c})=>s().createElement(d.TableContainer,null,s().createElement(d.TableToolbar,{"aria-label":e("dataTableToolbar","Data table toolbar"),style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableToolbarContent,{className:tI.toolbarContent},s().createElement(d.TableToolbarSearch,{labelText:e("filterTable","Filter table"),placeholder:e("filterTable","Filter table"),closeButtonLabelText:e("clearSearch","Clear search input"),persistent:!0,onChange:c}),s().createElement(d.TableToolbarMenu,{iconDescription:e("settings","Settings")},s().createElement(d.TableToolbarAction,{className:tI.toolbarAction,onClick:o},e("refresh","Refresh"))),s().createElement(tN,null))),s().createElement(d.Table,l(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,a.map(e=>"details"!==e.key&&s().createElement(d.TableHeader,{...r({header:e,isSortable:e.isSortable}),className:n.isDesktop?tI.desktopHeader:tI.tabletHeader,key:`${e.key}`},e.header?.content??e.header)),s().createElement(d.TableHeader,null))),s().createElement(d.TableBody,null,t.map(e=>s().createElement(s().Fragment,{key:e.id},s().createElement(d.TableRow,{className:n.isDesktop?tI.desktopRow:tI.tabletRow,...i({row:e})},e.cells.map(e=>e?.info?.header!=="details"&&s().createElement(d.TableCell,{key:e.id},e.value))))))),0===t.length?s().createElement("div",{className:tI.tileContainer},s().createElement(d.Tile,{className:tI.tile},s().createElement("div",{className:tI.tileContent},s().createElement("p",{className:tI.content},e("noStockUserRoleScopesToDisplay","No stock user role scopes to display")),s().createElement("p",{className:tI.helper},e("checkFilters","Check the filters above"))))):null)),s().createElement(d.Pagination,{...(0,M.LI)(e),page:m,pageSize:_,pageSizes:u,totalItems:c,onChange:({pageSize:e,page:t})=>{e!==_&&g(e),t!==m&&p(t)},className:tI.paginationOverride}))};var tx=a(7240),tU=a(2572),tR=a(9878);let tA="-esm-stock-management__printable-transaction-header__container___WBdX5",tO="-esm-stock-management__printable-transaction-header__printableBody___FF4ZS",tL="-esm-stock-management__printable-transaction-header__printableHeader___gpe8b",tM="-esm-stock-management__printable-transaction-header__img___1rO2J",t$="-esm-stock-management__printable-transaction-header__transactionDetails___8BOaI",tB="-esm-stock-management__printable-transaction-header__heading___FCJEU",tF="-esm-stock-management__printable-transaction-header__itemHeading___j9yVA",tP="-esm-stock-management__printable-transaction-header__itemLabel___Y1AWV",tz=({itemName:e})=>{let{t}=(0,i.useTranslation)(),{logo:a}=(0,n.useConfig)();return s().createElement("div",{className:tA},s().createElement("div",{className:tL},s().createElement("p",{className:tB},t("binCard","Bin card")),a?.src?s().createElement("img",{className:tM,height:60,width:250,src:a.src,alt:a.alt}):a?.name?a.name:s().createElement("svg",{className:tM,role:"img",width:110,height:40,viewBox:"0 0 380 119",xmlns:"http://www.w3.org/2000/svg"},s().createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M40.29 40.328a27.755 27.755 0 0 1 19.688-8.154c7.669 0 14.613 3.102 19.647 8.116l.02-18.54A42.835 42.835 0 0 0 59.978 17c-7.089 0-13.813 1.93-19.709 4.968l.021 18.36ZM79.645 79.671a27.744 27.744 0 0 1-19.684 8.154c-7.67 0-14.614-3.101-19.651-8.116l-.02 18.54A42.857 42.857 0 0 0 59.96 103a42.833 42.833 0 0 0 19.672-4.751l.013-18.578ZM40.328 79.696c-5.038-5.037-8.154-11.995-8.154-19.685 0-7.669 3.102-14.612 8.116-19.65l-18.54-.02A42.85 42.85 0 0 0 17 60.012a42.819 42.819 0 0 0 4.752 19.672l18.576.013ZM79.634 40.289a27.753 27.753 0 0 1 8.154 19.688 27.744 27.744 0 0 1-8.117 19.646l18.542.02a42.842 42.842 0 0 0 4.749-19.666c0-7.09-1.714-13.779-4.751-19.675l-18.577-.013ZM156.184 60.002c0-8.748-6.118-15.776-15.025-15.776-8.909 0-15.025 7.028-15.025 15.776 0 8.749 6.116 15.78 15.025 15.78 8.907 0 15.025-7.031 15.025-15.78Zm-34.881 0c0-11.482 8.318-19.958 19.856-19.958 11.536 0 19.855 8.477 19.855 19.959 0 11.484-8.319 19.964-19.855 19.964-11.538 0-19.856-8.48-19.856-19.965ZM179.514 75.54c5.507 0 9.05-4.14 9.05-9.482 0-5.341-3.543-9.483-9.05-9.483-5.505 0-9.046 4.142-9.046 9.483 0 5.342 3.541 9.482 9.046 9.482ZM166.22 53.306h4.248v3.704h.11c2.344-2.725 5.449-4.36 9.154-4.36 8.014 0 13.408 5.67 13.408 13.408 0 7.63-5.613 13.406-12.752 13.406-4.58 0-8.231-2.29-9.81-5.178h-.11V90.87h-4.248V53.306ZM217.773 63.768c-.163-4.305-3-7.193-7.686-7.193-4.685 0-7.79 2.888-8.335 7.193h16.021Zm3.653 10.412c-3.001 3.868-6.596 5.284-11.339 5.284-8.01 0-12.914-5.993-12.914-13.406 0-7.901 5.559-13.407 13.08-13.407 7.196 0 12.096 4.906 12.096 13.354v1.362h-20.597c.325 4.413 3.704 8.173 8.335 8.173 3.65 0 6.105-1.307 8.12-3.868l3.219 2.508ZM227.854 59.356c0-2.346-.216-4.36-.216-6.05h4.031c0 1.363.11 2.777.11 4.195h.11c1.144-2.505 4.306-4.85 8.5-4.85 6.705 0 9.699 4.252 9.699 10.41v15.748h-4.248v-15.31c0-4.253-1.856-6.924-5.833-6.924-5.503 0-7.903 3.979-7.903 9.811V78.81h-4.25V59.356ZM259.211 41.008h6.708L278.8 70.791h.107l12.982-29.782h6.549v37.99h-4.506V47.124h-.106L280.192 79h-2.738l-13.629-31.875h-.107V79h-4.507V41.01ZM312.392 57.752h4.023c4.992 0 11.487 0 11.487-6.282 0-5.47-4.776-6.276-9.177-6.276h-6.333v12.558Zm-4.506-16.744h9.711c7.352 0 15.132 1.072 15.132 10.462 0 5.527-3.594 9.125-9.495 10.037L334.018 79h-5.525l-10.304-17.063h-5.797V79h-4.506V41.01ZM358.123 47.712c-1.506-2.413-4.187-3.486-6.926-3.486-3.973 0-8.1 1.88-8.1 6.385 0 3.49 1.931 5.047 7.994 6.98 5.903 1.878 11.377 3.809 11.377 11.267 0 7.567-6.495 11.11-13.36 11.11-4.402 0-9.125-1.45-11.7-5.262l3.862-3.165c1.61 2.794 4.83 4.24 8.105 4.24 3.862 0 8.263-2.253 8.263-6.601 0-4.669-3.165-5.474-9.928-7.728-5.366-1.771-9.442-4.134-9.442-10.463 0-7.298 6.277-10.945 12.929-10.945 4.241 0 7.836 1.178 10.625 4.45l-3.699 3.218Z"}))),s().createElement("div",{className:tO},s().createElement("div",{className:t$},s().createElement("p",{className:tF},t("itemName","Item name")),s().createElement("p",{className:tP},(0,tR.A)(e)))))},tq=({title:e})=>{let{t}=(0,i.useTranslation)(),a=(0,n.useSession)();return s().createElement("div",{className:"-esm-stock-management__printable-transaction-footer__container___f+Jry"},s().createElement("p",{className:"-esm-stock-management__printable-transaction-footer__itemFooter___GAxjn"},e),s().createElement("p",{className:"-esm-stock-management__printable-transaction-footer__footDescription___0zbqs"},t("generatedMessage","The card has been electronically generated and is a valid document. It was created by {{userName}} on {{date}}",{userName:`${a?.user?.display}`,date:`${(0,n.formatDate)(new Date,{mode:"standard",noToday:!0})}`})))},tj="-esm-stock-management__printable-transaction__itemsContainer___7r2kf",tH="-esm-stock-management__printable-transaction__tableContainer___XdOI5",tZ=({columns:e,data:t,title:a})=>s().createElement("div",null,s().createElement(tz,{itemName:a}),s().createElement("div",{className:tj},s().createElement("div",{className:tH},s().createElement(d.DataTable,{"data-floating-menu-container":!0,rows:t,headers:e,useZebraStyles:!0},({rows:e,headers:t,getHeaderProps:a,getTableProps:n,onInputChange:o})=>s().createElement("div",null,s().createElement(d.TableContainer,null,s().createElement(d.Table,n(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,t.map(e=>s().createElement(d.TableHeader,a({header:e}),e.header)))),s().createElement(d.TableBody,{style:{fontSize:"8px"}},e.map(e=>s().createElement(d.TableRow,{key:e.id},e.cells.map(e=>s().createElement(d.TableCell,{key:e.id},e.value))))))))))),s().createElement(tq,{title:""})),tG=({itemName:e})=>{let{t}=(0,i.useTranslation)(),{logo:a}=(0,n.useConfig)();return s().createElement("div",{className:tA},s().createElement("div",{className:tL},s().createElement("p",{className:tB},t("stockCard","Stock card")),a?.src?s().createElement("img",{className:tM,height:60,width:250,src:a.src,alt:a.alt}):a?.name?a.name:s().createElement("svg",{className:tM,role:"img",width:110,height:40,viewBox:"0 0 380 119",xmlns:"http://www.w3.org/2000/svg"},s().createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M40.29 40.328a27.755 27.755 0 0 1 19.688-8.154c7.669 0 14.613 3.102 19.647 8.116l.02-18.54A42.835 42.835 0 0 0 59.978 17c-7.089 0-13.813 1.93-19.709 4.968l.021 18.36ZM79.645 79.671a27.744 27.744 0 0 1-19.684 8.154c-7.67 0-14.614-3.101-19.651-8.116l-.02 18.54A42.857 42.857 0 0 0 59.96 103a42.833 42.833 0 0 0 19.672-4.751l.013-18.578ZM40.328 79.696c-5.038-5.037-8.154-11.995-8.154-19.685 0-7.669 3.102-14.612 8.116-19.65l-18.54-.02A42.85 42.85 0 0 0 17 60.012a42.819 42.819 0 0 0 4.752 19.672l18.576.013ZM79.634 40.289a27.753 27.753 0 0 1 8.154 19.688 27.744 27.744 0 0 1-8.117 19.646l18.542.02a42.842 42.842 0 0 0 4.749-19.666c0-7.09-1.714-13.779-4.751-19.675l-18.577-.013ZM156.184 60.002c0-8.748-6.118-15.776-15.025-15.776-8.909 0-15.025 7.028-15.025 15.776 0 8.749 6.116 15.78 15.025 15.78 8.907 0 15.025-7.031 15.025-15.78Zm-34.881 0c0-11.482 8.318-19.958 19.856-19.958 11.536 0 19.855 8.477 19.855 19.959 0 11.484-8.319 19.964-19.855 19.964-11.538 0-19.856-8.48-19.856-19.965ZM179.514 75.54c5.507 0 9.05-4.14 9.05-9.482 0-5.341-3.543-9.483-9.05-9.483-5.505 0-9.046 4.142-9.046 9.483 0 5.342 3.541 9.482 9.046 9.482ZM166.22 53.306h4.248v3.704h.11c2.344-2.725 5.449-4.36 9.154-4.36 8.014 0 13.408 5.67 13.408 13.408 0 7.63-5.613 13.406-12.752 13.406-4.58 0-8.231-2.29-9.81-5.178h-.11V90.87h-4.248V53.306ZM217.773 63.768c-.163-4.305-3-7.193-7.686-7.193-4.685 0-7.79 2.888-8.335 7.193h16.021Zm3.653 10.412c-3.001 3.868-6.596 5.284-11.339 5.284-8.01 0-12.914-5.993-12.914-13.406 0-7.901 5.559-13.407 13.08-13.407 7.196 0 12.096 4.906 12.096 13.354v1.362h-20.597c.325 4.413 3.704 8.173 8.335 8.173 3.65 0 6.105-1.307 8.12-3.868l3.219 2.508ZM227.854 59.356c0-2.346-.216-4.36-.216-6.05h4.031c0 1.363.11 2.777.11 4.195h.11c1.144-2.505 4.306-4.85 8.5-4.85 6.705 0 9.699 4.252 9.699 10.41v15.748h-4.248v-15.31c0-4.253-1.856-6.924-5.833-6.924-5.503 0-7.903 3.979-7.903 9.811V78.81h-4.25V59.356ZM259.211 41.008h6.708L278.8 70.791h.107l12.982-29.782h6.549v37.99h-4.506V47.124h-.106L280.192 79h-2.738l-13.629-31.875h-.107V79h-4.507V41.01ZM312.392 57.752h4.023c4.992 0 11.487 0 11.487-6.282 0-5.47-4.776-6.276-9.177-6.276h-6.333v12.558Zm-4.506-16.744h9.711c7.352 0 15.132 1.072 15.132 10.462 0 5.527-3.594 9.125-9.495 10.037L334.018 79h-5.525l-10.304-17.063h-5.797V79h-4.506V41.01ZM358.123 47.712c-1.506-2.413-4.187-3.486-6.926-3.486-3.973 0-8.1 1.88-8.1 6.385 0 3.49 1.931 5.047 7.994 6.98 5.903 1.878 11.377 3.809 11.377 11.267 0 7.567-6.495 11.11-13.36 11.11-4.402 0-9.125-1.45-11.7-5.262l3.862-3.165c1.61 2.794 4.83 4.24 8.105 4.24 3.862 0 8.263-2.253 8.263-6.601 0-4.669-3.165-5.474-9.928-7.728-5.366-1.771-9.442-4.134-9.442-10.463 0-7.298 6.277-10.945 12.929-10.945 4.241 0 7.836 1.178 10.625 4.45l-3.699 3.218Z"}))),s().createElement("div",{className:tO},s().createElement("div",{className:t$},s().createElement("p",{className:tF},t("itemName","Item name")),s().createElement("p",{className:tP},(0,tR.A)(e)))))},tY=({columns:e,items:t,title:a})=>{let[o,l]=(0,r.useState)([]),[i,c]=(0,r.useState)({});return(0,r.useEffect)(()=>{(async()=>{let e=t.filter(e=>e.patientUuid).map(async e=>{let t=`${n.restBaseUrl}/patient/${e.patientUuid}?v=custom:(uuid,display,identifiers,links)`,a=await (0,n.openmrsFetch)(t);return{uuid:e.patientUuid,data:a.data}}),a=await Promise.all(e),o={};a.forEach(e=>{o[e.uuid]=e.data}),c(o)})()},[t]),(0,r.useEffect)(()=>{l(t.map(e=>{let t=e.patientUuid?i[e.patientUuid]:null;return{...e,id:e?.uuid,key:`key-${e?.uuid}`,uuid:`${e?.uuid}`,date:(0,e_.g1)(e?.dateCreated),location:e.operationSourcePartyName&&e.operationDestinationPartyName?e.operationSourcePartyName===e?.partyName?(e.quantity,s().createElement(s().Fragment,null,s().createElement("span",{className:"transaction-location"},e.operationSourcePartyName),s().createElement(ec.nk,{size:16})," ",e.operationDestinationPartyName)):e.operationDestinationPartyName===e?.partyName?(e.quantity,s().createElement(s().Fragment,null,s().createElement("span",{className:"transaction-location"},e.operationDestinationPartyName),s().createElement(ec.nk,{size:16})," ",e.operationSourcePartyName)):e?.partyName:e?.partyName,transaction:e?.isPatientTransaction?"Patient Dispense":e.stockOperationTypeName,quantity:`${e?.quantity?.toLocaleString()} ${e?.packagingUomName??""}`,batch:e.stockBatchNo?`${e.stockBatchNo}${e.expiration?` (${(0,e_.g1)(e.expiration)})`:""}`:"",out:e?.quantity<0?`${(-1*e?.quantity)?.toLocaleString()} ${e?.packagingUomName??""} of ${e.packagingUomFactor}`:"",totalout:e?.quantity<0?`${-1*e?.quantity*Number(e.packagingUomFactor)}`:"",patientId:e?.patientId??"",patientUuid:e?.patientUuid??"",patientName:t?.display??"",patientIdentifier:""}}))},[t,i]),s().createElement("div",null,s().createElement(tG,{itemName:a}),s().createElement("div",{className:tj},s().createElement("div",{className:tH},s().createElement(d.DataTable,{"data-floating-menu-container":!0,rows:o,headers:e,useZebraStyles:!0},({rows:e,headers:t,getHeaderProps:a,getTableProps:n,onInputChange:o})=>s().createElement("div",null,s().createElement(d.TableContainer,null,s().createElement(d.Table,n(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,t.map(e=>s().createElement(d.TableHeader,a({header:e}),e.header)))),s().createElement(d.TableBody,{style:{fontSize:"8px"}},e.map(e=>s().createElement(d.TableRow,{key:e.id},e.cells.map(e=>s().createElement(d.TableCell,{key:e.id},e.value))))))))))),s().createElement(tq,{title:""}))},tW="@openmrs/esm-stock-management-app",tV={featureName:"stock-management",moduleName:tW},tQ=a(4767),tK=(0,n.getAsyncLifecycle)(()=>a.e("4214").then(a.bind(a,6085)),{featureName:"delete-stock-modal",moduleName:tW}),tJ=(0,n.getAsyncLifecycle)(()=>a.e("822").then(a.bind(a,3333)),{featureName:"delete-stock-user-scope-modal",moduleName:tW}),tX=(0,n.getAsyncLifecycle)(()=>a.e("1600").then(a.bind(a,7939)),{featureName:"delete-packaging-unit-modal",moduleName:tW}),t0=(0,n.getSyncLifecycle)(p.A,{featureName:"delete-packaging-unit-button",moduleName:tW}),t1=(0,n.getAsyncLifecycle)(()=>a.e("6981").then(a.bind(a,5332)),{featureName:"expired-stock-modal",moduleName:tW}),t5=(0,n.getAsyncLifecycle)(()=>a.e("8661").then(a.bind(a,9892)),{featureName:"import-bulk-stock-items-modal",moduleName:tW}),t4=(0,n.getAsyncLifecycle)(()=>a.e("1164").then(a.bind(a,7127)),{featureName:"issuing-stock-modal",moduleName:tW}),t6=(0,n.getSyncLifecycle)(()=>{let e=`${window.spaBase}/stock-management`;return(0,n.useLeftNav)({name:"stock-page-dashboard-slot",basePath:e}),s().createElement("main",{className:"omrs-main-content"},s().createElement(l.BrowserRouter,{basename:window.spaBase},s().createElement(l.Routes,null,s().createElement(l.Route,{path:"/stock-management",element:s().createElement(E,null)}),s().createElement(l.Route,{path:"/stock-management/:dashboard/*",element:s().createElement(E,null)}))))},tV),t7=(0,n.getAsyncLifecycle)(()=>a.e("8990").then(a.bind(a,4125)),{featureName:"receiving-stock-modal",moduleName:tW}),t2=(0,n.getSyncLifecycle)(()=>{let{t:e}=(0,i.useTranslation)(),t=e("manageStock","Manage Stock");return s().createElement(d.Layer,null,s().createElement(d.ClickableTile,{href:window.getOpenmrsSpaBase()+"stock-management",rel:"noopener noreferrer"},s().createElement("div",null,s().createElement("div",{className:"heading"},t),s().createElement("div",{className:"content"},e("stockManagement","Stock management"))),s().createElement("div",{className:"iconWrapper"},s().createElement(ec.Qp,{size:16}))))},tV),t3=(0,n.getSyncLifecycle)(()=>s().createElement(n.LeftNavMenu,null),tV),t8=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{backgroundColor:"white"}},s().createElement(K,null),s().createElement(z,null))},tV),t9=(0,n.getSyncLifecycle)(m({title:"Overview",titleKey:"overview",name:"stock-management"}),tV),ae=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{margin:"1rem"}},s().createElement(e4,null))},tV),at=(0,n.getSyncLifecycle)(m({title:"Operations",titleKey:"operations",name:"operations"}),tV),aa=(0,n.getSyncLifecycle)(()=>((0,ee.W)(),s().createElement("div",{style:{margin:"1rem"}},s().createElement(ei,null))),tV),an=(0,n.getSyncLifecycle)(m({title:"Items",titleKey:"items",name:"items"}),tV),ao=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{margin:"1rem"}},s().createElement(tD,null))},tV),ar=(0,n.getSyncLifecycle)(m({title:"User role scopes",titleKey:"userRoleScopes",name:"user-scopes"}),tV),as=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{margin:"1rem"}},s().createElement(tv,null))},tV),al=(0,n.getSyncLifecycle)(m({title:"Sources",titleKey:"sources",name:"sources"}),tV),ai=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{margin:"1rem"}},s().createElement(eu,null))},tV),ac=(0,n.getSyncLifecycle)(m({title:"Locations",titleKey:"locations",name:"locations"}),tV),am=(0,n.getSyncLifecycle)(()=>{let{t:e}=(0,i.useTranslation)(),t=(0,X.K)(),a=()=>{t(`${n.restBaseUrl}/stockmanagement/batchjob?batchJobType=Report&v=default`)},{user:o}=(0,n.useSession)(),l=(0,n.userHasAccess)(ep.UE,o),c=(0,n.userHasAccess)(ep.v9,o),{reports:m,isLoading:u,currentPage:p,pageSizes:_,totalItems:g,goTo:k,currentPageSize:b,setPageSize:h}=(0,e3.$)(l),[E,f]=(0,r.useState)(()=>Date.now()),[T,v]=(0,r.useState)(!1);(0,r.useEffect)(()=>{if(!l)return;let e=window.setInterval(()=>f(Date.now()),15e3);return()=>window.clearInterval(e)},[l]);let N=(0,r.useMemo)(()=>[{id:0,header:e("report","Report"),key:"report"},{id:1,header:e("parameters","Parameters"),key:"parameters"},{id:2,header:e("dateRequested","Date Requested"),key:"dateRequested"},{id:3,header:e("requestedBy","Requested By"),key:"requestedBy"},{id:4,header:e("status","Status"),key:"status"},{id:5,header:e("timeTaken","Time Taken"),key:"timeTaken"},{id:8,header:e("actions","Actions"),key:"actions"}],[e]),S=(0,r.useCallback)((e,t)=>{e&&ti((0,ep.yu)(e,!0),e,t)},[]),C=(0,r.useMemo)(()=>m?.map((t,a)=>{let n=function(e,t,a=Date.now()){if(e!==e8||!t)return!1;let n=t instanceof Date?t.getTime():new Date(t).getTime();return Number.isFinite(n)&&n<a}(t.status,t.expiration,E);return{...t,checkbox:"isBatchJobActive",id:t?.uuid,key:`key-${t?.uuid}`,uuid:`${t?.uuid}`,batchJobType:t?.batchJobType,dateRequested:(0,e_.P9)(t.dateCreated),parameters:s().createElement(ts,{model:m[a]}),report:t?.description,requestedBy:t?.owners?.map((e,a)=>s().createElement("div",{key:`${t.uuid}-owner-${a}`},`${e.ownerFamilyName} ${e.ownerGivenName}`)),status:s().createElement("div",{className:to.reportStatus},t.status!==e8||n?null:s().createElement(d.InlineLoading,{status:"active",iconDescription:e("loading","Loading"),description:e("reportQueued","Report queued...")}),n&&s().createElement(s().Fragment,null,s().createElement(y.OR,{className:"report-stale","aria-hidden":"true"}),s().createElement("span",null,e("reportQueuedStale","Queued report has not started"))),"Running"===t.status&&s().createElement(d.InlineLoading,{status:"active",iconDescription:e("loading","Loading"),description:e("generatingReport","Generating report...")}),"Failed"===t.status&&s().createElement(s().Fragment,null,s().createElement(y.OR,{className:"report-failed","aria-hidden":"true"}),s().createElement("span",null,e("failed","Failed"))),t.status===te&&s().createElement(s().Fragment,null,s().createElement(e6._f,{className:"report-cancelled","aria-hidden":"true"}),s().createElement("span",null,e("cancelled","Cancelled"))),t.status===e9&&s().createElement(s().Fragment,null,s().createElement(eS.cR,{className:"report-completed","aria-hidden":"true",size:16}),s().createElement("span",null,e("completed","Completed"))),"Expired"===t.status&&s().createElement(s().Fragment,null,s().createElement(e7.lz,{className:"report-expired","aria-hidden":"true"}),s().createElement("span",null,e("expired","Expired")))),timeTaken:((e,t)=>{let a=new Date(e).getTime(),n=new Date(t).getTime();if(!a||!n)return"";let o=Math.floor((n-a)/1e3);return[Math.floor(o/3600),Math.floor(o%3600/60),o%60].map(e=>String(e).padStart(2,"0")).join(":")})(t.dateCreated,t.endTime),actions:s().createElement("div",{key:`${t?.uuid}-actions`,style:{display:"inline-block",whiteSpace:"nowrap"}},t.outputArtifactViewable&&"hide"===t.batchJobType&&s().createElement(d.Button,{key:`${t?.uuid}-actions-view`,type:"button",size:"sm",className:"submitButton clear-padding-margin",iconDescription:e("edit","Edit"),kind:"ghost",renderIcon:y.Ss}),s().createElement(d.Button,{type:"button",size:"sm",className:"submitButton clear-padding-margin",iconDescription:"Copy",kind:"ghost",renderIcon:e2.QR}),t?.status===e9&&(t.outputArtifactSize??0)>0&&s().createElement(d.Button,{type:"button",size:"sm",className:"submitButton clear-padding-margin",iconDescription:"Download",kind:"ghost",renderIcon:J.f5,onClick:()=>S(t.uuid,t.outputArtifactFileExt)}))}}),[m,S,e,E]);return T?s().createElement(t_,{onClose:()=>v(!1)}):u?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):s().createElement("div",{className:to.container},s().createElement(tg,{onOpen:()=>v(!0)}),s().createElement("h2",{className:to.tableHeader},e("stockReportsTableHeader","List of reports requested by users.")),s().createElement(d.DataTable,{rows:C,headers:N,isSortable:!0,useZebraStyles:!0},({rows:t,headers:o,getHeaderProps:r,getTableProps:i,getRowProps:u,onInputChange:p})=>s().createElement(d.TableContainer,null,s().createElement(d.TableToolbar,{"aria-label":e("dataTableToolbar","Data table toolbar"),style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableToolbarContent,{className:to.toolbarContent},s().createElement(d.TableToolbarSearch,{labelText:e("filterTable","Filter table"),placeholder:e("filterTable","Filter table"),closeButtonLabelText:e("clearSearch","Clear search input"),persistent:!0,onChange:p}),s().createElement(d.TableToolbarMenu,{iconDescription:e("settings","Settings")},s().createElement(d.TableToolbarAction,{className:to.toolbarMenuAction,onClick:a},e("refresh","Refresh"))),c&&s().createElement(tn,null))),s().createElement(d.Table,i(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,s().createElement(d.TableExpandHeader,null),o.map(e=>s().createElement(d.TableHeader,{...r({header:e,isSortable:e.isSortable}),className:n.isDesktop?to.desktopHeader:to.tabletHeader,key:`${e.key}`},e.header?.content??e.header)),s().createElement(d.TableHeader,null))),s().createElement(d.TableBody,null,t.map((e,t)=>s().createElement(s().Fragment,{key:e.id},s().createElement(d.TableExpandRow,{className:n.isDesktop?to.desktopRow:to.tabletRow,...u({row:e})},e.cells.map(e=>s().createElement(d.TableCell,{key:e.id},e.value))),e.isExpanded?s().createElement(d.TableExpandedRow,{colSpan:o.length+2},s().createElement(tr,{model:m[t]})):s().createElement(d.TableExpandedRow,{className:to.hiddenRow,colSpan:o.length+2}))))),l?0===t.length?s().createElement("div",{className:to.tileContainer},s().createElement(d.Tile,{className:to.tile},s().createElement("div",{className:to.tileContent},s().createElement("p",{className:to.content},e("noReportsToDisplay","No Stock reports to display")),s().createElement("p",{className:to.helper},e("checkFilters","Check the filters above"))))):null:s().createElement(ta,{title:"Can not view stock reports",description:"You have no permissions to view reports"}))),s().createElement(d.Pagination,{...(0,M.LI)(e),page:p,pageSize:b,pageSizes:_,totalItems:g,onChange:({pageSize:e,page:t})=>{e!==b&&h(e),t!==p&&k(t)},className:to.paginationOverride}))},tV),ad=(0,n.getSyncLifecycle)(m({title:"Reports",titleKey:"reports",name:"reports"}),tV),au=(0,n.getSyncLifecycle)(function(){let{t:e}=(0,i.useTranslation)();return s().createElement("div",{className:"-esm-stock-management__stock-settings__container___a4ZMo"},s().createElement("div",{className:"-esm-stock-management__stock-settings__tableHeader___yTdeQ"},e("comingSoonUnderDev","Exciting updates are on the way! In the meantime, use the link below to access Admin UI settings.")),s().createElement(d.Button,{onClick:()=>(0,n.navigate)({to:"${openmrsBase}/admin/maintenance/settings.list?show=Stockmanagement"}),size:"md",renderIcon:()=>s().createElement(tk.tl,{className:"cds--btn__icon",size:24}),kind:"ghost"},e("adminSettings","Admin settings")))},tV),ap=(0,n.getSyncLifecycle)(m({title:"Settings",titleKey:"settings",name:"settings"}),tV),a_=(0,n.getSyncLifecycle)(function(){return s().createElement(n.ExtensionSlot,{name:"stock-management-dashboard-slot"})},tV),ag=(0,n.getAsyncLifecycle)(()=>a.e("6105").then(a.bind(a,9632)),{featureName:"stock-operation-modal",moduleName:tW}),ak=(0,n.getSyncLifecycle)(()=>{let e=window.getOpenmrsSpaBase();return s().createElement(d.ClickableTile,{className:"-esm-stock-management__item__customTile___bmBVE",id:"menu-item",href:`${e}stock-management`},s().createElement("div",{className:"customTileTitle"},s().createElement(u.pl,{size:24})),s().createElement("div",null,"Stock Management"))},tV),ab=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("7369"),a.e("9457"),a.e("6647")]).then(a.bind(a,8394)),tV),ah=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("7369"),a.e("9457"),a.e("7556")]).then(a.bind(a,6399)),tV),aE=(0,n.getAsyncLifecycle)(()=>a.e("5838").then(a.bind(a,4301)),tV),ay=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("7369"),a.e("2713")]).then(a.bind(a,3824)),tV),af=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("9457"),a.e("3576")]).then(a.bind(a,5979)),tV),aT=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("7369"),a.e("5996")]).then(a.bind(a,8647)),tV),av=(0,n.getSyncLifecycle)(({onClose:e,title:t,columns:a,data:o,truncated:l,binOrStockCard:c})=>{let{t:m}=(0,i.useTranslation)(),u=(0,r.useRef)(null),p=(0,tx.useReactToPrint)({content:()=>u.current});return s().createElement(s().Fragment,null,s().createElement(d.ModalHeader,{iconDescription:m("close","Close"),closeModal:e,title:m("printBinCard","Print Bin Card")}),s().createElement(d.ModalBody,null,s().createElement("div",{ref:u},l&&s().createElement("p",null,m("printTruncated","Only the first {{count}} movements are listed: narrow the period or the location.",{count:tU.ZJ})),s().createElement(tZ,{title:t,columns:a,data:o}))),s().createElement(d.ModalFooter,null,s().createElement(d.Button,{kind:"secondary",onClick:e},(0,n.getCoreTranslation)("cancel")),s().createElement(d.Button,{type:"button",onClick:p},(0,n.getCoreTranslation)("print"))))},tV),aN=(0,n.getSyncLifecycle)(({onClose:e,title:t,columns:a,data:o,truncated:l})=>{let{t:c}=(0,i.useTranslation)(),m=(0,r.useRef)(null),u=(0,tx.useReactToPrint)({content:()=>m.current});return s().createElement(s().Fragment,null,s().createElement(d.ModalHeader,{iconDescription:c("close","Close"),closeModal:e,title:c("printStockCard","Print Stock Card")}),s().createElement(d.ModalBody,null,s().createElement("div",{ref:m},l&&s().createElement("p",null,c("printTruncated","Only the first {{count}} movements are listed: narrow the period or the location.",{count:tU.ZJ})),s().createElement(tY,{title:t,columns:a,items:o}))),s().createElement(d.ModalFooter,null,s().createElement(d.Button,{kind:"secondary",onClick:e},(0,n.getCoreTranslation)("cancel")),s().createElement(d.Button,{type:"button",onClick:u},(0,n.getCoreTranslation)("print"))))},tV);function aS(){(0,n.defineConfigSchema)(tW,o)}let aC=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("9457"),a.e("1878")]).then(a.bind(a,6453)),tV)},3270(e,t,a){"use strict";a.d(t,{A:()=>c});var n=a(9868),o=a.n(n),r=a(4644),s=a(2761),l=a(5576),i=a(815);let c=({row:e})=>{let{t}=(0,r.useTranslation)(),a=(0,n.useCallback)(()=>{let t=(0,i.showModal)("delete-packaging-unit-modal",{closeModal:()=>t(),row:e})},[e]);return o().createElement(s.Button,{type:"button",size:"sm",className:"submitButton clear-padding-margin",iconDescription:t("delete","Delete"),kind:"ghost",renderIcon:l.zH,onClick:a})}},6039(e,t,a){"use strict";a.d(t,{A:()=>m,N:()=>c});var n=a(9868),o=a.n(n),r=a(2761),s=a(4644),l=a(5175),i=a(4520);let c="",m=e=>{let{t}=(0,s.useTranslation)(),{stockLocations:a}=(0,l.gQ)(),[m,d]=(0,n.useState)(null),u=(0,n.useMemo)(()=>[{id:c,name:t("allLocations","All locations")},...a??[]],[a,t]),p=void 0===e.value?m:e.value,_=null===p?null:u.find(e=>e.id===p)??null;return o().createElement(r.ComboBox,{translateWithId:(0,i.D1)(t),titleText:e.title,id:e.name,size:"md",items:u,selectedItem:_,onChange:({selectedItem:t})=>{let a=t?.id??c;d(a),e.onLocationIdChange?.(a)},itemToString:e=>e?e.name:"",shouldFilterItem:({item:e,inputValue:t})=>!t||e.id===c||e.name?.toLowerCase().includes(t.toLowerCase()),placeholder:e.placeholder})}},5960(e,t,a){"use strict";a.d(t,{A:()=>T});var n=a(2761),o=a(2137),r=a(9868),s=a.n(r),l=a(4644),i=a(7092),c=a(6008),m=a(4520),d=a(3767),u=a(9564),p=a(9587),_=a(815);let g=({columns:e,data:t,itemUuid:a,filter:o,getPrintRows:i,getStockCardRows:c})=>{let{t:m}=(0,l.useTranslation)(),{enablePrintButton:g}=(0,_.useConfig)(),[k]=(0,r.useState)({startIndex:0,v:o?.v||d.G.Default,limit:10,q:o?.q,totalCount:!0,stockItemUuid:a}),{item:b,isLoading:h}=(0,p.hA)(a),{items:E}=(0,p.Xu)(k),y=(0,r.useMemo)(()=>[{key:"patientId",header:"Patient ID"},{key:"patientName",header:"Patient Name"},{key:"patientIdentifier",header:"Patient Identifier"},{key:"date",header:"Date"},{key:"location",header:"Location"},{key:"transaction",header:"Transaction"},{key:"balance",header:"Balance"},{key:"totalout",header:"OUT"},{key:"batch",header:"Batch"}],[]),[f,T]=(0,r.useState)(!1),v=async()=>{T(!0);let a=t,n=!1;try{let e=await i?.();a=e?.rows??t,n=!!e?.truncated}catch{a=t}finally{T(!1)}let o=(0,_.showModal)("transactions-print-bincard-preview-modal",{onClose:()=>o(),title:b?.drugName||b?.conceptName||"",columns:e,data:a,truncated:n})},N=async()=>{T(!0);let e=[],t=!1;try{let a=await c?.();e=a?.rows??[],t=!!a?.truncated}catch{e=[]}finally{T(!1)}let a=(0,_.showModal)("transactions-print-stockcard-preview-modal",{onClose:()=>a(),title:b?.drugName||b?.conceptName||"",columns:y,data:e.map(e=>({...e,balance:`${E?.total??""} ${e?.packagingUomName??""}`.trim()})),truncated:t})};return s().createElement(s().Fragment,null,g&&s().createElement(n.ComboButton,{label:m("print","Print")},s().createElement(n.MenuItem,{label:m("printStockCard","Print Stock Card"),renderIcon:e=>s().createElement(u.xj,{size:24,...e}),onClick:N,disabled:h||f}),s().createElement(n.MenuItem,{label:m("printBinCard","Print Bin Card"),renderIcon:e=>s().createElement(u.xj,{size:24,...e}),onClick:v,disabled:h||f})))};var k=a(6039),b=a(2572),h=a(5175),E=a(683),y=a(4779);let f=({operationNumber:e,operationUuid:t})=>{let{t:a}=(0,l.useTranslation)(),{types:o,isLoading:i,error:c}=(0,h.G2)(),{items:m,error:d,isLoading:u}=(0,y.Eb)(t??null),p=(0,r.useCallback)(()=>{let e=o.results?.find(e=>e?.uuid===m?.operationTypeUuid);e&&(0,E.AE)(e,m,m?.requisitionStockOperationUuid)},[m,o.results]);return((0,r.useEffect)(()=>{d&&(0,_.showSnackbar)({title:a("errorLoadingStockOperation","Error loading stock operation"),subtitle:d?.message,kind:"error"}),c&&(0,_.showSnackbar)({title:a("errorLoadingStockOperationTypes","Error loading stock operation types"),subtitle:c?.message,kind:"error"})},[d,c,a]),i||u)?s().createElement(n.InlineLoading,{description:a("loading","Loading")}):s().createElement("a",{onClick:p,style:{cursor:"pointer"}},e)},T=({stockItemUuid:e,defaultPeriod:t,defaultLocationId:a=null})=>{let{t:u,i18n:p}=(0,l.useTranslation)(),[_,h]=(0,r.useState)(t?.from??null),[E,y]=(0,r.useState)(t?.to??null),[T,v]=(0,r.useState)(a),[N,S]=(0,r.useState)(()=>t?{stockItemUuid:e,...(0,b.zr)(t.from,t.to)}:void 0),{isLoading:C,items:w,tableHeaders:I,totalCount:D,setCurrentPage:x,setStockItemUuid:U,setLocationUuid:R,setPeriod:A,currentPage:O,currentPageSize:L,setPageSize:M,binCardHeaders:$,inventory:B,transactionFilter:F}=(0,b.lv)(N);(0,r.useEffect)(()=>{U(e)},[e,U]);let P=(0,r.useCallback)(e=>{let t=B?.total??"";return{...e,id:e?.uuid,key:`key-${e?.uuid}`,uuid:`${e?.uuid}`,date:(0,c.a9)(e?.dateCreated),location:e.operationSourcePartyName&&e.operationDestinationPartyName?e.operationSourcePartyName===e?.partyName?(e.quantity,s().createElement(s().Fragment,null,s().createElement("span",{className:"transaction-location"},e.operationSourcePartyName),s().createElement(o.nk,{size:16})," ",e.operationDestinationPartyName)):e.operationDestinationPartyName===e?.partyName?(e.quantity,s().createElement(s().Fragment,null,s().createElement("span",{className:"transaction-location"},e.operationDestinationPartyName),s().createElement(o.nk,{size:16})," ",e.operationSourcePartyName)):e?.partyName:e?.partyName,transaction:e?.isPatientTransaction?u("patientDispense","Patient Dispense"):(0,m.nt)(u,e.stockOperationTypeName),quantity:`${e?.quantity?.toLocaleString()} ${e?.packagingUomName??""}`,batch:e.stockBatchNo?`${e.stockBatchNo}${e.expiration?` (${(0,c.ZM)(e.expiration)})`:""}`:"",reference:s().createElement(f,{operationUuid:e?.stockOperationUuid,operationNumber:e?.stockOperationNumber}),status:(0,m.e_)(u,e?.stockOperationStatus)??"",in:e?.quantity>=0?u("transactionQuantity","{{quantity}} {{unit}} of {{factor}}",{quantity:e?.quantity?.toLocaleString(),unit:e?.packagingUomName??"",factor:e.packagingUomFactor,interpolation:{escapeValue:!1}}):"",out:e?.quantity<0?u("transactionQuantity","{{quantity}} {{unit}} of {{factor}}",{quantity:(-1*e?.quantity)?.toLocaleString(),unit:e?.packagingUomName??"",factor:e.packagingUomFactor,interpolation:{escapeValue:!1}}):"",totalin:e?.quantity>=0?`${e?.quantity*Number(e.packagingUomFactor)}`:"",totalout:e?.quantity<0?`${-1*e?.quantity*Number(e.packagingUomFactor)}`:"",balance:`${t} ${e?.packagingUomName??""}`}},[B,u]),z=(0,r.useMemo)(()=>w?.map(P),[w,P]),q=(0,r.useCallback)(async()=>{let{rows:e,truncated:t}=await (0,b.jA)(F);return{rows:e.map(P),truncated:t}},[F,P]),j=(0,r.useCallback)(()=>(0,b.jA)({...F,isPatientTransaction:"true",v:d.G.Full}),[F]),H=(e,t)=>{h(e),y(t),A(e,t),S(a=>({...a,...(0,b.zr)(e,t)}))},Z=()=>{let e=(0,b.yE)(document.getElementById("transactions-start-date")?.value),t=(0,b.yE)(document.getElementById("transactions-end-date")?.value),a=e=>e?e.getTime():null;(a(e)!==a(_)||a(t)!==a(E))&&H(e,t)};return C?s().createElement(n.DataTableSkeleton,{role:"progressbar"}):s().createElement(i.A,{children:()=>s().createElement(s().Fragment,null,s().createElement("div",{className:"-esm-stock-management__transactions__filters___fXyXQ"},s().createElement(g,{columns:$,data:z,itemUuid:e,filter:N,getPrintRows:q,getStockCardRows:j}),s().createElement(k.A,{value:T,onLocationIdChange:e=>{v(e),R(e),S(t=>({...t,locationUuid:e}))},name:"TransactionLocationUuid",placeholder:u("filterByLocation","Filter by Location")}),s().createElement(n.DatePicker,{datePickerType:"range",dateFormat:c.Mz,locale:(0,m.ft)(p.language),...(0,m.Wo)(u),onChange:e=>H(e?.[0]??null,e?.[1]??null),onClose:Z,value:[_,E]},s().createElement(n.DatePickerInput,{id:"transactions-start-date",onBlur:Z,labelText:u("startDate","Start date"),placeholder:c.YI}),s().createElement(n.DatePickerInput,{id:"transactions-end-date",onBlur:Z,labelText:u("endDate","End date"),placeholder:c.YI})),(_||E)&&s().createElement(n.Button,{kind:"ghost",size:"md",onClick:()=>H(null,null)},u("clearDates","Clear dates")))),columns:I,data:z,totalItems:D,goToPage:x,page:O,pageSize:L,onPageSizeChange:M,hasToolbar:!0})}},2572(e,t,a){"use strict";a.d(t,{ZJ:()=>u,jA:()=>p,lv:()=>g,yE:()=>_,zr:()=>d});var n=a(815),o=a(3767),r=a(9868),s=a(4644),l=a(7065),i=a.n(l),c=a(5175),m=a(9587);let d=(e,t)=>({dateMin:e?i()(e).startOf("day").toISOString():null,dateMax:t?i()(t).endOf("day").toISOString():null}),u=2e3;async function p(e){let t=[],a=null;for(let r=0;;r++){let s=(0,o.q)({...e,startIndex:r,limit:100,totalCount:0===r}),l=await (0,n.openmrsFetch)(`${n.restBaseUrl}/stockmanagement/stockitemtransaction${s}`),i=l?.data?.results??[];if(0===r&&"number"==typeof l?.data?.totalCount&&(a=l.data.totalCount),t.push(...i),i.length<100||null!==a&&t.length>=a)return{rows:t,truncated:!1};if(t.length>=u)return{rows:t.slice(0,u),truncated:!0}}}let _=e=>{let t=/^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/.exec(e??"");if(!t)return null;let[a,n,o]=[Number(t[1]),Number(t[2]),Number(t[3])],r=new Date(o,n-1,a);return r.getFullYear()===o&&r.getMonth()===n-1&&r.getDate()===a?r:null};function g(e){let{t}=(0,s.useTranslation)(),[a,n]=(0,r.useState)({startIndex:0,v:e?.v||o.G.Default,limit:10,q:e?.q,totalCount:!0,stockItemUuid:e?.stockItemUuid,dateMin:e?.dateMin??null,dateMax:e?.dateMax??null}),[l,i]=(0,r.useState)(10),[u,p]=(0,r.useState)(null),[_,g]=(0,r.useState)(1),{items:k}=(0,c.qM)(),[b,h]=(0,r.useState)(e?.stockItemUuid),[E,y]=(0,r.useState)(e?.partyUuid),[f,T]=(0,r.useState)(e?.locationUuid),[v,N]=(0,r.useState)(e?.stockBatchUuid),[S,C]=(0,r.useState)(e?.dateMin??null),[w,I]=(0,r.useState)(e?.dateMax??null),D=(0,r.useCallback)(e=>{T(e),g(1)},[]),x=(0,r.useCallback)(e=>{i(e),g(1)},[]),U=(0,r.useCallback)((e,t)=>{let a=d(e,t);C(a.dateMin),I(a.dateMax),g(1)},[]);(0,r.useEffect)(()=>{n({startIndex:_-1,v:o.G.Default,limit:l,q:u,totalCount:!0,stockItemUuid:b,partyUuid:E,locationUuid:f,stockBatchUuid:v,dateMin:S,dateMax:w})},[u,_,l,b,E,f,v,S,w]);let R=(0,r.useMemo)(()=>{let e,{locationUuid:t,...n}=a;return t?{...n,partyUuid:(e=k?.results,e?.find(e=>e.locationUuid===t)?.uuid??t)}:n},[a,k]),{items:A,isLoading:O,error:L}=(0,m.kl)(R),M=(0,r.useMemo)(()=>({...a,dateMin:null,dateMax:null}),[a]),{items:$}=(0,m.Xu)(M),B=(0,r.useMemo)(()=>[{key:"date",header:t("date","Date")},{key:"location",header:t("location","Location")},{key:"transaction",header:t("transaction","Transaction")},{key:"in",header:t("transactionIn","IN")},{key:"out",header:t("transactionOut","OUT")},{key:"batch",header:t("batch","Batch No")},{key:"reference",header:t("reference","Reference")},{key:"status",header:t("status","Status")}],[t]),F=(0,r.useMemo)(()=>[{key:"date",header:t("date","Date")},{key:"location",header:t("location","Location")},{key:"transaction",header:t("transaction","Transaction")},{key:"totalin",header:t("transactionIn","IN")},{key:"totalout",header:t("transactionOut","OUT")},{key:"batch",header:t("batch","Batch No")},{key:"balance",header:t("balance","Balance")},{key:"reference",header:t("reference","Reference")},{key:"status",header:t("status","Status")}],[t]);return{items:A.results,totalCount:A.totalCount,currentPage:_,currentPageSize:l,setCurrentPage:g,setPageSize:x,pageSizes:[10,20,30,40,50],isLoading:O,error:L,setSearchString:p,tableHeaders:B,setStockItemUuid:h,setLocationUuid:D,setPeriod:U,dateMin:S,dateMax:w,setPartyUuid:y,setStockBatchUuid:N,binCardHeaders:F,inventory:$,transactionFilter:R}}},7187(e,t,a){"use strict";a.d(t,{W:()=>l,m:()=>s});var n=a(9868),o=a(815),r=a(7003);let s=e=>{(0,o.launchWorkspace2)("stock-item-form-workspace",{stockItem:e})},l=()=>{(0,n.useEffect)(()=>{let e=new URL(window.location.href),t=e.searchParams.get(r.R4);t&&(e.searchParams.delete(r.R4),window.history.replaceState(window.history.state,"",e.pathname+e.search+e.hash),(0,o.openmrsFetch)(`${o.restBaseUrl}/stockmanagement/stockitem/${encodeURIComponent(t)}?v=full`).then(({data:e})=>{e?.uuid&&s({...e,isDrug:!!e.drugUuid})}).catch(()=>{}))},[])}},9587(e,t,a){"use strict";a.d(t,{AR:()=>_,Jq:()=>k,ME:()=>d,QC:()=>l,R3:()=>f,W8:()=>i,Xu:()=>m,Yx:()=>u,__:()=>v,hA:()=>p,jf:()=>E,kC:()=>h,kl:()=>c,n6:()=>b,s_:()=>y,w_:()=>g,z8:()=>T});var n=a(815),o=a(9736),r=a.n(o),s=a(3767);function l(e){let t=`${n.restBaseUrl}/stockmanagement/stockitem${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function i(e){let t=`${n.restBaseUrl}/stockmanagement/stockitem?drugUuid=${e}&limit=1`;return(0,n.openmrsFetch)(t).then(({data:e})=>e)}function c(e){let t=`${n.restBaseUrl}/stockmanagement/stockitemtransaction${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function m(e){let t=`${n.restBaseUrl}/stockmanagement/stockiteminventory${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function d(e){let t=`${n.restBaseUrl}/stockmanagement/stockbatch${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function u(e){let t=`${n.restBaseUrl}/stockmanagement/stockitempackaginguom${(0,s.q)(e)}`,{data:a,error:o,isLoading:l,mutate:i}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o,mutate:i}}function p(e){let t=`${n.restBaseUrl}/stockmanagement/stockitem/${e}?v=full`,{data:a,error:o,isLoading:s}=r()(t,n.openmrsFetch);return{item:a?.data||{},isLoading:s,error:o}}function _(e){let t=`${n.restBaseUrl}/stockmanagement/stockitempackaginguom/${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:a.signal})}function g(e){let t=`${n.restBaseUrl}/stockmanagement/stockitem`,a=new AbortController;return delete e.isDrug,(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function k(e,t){let a=`${n.restBaseUrl}/stockmanagement/stockitem/${e}`,o=new AbortController;return delete t.isDrug,delete t.dateCreated,(0,n.openmrsFetch)(a,{method:"POST",headers:{"Content-Type":"application/json"},signal:o.signal,body:t})}function b(e){let t=`${n.restBaseUrl}/stockmanagement/stockitempackaginguom`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function h(e,t){let a=`${n.restBaseUrl}/stockmanagement/stockitempackaginguom/${t}`,o=new AbortController;return(0,n.openmrsFetch)(a,{method:"POST",headers:{"Content-Type":"application/json"},signal:o.signal,body:e})}function E(e){let t=`${n.restBaseUrl}/stockmanagement/stockrule${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function y(e){let t=`${n.restBaseUrl}/stockmanagement/stockrule/${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:a.signal})}function f(e){let t=`${n.restBaseUrl}/stockmanagement/stockitemreference${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function T(e){let t=`${n.restBaseUrl}/stockmanagement/stockitemreference`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function v(e){let t=`${n.restBaseUrl}/stockmanagement/stockitemreference/${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:a.signal})}},1844(e,t,a){"use strict";a.d(t,{DW:()=>d,_D:()=>m,zC:()=>c});var n=a(9868),o=a(9736),r=a.n(o),s=a(815),l=a(4644),i=a(5175);function c(e){let{stockLocations:t,error:a,isLoading:o,mutate:r}=(0,i.gQ)(),[c,m]=(0,n.useState)(10),{goTo:d,results:u,currentPage:p}=(0,s.usePagination)(t,c),{t:_}=(0,l.useTranslation)(),g=(0,n.useMemo)(()=>[{id:0,header:_("name","Name"),key:"name"},{id:1,header:_("tags","Tags"),key:"tags"},{id:2,header:_("childLocations","Child Locations"),key:"childLocations"},{id:3,header:_("actions","Actions"),key:"actions"}],[_]),k=(0,n.useMemo)(()=>t.map(e=>({id:e?.uuid,key:`key-${e?.uuid}`,uuid:`${e?.uuid}`,name:`${e?.name}`,tags:e?.meta.tag?.filter(e=>"SUBSETTED"!==e.code).map(e=>e.code)?.join(", ")??"",childLocations:e?.childLocations?.map(e=>e.display)?.join(", ")??""})),[t]);return{items:t,mutate:r,currentPage:p,currentPageSize:c,paginatedQueueEntries:u,goTo:d,pageSizes:[10,20,30,40,50],isLoading:o,error:a,setPageSize:m,tableHeaders:g,tableRows:k}}let m=()=>{let e=`${s.restBaseUrl}/locationtag/`,{data:t,isLoading:a,mutate:n}=r()(e,s.openmrsFetch);return{locationTagList:t?.data?.results?t?.data?.results:[],loading:a,mutate:n}};async function d({locationPayload:e}){return await (0,s.openmrsFetch)(`${s.restBaseUrl}/location/`,{method:"POST",headers:{"Content-Type":"application/json"},body:e})}},5175(e,t,a){"use strict";a.d(t,{G2:()=>m,Jd:()=>p,Ul:()=>h,VE:()=>b,VZ:()=>k,bh:()=>d,cj:()=>_,gQ:()=>i,kp:()=>u,qM:()=>g,zn:()=>c});var n=a(5453),o=a(9736),r=a.n(o),s=a(815),l=a(3767);function i(){let e=`${s.fhirBaseUrl}/Location?_summary=data&_tag=main store,main pharmacy,dispensary `,{data:t,error:a,isLoading:o,mutate:r}=(0,s.useFhirFetchAll)(e);return{stockLocations:(0,n.A)(t,"id")??[],mutate:r,isLoading:o,error:a}}function c(e){let t=`${s.restBaseUrl}/role${(0,l.q)(e)}`,{data:a,error:n,isLoading:o}=r()(t,s.openmrsFetch);return{items:a?.data||{},isLoading:o,error:n}}function m(){let e=`${s.restBaseUrl}/stockmanagement/stockoperationtype?v=default`,{data:t,isLoading:a,error:n}=r()(e,s.openmrsFetch);return{types:t?.data||{},isLoading:a,error:n}}function d(){let e=`${s.restBaseUrl}/stockmanagement/stockoperationtype?v=default`;return(0,s.openmrsFetch)(e)}function u(e){let t=`${s.restBaseUrl}/user${(0,l.q)(e)}`,{data:a,error:n,isLoading:o}=r()(t,s.openmrsFetch,{keepPreviousData:!0});return{items:a?.data||{},isLoading:o,error:n}}function p(e,t){let a=`${s.restBaseUrl}/user/${e}${(0,l.q)({v:t||void 0})}`,{data:n,error:o,isLoading:i}=r()(e?a:null,s.openmrsFetch);return{data:n?.data||{},isLoading:i,error:o}}function _(e){let t=`${s.restBaseUrl}/concept/${e}`,{data:a,error:n,isLoading:o}=r()(e?t:null,s.openmrsFetch,{errorRetryCount:2});return{items:a?.data||{},isLoading:o,error:n}}function g(){let e=`${s.restBaseUrl}/stockmanagement/party?v=default`,{data:t,error:a,isLoading:n}=r()(e,s.openmrsFetch);return{items:t?.data||{},isLoading:n,error:a}}function k(e,t=!0){let a=`${s.restBaseUrl}/drug${(0,l.q)(e)}`,{data:n,error:o,isLoading:i}=r()(t?a:null,s.openmrsFetch);return{items:n?.data||{},isLoading:i,error:o}}function b(e){let t=`${s.restBaseUrl}/concept${(0,l.q)(e)}`,{data:a,error:n,isLoading:o}=r()(t,s.openmrsFetch);return{items:a?.data||{},isLoading:o,error:n}}let h=()=>{let{user:e}=(0,s.useSession)(),t=`${s.restBaseUrl}/stockmanagement/userrolescope`,{data:a,isLoading:n,error:o}=r()(t,s.openmrsFetch);return{userRoles:a?.data?.results.find(t=>t.userUuid===e.uuid),isLoading:n,error:o}}},683(e,t,a){"use strict";a.d(t,{AE:()=>o,_H:()=>r,mh:()=>s,rA:()=>l});var n=a(815);a(8308);let o=(e,t,a)=>{(0,n.launchWorkspace2)("stock-operation-form-workspace",{stockOperationType:e,stockOperation:t,stockRequisitionUuid:a})},r=e=>!e||("NEW"===e.status||"RETURNED"===e.status)&&e.permission?.canEdit!==!1;function s(){return`${new Date().getTime()}-${Math.random().toString(36).substring(2,16)}`}let l=(e,t,a)=>{let o=(0,n.showModal)("stock-operations-modal",{title:e,operation:a,requireReason:t,closeModal:()=>o()})}},4094(e,t,a){"use strict";a.d(t,{A:()=>o});var n=a(3466);let o=e=>{let t=(0,n.lj)(e.operationType);return{isNegativeQuantityAllowed:(0,n.R6)(t),requiresBatchUuid:(0,n.Xb)(t),requiresActualBatchInfo:(0,n.en)(t),isQuantityOptional:(0,n.Hu)(t),canCaptureQuantityPrice:(0,n.Wf)(t),requiresStockAdjustmentReason:(0,n.jQ)(t),requiresDispatchAcknowledgement:(0,n.Eh)(t),allowExpiredBatchNumbers:e?.allowExpiredBatchNumbers??!1,allowPrinting:(0,n.LD)(t)}}},8720(e,t,a){"use strict";a.d(t,{A:()=>m});var n=a(9868),o=a.n(n),r=a(2761),s=a(4644),l=a(815),i=a(9587),c=a(3767);let m=({onSelectedItem:e})=>{let{t}=(0,s.useTranslation)(),{isLoading:a,stockItemsList:m,setSearchString:d}=function(e){let[t,a]=(0,n.useState)(e||{v:c.G.Default,limit:10,startIndex:0}),{items:{results:o},isLoading:r}=(0,i.QC)(t),[s,l]=(0,n.useState)(null),[m,d]=(0,n.useState)(e?.limit||10),[u,p]=(0,n.useState)(e?.v||c.G.Default);return(0,n.useEffect)(()=>{a({startIndex:0,v:u,limit:m,q:s})},[s,m,u]),{stockItemsList:o,setLimit:d,setRepresentation:p,setSearchString:l,isLoading:r}}({}),[u,p]=(0,n.useState)(""),_=(0,l.useDebounce)(u),{useItemCommonNameAsDisplay:g}=(0,l.useConfig)(),k=(0,n.useCallback)(e=>{if(g)return;let a=e?.commonName?`(Common name: ${e.commonName})`:void 0;return`${e?.drugName||t("noDrugNameAvailable","No drug name available")+(a??"")}`},[g,t]),b=(0,n.useCallback)(e=>{if(!g)return;let a=e?.drugName?`(Drug name: ${e.drugName})`:void 0;return`${e?.commonName||t("noCommonNameAvailable","No common name available")+(a??"")}`},[g,t]);return(0,n.useEffect)(()=>{_?.length!==0&&d(_)},[_,d]),o().createElement("div",{className:"-esm-stock-management__input-components-styles__stockItemSearchContainer___3u5hk"},o().createElement("div",{style:{display:"flex"}},o().createElement(r.Search,{size:"lg",placeholder:t("findItems","Find your items"),labelText:t("search","Search"),closeButtonLabelText:t("clearSearch","Clear search input"),value:u,id:"search-stock-operation-item",onChange:e=>p(e.target.value)})),u&&m?.length>0&&o().createElement("div",{className:"-esm-stock-management__input-components-styles__searchResults___2JIEq"},m?.slice(0,5).map(t=>{let a=b(t),n=k(t);return o().createElement(r.ClickableTile,{onClick:()=>{e?.(t),p("")},key:t?.uuid},g?a:n)})))}},4779(e,t,a){"use strict";a.d(t,{DT:()=>p,Eb:()=>c,G7:()=>m,Wu:()=>i,_o:()=>g,jU:()=>u,jp:()=>_,kR:()=>l,yJ:()=>d});var n=a(815),o=a(9736),r=a.n(o),s=a(3767);function l(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperation${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch,{keepPreviousData:!0});return{items:a?.data||{},isLoading:l,error:o}}function i(e){if(!e)return;let t=`${n.restBaseUrl}/stockmanagement/stockoperation/${e}?v=full`;return(0,n.openmrsFetch)(t)}function c(e=""){let t=`${n.restBaseUrl}/stockmanagement/stockoperation/${e}?v=full`,{data:a,error:o,isLoading:s}=r()(e?t:null,n.openmrsFetch);return{items:a?.data,isLoading:s,error:o}}function m(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperationitem/${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:a.signal})}function d(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperation`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function u(e,t){let a=`${n.restBaseUrl}/stockmanagement/stockoperation/${e.uuid}`,o=new AbortController;return(0,n.openmrsFetch)(a,{method:"POST",headers:{"Content-Type":"application/json"},signal:o.signal,body:t})}function p(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperationaction`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function _(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperationitemcost?v=default&stockOperationUuid=${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"GET",headers:{"Content-Type":"application/json"},signal:a.signal})}function g(e){let t=`${n.restBaseUrl}/stockmanagement/stockiteminventory${(0,s.q)(e)}&v=default`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"GET",headers:{"Content-Type":"application/json"},signal:a.signal})}},1651(e,t,a){"use strict";a.d(t,{$:()=>i,X:()=>l});var n=a(815),o=a(9736),r=a.n(o),s=a(9868);function l(){let e=`${n.restBaseUrl}/stockmanagement/report?v=default`,{data:t,error:a,isLoading:o}=r()(e,n.openmrsFetch);return{reportTypes:t?.data?.results??[],isLoading:o,error:a}}function i(e=!0){let t=`${n.restBaseUrl}/stockmanagement/batchjob?batchJobType=Report&v=default&limit=10&totalCount=true`,{data:a,error:o,isLoading:l,mutate:c}=r()(e?t:null,n.openmrsFetch,{refreshInterval:15e3,dedupingInterval:1e4}),[m,d]=(0,s.useState)(10),{goTo:u,results:p,currentPage:_}=(0,n.usePagination)(a?.data?.results,m);return{reports:a?.data?.results??[],isLoading:l,error:o,items:p,totalItems:a?.data?.results?.length??0,currentPage:_,currentPageSize:m,paginatedItems:p,goTo:u,pageSizes:[10,20,30,40,50],setPageSize:d,mutate:c}}},8455(e,t,a){"use strict";a.d(t,{UP:()=>l,Xh:()=>i,qi:()=>c});var n=a(815),o=a(3767),r=a(9736),s=a.n(r);function l(e){let t=`${n.restBaseUrl}/stockmanagement/stocksource${(0,o.q)(e)}`,{data:a,error:r,isLoading:l}=s()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:r}}function i(e){let t=e.reduce((e,t,a)=>0===a?e:e+=(e.length>0?",":"")+encodeURIComponent(t),"");t.length>0&&(t="?ids="+t);let a=`${n.restBaseUrl}/stockmanagement/stocksource/${e[0]}${t}`,o=new AbortController;return(0,n.openmrsFetch)(a,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:o.signal})}function c(e){let t=null!=e.uuid,a=`${n.restBaseUrl}/stockmanagement/stocksource${t?"/"+e.uuid:""}`,o=new AbortController;return(0,n.openmrsFetch)(a,{method:"POST",headers:{"Content-Type":"application/json"},signal:o.signal,body:{...e,sourceType:e?.sourceType?.uuid}})}},1347(e,t,a){"use strict";a.d(t,{IV:()=>i,Wh:()=>l,ww:()=>c});var n=a(9736),o=a.n(n),r=a(3767),s=a(815);function l(e){let t=`${s.restBaseUrl}/stockmanagement/userrolescope${(0,r.q)(e)}`,{data:a,error:n,isLoading:l}=o()(t,s.openmrsFetch);return{items:a?.data||{},isLoading:l,error:n}}function i(e){let t=e.reduce((e,t,a)=>0===a?e:e+=(e.length>0?",":"")+encodeURIComponent(t),"");t.length>0&&(t="?ids="+t);let a=`${s.restBaseUrl}/stockmanagement/userrolescope/${e[0]}${t}`,n=new AbortController;return(0,s.openmrsFetch)(a,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:n.signal})}function c(e){let t=new AbortController,a=null!=e.uuid,n=`${s.restBaseUrl}/stockmanagement/userrolescope${a?"/"+e.uuid:""}`;return(0,s.openmrsFetch)(n,{method:"POST",headers:{"Content-Type":"application/json"},signal:t.signal,body:e})}},7351(e,t,a){"use strict";a.d(t,{K:()=>r});var n=a(9868),o=a(9736);let r=()=>{let{mutate:e}=(0,o.useSWRConfig)();return(0,n.useCallback)(t=>e(e=>"string"==typeof e&&e.startsWith(t),void 0),[e])}}}]);