(globalThis.webpackChunk_openmrs_esm_stock_management_app=globalThis.webpackChunk_openmrs_esm_stock_management_app||[]).push([["3527"],{4126(e,t,a){"use strict";a.d(t,{A:()=>n});let n={headerBtnContainer:"-esm-stock-management__stock-items-table__headerBtnContainer___Lvtqz",tileContainer:"-esm-stock-management__stock-items-table__tileContainer___xZqOk",tile:"-esm-stock-management__stock-items-table__tile___yRrkk",tileContent:"-esm-stock-management__stock-items-table__tileContent___3HzgB",content:"-esm-stock-management__stock-items-table__content___Giie2",helper:"-esm-stock-management__stock-items-table__helper___coPmu",separator:"-esm-stock-management__stock-items-table__separator___Lo7I2",toolbarContent:"-esm-stock-management__stock-items-table__toolbarContent___JQ8Kq",filterContainer:"-esm-stock-management__stock-items-table__filterContainer___sAp1-",dateAlign:"-esm-stock-management__stock-items-table__dateAlign___OFoT8",filtersAlign:"-esm-stock-management__stock-items-table__filtersAlign___h9qb6",toolbarAction:"-esm-stock-management__stock-items-table__toolbarAction___0V8Wh",tableHeader:"-esm-stock-management__stock-items-table__tableHeader___vuIl7",tableScroll:"-esm-stock-management__stock-items-table__tableScroll___sTQZm",nameCell:"-esm-stock-management__stock-items-table__nameCell___EyW9b",stockTableContainer:"-esm-stock-management__stock-items-table__stockTableContainer___7z9fp",paginationOverride:"-esm-stock-management__stock-items-table__paginationOverride___QaJVs"}},4767(e,t,a){var n={"./uk.json":["723","9072"],"./ar.json":["4132","7045"],"./ru_RU.json":["986","8359"],"./uz_UZ.json":["890","7175"],"./fr.json":["4055","6508"],"./sw_KE.json":["8618","903"],"./uz.json":["3584","6377"],"./en.json":["4300","5117"],"./ky.json":["8163","2416"],"./pl.json":["1119","6724"],"./sq.json":["8371","4928"],"./ka.json":["795","1480"],"./si.json":["6859","6904"],"./zh_TW.json":["439","556"],"./de.json":["4944","5145"],"./lg.json":["4618","8695"],"./vi.json":["9214","6371"],"./tr.json":["5241","434"],"./es_MX.json":["8349","1646"],"./tr_TR.json":["9900","1869"],"./zh_CN.json":["9879","5644"],"./en_US.json":["9569","4106"],"./he.json":["4652","2317"],"./id.json":["2690","6047"],"./ku.json":["9895","4348"],"./es.json":["3099","7912"],"./ne.json":["2146","5503"],"./ar_SY.json":["7617","282"],"./uz@Latn.json":["7097","4658"],"./bn.json":["7159","6444"],"./cs.json":["6589","7182"],"./zh.json":["5661","7742"],"./hi_IN.json":["5442","4383"],"./pt_BR.json":["6468","1877"],"./qu.json":["5173","8358"],"./ro_RO.json":["6022","3963"],"./sw.json":["9913","3378"],"./am.json":["1197","9806"],"./pt.json":["6679","5132"],"./it.json":["9538","4111"],"./km.json":["4335","5940"],"./hi.json":["6840","2881"]};function o(e){if(!a.o(n,e))return Promise.resolve().then(function(){var t=Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t});var t=n[e],o=t[0];return a.e(t[1]).then(function(){return a(o)})}o.keys=()=>Object.keys(n),o.id=4767,e.exports=o},7003(e,t,a){"use strict";a.d(t,{Cg:()=>p,Ec:()=>c,Mz:()=>l,Qg:()=>f,R4:()=>S,UE:()=>d,Ul:()=>k,Wh:()=>N,YI:()=>s,Zz:()=>b,bp:()=>E,dt:()=>T,fH:()=>g,fK:()=>C,iD:()=>v,je:()=>D,m0:()=>m,v9:()=>u,vI:()=>h,x9:()=>i,xM:()=>y,yj:()=>_,yu:()=>w});var n=a(254),o=a.n(n),r=a(6008);window.getOpenmrsSpaBase,o()(new Date().setUTCHours(0,0,0,0)).format("YYYY-MM-DDTHH:mm:ss.SSSZZ"),Intl.DateTimeFormat().resolvedOptions().timeZone;let s="DD/MM/YYYY",l="d/m/Y",i=e=>(0,r.g1)(e,s),c=()=>{let e=new Date;return new Date(e.getFullYear(),e.getMonth(),e.getDate())},m=Object.freeze({SOURCES:"Sources",OPERATION:"Operation",STATUS:"Status"}),d="App: stockmanagement.reports",u="Task: stockmanagement.reports.mutate",p="d210eb66-2188-11ed-9dff-507b9dea1806",_="cca4be4b-2188-11ed-9dff-507b9dea1806",g="84bdd876-4694-11ed-8109-00155dcc3fc0",b="a49be648-6b0a-11ed-93a2-806d973f13a9",k="2083fd40-3391-11ed-a667-507b9dea1806",h=!0,E=!0,y="Health Center",f="moduleResources/stockmanagement/assets/print-logo.svg",T="Main Store",v=!0,N=e=>`/user-role-scopes/${e}`,S="stockItem",C=e=>`/stock-management/items?${S}=${encodeURIComponent(e)}`,w=(e,t)=>`/openmrs/ws/rest/v1/stockmanagement/batchjobartifact?id=${e}${t?"&download=1":""}`;function D(e){let t=e?.responseBody?.error?.fieldErrors;return t?Object.values(t).flatMap(e=>e.map(e=>e.message)):[e?.responseBody?.error?.message??e?.message]}},3767(e,t,a){"use strict";a.d(t,{G:()=>o,q:()=>r});var n,o=((n={}).Default="default",n.Full="full",n.REF="ref",n);function r(e,t=!0){if(!e)return"";let a=Object.keys(e)?.map(a=>{let n=e[a];return t&&(!1===n||!0===n||n)||!t&&(""===n||!1===n||!0===n||n)?`${encodeURIComponent(a)}=${encodeURIComponent(n.toString())}`:null}).filter(e=>null!=e).join("&");return a.length>0?"?"+a:""}},7138(e,t,a){"use strict";a.d(t,{QS:()=>n,th:()=>o});let n="LocationStockItemBatchNo",o="LocationStockItem"},9684(e,t,a){"use strict";a.d(t,{By:()=>n});let n=["NEW","SUBMITTED","AUTHORIZED","DISPATCHED","COMPLETED","RETURNED","CANCELLED","REJECTED"]},3466(e,t,a){"use strict";a.d(t,{Eh:()=>u,Hu:()=>m,LD:()=>p,R6:()=>l,S5:()=>o,Wf:()=>d,Xb:()=>i,en:()=>c,jQ:()=>s,lj:()=>r,t$:()=>k});var n,o=((n={}).TRANSFER_OUT_OPERATION_TYPE="transferout",n.DISPOSED_OPERATION_TYPE="disposed",n.STOCK_ISSUE_OPERATION_TYPE="stockissue",n.STOCK_TAKE_OPERATION_TYPE="stocktake",n.REQUISITION_OPERATION_TYPE="requisition",n.OPENING_STOCK_OPERATION_TYPE="initial",n.RECEIPT_OPERATION_TYPE="receipt",n.RETURN_OPERATION_TYPE="return",n.ADJUSTMENT_OPERATION_TYPE="adjustment",n);function r(e){return"transferout"===(e=e?.toLowerCase())?"transferout":"disposed"===e?"disposed":"stockissue"===e?"stockissue":"stocktake"===e?"stocktake":"requisition"===e?"requisition":"receipt"===e?"receipt":"return"===e?"return":"adjustment"===e?"adjustment":"initial"===e?"initial":void 0}let s=e=>"adjustment"===e||"stocktake"===e||"disposed"===e,l=e=>"adjustment"===e,i=e=>!c(e)&&"requisition"!==e,c=e=>"receipt"===e||"initial"===e,m=e=>"requisition"===e,d=e=>"receipt"===e||"initial"===e,u=e=>"stockissue"===e||"return"===e,p=e=>"stockissue"===e||_(e)||g(e)||b(e),_=e=>"requisition"===e,g=e=>"receipt"===e,b=e=>"transferout"===e,k=e=>"stockissue"===e},7092(e,t,a){"use strict";a.d(t,{A:()=>u});var n=a(1455),o=a.n(n),r=a(7815),s=a(4520),l=a(4213),i=a(9252),c=a(3654),m=a(3716);let d={widgetContainer:"-esm-stock-management__table__widgetContainer___yyK1I",widgetHeaderContainer:"-esm-stock-management__table__widgetHeaderContainer___LXuqs",toggleButtons:"-esm-stock-management__table__toggleButtons___IDXdF",searchField:"-esm-stock-management__table__searchField___JNd9O",searchBox:"-esm-stock-management__table__searchBox___zsTHQ",container:"-esm-stock-management__table__container___r5gjS",tabContainer:"-esm-stock-management__table__tabContainer___T0+Dm",itemListSearch:"-esm-stock-management__table__itemListSearch___kQCXe",tileContainer:"-esm-stock-management__table__tileContainer___y7bJu",tile:"-esm-stock-management__table__tile___tBLDw",tileContent:"-esm-stock-management__table__tileContent___PGTHq",menuItem:"-esm-stock-management__table__menuItem___Y1vXl",radioButtonGroup:"-esm-stock-management__table__radioButtonGroup___o0xvH",radioButton:"-esm-stock-management__table__radioButton___8e61a",section:"-esm-stock-management__table__section___DdCkE",sectionTitle:"-esm-stock-management__table__sectionTitle___2+NJM",modalBody:"-esm-stock-management__table__modalBody___jFvGH",tableContainer:"-esm-stock-management__table__tableContainer___WuS2z",search:"-esm-stock-management__table__search___ysc8+",toolbarContent:"-esm-stock-management__table__toolbarContent___NRN6N",itemListDownload:"-esm-stock-management__table__itemListDownload___jkHl6",content:"-esm-stock-management__table__content___-EUvd",helper:"-esm-stock-management__table__helper___uLyZY"},u=({columns:e,data:t,children:a,totalItems:u,goToPage:p,hasToolbar:_=!0})=>{let{t:g}=(0,r.useTranslation)(),b=(0,m.useLayoutType)(),[k,h]=(0,n.useState)([]),E="tablet"===(0,m.useLayoutType)(),[y]=(0,n.useState)(t),f=[10,20,30,40,50],[T,v]=(0,n.useState)(10),{goTo:N,results:S,currentPage:C}=(0,m.usePagination)(y,T);(0,n.useEffect)(()=>{let e=[];S.map((t,a)=>e.push({...t,id:a++})),h(e)},[S,k]);let w=()=>{let t=new Blob([I(y,e)],{type:"text/csv;charset=utf-8"});(0,l.saveAs)(t,"data.csv")},D=()=>{let e=new Blob([JSON.stringify(y,null,2)],{type:"application/json"});(0,l.saveAs)(e,"data.json")},I=(e,t)=>[t.map(e=>e.header).join(","),...e.map(e=>t.map(t=>JSON.stringify(e[t.key])).join(","))].join("\n");return o().createElement(o().Fragment,null,o().createElement(i.DataTable,{"data-floating-menu-container":!0,rows:k,headers:e,filterRows:({rowIds:e,headers:t,cellsById:a,inputValue:n,getCellId:o})=>e.filter(e=>t.some(({key:t})=>{let r=a[o(e,t)].value,s=n?.toLowerCase();return"boolean"!=typeof r&&(""+r)?.toLowerCase().includes(s)})),overflowMenuOnHover:(0,m.isDesktop)(b),size:E?"lg":"md",useZebraStyles:!0},({rows:e,headers:t,getHeaderProps:n,getTableProps:r,onInputChange:l})=>o().createElement("div",null,o().createElement(i.TableContainer,{className:d.tableContainer},_&&o().createElement(i.TableToolbar,{"aria-label":g("dataTableToolbar","Data table toolbar"),style:{position:"static",overflow:"visible",backgroundColor:"color"}},o().createElement(i.TableToolbarContent,{className:d.toolbarContent},a?a({onInputChange:l}):o().createElement(o().Fragment,null,o().createElement(i.OverflowMenu,{focusTrap:!1,iconDescription:g("downloadOptions","Download options"),renderIcon:c.QN,size:"sm"},o().createElement(i.OverflowMenuItem,{className:d.menuItem,itemText:g("downloadAsCSV","Download As CSV"),onClick:w}),o().createElement(i.OverflowMenuItem,{className:d.menuItem,itemText:g("downloadAsJson","Download As JSON"),onClick:D})),o().createElement(i.TableToolbarSearch,{labelText:g("searchThisList","Search this list"),closeButtonLabelText:g("clearSearch","Clear search input"),className:d.itemListSearch,expanded:!0,onChange:l,placeholder:g("searchThisList","Search this list"),size:"sm"})))),o().createElement(i.Table,r(),o().createElement(i.TableHead,null,o().createElement(i.TableRow,null,t.map(e=>o().createElement(i.TableHeader,{...n({header:e}),key:e.key},e.header)))),o().createElement(i.TableBody,null,e.map(e=>o().createElement(i.TableRow,{key:e.id},e.cells.map(e=>o().createElement(i.TableCell,{key:e.id},e.value)))))),0===e.length?o().createElement("div",{className:d.tileContainer},o().createElement(i.Tile,{className:d.tile},o().createElement("div",{className:d.tileContent},o().createElement("p",{className:d.content},g("noData","No data to display")),o().createElement("p",{className:d.helper},g("checkFilters","Check the filters above"))))):null,o().createElement(i.Pagination,{...(0,s.LI)(g),page:C,pageSize:T,pageSizes:f,totalItems:u||y?.length,className:d.pagination,onChange:({pageSize:e,page:t})=>{if(e!==T&&v(e),t!==C){if(p)return void p(t);N(t)}}})))))}},570(e,t,a){"use strict";a.d(t,{d:()=>o});var n=a(1455);function o(e,t=1e3){let a=(0,n.useRef)();return(0,n.useEffect)(()=>()=>{a.current&&clearTimeout(a.current)},[]),(...n)=>{let o=setTimeout(()=>{e(...n)},t);clearTimeout(a.current),a.current=o}}},6008(e,t,a){"use strict";a.d(t,{P9:()=>c,ZM:()=>l,a9:()=>i,g1:()=>s,xp:()=>m});var n=a(254),o=a.n(n),r=a(3716);let s=(e,t)=>e?o()(e).format(t??"DD-MMM-YYYY"):"",l=e=>{if(!e)return"";let t=e instanceof Date?e:(0,r.parseDate)(String(e));return isNaN(t?.getTime())?"":(0,r.formatDate)(t,{time:!1,noToday:!0})},i=l,c=(e,t)=>e?o()(e).format(t??"DD-MMM-YYYY HH:mm"):"",m=e=>e?o()(e).format("YYYY-MM-DD"):e},8728(e,t,a){"use strict";function n(e){let t=e?.match(/^(.*\S)\s*\((.*)\)$/s);return t&&t[1].trim().toLowerCase()===t[2].trim().toLowerCase()?t[1].trim():e}a.d(t,{U:()=>n})},4520(e,t,a){"use strict";function n(e,t){switch(t){case"NEW":return e("statusNew","New");case"SUBMITTED":return e("submitted","Submitted");case"AUTHORIZED":return e("statusAuthorized","Authorized");case"DISPATCHED":return e("dispatched","Dispatched");case"COMPLETED":return e("completed","Completed");case"RETURNED":return e("returned","Returned");case"CANCELLED":return e("cancelled","Cancelled");case"REJECTED":return e("rejected","Rejected");default:return t}}function o(e){return{itemsPerPageText:e("itemsPerPage","Items per page:"),itemRangeText:(t,a,n)=>e("paginationItemRange","{{min}}–{{max}} of {{total}} items",{min:t,max:a,total:n,count:n}),pageRangeText:(t,a)=>e("paginationPageRange","of {{count}} pages",{count:a}),pageSelectLabelText:t=>e("paginationPageSelectLabel","Page of {{count}} pages",{count:t}),backwardText:e("previousPage","Previous page"),forwardText:e("nextPage","Next page")}}function r(e){return t=>{switch(t){case"carbon.table.row.expand":return e("expandCurrentRow","Expand current row");case"carbon.table.row.collapse":return e("collapseCurrentRow","Collapse current row");case"carbon.table.all.expand":return e("expandAllRows","Expand all rows");case"carbon.table.all.collapse":return e("collapseAllRows","Collapse all rows");case"carbon.table.all.select":return e("selectAllRows","Select all rows");case"carbon.table.all.unselect":return e("unselectAllRows","Unselect all rows");case"carbon.table.row.select":return e("selectRow","Select row");case"carbon.table.row.unselect":return e("unselectRow","Unselect row");default:return t}}}function s(e){return(t,a)=>{let n="string"==typeof a?.header?a.header:"";return a?.isSortHeader&&a.sortDirection===a.sortStates?.ASC?e("sortRowsDescending","Click to sort rows by {{header}} header in descending order",{header:n,interpolation:{escapeValue:!1}}):a?.isSortHeader&&a.sortDirection===a.sortStates?.DESC?e("unsortRows","Click to unsort rows by {{header}} header",{header:n,interpolation:{escapeValue:!1}}):e("sortRowsAscending","Click to sort rows by {{header}} header in ascending order",{header:n,interpolation:{escapeValue:!1}})}}function l(e){return t=>{switch(t){case"clear.selection":return e("clearSelectedItem","Clear selected item");case"clear.all":return e("clearAllSelectedItems","Clear all selected items");case"open.menu":return e("openMenu","Open menu");case"close.menu":return e("closeMenu","Close menu");default:return t}}}function i(e){return{prevMonthAriaLabel:e("previousMonth","Previous month"),nextMonthAriaLabel:e("nextMonth","Next month")}}function c(e){return e?.split(/[-_]/)[0]?.toLowerCase()||"en"}function m(e,t){return t?.status==="AUTHORIZED"||t?.status==="COMPLETED"&&t?.operationType==="requisition"&&t?.submittedDate?e("approved","Approved"):e("completed","Completed")}a.d(t,{D1:()=>l,IQ:()=>r,L9:()=>s,LI:()=>o,Wo:()=>i,e_:()=>n,ft:()=>c,qD:()=>m})},3978(e,t,a){"use strict";a.r(t),a.d(t,{root:()=>tY,deletePackagingUnitModal:()=>tj,stockManagementAdminCardLink:()=>tV,stockManagement:()=>an,stockOperationsModal:()=>ao,stockSourcesLink:()=>t6,stockOperationsLink:()=>t0,stockItemsLink:()=>t5,stockOperations:()=>tX,transactionStockcardPrintPreviewModal:()=>ap,stockLocations:()=>t3,deleteUserScopeModal:()=>tz,deletePackagingUnitButton:()=>tq,importTranslation:()=>tF,stockReports:()=>t8,importBulkStockItemsModal:()=>tZ,stockUserScopesLink:()=>t7,stockOperationFormWorkspace:()=>as,stockItemFormWorkspace:()=>al,stockUserScopesFormWorkspace:()=>ad,stockNavMenu:()=>tQ,stockUserScopes:()=>t4,deleteStockModal:()=>tP,stockItems:()=>t1,stockOverviewLink:()=>tJ,stockSourcesFormWorkspace:()=>ac,issuingStockModal:()=>tG,transactionBincardPrintPreviewModal:()=>au,startupApp:()=>a_,receivingStockModal:()=>tW,stockReportsFormWorkspace:()=>am,stockReportsLink:()=>ae,stockItemRulesFormWorkspace:()=>ai,stockLocationsLink:()=>t9,stockOverview:()=>tK,stockSettingsLink:()=>aa,stockManagementAppMenuItem:()=>ar,stockSettings:()=>at,expiredStockModal:()=>tH,stockSources:()=>t2,createLocationModal:()=>ag});var n=a(3716);let o={autoPopulateResponsiblePerson:{_type:n.Type.Boolean,_default:!1,_description:"Auto-populate responsible person in stock operations with the currently logged-in user"},dispensingUnitsUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock dispensing units",_default:"162402AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},enablePrintButton:{_type:n.Type.Boolean,_default:!0,_description:"Enable or disable the print button in the stock management UI"},logo:{src:{_type:n.Type.String,_default:null,_description:"A path or URL to an image"},alt:{_type:n.Type.String,_default:"Logo",_description:"Alt text shown on hover"},name:{_type:n.Type.String,_default:null,_description:"The organization name displayed when image is absent"}},packingUnitsUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the packaging unit",_default:"a6d438fe-05c1-4d4d-9755-c11cf6b0b3b9"},printBalanceOnHand:{_type:n.Type.Boolean,_default:!1,_description:"Whether to include balance on hand on the printout"},printItemCost:{_type:n.Type.Boolean,_default:!1,_description:"Whether to include item costs on the printout"},responsiblePersonExcludedRoles:{_type:n.Type.Array,_elements:{_type:n.Type.String},_default:[],_description:'Users holding any of these roles (role names, e.g. "System Developer") are not offered as the responsible person of a stock operation, so that system and integration accounts do not crowd out staff'},stockAdjustmentReasonUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock adjustment reasons",_default:"3a9021d1-d6c1-4fc2-8e30-ca8e204e44de"},stockItemCategoryUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock item category",_default:"8ccf6066-9297-4d76-aaf3-00aa3714d198"},stockSourceTypeUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock source types",_default:"937a0440-95f7-42f6-aaef-16cf611fcf10"},stockTakeReasonUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock take reasons",_default:"faa466c5-0953-4d4f-8ea7-d9a06341c3f3"},useItemCommonNameAsDisplay:{_type:n.Type.Boolean,_description:"Use item common name as display (true) or drug name as display (false)",_default:!0}};var r=a(1455),s=a.n(r),l=a(3387),i=a(7815);function c({dashboardLinkConfig:e}){let{name:t,title:a,titleKey:o}=e,{t:m}=(0,i.useTranslation)(),d=(0,l.useLocation)(),u=`${window.spaBase}/stock-management`,p=(0,r.useMemo)(()=>{let e=d.pathname.split("/");return decodeURIComponent(e[e.length-1])},[d.pathname]);return s().createElement(n.ConfigurableLink,{to:`${u}/${t}`,className:`cds--side-nav__link ${p.match(t)&&"active-left-nav-link"}`},o?m(o,a):a)}let m=e=>()=>s().createElement(l.BrowserRouter,null,s().createElement(c,{dashboardLinkConfig:e}));var d=a(9252),u=a(9564),p=a(3270),_=a(7136),g=a(3335);let b="-esm-stock-management__stock-management-header__value___9tRKk",k=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,n.useSession)(),a=t?.sessionLocation?.display;return s().createElement(n.PageHeader,{className:"-esm-stock-management__stock-management-header__header___LKg86","data-testid":"stock-management-header"},s().createElement(n.PageHeaderContent,{illustration:s().createElement(n.StockManagementPictogram,null),title:e("stockManagement","Stock management")}),s().createElement("div",{className:"-esm-stock-management__stock-management-header__right-justified-items___oK4n1"},s().createElement("div",{className:"-esm-stock-management__stock-management-header__date-and-location___8nnlA"},s().createElement(_.aZ,{size:16}),s().createElement("span",{className:b},a),s().createElement("span",{className:"-esm-stock-management__stock-management-header__middot___MhHzj"},"\xb7"),s().createElement(g.Vv,{size:16}),s().createElement("span",{className:b},(0,n.formatDate)(new Date,{mode:"standard"})))))},h=({dashboardSlot:e,title:t})=>s().createElement(s().Fragment,null,s().createElement(k,null),s().createElement(n.ExtensionSlot,{name:e,state:{dashboardTitle:t}}));function E(){let e=(0,l.useParams)(),t=(0,n.useExtensionSlotMeta)("stock-page-dashboard-slot"),a=(0,n.useLayoutType)(),o=Object.values(t).filter(e=>Object.keys(e).length)||[],r=o.find(t=>t.name===e?.dashboard)||o[0];return s().createElement("div",{className:"-esm-stock-management__home-dashboard__homePageWrapper___TnM9T"},s().createElement("section",{className:(0,n.isDesktop)(a)?"-esm-stock-management__home-dashboard__dashboardContainer___lLkxS":"-esm-stock-management__home-dashboard__dashboardContainerTablet___3pvso"},(0,n.isDesktop)(a)&&s().createElement(n.ExtensionSlot,{name:"stock-sidebar-slot",key:a}),s().createElement(h,{title:r?.name,dashboardSlot:r?.slot})))}var y=a(2383),f=a(3767),T=a(9587);function v(){let[e,t]=(0,r.useState)({startIndex:0,v:f.G.Default,q:null,includeStockItemName:"true"});(0,r.useEffect)(()=>{t({v:f.G.Default,includeStockItemName:"true"})},[]);let{items:a,isLoading:n,error:o}=(0,T.ME)(e);return{items:a.results??[],isLoading:n,error:o}}function N(e,t=new Date){if(!e)return null;let a=new Date(e).getTime();return Number.isFinite(a)?Math.ceil((a-t.getTime())/864e5):null}function S(e,t,a=new Date){return e.filter(e=>{let n=N(e.expiration,a);return null!==n&&n>=0&&n<=t})}function C(e){let[t,a]=(0,r.useState)({v:e||f.G.Default,q:null,totalCount:!0}),{items:n,isLoading:o,error:s}=(0,T.QC)(t);return(0,r.useEffect)(()=>{a({v:f.G.Default,totalCount:!0})},[]),{items:n?.results??[],isLoading:o,error:s}}let w="-esm-stock-management__stock-home-detail-card__content___k1ELO",D="-esm-stock-management__stock-home-detail-card__card___MuR+4",I="-esm-stock-management__stock-home-detail-card__icon___d49jB",x="-esm-stock-management__stock-home-detail-card__cardText___WIaKk";var A=a(7138);let U=()=>{let{t:e}=(0,i.useTranslation)(),{items:t,isLoading:a}=v(),{items:o,isLoading:r}=C(),{items:l}=(0,T.Xu)({v:f.G.Default,groupBy:A.QS,includeBatchNo:!0});if(r||a)return null;if(o?.length===0)return s().createElement("p",{className:w},e("noInventoryAlerts","No inventory alerts to display"));let c=t.filter(e=>e?.expiration).map(e=>{let t=o?.find(t=>e?.stockItemUuid===t.uuid),a=l?.results?.filter(t=>t.stockBatchUuid===e.uuid).reduce((e,t)=>e+(Number(t.quantity)||0),0);return{...t,...e,quantity:a}}),m=S(c,180).slice(0,5);return s().createElement(s().Fragment,null,m.map((t,a)=>s().createElement("div",{className:D,key:a},s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__colorLineRed___hXQea"}),s().createElement("div",{className:I},s().createElement(y.Cs,{size:40,color:"#DA1E28"})),s().createElement("div",{className:x},s().createElement("p",null,e("expiringStock","Expiring stock")),s().createElement("p",null,s().createElement("strong",null,t?.drugName??t?.commonName)," ",e("batchQuantityLabel","Batch number: {{batchNo}}, quantity: {{quantity}} {{unit}}",{batchNo:t?.batchNo,quantity:t?.quantity??"--",unit:t?.dispensingUnitName??"",interpolation:{escapeValue:!1}}))))),s().createElement(d.Button,{kind:"ghost",onClick:()=>{let e=(0,n.showModal)("expired-stock-modal",{closeModal:()=>e(),expiredStock:c})},size:"sm"},e("viewAll","View All")))};var R=a(3654),$=a(4779),O=a(8728),L=a(4520);let M=()=>{let{t:e}=(0,i.useTranslation)(),{items:t,isLoading:a}=function(e){let{items:t,isLoading:a,error:n}=(0,$.kR)(e);return{items:t?.results?.filter(e=>e?.operationType==="stockissue"&&e?.status!=="COMPLETED"),isLoading:a,error:n}}({v:f.G.Full,totalCount:!0});if(a)return null;if(t?.length===0)return s().createElement("p",{className:w},e("noIssuedStock","No issued stock to display"));let o=t?.map((e,t)=>(e?.stockOperationItems||[]).map((a,n)=>({status:e?.status,sourceName:e?.sourceName,destinationName:e?.destinationName,stockItemName:(0,O.U)(a?.stockItemName),stockItemPackagingUOMName:a?.stockItemPackagingUOMName,quantity:a?.quantity,key:`${t}-${n}`}))),r=o?.flat().slice(0,10);return s().createElement(s().Fragment,null,r?.map((t,a)=>s().createElement("div",{className:D,key:a},s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__colorLineGreen___wm9i4"}),s().createElement("div",{className:I},s().createElement(R.t0,{size:40,color:"#198038"})),s().createElement("div",{className:x},s().createElement("p",null,(0,L.e_)(e,t?.status)," \xb7 ",t?.sourceName," \xb7 ",t?.destinationName),s().createElement("p",null,s().createElement("strong",null,t?.stockItemName)," ",t?.stockItemPackagingUOMName,", ",t?.quantity)))),s().createElement(d.Button,{kind:"ghost",onClick:()=>{let e=(0,n.showModal)("issuing-stock-modal",{closeModal:()=>e(),issuingStock:t})},size:"sm"},e("viewAll","View All")))},B=e=>e?new Date(e).getTime():0,F=()=>{let{t:e}=(0,i.useTranslation)(),{items:t,isLoading:a}=function(e){let{items:t,isLoading:a,error:n}=(0,$.kR)({...e,status:"COMPLETED"});return{items:t?.results?.filter(e=>e?.operationType==="receipt"&&e?.status==="COMPLETED").sort((e,t)=>B(t.completedDate??t.operationDate??t.dateCreated)-B(e.completedDate??e.operationDate??e.dateCreated)),isLoading:a,error:n}}({v:f.G.Full,totalCount:!0});return a?null:t?.length===0?s().createElement("p",{className:w},e("noReceivedStock","No received stock to display")):s().createElement(s().Fragment,null,t?.map((t,a)=>t?.stockOperationItems.map(n=>s().createElement("div",{className:D,key:a},s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__colorLineBlue___h+uO1"}),s().createElement("div",{className:I},s().createElement(R.rf,{size:40,color:"#0F62FE"})),s().createElement("div",{className:x},s().createElement("p",null,(0,L.e_)(e,t?.status)," \xb7 ",t?.sourceName," \xb7 ",t?.destinationName),s().createElement("p",null,s().createElement("strong",null,(0,O.U)(n?.stockItemName))," ",n?.stockItemPackagingUOMName,","," ",n?.quantity))))),s().createElement(d.Button,{kind:"ghost",onClick:()=>{let e=(0,n.showModal)("receiving-stock-modal",{closeModal:()=>e(),receivingStock:t})},size:"sm"},e("viewAll","View All")))},P=({title:e,children:t})=>{let a="tablet"===(0,n.useLayoutType)();return s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__tilesContainer___7Uurd"},s().createElement(d.Layer,null,s().createElement(d.Tile,null,s().createElement("div",{className:a?"-esm-stock-management__stock-home-detail-card__tabletHeading___cNMqn":"-esm-stock-management__stock-home-detail-card__desktopHeading___5EUrG"},s().createElement("h4",null,e)),t)))},z=()=>{let{t:e}=(0,i.useTranslation)();return s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__cardContainer___M502h"},s().createElement(P,{title:e("inventoryAlerts","Inventory alerts")},s().createElement(U,null)),s().createElement(P,{title:e("receiving","Receiving")},s().createElement(F,null)),s().createElement(P,{title:e("issuing","Issuing")},s().createElement(M,null)))};var j=a(8611),q=a.n(j),H=a(254),Z=a.n(H),G=a(8906),Y=a.n(G),W=a(6401);let V="-esm-stock-management__metrics-card__countGrid___rz7tr";Z().extend(Y());let Q=({label:e,value:t,headerLabel:a,children:n,count:o,outOfStockCount:r,disposedCount:l})=>{let{t:c}=(0,i.useTranslation)();return s().createElement(d.Tile,{className:"-esm-stock-management__metrics-card__tileContainer___2dbmS"},s().createElement("div",{className:"-esm-stock-management__metrics-card__tileHeader___I+lc1"},s().createElement("div",{className:"-esm-stock-management__metrics-card__headerLabelContainer___FcNbu"},s().createElement("label",{className:"-esm-stock-management__metrics-card__headerLabel___ynB1N"},a),n)),s().createElement("div",{className:"-esm-stock-management__metrics-card__metricsGrid___7NagF"},s().createElement("div",null,s().createElement("label",{className:"-esm-stock-management__metrics-card__totalsLabel___6Mw2w"},e),s().createElement("p",{className:"-esm-stock-management__metrics-card__totalsValue___esjS3"},t)),!(0,W.A)(o)&&s().createElement("div",{className:V},s().createElement("span",null),s().createElement("span",{className:"-esm-stock-management__metrics-card__in6MonthsLabel___7yBr-"},c("in6Months","In 6 months")),s().createElement("p",null),s().createElement("p",{className:"-esm-stock-management__metrics-card__in6MonthsValue___6mIwS"},o.expiry6months?.length)),!(0,W.A)(r)&&s().createElement("div",{className:V},s().createElement("span",{className:"-esm-stock-management__metrics-card__belowMinLabel___28e5i"},c("understockedItems","Understocked items")),s().createElement("span",{className:"-esm-stock-management__metrics-card__aboveMaxLabel___z++jU"},c("overstockedItems","Overstocked items")),s().createElement("p",{className:"-esm-stock-management__metrics-card__belowMinValue___ZZJpg"},r.itemsBelowMin?.length),s().createElement("p",{className:"-esm-stock-management__metrics-card__aboveMaxValue___3W76E"},r.itemsAboveMax?.length)),!(0,W.A)(l)&&s().createElement("div",{className:V},s().createElement("span",{className:"-esm-stock-management__metrics-card__expiredLabel___0WP2Q"},c("expired","Expired")),s().createElement("span",{className:"-esm-stock-management__metrics-card__poorQualityLabel___dA002"},c("poorQuality","Poor Quality")),s().createElement("p",{className:"-esm-stock-management__metrics-card__expiredValue___46Xws"},l.expired?.length),s().createElement("p",{className:"-esm-stock-management__metrics-card__poorQualityValue___fsfCF"},l.poorQuality?.length))))},K=e=>{let{t}=(0,i.useTranslation)(),{stockList:a,error:o}=(()=>{let e=`${n.restBaseUrl}/stockmanagement/stockitem?v=default&totalCount=true`,{data:t,error:a,isLoading:o}=q()(e,n.openmrsFetch);return{stockList:t?.data.results.map(e=>({uuid:e.uuid,hasExpiration:e.hasExpiration,expiryNotice:e.expiryNotice}))??[],isLoading:o,error:a}})(),{items:r}=v(),{items:l}=C(),c=r.filter(e=>e?.expiration).map(e=>({...l?.find(t=>e?.stockItemUuid===t.uuid),...e})),m=c.filter(e=>{let t=N(e.expiration);return null!==t&&t<=(e.expiryNotice||180)}),d=S(c,180),{items:u}=function(e){let{items:t,isLoading:a,error:n}=(0,$.kR)(e);return{items:t?.results?.filter(e=>e?.operationType==="disposed"),isLoading:a,error:n}}({v:f.G.Full,totalCount:!0});if(o)return s().createElement(n.ErrorState,{headerTitle:t("errorStockMetric","Error fetching stock metrics"),error:o});let p=u&&u.filter(e=>"Drug not available due to expired medication"===e.reasonName),_=u&&u.filter(e=>"Poor Quality"===e.reasonName);return s().createElement("div",{className:"-esm-stock-management__stock-home__cardContainer___haC5o"},s().createElement(Q,{count:{expiry6months:d},headerLabel:t("expiringStock","Expiring stock"),label:t("expiringStock","Expiring stock"),value:m?.length||0}),s().createElement(Q,{label:t("outOfStock","Out of stock"),headerLabel:t("outOfStock","Out of stock"),outOfStockCount:{itemsBelowMin:[],itemsAboveMax:[]},value:a?.length}),s().createElement(Q,{disposedCount:{expired:p,poorQuality:_},headerLabel:t("disposedStock","Disposed stock"),label:t("disposedStock","Disposed stock"),value:u?.length||0}))};var J=a(771),X=a(7351),ee=a(7187),et=a(570);let ea=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{(0,ee.m)()},[]);return s().createElement(d.Button,{onClick:t,size:"md",kind:"primary"},e("addStockItem","Add stock item"))},en=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{let e=(0,n.showModal)("import-bulk-stock-items",{closeModal:()=>e()})},[]);return s().createElement(d.Button,{iconDescription:e("import","Import"),kind:"ghost",onClick:t},e("import","Import"))},eo=({data:e})=>{let{t}=(0,i.useTranslation)();return s().createElement(d.Button,{kind:"ghost",size:"md",className:"-esm-stock-management__edit-stock-item-action-menu__nameButton___DO0Vc",onClick:()=>{e.isDrug=!!e.drugUuid,(0,ee.m)(e)},iconDescription:t("editStockItem","Edit stock item")},`${e?.drugName??e.conceptName}`)},er=({filterType:e,changeFilterType:t})=>{let{t:a}=(0,i.useTranslation)();return s().createElement(d.RadioButtonGroup,{name:"is-drug",defaultSelected:e,onChange:e=>t(e),className:"-esm-stock-management__filter-stock-items__spacing___bU+u5"},s().createElement(d.RadioButton,{labelText:a("all","All"),value:"",id:"is-drug-all"}),s().createElement(d.RadioButton,{labelText:a("pharmaceuticals","Pharmaceuticals"),value:"true",id:"is-drug-drug"}),s().createElement(d.RadioButton,{labelText:a("nonPharmaceuticals","Non Pharmaceuticals"),value:"false",id:"is-drug-other"}))};var es=a(4126);let el=["genericName","commonName","tradeName"],ei=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,X.K)(),[a,o]=(0,r.useState)(""),l=()=>{t(`${n.restBaseUrl}/stockmanagement/stockitem`)},{currentPage:c,currentPageSize:m,isDrug:u,isLoading:p,items:_,pageSizes:g,setCurrentPage:b,setDrug:k,setPageSize:h,setSearchString:E,totalCount:y}=function(e){let{t}=(0,i.useTranslation)(),[a,o]=(0,r.useState)(1),[s,l]=(0,r.useState)(10),[c,m]=(0,r.useState)(null),[d,u]=(0,r.useState)(""),[p,_]=(0,r.useState)({startIndex:a-1,v:e||f.G.Default,limit:s,q:null,totalCount:!0}),{items:g,isLoading:b,error:k}=(0,T.QC)(p),h=(0,n.usePagination)(g.results,s);return(0,r.useEffect)(()=>{_({startIndex:a-1,v:f.G.Default,limit:s,q:c,totalCount:!0,isDrug:d})},[c,a,s,d]),{items:h.results,pagination:h,totalCount:g.totalCount,currentPageSize:s,currentPage:a,setCurrentPage:o,setPageSize:l,pageSizes:[10,20,30,40,50],isLoading:b,error:k,isDrug:d,setDrug:e=>{o(1),u(e)},setSearchString:m}}(f.G.Full),v=(0,et.d)(e=>{E(e)},1e3);(0,r.useEffect)(()=>{v(a)},[a,v]);let N=(0,r.useMemo)(()=>[{id:0,header:e("type","Type"),key:"type"},{id:1,header:e("genericName","Generic name"),key:"genericName"},{id:2,header:e("commonName","Common name"),key:"commonName"},{id:3,header:e("tradeName","Trade name"),key:"tradeName"},{id:4,header:e("dispensingUnitName","Dispensing UoM"),key:"dispensingUnitName"},{id:5,header:e("defaultStockOperationsUoMName","Bulk packaging"),key:"defaultStockOperationsUoMName"},{id:6,header:e("reorderLevel","Reorder level"),key:"reorderLevel"},{id:7,header:e("actions","Actions"),key:"actions"}],[e]),S=(0,r.useMemo)(()=>_?.map((t,a)=>({...t,id:t?.uuid,key:`key-${t?.uuid}`,uuid:`${t?.uuid}`,type:t?.drugUuid?e("drug","Drug"):e("other","Other"),genericName:s().createElement(eo,{data:_[a]}),commonName:t?.commonName,tradeName:t?.drugUuid?t?.conceptName:"",preferredVendorName:t?.preferredVendorName,dispensingUoM:t?.defaultStockOperationsUoMName,dispensingUnitName:t?.dispensingUnitName,defaultStockOperationsUoMName:t?.defaultStockOperationsUoMName,reorderLevel:t?.reorderLevelUoMName&&t?.reorderLevel?`${t?.reorderLevel?.toLocaleString()} ${t?.reorderLevelUoMName}`:"",actions:s().createElement(d.IconButton,{kind:"ghost",label:e("editStockItem","Edit stock item"),onClick:()=>{t.isDrug=!!t.drugUuid,(0,ee.m)(t)}},s().createElement(J.ff,{size:16}))})),[_,e]);return p?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):s().createElement(s().Fragment,null,s().createElement("h2",{className:es.A.tableHeader},e("stockItemsTableHeader","Drugs and other stock items managed by the system.")),s().createElement(d.DataTable,{rows:S,headers:N,isSortable:!0,useZebraStyles:!0},({rows:t,headers:r,getHeaderProps:i,getTableProps:c,getRowProps:m,getBatchActionProps:p})=>s().createElement(d.TableContainer,{className:es.A.stockTableContainer},s().createElement(d.TableToolbar,{"aria-label":e("dataTableToolbar","Data table toolbar"),style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableBatchActions,{...p(),translateWithId:(t,a)=>(function(e,t,a){switch(t){case"carbon.table.batch.cancel":return e("cancel","Cancel");case"carbon.table.batch.selectAll":return e("selectAll","Select all");case"carbon.table.batch.item.selected":return e("itemSelected","{{count}} item selected",{count:a});default:return e("itemsSelected","{{count}} items selected",{count:a})}})(e,t,a?.totalSelected)}),s().createElement(d.TableToolbarContent,{className:es.A.toolbarContent},s().createElement(d.TableToolbarSearch,{labelText:e("searchStockItems","Search stock items"),closeButtonLabelText:e("clearSearch","Clear search input"),onChange:e=>{o("string"==typeof e?e:e.target.value)},persistent:!0,placeholder:e("searchStockItems","Search stock items"),value:a}),s().createElement(er,{filterType:u,changeFilterType:k}),s().createElement(en,null),s().createElement(d.TableToolbarMenu,{iconDescription:e("settings","Settings"),"data-testid":"stock-items-menu"},s().createElement(d.TableToolbarAction,{className:es.A.toolbarAction,onClick:l},e("refresh","Refresh"))),s().createElement(ea,null))),s().createElement("div",{className:es.A.tableScroll},s().createElement(d.Table,c(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,r.map(t=>"details"!==t.key&&s().createElement(d.TableHeader,{...i({header:t,isSortable:t.isSortable}),className:n.isDesktop?es.A.desktopHeader:es.A.tabletHeader,key:`${t.key}`,isSortable:"name"!==t.key&&"actions"!==t.key,translateWithId:(0,L.L9)(e)},"object"==typeof t.header&&null!==t.header&&"content"in t.header?t.header.content:t.header)))),s().createElement(d.TableBody,null,t.map(e=>s().createElement(s().Fragment,{key:e.id},s().createElement(d.TableRow,{...m({row:e}),className:n.isDesktop?es.A.desktopRow:es.A.tabletRow,key:e.id},e.cells.map(e=>e?.info?.header!=="details"&&s().createElement(d.TableCell,{key:e.id,className:el.includes(e?.info?.header)?es.A.nameCell:void 0},e.value)))))))),0===t.length?s().createElement("div",{className:es.A.tileContainer},s().createElement(d.Tile,{className:es.A.tile},s().createElement("div",{className:es.A.tileContent},s().createElement("p",{className:es.A.content},e("noStockItemsToDisplay","No stock items to display")),s().createElement("p",{className:es.A.helper},e("checkFilters","Check the filters above"))))):null)),s().createElement(d.Pagination,{...(0,L.LI)(e),className:es.A.paginationOverride,onChange:({page:e,pageSize:t})=>{b(e),h(t)},page:c,pageSize:m,pageSizes:g,totalItems:y}))};var ec=a(2137),em=a(1844),ed=a(7092);let eu=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useRef)();(0,r.useEffect)(()=>()=>t.current?.(),[]);let{tableHeaders:a,tableRows:o,items:l,isLoading:c,mutate:m}=(0,em.zC)({v:f.G.Full}),u=()=>{m()};return c?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):l?.length?s().createElement(ed.A,{columns:a,data:o},({onInputChange:a})=>s().createElement(s().Fragment,null,s().createElement(d.TableToolbarSearch,{labelText:e("filterTable","Filter table"),placeholder:e("filterTable","Filter table"),closeButtonLabelText:e("clearSearch","Clear search input"),persistent:!0,onChange:a}),s().createElement(d.TableToolbarMenu,{iconDescription:e("settings","Settings")},s().createElement(d.TableToolbarAction,{className:es.A.toolbarMenuAction,onClick:u},e("refresh","Refresh"))),s().createElement(d.Button,{kind:"ghost",renderIcon:e=>s().createElement(ec.OM,{size:16,...e}),onClick:()=>{t.current?.(),t.current=(0,n.showModal)("stock-create-location-modal",{mutate:m})}},e("createLocation","Create Location")))):s().createElement("div",{className:es.A.tileContainer},s().createElement(d.Tile,{className:es.A.tile},s().createElement("p",{className:es.A.content},e("noLocationsToDisplay","No locations to display"))))};var ep=a(7003),e_=a(6008),eg=a(683),eb=a(5175);let ek=()=>{let{types:{results:e},isLoading:t,error:a}=(0,eb.G2)(),{userRoles:n,isLoading:o,error:s}=(0,eb.Ul)();return{operationTypes:(0,r.useMemo)(()=>{let t=[...new Set(n?.operationTypes?.map(e=>e.operationTypeUuid)||[])];return e?.filter(e=>t.includes(e.uuid))||[]},[e,n]),isLoading:t||o,error:a||s}},eh=({stockOperation:e,showIcon:t=!0,showprops:a=!0})=>{let{t:o}=(0,i.useTranslation)(),{error:l,isLoading:c,operationTypes:m}=ek(),{isLoading:u,items:p,error:_}=(0,$.Eb)(e?.uuid),g=(0,r.useMemo)(()=>m?.find(e=>e?.uuid===p?.operationTypeUuid),[m,p]),b=(0,r.useCallback)(()=>{(0,eg.AE)(g,p,p?.requisitionStockOperationUuid)},[g,p]);(0,r.useEffect)(()=>{(l||_)&&(0,n.showSnackbar)({kind:"error",title:o("stockOperationLoadError","Error loading stock operation"),subtitle:l?.message||_?.message||""})},[l,_,o]);let k=(0,eg._H)(p??e);return c||u?s().createElement(d.InlineLoading,{status:"active",iconDescription:"Loading"}):l||_?s().createElement(s().Fragment,null,"--"):s().createElement(d.Button,{className:"-esm-stock-management__edit-stock-operation-button__editStockButton___aF9CI",kind:"ghost",size:"sm",onClick:b,renderIcon:t?()=>k?s().createElement(J.ff,{size:16}):s().createElement(y.Ss,{size:16}):void 0,"aria-label":a?void 0:k?o("edit","Edit"):o("view","View")},a&&s().createElement("span",{className:"-esm-stock-management__edit-stock-operation-button__operationNumberText___sw6oi"},p?.operationNumber?.split("-").map((e,t,a)=>s().createElement(s().Fragment,{key:t},e,t<a.length-1&&s().createElement(s().Fragment,null,"-",s().createElement("wbr",null))))))};var eE=a(1673),ey=a(3466);let ef=()=>{let{t:e}=(0,i.useTranslation)(),{error:t,isLoading:a,operationTypes:o}=ek(),l=(0,r.useCallback)(e=>{e.operationType,ey.S5.STOCK_ISSUE_OPERATION_TYPE,(0,eg.AE)(e,void 0)},[]);return((0,r.useEffect)(()=>{t&&(0,n.showSnackbar)({kind:"error",title:e("stockOperationTypesError","Error loading stock operation types"),subtitle:t?.message})},[t,e]),a)?s().createElement(d.ButtonSkeleton,null):t?null:o&&o.length?s().createElement(d.OverflowMenu,{"aria-label":e("startNew","Start New"),iconDescription:e("startNew","Start New"),renderIcon:()=>s().createElement(s().Fragment,null,e("startNew","Start New"),"\xa0\xa0",s().createElement(eE.CH,{size:16})),menuOffset:{top:0,left:-100},style:{backgroundColor:"#007d79",backgroundImage:"none",color:"#fff",minHeight:"1rem",padding:".95rem !important",width:"auto",paddingInline:"1rem",marginRight:"0.5rem",whiteSpace:"nowrap"}},o.sort((e,t)=>e.name.localeCompare(t.name)).map(e=>s().createElement(d.OverflowMenuItem,{key:e.uuid,itemText:e.name,onClick:()=>{l(e)}}))):null};var eT=a(9684);let ev=({conceptUuid:e,onFilterChange:t,filterName:a})=>{let{t:n}=(0,i.useTranslation)(),{items:o,isLoading:l}=(0,eb.cj)(e),[c,m]=(0,r.useState)(!1),[u,p]=(0,r.useState)([]);if((0,r.useEffect)(()=>{switch(m(!0),a){case ep.m0.STATUS:p(eT.By.map(e=>({uuid:e,display:e})));break;case ep.m0.SOURCES:o?.answers?.length&&(p([...o.answers]),m(l));break;case ep.m0.OPERATION:(0,eb.bh)().then(e=>{m(!0),e.data?.results.length&&p(e.data.results.map(e=>({uuid:e.uuid,display:e.name}))),m(!1)})}m(!1)},[a,l,o.answers]),c)return s().createElement(d.DropdownSkeleton,null);let _=a===ep.m0.SOURCES?n("sources","Sources"):a===ep.m0.STATUS?n("status","Status"):a===ep.m0.OPERATION?n("operationFilter","Operation"):a;return s().createElement(d.MultiSelect,{translateWithId:(0,L.D1)(n),autoAlign:!0,className:es.A.filtersAlign,disabled:!u.length,id:"multiSelect",label:_,labelInline:!0,items:u,itemToString:e=>e?a===ep.m0.STATUS?(0,L.e_)(n,e.display):e.display:n("notSet","Not Set"),onChange:({selectedItems:e})=>{e&&t(e.map(e=>e.uuid),a)},placeholder:n("filterBy","Filter by {{filterName}}",{filterName:_})})};var eN=a(9184);let eS=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Approve",operation:e,requireReason:!1,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,renderIcon:e=>s().createElement(eN.cR,{size:16,...e})},t("approve","Approve"))},eC=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Dispatch",operation:e,requireReason:!1,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,renderIcon:e=>s().createElement(R.jw,{size:16,...e})},t("dispatch","Dispatch"))},ew=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Cancel",operation:e,requireReason:!0,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,kind:"danger--ghost",renderIcon:e=>s().createElement(J.$D,{size:16,...e})},t("cancel","Cancel "))},eD=({operation:e,reason:t})=>{let{t:a}=(0,i.useTranslation)(),o=(0,r.useCallback)(()=>{let a=(0,n.showModal)("stock-operations-modal",{title:"Complete Dispatch",operation:e,requireReason:t,closeModal:()=>a()})},[e,t]);return s().createElement(d.Button,{onClick:o,renderIcon:e=>s().createElement(ec.cD,{size:16,...e})},a("completeDispatch","Complete dispatch"))},eI=({operation:e})=>{let{t}=(0,i.useTranslation)(),{error:a,isLoading:o,types:l}=(0,eb.G2)(),c=(0,r.useMemo)(()=>l?.results?.find(e=>e.operationType===ey.S5.STOCK_ISSUE_OPERATION_TYPE),[l]);return((0,r.useEffect)(()=>{a&&(0,n.showSnackbar)({kind:"error",title:t("stockOperationTypesError","Error loading stock operation types"),subtitle:a?.message})},[a,t]),o)?s().createElement(d.InlineLoading,{description:"",iconDescription:t("loadingOperationTypes","Loading operation types")}):s().createElement(d.Button,{onClick:()=>{(0,eg.AE)(c,void 0,e.uuid)},kind:"tertiary",renderIcon:e=>s().createElement(R.U$,{size:16,...e})},t("issueStock","Issue Stock "))},ex=`
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
`,eA=async()=>{let e=await (0,n.getConfig)("@openmrs/esm-stock-management-app"),t=e?.logo?.src;return new Promise((e,a)=>{if(!t)return void e(null);let n=document.getElementById("hdnTxtPrintLogo");if(n&&n.value?.length>0){let t=n.getAttribute("isSvg");e({image:n.value,isSvg:"1"===t});return}if(t.toLowerCase().endsWith(".svg"))fetch(t,{headers:{"Disable-WWW-Authenticate":"true"}}).then(e=>{if(!e.ok)throw Error("Print logo fetch network response was not OK");return e.text()}).then(t=>{n&&(n.value=t,n.setAttribute("isSvg","1")),e({image:t,isSvg:!0})}).catch(e=>{console.error("Error fetching print logo: ",e),a("Error fetching print logo")});else{let o=new Image;o.addEventListener("load",()=>{try{let t=document.createElement("canvas");t.width=o.width,t.height=o.height;let r=t.getContext("2d");if(r){r.drawImage(o,0,0);let a=t.toDataURL("image/png");n&&(n.value=a,n.setAttribute("isSvg","0")),e({image:a,isSvg:!1})}else a("Failed to allocate canvas context for print logo")}catch(e){a(e)}}),o.addEventListener("error",e=>{a(e)}),o.src=t}})},eU=(e,t,a=!1,n=!0)=>`<html>
<head>
<meta http-equiv=Content-Type content="text/html; charset=utf8">
<title>${t??""}</title>
<style>
${ex}
</style>
</head>
<body onload="${a?"window.print()":""}" style='word-wrap:break-word' ${n?'onafterprint="self.close()"':""}>
    ${e}
</body>
</html>`,eR=async()=>{let e=await (0,n.getConfig)("@openmrs/esm-stock-management-app"),t=e?.logo?.name,a=null;if(ep.Qg)try{a=await eA()}catch(e){console.error(e)}return a||t?`
<div class="logo" >
    ${a?a.isSvg?a.image:`<img alt='' src='${a.image}' />`:""}
    ${t?`<span class='logo-text text'>${t}</span>`:""}
</div>    
    `:""},e$=async()=>{let e=await eR();return`
<div class="logo-row right">
${e}
</div>    
    `},eO=e=>{setTimeout(()=>{let t;(t=window.open("","Print-Window"))&&(t.document.open(),t.document.write(e),t.document.close())},300)},eL=async e=>{let t=Math.max(0,25-(e?.items?.length??0)),a=await e$();return`
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
    `},eM=async e=>{eO(eU(await eL(e),e?.documentTitle,!0,ep.iD))},eB=async e=>{let t=Math.max(0,28-(e?.items?.length??0)),a=await e$();return`
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
    `},eF=async e=>{eO(eU(await eB(e),e?.documentTitle,!0,ep.iD))},eP=async(e,t,a,n,o)=>{let r={};return ey.S5.REQUISITION_OPERATION_TYPE!==e.operationType&&(r.authorizedBy=e?.dispatchedDate?`${e.dispatchedByFamilyName??""} ${e.dispatchedByGivenName??""}`:e?.completedDate?`${e.completedByFamilyName??""} ${e.completedByGivenName??""}`:""),r.remarks=e.remarks,r.operationNumber=e?.operationNumber,r.operationDate=a?.operationDate??e?.operationDate,r.location=a?.atLocationName??e?.atLocationName,r.source=e?.sourceName,r.destination=e?.destinationName,r.responsiblePerson=r.orderedBy=a?.responsiblePersonFamilyName?`${a.responsiblePersonFamilyName??""} ${a?.responsiblePersonGivenName??""}`:`${e.responsiblePersonFamilyName??""} ${e.responsiblePersonGivenName??""}`,r.organizationName=ep.xM,r.documentTitle=`${e.operationTypeName} ${e?.operationNumber}${a?` of ${a.operationTypeName} ${a?.operationNumber}`:""}`,r.items=t.map(t=>{let r={};if(r.itemCode=t?.acronym,r.itemDescription=(0,O.U)(t?.stockItemName),r.purchasePrice=t?.purchasePrice,r.batchNumber=t?.batchNo,r.expiryDate=t?.expiration,a?(r.quantityRequired=t?.quantityRequested,r.quantityRequiredUoM=t?.quantityRequestedPackagingUOMName,r.quantityIssued=t?.quantity,r.quantityIssuedUoM=t?.stockItemPackagingUOMName):ey.S5.STOCK_ISSUE_OPERATION_TYPE===e.operationType?(r.quantityIssued=t?.quantity,r.quantityIssuedUoM=t?.stockItemPackagingUOMName):(r.quantityRequired=t?.quantity,r.quantityRequiredUoM=t?.stockItemPackagingUOMName),n){let e=n.find(e=>e.uuid===t.uuid);e&&(r.unitCost=e.unitCost,r.unitCostUoM=e.unitCostUOMName,r.totalCost=e.totalCost)}if(o){let e=o.find(e=>e.stockItemUuid===t.stockItemUuid);e&&(r.balanceOnHand=e.quantity,r.balanceOnHandUoM=e.quantityUoM)}return r}),r},ez=async e=>{let t=Math.max(0,25-(e?.items?.length??0)),a=await e$();return`
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
    `},ej=async e=>{eO(eU(await ez(e),e?.documentTitle,!0,ep.iD))},eq=({operation:e})=>{let{t}=(0,i.useTranslation)(),{isLoading:a,items:o,error:l}=(0,$.Eb)(e.uuid),[c,m]=(0,r.useState)(!1),p=async()=>{m(!0);try{let t,a=null,n=null;if(o.requisitionStockOperationUuid&&!(t=(await (0,$.Wu)(o.requisitionStockOperationUuid)).data))return;if((t||t?.operationType==="stockissue"||t?.operationType==="transferout")&&1){let e={};o?.uuid&&(e.stockOperationUuid=o.uuid);let t=await (0,$.jp)(e);a=t.data?.results}if(t||t?.operationType==="requisition"){let e={};o?.uuid,e.locationUuid=o.atLocationUuid,e.stockOperationUuid=o.uuid,e.v=f.G.Default,e.groupBy="LocationStockItem",e.includeStockItemName="true",e.date=t?.dateCreated?new Date(t.dateCreated).toISOString():o?.dateCreated?new Date(o.dateCreated).toISOString():null;let a=await (0,$._o)(e);n=a.data?.results}let r=await eP(o,o.stockOperationItems??e?.stockOperationItems??[],t,a,n);r?o?.operationType===ey.S5.RECEIPT_OPERATION_TYPE?await eM(r):o?.operationType===ey.S5.TRANSFER_OUT_OPERATION_TYPE?await ej(r):await eF(r):console.warn(r)}catch(e){console.error(e),(0,n.showSnackbar)({kind:"error",title:t("errorPrintingStockOperation","Error printing stock operation"),subtitle:(0,ep.je)(e).join(", ")})}finally{m(!1)}};return s().createElement(d.Button,{onClick:p,kind:"tertiary",disabled:a||c,renderIcon:e=>s().createElement(u.xj,{size:16,...e})},c||a?s().createElement(d.InlineLoading,{description:t("loadingPlaceholder","Loading..."),iconDescription:t("loading","Loading")}):t("print","Print"))},eH=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Reject",operation:e,requireReason:!0,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,renderIcon:e=>s().createElement(eN.XE,{size:16,...e})},t("reject","Reject"))},eZ=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Return",operation:e,requireReason:!0,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,kind:"tertiary",renderIcon:e=>s().createElement(u.kM,{size:16,...e})},t("return","Return "))};var eG=a(4094);let eY={tileContainer:"-esm-stock-management__stock-operations-table__tileContainer___Hf3bi",tile:"-esm-stock-management__stock-operations-table__tile___Rltv3",tileContent:"-esm-stock-management__stock-operations-table__tileContent___PKYUb",content:"-esm-stock-management__stock-operations-table__content___5YHki",helper:"-esm-stock-management__stock-operations-table__helper___hMVu7",toolbarContent:"-esm-stock-management__stock-operations-table__toolbarContent___ioLvK",stockTableContainer:"-esm-stock-management__stock-operations-table__stockTableContainer___tfcUj",container:"-esm-stock-management__stock-operations-table__container___lqN-P",filterContainer:"-esm-stock-management__stock-operations-table__filterContainer___dgDtc",rowLoadingContainer:"-esm-stock-management__stock-operations-table__rowLoadingContainer___2mLNR",statusContainer:"-esm-stock-management__stock-operations-table__statusContainer___ZOYeD",textHeading:"-esm-stock-management__stock-operations-table__textHeading___xKm0I",statusDescriptions:"-esm-stock-management__stock-operations-table__statusDescriptions___ofld0",text:"-esm-stock-management__stock-operations-table__text___yjDAz",actionBtns:"-esm-stock-management__stock-operations-table__actionBtns___lkAho",relatedLink:"-esm-stock-management__stock-operations-table__relatedLink___ZKj5j",relatedTransactionHeader:"-esm-stock-management__stock-operations-table__relatedTransactionHeader___siCKr",toolbarMenuAction:"-esm-stock-management__stock-operations-table__toolbarMenuAction___7cJiz",dataTableSkeleton:"-esm-stock-management__stock-operations-table__dataTableSkeleton___WNbMf",datePicker:"-esm-stock-management__stock-operations-table__datePicker___xyvJu",arrowIcon:"-esm-stock-management__stock-operations-table__arrowIcon___nKYBV",tableHeader:"-esm-stock-management__stock-operations-table__tableHeader___9b8Dj",itemNamesCell:"-esm-stock-management__stock-operations-table__itemNamesCell___q0g50",paginationOverride:"-esm-stock-management__stock-operations-table__paginationOverride___TtLXN"},eW=({stockOperation:e,stockOperationType:t})=>{let a=(0,eG.A)(t),n=(0,r.useMemo)(()=>(0,ey.lj)(t.operationType),[t]);return s().createElement(s().Fragment,null,(!e.permission?.canEdit&&(e.permission?.canApprove||e.permission?.canReceiveItems)||e.permission?.canEdit||(0,ey.LD)(n)||(e?.permission?.isRequisitionAndCanIssueStock??!1)||e.permission?.isRequisitionAndCanIssueStock)&&s().createElement("div",{className:eY.actionBtns},s().createElement(s().Fragment,null,!e.permission?.canEdit&&e.permission?.canApprove&&s().createElement(s().Fragment,null,!a.requiresDispatchAcknowledgement&&s().createElement(eS,{operation:e}),a.requiresDispatchAcknowledgement&&s().createElement(eC,{operation:e}),s().createElement(eH,{operation:e}),s().createElement(eZ,{operation:e}),s().createElement(ew,{operation:e})),!e.permission?.canEdit&&e.permission?.canReceiveItems&&s().createElement(s().Fragment,null,s().createElement(eD,{operation:e,reason:!1}),s().createElement(eZ,{operation:e})),e.permission?.canEdit&&s().createElement(ew,{operation:e}),e.permission?.isRequisitionAndCanIssueStock&&s().createElement(eI,{operation:e}),(e.permission?.isRequisitionAndCanIssueStock||e.operationType===ey.S5.STOCK_ISSUE_OPERATION_TYPE||e.operationType===ey.S5.REQUISITION_OPERATION_TYPE||e.operationType===ey.S5.RECEIPT_OPERATION_TYPE||e.operationType===ey.S5.TRANSFER_OUT_OPERATION_TYPE)&&s().createElement(eq,{operation:e}))))},eV=({stockOperationUuid:e,operationNumber:t})=>{let{error:a,isLoading:n,types:o}=(0,eb.G2)(),{error:l,isLoading:i,items:c}=(0,$.Eb)(e),m=(0,r.useCallback)(()=>{let e=o?.results?.find(e=>e?.uuid===c?.operationTypeUuid);e&&(0,eg.AE)(e,c,c?.requisitionStockOperationUuid)},[o,c]);return n||a||l||i?null:s().createElement("span",{onClick:m,style:{cursor:"pointer",textDecoration:"underline"}},t)},eQ=({stockOperation:e,stockOperationType:t})=>{let{error:a,isLoading:o,operationLinks:l}=(e=>{let t=`${n.restBaseUrl}/stockmanagement/stockoperationlink?v=default&q=${e}`,{data:a,error:o,isLoading:r,mutate:s}=q()(e?t:null,n.openmrsFetch);return{error:o,isLoading:r,mutate:s,operationLinks:a?.data?.results??[]}})((0,r.useMemo)(()=>t?.operationType===ey.S5.REQUISITION_OPERATION_TYPE||e?.operationType===ey.S5.REQUISITION_OPERATION_TYPE||t?.operationType===ey.S5.STOCK_ISSUE_OPERATION_TYPE||e?.operationType===ey.S5.STOCK_ISSUE_OPERATION_TYPE?e.uuid:null,[t,e]));return o||a?null:s().createElement("div",null," ",l&&l.length>0&&s().createElement("div",null,s().createElement("h6",{className:eY.relatedTransactionHeader},"Related Transactions:"),l.map(a=>(e.uuid===a?.parentUuid||t?.uuid===a?.parentUuid)&&s().createElement(s().Fragment,{key:a.uuid},s().createElement("span",null,a?.childOperationTypeName),s().createElement("span",{className:a?.childVoided?"voided":""}," ",a?.childVoided&&a?.childOperationNumber,!a?.childVoided&&s().createElement("span",{className:eY.relatedLink},s().createElement(eV,{stockOperationUuid:a?.childUuid,operationNumber:a?.childOperationNumber})))," ",s().createElement("span",null,"[",a?.childStatus,"]"))),s().createElement("span",null," "),l.map(a=>(e.uuid===a?.childUuid||t.uuid===a?.childUuid)&&s().createElement(s().Fragment,{key:a.uuid},s().createElement("span",null,a?.parentOperationTypeName),s().createElement("span",{className:a?.parentVoided?"voided":""}," ",a?.parentVoided&&a?.parentOperationNumber,!a?.parentVoided&&s().createElement("span",{className:eY.relatedLink},s().createElement(eV,{stockOperationUuid:a?.parentUuid,operationNumber:a?.parentOperationNumber})))," ",s().createElement("span",null,"[",a?.parentStatus,"]")))))},eK=({items:e})=>{let{t}=(0,i.useTranslation)(),[a,o]=(0,r.useState)(10),l=(0,r.useMemo)(()=>[5,10,20,50,100],[]),[c,m]=(0,r.useState)(""),u=e.filter(e=>{let t=c.trim().toLowerCase();return!t||(e.commonName??"").toLowerCase().includes(t)}),{results:p,totalPages:_,currentPage:g,goTo:b}=(0,n.usePagination)(u,a),k=(0,r.useMemo)(()=>[{header:t("item","Item"),key:"commonName"},{header:t("batchNo","Batch number"),key:"batchNo"},{header:t("expiry","Expiry"),key:"expiration"},{header:t("quantity","Quantity"),key:"quantity"},{header:t("uom","Unit of Measurement"),key:"stockItemPackagingUOMName"}],[t]),h=(0,r.useMemo)(()=>p.map((e,t)=>({id:t,...e,expiration:e.expiration?(0,e_.ZM)(e.expiration):"--"})),[p]);return s().createElement(d.Tile,{className:"-esm-stock-management__stock-items-table__container___EJrwZ"},s().createElement("span",{className:"-esm-stock-management__stock-items-table__title___yPzNC"},t("stockItems","Stock items")),s().createElement(d.Search,{closeButtonLabelText:t("clearSearch","Clear search input"),labelText:t("search","Search"),placeholder:t("search","Search"),value:c,onChange:({target:{value:e}})=>m(e)}),s().createElement(d.DataTable,{useZebraStyles:!0,rows:h,headers:k},({rows:e,headers:t,getTableProps:a,getHeaderProps:n,getRowProps:o})=>s().createElement(d.Table,a(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,t.map(e=>s().createElement(d.TableHeader,n({header:e}),e.header)))),s().createElement(d.TableBody,null,e.map(e=>s().createElement(d.TableRow,o({row:e}),e.cells.map(e=>s().createElement(d.TableCell,{key:e.id},e.value))))))),s().createElement(d.Pagination,{...(0,L.LI)(t),page:g,pageSize:a,pageSizes:l,totalItems:u.length,onChange:({page:e,pageSize:t})=>{b(e),o(t)}}))},eJ="-esm-stock-management__stock-operation-expanded-row__text___57AWf",eX="-esm-stock-management__stock-operation-expanded-row__statusContainerRow___NCj+K",e0=({status:e,statusFillerFamilyName:t,statusFillerGivenName:a,statusFilledDate:o,extraStatusinfo:r})=>{let{t:l}=(0,i.useTranslation)();return s().createElement("div",null,s().createElement("span",{className:"-esm-stock-management__stock-operation-expanded-row__textHeading___jsti5"},e,":"),s().createElement("div",{className:"-esm-stock-management__stock-operation-expanded-row__statusDescriptions___Zk1Ht"},s().createElement("span",{className:eJ},(0,n.formatDate)((0,n.parseDate)(o),{time:!0,mode:"standard"}))," ",s().createElement("span",{className:eJ},l("by","By"))," ",s().createElement("span",{className:eJ},[t,a].filter(Boolean).join(" ")),r))},e1=e=>{let{t}=(0,i.useTranslation)(),{types:a,isLoading:n,error:o}=(0,eb.G2)(),l=(0,r.useMemo)(()=>a?.results?.find(({uuid:t})=>e.model?.operationTypeUuid===t),[e.model?.operationTypeUuid,a?.results]);return e.model?s().createElement(s().Fragment,null,s().createElement(d.Layer,{className:"-esm-stock-management__stock-operation-expanded-row__statusContainer___e8ZHc"},s().createElement(d.Row,{className:eX},e.model?.dateCreated&&s().createElement(e0,{status:t("started","Started"),statusFilledDate:e.model?.dateCreated.toString(),statusFillerFamilyName:e.model?.creatorFamilyName,statusFillerGivenName:e.model?.creatorGivenName}),e.model.submittedDate&&s().createElement(e0,{status:t("submitted","Submitted"),statusFilledDate:e.model?.submittedDate.toString(),statusFillerFamilyName:e.model?.submittedByFamilyName,statusFillerGivenName:e.model?.submittedByGivenName}),e.model?.dispatchedDate&&s().createElement(e0,{status:t("dispatched","Dispatched"),statusFilledDate:e.model?.dispatchedDate.toString(),statusFillerFamilyName:e.model?.dispatchedByFamilyName,statusFillerGivenName:e.model?.dispatchedByGivenName}),e.model?.returnedDate&&s().createElement(e0,{status:t("returned","Returned"),statusFilledDate:e.model?.returnedDate.toString(),statusFillerFamilyName:e.model?.returnedByFamilyName,statusFillerGivenName:e.model?.returnedByGivenName,extraStatusinfo:s().createElement("span",{className:eJ},e.model?.returnReason)}),e.model?.completedDate&&s().createElement(e0,{status:(0,L.qD)(t,e.model),statusFilledDate:e.model?.completedDate.toString(),statusFillerFamilyName:e.model?.completedByFamilyName,statusFillerGivenName:e.model?.completedByGivenName}),e.model?.status==="CANCELLED"&&s().createElement(e0,{status:t("cancelled","Cancelled"),statusFilledDate:e.model?.cancelledDate.toString(),statusFillerFamilyName:e.model?.cancelledByFamilyName,statusFillerGivenName:e.model?.cancelledByGivenName,extraStatusinfo:s().createElement("span",{className:eJ},e.model?.cancelReason)}),e.model?.status==="REJECTED"&&s().createElement(e0,{status:t("rejected","Rejected"),statusFilledDate:e.model?.rejectedDate.toString(),statusFillerFamilyName:e.model?.rejectedByFamilyName,statusFillerGivenName:e.model?.rejectedByGivenName,extraStatusinfo:s().createElement("span",null,e.model?.rejectionReason)})),s().createElement(d.Row,{className:eX},n&&s().createElement(d.InlineLoading,{description:t("loadingStockOperationLinks","Loading stock operation links..."),iconDescription:t("loadingStockOperationLinksIcon","Loading stock operation links")}),l&&s().createElement(eQ,{stockOperationType:l,stockOperation:e.model})),s().createElement(d.Row,{className:eX},s().createElement(eK,{items:e.model.stockOperationItems})),s().createElement(d.Row,{className:eX},n&&s().createElement(d.InlineLoading,{description:t("loadingOperationActions","Loading stock operation actions..."),iconDescription:t("loadingOperationActionsIcon","Loading stock operation actions")}),l&&s().createElement(eW,{stockOperationType:l,stockOperation:e.model})))):null},e5=()=>{let{t:e,i18n:t}=(0,i.useTranslation)(),a=(0,X.K)(),o=()=>{a(`${n.restBaseUrl}/stockmanagement/stockoperation`)},[l,c]=(0,r.useState)(null),[m,u]=(0,r.useState)(null),[p,_]=(0,r.useState)([]),[g,b]=(0,r.useState)([]),[k,h]=(0,r.useState)([]),[E,y]=(0,r.useState)(""),[T,v]=(0,r.useState)(""),[N,S]=(0,r.useState)([]),C=(0,r.useCallback)(()=>S([]),[]),w=(0,r.useCallback)(e=>S(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]),[]),D=(0,et.d)(e=>{C(),v(e.trim())},300),I=e=>{let t="string"==typeof e?e:e?.target?.value??"";y(t),D(t)},{items:x,tableHeaders:A,currentPage:U,pageSizes:R,totalItems:O,goTo:M,currentPageSize:B,setPageSize:F,isLoading:P}=function(e){let[t,a]=(0,r.useState)(10),n=`${JSON.stringify(e)}|${t}`,[o,s]=(0,r.useState)({filterKey:n,page:1});o.filterKey!==n&&s({filterKey:n,page:1});let l=o.filterKey===n?o.page:1,c=(0,r.useCallback)(e=>s({filterKey:n,page:e}),[n]),{items:m,isLoading:d,error:u}=(0,$.kR)({...e,totalCount:!0,startIndex:l-1,limit:t}),p=(0,r.useMemo)(()=>m?.results??[],[m]),{t:_}=(0,i.useTranslation)(),g=(0,r.useMemo)(()=>[{id:0,header:_("type","Type"),key:"operationTypeName"},{id:1,header:_("number","Number"),key:"operationNumber"},{id:2,header:_("stockOperationItemsTableHeader","Items"),key:"stockOperationItems"},{id:3,header:_("status","Status"),key:"status"},{id:4,header:_("location","Location"),key:"location"},{id:5,header:_("responsiblePerson","Responsible Person"),key:"responsiblePerson"},{id:6,header:_("date","Date"),key:"operationDate"},{id:7,key:"actions",header:"",isSortable:!1}],[_]);return{items:p,totalItems:m?.totalCount,currentPage:l,currentPageSize:t,paginatedItems:p,goTo:c,pageSizes:[10,20,30,40,50],isLoading:d,error:u,setPageSize:a,tableHeaders:g}}({v:f.G.Full,totalCount:!0,q:T||void 0,operationDateMin:l?.toISOString(),operationDateMax:m?.toISOString(),status:g.join(","),sourceTypeUuid:p.join(","),operationTypeUuid:k.join(",")}),z=T||l||m||p.length||g.length||k.length,j=(0,r.useCallback)((e,t)=>{C(),t===ep.m0.SOURCES?_(e):t===ep.m0.OPERATION?h(e):b(e)},[C]),q=(0,r.useMemo)(()=>x?.map((t,a)=>{let n=(t?.stockOperationItems?.length??0)>1,o=t?.stockOperationItems?.slice(0,n?1:void 0).map(e=>e.commonName).join(", ")??"";return{...t,id:t?.uuid,key:`key-${t?.uuid}`,operationTypeName:`${t?.operationTypeName}`,operationNumber:s().createElement(eh,{stockOperation:t,showIcon:!1,showprops:!0}),stockOperationItems:{commonNames:o,more:n?t?.stockOperationItems?.length-1:0},status:(0,L.e_)(e,t?.status),source:`${t?.sourceName??""}`,destination:`${t?.destinationName??""}`,location:s().createElement(s().Fragment,null,t?.sourceName??"",t?.sourceName&&t?.destinationName?s().createElement(ec.Qp,{className:eY.arrowIcon,key:`${a}-0`,size:12}):""," ",t?.destinationName??""),responsiblePerson:`${t?.responsiblePersonFamilyName??t?.responsiblePersonOther??""} ${t?.responsiblePersonGivenName??""}`,operationDate:(0,e_.a9)(t?.operationDate),actions:s().createElement(eh,{stockOperation:t,showIcon:!0,showprops:!1})}}),[x,e]);return P&&!z?s().createElement(d.DataTableSkeleton,{className:eY.dataTableSkeleton,showHeader:!1,rowCount:5,columnCount:5,zebra:!0}):s().createElement(s().Fragment,null,s().createElement("h2",{className:eY.tableHeader},e("stockOperationsTableHeader","Stock operations to track movement of stock.")),s().createElement(d.DataTable,{headers:A,isSortable:!0,rows:q,useZebraStyles:!0,translateWithId:(0,L.IQ)(e)},({getExpandedRowProps:a,getHeaderProps:r,getRowProps:i,getTableProps:p,headers:_,rows:g})=>s().createElement(d.TableContainer,{className:eY.stockTableContainer},s().createElement(d.TableToolbar,{"aria-label":e("dataTableToolbar","Data table toolbar"),style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableToolbarContent,{className:eY.toolbarContent},s().createElement(d.TableToolbarSearch,{expanded:!0,closeButtonLabelText:e("clearSearch","Clear search input"),labelText:e("searchStockOperationsByNumber","Search by operation number or location"),onChange:I,placeholder:e("searchStockOperationsByNumber","Search by operation number or location"),value:E}),s().createElement("div",{className:eY.container},s().createElement(d.DatePicker,{className:eY.datePicker,datePickerType:"range",dateFormat:ep.Mz,locale:(0,L.ft)(t.language),...(0,L.Wo)(e),onChange:([e,t])=>(([e,t])=>{C(),e&&(c(e),m&&e&&m<e&&u(e)),t&&(u(t),l&&t&&l>t&&c(t))})([e,t]),value:[l,m]},s().createElement(d.DatePickerInput,{id:"stock-operations-start-date",labelText:e("startDate","Start date"),placeholder:ep.YI}),s().createElement(d.DatePickerInput,{id:"stock-operations-end-date",labelText:e("endDate","End date"),placeholder:ep.YI})),s().createElement(ev,{filterName:ep.m0.SOURCES,onFilterChange:j}),s().createElement(ev,{filterName:ep.m0.STATUS,onFilterChange:j}),s().createElement(ev,{filterName:ep.m0.OPERATION,onFilterChange:j})),s().createElement(d.TableToolbarMenu,{iconDescription:e("settings","Settings")},s().createElement(d.TableToolbarAction,{className:eY.toolbarMenuAction,onClick:o},e("refresh","Refresh"))),s().createElement(ef,null))),s().createElement(d.Table,p(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,s().createElement(d.TableExpandHeader,null),_.map(t=>"details"!==t.key&&s().createElement(d.TableHeader,{...r({header:t,isSortable:t.isSortable}),className:n.isDesktop?eY.desktopHeader:eY.tabletHeader,key:`${t.key}`,translateWithId:(0,L.L9)(e)},t.header?.content??t.header)))),s().createElement(d.TableBody,null,g?.map(t=>{let o=x?.find(e=>e?.uuid===t.id),r=!!o&&N.includes(t.id),l={...i({row:t}),isExpanded:r,onExpand:()=>w(t.id),"aria-label":r?e("collapseCurrentRow","Collapse current row"):e("expandCurrentRow","Expand current row")};return s().createElement(s().Fragment,{key:t.id},s().createElement(d.TableExpandRow,{className:n.isDesktop?eY.desktopRow:eY.tabletRow,...l},t.cells.map(a=>s().createElement(d.TableCell,{key:a.id,className:a?.info?.header==="stockOperationItems"?eY.itemNamesCell:void 0},a?.info?.header==="stockOperationItems"?s().createElement("span",null,s().createElement("span",null,a.value.commonNames),a.value.more>0&&s().createElement(d.Link,{onClick:()=>w(t.id)},e("moreItems","...({{count}} more)",{count:a.value.more}))):a.value))),r?s().createElement(d.TableExpandedRow,{...a({row:t}),colSpan:_.length+1},s().createElement(e1,{model:o})):s().createElement(d.TableExpandedRow,{className:eY.hiddenRow,colSpan:_.length+1}))}))),0!==g.length||P?null:s().createElement("div",{className:eY.tileContainer},s().createElement(d.Tile,{className:eY.tile},s().createElement("div",{className:eY.tileContent},s().createElement("p",{className:eY.content},e("noOperationsToDisplay","No stock operations to display")),s().createElement("p",{className:eY.helper},e("checkFilters","Check the filters above"))))),!!(z&&P)&&s().createElement("div",{className:eY.rowLoadingContainer},s().createElement(d.InlineLoading,{description:e("loadingPlaceholder","Loading...")})))),x.length>0&&s().createElement(d.Pagination,{...(0,L.LI)(e),page:U,pageSize:B,pageSizes:R,totalItems:O,onChange:({pageSize:e,page:t})=>{e!==B&&F(e),t!==U&&M(t)},className:eY.paginationOverride}))};var e4=a(4535),e7=a(1362),e2=a(1397),e6=a(1651);let e3="Pending",e9="Completed",e8="Cancelled",te=(e,t=[])=>{if(!e)return null;let a={};return e.split(/\r?\n|\r/).forEach(e=>{if(e.startsWith("#")||t&&t.some(t=>e.startsWith(t)))return;let n=e.split("=",2);if(2===n.length)if(n[0].startsWith("param.")){let e=n[0].substring(6),t=e.lastIndexOf(".value.desc");if(t>0&&(e=e.substring(0,t)+".display"),e){let t=e.split("."),o=t.length>1?t.slice(0,t.length-1).join("."):t[0],r=t.length>1?t[t.length-1]:"value";a[o]||(a[o]={}),a[o][r]=n[1]}}else{let e=n[0].split(".",2),t=e[0],o=e.length>1?e[1]:"value";a[t]||(a[t]={}),a[t][o]=n[1]}}),a},tt=({title:e,description:t})=>{let{t:a}=(0,i.useTranslation)();return s().createElement("div",{className:"-esm-stock-management__privileged-view__tileContainer___Yl4Vp"},s().createElement(d.Tile,{className:"-esm-stock-management__privileged-view__tile___IYz7X"},s().createElement("div",{className:"-esm-stock-management__privileged-view__tileContent___Gc2Rz"},s().createElement(R._N,{size:"24"}),s().createElement("p",{className:"-esm-stock-management__privileged-view__content___yTq+x"},a("noPrivilegesTitle",`${e}`)),t&&s().createElement("p",{className:"-esm-stock-management__privileged-view__helper___TmynX"},a("noViewPrivilegesDescription","Description: {{description}}",{description:t})))))},ta=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-reports-form-workspace")},[]);return s().createElement(d.Button,{onClick:t,size:"md",kind:"primary"},e("newReport","New Report"))},tn={container:"-esm-stock-management__stock-reports__container___ZKAc9",content:"-esm-stock-management__stock-reports__content___EyyhY",helper:"-esm-stock-management__stock-reports__helper___ZF3Ny",separator:"-esm-stock-management__stock-reports__separator___OJG7M",tileContainer:"-esm-stock-management__stock-reports__tileContainer___EQcu0",tile:"-esm-stock-management__stock-reports__tile___lwOqT",tileContent:"-esm-stock-management__stock-reports__tileContent___NirI4",statusContainer:"-esm-stock-management__stock-reports__statusContainer___-ixXF",reportStatus:"-esm-stock-management__stock-reports__reportStatus___x2TYB",textHeading:"-esm-stock-management__stock-reports__textHeading___RgSrr",statusDescriptions:"-esm-stock-management__stock-reports__statusDescriptions___+7DLu",text:"-esm-stock-management__stock-reports__text___SXJQp",toolbarMenuAction:"-esm-stock-management__stock-reports__toolbarMenuAction___gIZtH",tableHeader:"-esm-stock-management__stock-reports__tableHeader___YQ8V+"},to=e=>{let t,{t:a}=(0,i.useTranslation)();try{t=((e,t)=>{if(!t)return null;let a=Object.keys(t);return 0===a.length?null:a.map((a,n)=>{let o=t[a].description??a,r=t[a].display??t[a].value;return s().createElement("div",{key:`${e}-param-${n}`},o,": ",r)})})(e.model?.uuid,te(e.model?.executionState))}catch(e){console.error(e)}return s().createElement("div",{className:tn.statusContainer},e.model?.status===e8&&s().createElement("div",null,s().createElement("span",{className:tn.textHeading},a("cancelled","Cancelled"),":"),s().createElement("div",{className:tn.statusDescriptions},s().createElement("span",{className:tn.text},(0,n.formatDate)((0,n.parseDate)(e.model?.cancelledDate.toString()),{time:!0,mode:"standard"}),s().createElement("p",null,e.model?.cancelReason)))),e.model?.startTime&&s().createElement("div",null,s().createElement("span",{className:tn.textHeading},a("started","Started"),":"),s().createElement("div",{className:tn.statusDescriptions},s().createElement("span",{className:tn.text},(0,n.formatDate)((0,n.parseDate)(e.model?.startTime.toString()),{time:!0,mode:"standard"})))),e.model?.endTime&&s().createElement("div",null,s().createElement("span",{className:tn.textHeading},a("ended","Ended"),":"),s().createElement("div",{className:tn.statusDescriptions},s().createElement("span",{className:tn.text},(0,n.formatDate)((0,n.parseDate)(e.model?.endTime.toString()),{time:!0,mode:"standard"})))),e.model?.expiration&&s().createElement("div",null,s().createElement("span",{className:tn.textHeading},a("expires","Expires"),":"),s().createElement("div",{className:tn.statusDescriptions},s().createElement("span",{className:tn.text},(0,e_.ZM)(e.model?.expiration)))),t&&s().createElement("div",null,s().createElement("span",{className:tn.textHeading},a("executionState","Execution State"),":"),s().createElement("div",{className:tn.statusDescriptions},s().createElement("span",{className:tn.text},t))),e.model?.completedDate&&s().createElement("div",null,s().createElement("span",{className:tn.textHeading},a("completed","Completed"),":"),s().createElement("div",{className:tn.statusDescriptions},s().createElement("span",{className:tn.text},(0,n.formatDate)((0,n.parseDate)(e.model?.completedDate.toString()),{time:!0,mode:"standard"})))),e.model?.exitMessage&&s().createElement("div",null,s().createElement("span",{className:tn.textHeading},a("exitMessage","Message"),":"),s().createElement("div",{className:tn.statusDescriptions},s().createElement("span",{className:tn.text},s().createElement("p",null,e.model?.exitMessage)))))},tr=e=>{let t;try{t=((e,t)=>{if(!t)return null;let a=Object.keys(t);return 0===a.length?null:a.map((a,n)=>{let o=t[a].description??a,r=t[a].display??t[a].value;return s().createElement("div",{key:`${e}-param-${n}`},o,": ",r)})})(e.model?.uuid,te(e.model?.parameters,["param.report"]))}catch(e){console.error(e)}return s().createElement("span",null,t)};var ts=a(5576);let tl=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-sources-form-workspace")},[]);return s().createElement(d.Button,{onClick:t,size:"md",kind:"primary"},e("addNewStockSource","Add new source"))},ti=({data:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-sources-form-workspace",{model:e})},[e]);return s().createElement(d.IconButton,{kind:"ghost",size:"md",onClick:a,label:t("editStockSource","Edit stock source")},s().createElement(J.ff,{size:16}))};var tc=a(8455);let tm=({uuid:e})=>{let{t}=(0,i.useTranslation)(),a=(0,X.K)(),[o,l]=(0,r.useState)(!1),c=s().useCallback(()=>{let o=(0,n.showModal)("delete-stock-modal",{close:()=>o(),uuid:e,onConfirmation:()=>{let r=[];r.push(e),(0,tc.Xh)(r).then(()=>{l(!1),a(`${n.restBaseUrl}/stockmanagement/stocksource`),(0,n.showSnackbar)({isLowContrast:!0,title:t("deletingSource","Delete Source"),kind:"success",subtitle:t("stockSourceDeletedSuccessfully","Stock Source Deleted Successfully")})},e=>{l(!1),(0,n.showSnackbar)({title:t("errorDeletingSource","Error deleting a source"),kind:"error",isLowContrast:!0,subtitle:e?.message})}).catch(),o()}})},[t,e,a]),m=s().createElement(d.Button,{kind:"ghost",size:"md",onClick:c,"aria-label":t("deleteSource","Delete Source")},s().createElement(ts.zH,{size:16}));return o?s().createElement(d.InlineLoading,null):m},td=({onFilterChange:e})=>{let{t}=(0,i.useTranslation)(),{stockSourceTypeUUID:a}=(0,n.useConfig)(),{items:o,isLoading:r,error:l}=(0,eb.cj)(a);return r?s().createElement(d.DropdownSkeleton,{size:"sm"}):(l&&(0,n.showSnackbar)({title:t("errorFetchingStockSourceTypes","Error fetching stock source types"),subtitle:l.message,kind:"error",isLowContrast:!0}),0===Object.keys(o).length)?null:s().createElement("div",{className:"-esm-stock-management__stock-sources-filter__filterContainer___Bb9v0"},s().createElement(d.Dropdown,{translateWithId:(0,L.D1)(t),id:"stockSourcesFilter",initialSelectedItem:o?.answers?.[0],items:[...o?.answers||[]],itemToString:e=>e?e.display:t("notSet","Not Set"),label:"",onChange:({selectedItem:t})=>e(t?.display),size:"sm",titleText:t("selectSourceType","Select source type"),type:"inline"}))},tu={container:"-esm-stock-management__stock-sources__container___oayXM",headerContainer:"-esm-stock-management__stock-sources__headerContainer___8t1IZ",headerButtons:"-esm-stock-management__stock-sources__headerButtons___UOS+X",heading:"-esm-stock-management__stock-sources__heading___edIfR",filterContainer:"-esm-stock-management__stock-sources__filterContainer___vC26j",tooltip:"-esm-stock-management__stock-sources__tooltip___WBWQs",tag:"-esm-stock-management__stock-sources__tag___yDzTi",backgroundDataFetchingIndicator:"-esm-stock-management__stock-sources__backgroundDataFetchingIndicator___g-a2v",search:"-esm-stock-management__stock-sources__search___Bzrt2",tableContainer:"-esm-stock-management__stock-sources__tableContainer___sLSlE",toolbarContent:"-esm-stock-management__stock-sources__toolbarContent___mzMtt",emptyRow:"-esm-stock-management__stock-sources__emptyRow___5NiWZ",stockSourcesTable:"-esm-stock-management__stock-sources__stockSourcesTable___S3SzO",content:"-esm-stock-management__stock-sources__content___SPY43",helper:"-esm-stock-management__stock-sources__helper___u9ge-",separator:"-esm-stock-management__stock-sources__separator___047KC",tileContainer:"-esm-stock-management__stock-sources__tileContainer___xskbH",tile:"-esm-stock-management__stock-sources__tile___Vgj2L",tileContent:"-esm-stock-management__stock-sources__tileContent___pbxoz",menuItem:"-esm-stock-management__stock-sources__menuItem___MUoew",desktopHeading:"-esm-stock-management__stock-sources__desktopHeading___b1pI5",tabletHeading:"-esm-stock-management__stock-sources__tabletHeading___pLZUa",statusContainer:"-esm-stock-management__stock-sources__statusContainer___te34Z",visitType:"-esm-stock-management__stock-sources__visitType___UXsDD",headerBtnContainer:"-esm-stock-management__stock-sources__headerBtnContainer___IhIgF",addPatientToListBtn:"-esm-stock-management__stock-sources__addPatientToListBtn___tCLhZ",editIcon:"-esm-stock-management__stock-sources__editIcon___AUCBC",toolbarMenuAction:"-esm-stock-management__stock-sources__toolbarMenuAction___LMamR",tableHeader:"-esm-stock-management__stock-sources__tableHeader___Z1JQE"},tp=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,X.K)(),[a,o]=s().useState(""),l=()=>{t(`${n.restBaseUrl}/stockmanagement/stocksource`)},{items:c,totalItems:m,tableHeaders:u,currentPage:p,pageSizes:_,goTo:g,currentPageSize:b,setPageSize:k,isLoading:h}=function(e){let{t}=(0,i.useTranslation)(),{items:a,isLoading:o,error:s}=(0,tc.UP)(e),[l,c]=(0,r.useState)(10),{goTo:m,results:d,currentPage:u}=(0,n.usePagination)(a.results,l),p=(0,r.useMemo)(()=>[{id:1,header:t("name","Name"),key:"name"},{id:2,header:t("acronym","Acronym"),key:"acronym"},{id:3,header:t("sourceType","Source type"),key:"sourceType"},{id:4,header:t("actions","Actions"),key:"actions"}],[t]);return{items:d,totalItems:a?.totalCount,currentPage:u,currentPageSize:l,paginatedItems:d,goTo:m,pageSizes:[10,20,30,40,50],isLoading:o,error:s,setPageSize:c,tableHeaders:p}}({v:f.G.Default,totalCount:!0}),E=(0,r.useMemo)(()=>c?.map((e,t)=>({...e,id:e?.uuid,key:`key-${e?.uuid}`,uuid:e?.uuid,name:e?.name,acronym:e?.acronym,sourceType:e?.sourceType?.display,actions:s().createElement(s().Fragment,null,s().createElement(ti,{data:c[t]}),s().createElement(tm,{uuid:c[t].uuid}))})),[c]),y=e=>{o(e)},T=(0,r.useMemo)(()=>a?E.filter(e=>e.sourceType===a):E,[E,a]);return h?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):s().createElement("div",{className:tu.tableOverride},s().createElement("h2",{className:tu.tableHeader},e("stockSourcesTableHeader","List of partners who provide stock to the facility.")),s().createElement(d.DataTable,{rows:T,headers:u,isSortable:!0,useZebraStyles:!0},({rows:t,headers:a,getHeaderProps:o,getTableProps:r,getRowProps:i,onInputChange:c})=>s().createElement(d.TableContainer,null,s().createElement(d.TableToolbar,{"aria-label":e("dataTableToolbar","Data table toolbar"),style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableToolbarContent,{className:tu.toolbarContent},s().createElement(d.TableToolbarSearch,{labelText:e("filterTable","Filter table"),placeholder:e("filterTable","Filter table"),closeButtonLabelText:e("clearSearch","Clear search input"),persistent:!0,onChange:c}),s().createElement("div",{style:{display:"flex",alignItems:"center"}},s().createElement(td,{onFilterChange:y})),s().createElement(d.TableToolbarMenu,{iconDescription:e("settings","Settings")},s().createElement(d.TableToolbarAction,{className:tu.toolbarMenuAction,onClick:l},e("refresh","Refresh"))),s().createElement(tl,null))),s().createElement(d.Table,r(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,a.map(e=>"details"!==e.key&&s().createElement(d.TableHeader,{...o({header:e,isSortable:e.isSortable}),className:n.isDesktop?tu.desktopHeader:tu.tabletHeader,key:`${e.key}`},"object"==typeof e.header&&null!==e.header&&"content"in e.header?e.header.content:e.header)),s().createElement(d.TableHeader,null))),s().createElement(d.TableBody,null,t.map(e=>s().createElement(s().Fragment,{key:e.id},s().createElement(d.TableRow,{className:n.isDesktop?tu.desktopRow:tu.tabletRow,...i({row:e})},e.cells.map(e=>e?.info?.header!=="details"&&s().createElement(d.TableCell,{key:e.id},e.value))))))),0===t.length?s().createElement("div",{className:tu.tileContainer},s().createElement(d.Tile,{className:tu.tile},s().createElement("div",{className:tu.tileContent},s().createElement("p",{className:tu.content},e("noSourcesToDisplay","No stock sources to display")),s().createElement("p",{className:tu.helper},e("checkFilters","Check the filters above"))))):null)),s().createElement(d.Pagination,{...(0,L.LI)(e),page:p,pageSize:b,pageSizes:_,totalItems:m,onChange:({pageSize:e,page:t})=>{e!==b&&k(e),t!==p&&g(t)},className:tu.paginationOverride}))},t_=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-user-role-scopes-form-workspace")},[]);return s().createElement(d.Button,{kind:"primary",onClick:t,size:"md"},e("addNewUserRoleScope","Add new user role scope"))},tg=({data:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-user-role-scopes-form-workspace",{model:e})},[e]);return s().createElement(d.IconButton,{autoAlign:!0,kind:"ghost",label:t("editUserRoleScope","Edit user role scope"),onClick:a},s().createElement(J.ff,{size:16}))};var tb=a(1347);let tk=({uuid:e})=>{let{t}=(0,i.useTranslation)(),a=(0,X.K)(),[o,l]=(0,r.useState)(!1),c=s().useCallback(()=>{let o=(0,n.showModal)("delete-stock-user-scope-modal",{close:()=>o(),uuid:e,onConfirmation:()=>{let r=[];r.push(e),(0,tb.IV)(r).then(()=>{a(`${n.restBaseUrl}/stockmanagement/userrolescope`),l(!1),(0,n.showSnackbar)({isLowContrast:!0,title:t("deletingStockUserScope","Delete Stock User Scope"),kind:"success",subtitle:t("stockUserScopeDeletedSuccessfully","Stock User Scope Deleted Successfully")})},e=>{l(!1),(0,n.showSnackbar)({title:t("errorDeletingUserScope","Error deleting a user scope"),kind:"error",isLowContrast:!0,subtitle:e?.message})}).catch(),o()}})},[t,e,a]),m=s().createElement(d.IconButton,{autoAlign:!0,kind:"ghost",label:t("deleteUserRoleScope","Delete user role scope"),onClick:c},s().createElement(ts.zH,{size:16}));return o?s().createElement(d.InlineLoading,null):m},th={content:"-esm-stock-management__stock-user-role-scopes__content___yGACN",helper:"-esm-stock-management__stock-user-role-scopes__helper___StCJF",separator:"-esm-stock-management__stock-user-role-scopes__separator___3sqL6",tileContainer:"-esm-stock-management__stock-user-role-scopes__tileContainer___tjBuD",tile:"-esm-stock-management__stock-user-role-scopes__tile___XEtB5",tileContent:"-esm-stock-management__stock-user-role-scopes__tileContent___DGNm3",toolbarAction:"-esm-stock-management__stock-user-role-scopes__toolbarAction___mn3IJ",arrowIcon:"-esm-stock-management__stock-user-role-scopes__arrowIcon___hWOcY",tableHeader:"-esm-stock-management__stock-user-role-scopes__tableHeader___CU9PH"},tE=function(){let{t:e}=(0,i.useTranslation)(),t=(0,X.K)(),a=(0,n.useSession)(),o=()=>{t(`${n.restBaseUrl}/stockmanagement/userrolescope`)},{items:l,totalItems:c,currentPage:m,pageSizes:u,goTo:p,currentPageSize:_,setPageSize:g,isLoading:b}=function(e){let{items:t,isLoading:a,error:o}=(0,tb.Wh)(e),[s,l]=(0,r.useState)(10),{goTo:i,results:c,currentPage:m}=(0,n.usePagination)(t.results,s);return{items:c,totalItems:t?.totalCount,currentPage:m,currentPageSize:s,paginatedItems:c,goTo:i,pageSizes:[10,20,30,40,50],isLoading:a,error:o,setPageSize:l}}({v:f.G.Default,totalCount:!0}),k=(0,r.useMemo)(()=>[{id:0,header:e("user","User"),key:"user"},{id:1,header:e("role","Role"),key:"role"},{id:2,header:e("locations","Locations"),key:"locations"},{id:3,header:e("stockOperations","Stock operations"),key:"stockOperations"},{id:4,header:e("permanent","Permanent"),key:"permanent"},{id:5,header:e("activeFrom","Active From"),key:"activeFrom"},{id:6,header:e("activeTo","Active To"),key:"activeTo"},{id:7,header:e("enabled","Enabled"),key:"enabled"},{id:8,header:e("actions","Actions"),key:"actions"}],[e]),h=(0,r.useMemo)(()=>l?.map((t,n)=>{let o=a.user.uuid===t.userUuid;return{...t,id:t?.uuid,key:`key-${t?.uuid}`,uuid:`${t?.uuid}`,user:a.user.uuid===t.userUuid?`${t?.userFamilyName} ${t.userGivenName}`:s().createElement(d.Link,{href:(0,ep.Wh)(t?.uuid)},`${t?.userFamilyName} ${t.userGivenName}`),roleName:t?.role,locations:t?.locations?.map(e=>{let a=`loc-${t?.uuid}-${e.locationUuid}`;return s().createElement("span",{key:a},e?.locationName,e?.enableDescendants?s().createElement(ec.PS,{className:th.arrowIcon,key:`${a}-${n}-0`,size:12}):s().createElement(ec.nk,{className:th.arrowIcon,key:`${a}-${n}-1`,size:12}))}),stockOperations:t?.operationTypes?.map(e=>e?.operationTypeName)?.join(", "),permanent:t?.permanent?e("yes","Yes"):e("no","No"),activeFrom:(0,e_.g1)(t?.activeFrom)??"Not Set",activeTo:(0,e_.g1)(t?.activeTo)??"Not Set",enabled:t?.enabled?e("yes","Yes"):e("no","No"),actions:s().createElement("div",{style:{display:"flex"}},!o&&s().createElement(s().Fragment,null,s().createElement(tg,{data:l[n]}),s().createElement(tk,{uuid:l[n].uuid})))}}),[a.user.uuid,l,e]);return b?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):s().createElement("div",{className:th.tableOverride},s().createElement("h2",{className:th.tableHeader},e("stockUserRoleScopesTableHeader","To access stock management features, users must have assigned roles specifying location and stock operation type scopes.")),s().createElement(d.DataTable,{headers:k,isSortable:!0,rows:h??[],useZebraStyles:!0},({rows:t,headers:a,getHeaderProps:r,getTableProps:l,getRowProps:i,onInputChange:c})=>s().createElement(d.TableContainer,null,s().createElement(d.TableToolbar,{"aria-label":e("dataTableToolbar","Data table toolbar"),style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableToolbarContent,{className:th.toolbarContent},s().createElement(d.TableToolbarSearch,{labelText:e("filterTable","Filter table"),placeholder:e("filterTable","Filter table"),closeButtonLabelText:e("clearSearch","Clear search input"),persistent:!0,onChange:c}),s().createElement(d.TableToolbarMenu,{iconDescription:e("settings","Settings")},s().createElement(d.TableToolbarAction,{className:th.toolbarAction,onClick:o},e("refresh","Refresh"))),s().createElement(t_,null))),s().createElement(d.Table,l(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,a.map(e=>"details"!==e.key&&s().createElement(d.TableHeader,{...r({header:e,isSortable:e.isSortable}),className:n.isDesktop?th.desktopHeader:th.tabletHeader,key:`${e.key}`},e.header?.content??e.header)),s().createElement(d.TableHeader,null))),s().createElement(d.TableBody,null,t.map(e=>s().createElement(s().Fragment,{key:e.id},s().createElement(d.TableRow,{className:n.isDesktop?th.desktopRow:th.tabletRow,...i({row:e})},e.cells.map(e=>e?.info?.header!=="details"&&s().createElement(d.TableCell,{key:e.id},e.value))))))),0===t.length?s().createElement("div",{className:th.tileContainer},s().createElement(d.Tile,{className:th.tile},s().createElement("div",{className:th.tileContent},s().createElement("p",{className:th.content},e("noStockUserRoleScopesToDisplay","No stock user role scopes to display")),s().createElement("p",{className:th.helper},e("checkFilters","Check the filters above"))))):null)),s().createElement(d.Pagination,{...(0,L.LI)(e),page:m,pageSize:_,pageSizes:u,totalItems:c,onChange:({pageSize:e,page:t})=>{e!==_&&g(e),t!==m&&p(t)},className:th.paginationOverride}))};var ty=a(7240),tf=a(9878);let tT="-esm-stock-management__printable-transaction-header__container___WBdX5",tv="-esm-stock-management__printable-transaction-header__printableBody___FF4ZS",tN="-esm-stock-management__printable-transaction-header__printableHeader___gpe8b",tS="-esm-stock-management__printable-transaction-header__img___1rO2J",tC="-esm-stock-management__printable-transaction-header__transactionDetails___8BOaI",tw="-esm-stock-management__printable-transaction-header__heading___FCJEU",tD="-esm-stock-management__printable-transaction-header__itemHeading___j9yVA",tI="-esm-stock-management__printable-transaction-header__itemLabel___Y1AWV",tx=({itemName:e})=>{let{t}=(0,i.useTranslation)(),{logo:a}=(0,n.useConfig)({externalModuleName:"@kenyaemr/esm-login-app"});return s().createElement("div",{className:tT},s().createElement("div",{className:tN},s().createElement("p",{className:tw},t("binCard","Bin card")),a?.src?s().createElement("img",{className:tS,height:60,width:250,src:a.src,alt:a.alt}):a?.name?a.name:s().createElement("svg",{className:tS,role:"img",width:110,height:40,viewBox:"0 0 380 119",xmlns:"http://www.w3.org/2000/svg"},s().createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M40.29 40.328a27.755 27.755 0 0 1 19.688-8.154c7.669 0 14.613 3.102 19.647 8.116l.02-18.54A42.835 42.835 0 0 0 59.978 17c-7.089 0-13.813 1.93-19.709 4.968l.021 18.36ZM79.645 79.671a27.744 27.744 0 0 1-19.684 8.154c-7.67 0-14.614-3.101-19.651-8.116l-.02 18.54A42.857 42.857 0 0 0 59.96 103a42.833 42.833 0 0 0 19.672-4.751l.013-18.578ZM40.328 79.696c-5.038-5.037-8.154-11.995-8.154-19.685 0-7.669 3.102-14.612 8.116-19.65l-18.54-.02A42.85 42.85 0 0 0 17 60.012a42.819 42.819 0 0 0 4.752 19.672l18.576.013ZM79.634 40.289a27.753 27.753 0 0 1 8.154 19.688 27.744 27.744 0 0 1-8.117 19.646l18.542.02a42.842 42.842 0 0 0 4.749-19.666c0-7.09-1.714-13.779-4.751-19.675l-18.577-.013ZM156.184 60.002c0-8.748-6.118-15.776-15.025-15.776-8.909 0-15.025 7.028-15.025 15.776 0 8.749 6.116 15.78 15.025 15.78 8.907 0 15.025-7.031 15.025-15.78Zm-34.881 0c0-11.482 8.318-19.958 19.856-19.958 11.536 0 19.855 8.477 19.855 19.959 0 11.484-8.319 19.964-19.855 19.964-11.538 0-19.856-8.48-19.856-19.965ZM179.514 75.54c5.507 0 9.05-4.14 9.05-9.482 0-5.341-3.543-9.483-9.05-9.483-5.505 0-9.046 4.142-9.046 9.483 0 5.342 3.541 9.482 9.046 9.482ZM166.22 53.306h4.248v3.704h.11c2.344-2.725 5.449-4.36 9.154-4.36 8.014 0 13.408 5.67 13.408 13.408 0 7.63-5.613 13.406-12.752 13.406-4.58 0-8.231-2.29-9.81-5.178h-.11V90.87h-4.248V53.306ZM217.773 63.768c-.163-4.305-3-7.193-7.686-7.193-4.685 0-7.79 2.888-8.335 7.193h16.021Zm3.653 10.412c-3.001 3.868-6.596 5.284-11.339 5.284-8.01 0-12.914-5.993-12.914-13.406 0-7.901 5.559-13.407 13.08-13.407 7.196 0 12.096 4.906 12.096 13.354v1.362h-20.597c.325 4.413 3.704 8.173 8.335 8.173 3.65 0 6.105-1.307 8.12-3.868l3.219 2.508ZM227.854 59.356c0-2.346-.216-4.36-.216-6.05h4.031c0 1.363.11 2.777.11 4.195h.11c1.144-2.505 4.306-4.85 8.5-4.85 6.705 0 9.699 4.252 9.699 10.41v15.748h-4.248v-15.31c0-4.253-1.856-6.924-5.833-6.924-5.503 0-7.903 3.979-7.903 9.811V78.81h-4.25V59.356ZM259.211 41.008h6.708L278.8 70.791h.107l12.982-29.782h6.549v37.99h-4.506V47.124h-.106L280.192 79h-2.738l-13.629-31.875h-.107V79h-4.507V41.01ZM312.392 57.752h4.023c4.992 0 11.487 0 11.487-6.282 0-5.47-4.776-6.276-9.177-6.276h-6.333v12.558Zm-4.506-16.744h9.711c7.352 0 15.132 1.072 15.132 10.462 0 5.527-3.594 9.125-9.495 10.037L334.018 79h-5.525l-10.304-17.063h-5.797V79h-4.506V41.01ZM358.123 47.712c-1.506-2.413-4.187-3.486-6.926-3.486-3.973 0-8.1 1.88-8.1 6.385 0 3.49 1.931 5.047 7.994 6.98 5.903 1.878 11.377 3.809 11.377 11.267 0 7.567-6.495 11.11-13.36 11.11-4.402 0-9.125-1.45-11.7-5.262l3.862-3.165c1.61 2.794 4.83 4.24 8.105 4.24 3.862 0 8.263-2.253 8.263-6.601 0-4.669-3.165-5.474-9.928-7.728-5.366-1.771-9.442-4.134-9.442-10.463 0-7.298 6.277-10.945 12.929-10.945 4.241 0 7.836 1.178 10.625 4.45l-3.699 3.218Z"}))),s().createElement("div",{className:tv},s().createElement("div",{className:tC},s().createElement("p",{className:tD},t("itemName","Item name")),s().createElement("p",{className:tI},(0,tf.A)(e)))))},tA=({title:e})=>{let{t}=(0,i.useTranslation)(),a=(0,n.useSession)();return s().createElement("div",{className:"-esm-stock-management__printable-transaction-footer__container___f+Jry"},s().createElement("p",{className:"-esm-stock-management__printable-transaction-footer__itemFooter___GAxjn"},e),s().createElement("p",{className:"-esm-stock-management__printable-transaction-footer__footDescription___0zbqs"},t("generatedMessage","The card has been electronically generated and is a valid document. It was created by {{userName}} on {{date}}",{userName:`${a?.user?.display}`,date:`${(0,n.formatDate)(new Date,{mode:"standard",noToday:!0})}`})))},tU="-esm-stock-management__printable-transaction__itemsContainer___7r2kf",tR="-esm-stock-management__printable-transaction__tableContainer___XdOI5",t$=({columns:e,data:t,title:a})=>s().createElement("div",null,s().createElement(tx,{itemName:a}),s().createElement("div",{className:tU},s().createElement("div",{className:tR},s().createElement(d.DataTable,{"data-floating-menu-container":!0,rows:t,headers:e,useZebraStyles:!0},({rows:e,headers:t,getHeaderProps:a,getTableProps:n,onInputChange:o})=>s().createElement("div",null,s().createElement(d.TableContainer,null,s().createElement(d.Table,n(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,t.map(e=>s().createElement(d.TableHeader,a({header:e}),e.header)))),s().createElement(d.TableBody,{style:{fontSize:"8px"}},e.map(e=>s().createElement(d.TableRow,{key:e.id},e.cells.map(e=>s().createElement(d.TableCell,{key:e.id},e.value))))))))))),s().createElement(tA,{title:""})),tO=({itemName:e})=>{let{t}=(0,i.useTranslation)(),{logo:a}=(0,n.useConfig)({externalModuleName:"@kenyaemr/esm-login-app"});return s().createElement("div",{className:tT},s().createElement("div",{className:tN},s().createElement("p",{className:tw},t("stockCard","Stock card")),a?.src?s().createElement("img",{className:tS,height:60,width:250,src:a.src,alt:a.alt}):a?.name?a.name:s().createElement("svg",{className:tS,role:"img",width:110,height:40,viewBox:"0 0 380 119",xmlns:"http://www.w3.org/2000/svg"},s().createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M40.29 40.328a27.755 27.755 0 0 1 19.688-8.154c7.669 0 14.613 3.102 19.647 8.116l.02-18.54A42.835 42.835 0 0 0 59.978 17c-7.089 0-13.813 1.93-19.709 4.968l.021 18.36ZM79.645 79.671a27.744 27.744 0 0 1-19.684 8.154c-7.67 0-14.614-3.101-19.651-8.116l-.02 18.54A42.857 42.857 0 0 0 59.96 103a42.833 42.833 0 0 0 19.672-4.751l.013-18.578ZM40.328 79.696c-5.038-5.037-8.154-11.995-8.154-19.685 0-7.669 3.102-14.612 8.116-19.65l-18.54-.02A42.85 42.85 0 0 0 17 60.012a42.819 42.819 0 0 0 4.752 19.672l18.576.013ZM79.634 40.289a27.753 27.753 0 0 1 8.154 19.688 27.744 27.744 0 0 1-8.117 19.646l18.542.02a42.842 42.842 0 0 0 4.749-19.666c0-7.09-1.714-13.779-4.751-19.675l-18.577-.013ZM156.184 60.002c0-8.748-6.118-15.776-15.025-15.776-8.909 0-15.025 7.028-15.025 15.776 0 8.749 6.116 15.78 15.025 15.78 8.907 0 15.025-7.031 15.025-15.78Zm-34.881 0c0-11.482 8.318-19.958 19.856-19.958 11.536 0 19.855 8.477 19.855 19.959 0 11.484-8.319 19.964-19.855 19.964-11.538 0-19.856-8.48-19.856-19.965ZM179.514 75.54c5.507 0 9.05-4.14 9.05-9.482 0-5.341-3.543-9.483-9.05-9.483-5.505 0-9.046 4.142-9.046 9.483 0 5.342 3.541 9.482 9.046 9.482ZM166.22 53.306h4.248v3.704h.11c2.344-2.725 5.449-4.36 9.154-4.36 8.014 0 13.408 5.67 13.408 13.408 0 7.63-5.613 13.406-12.752 13.406-4.58 0-8.231-2.29-9.81-5.178h-.11V90.87h-4.248V53.306ZM217.773 63.768c-.163-4.305-3-7.193-7.686-7.193-4.685 0-7.79 2.888-8.335 7.193h16.021Zm3.653 10.412c-3.001 3.868-6.596 5.284-11.339 5.284-8.01 0-12.914-5.993-12.914-13.406 0-7.901 5.559-13.407 13.08-13.407 7.196 0 12.096 4.906 12.096 13.354v1.362h-20.597c.325 4.413 3.704 8.173 8.335 8.173 3.65 0 6.105-1.307 8.12-3.868l3.219 2.508ZM227.854 59.356c0-2.346-.216-4.36-.216-6.05h4.031c0 1.363.11 2.777.11 4.195h.11c1.144-2.505 4.306-4.85 8.5-4.85 6.705 0 9.699 4.252 9.699 10.41v15.748h-4.248v-15.31c0-4.253-1.856-6.924-5.833-6.924-5.503 0-7.903 3.979-7.903 9.811V78.81h-4.25V59.356ZM259.211 41.008h6.708L278.8 70.791h.107l12.982-29.782h6.549v37.99h-4.506V47.124h-.106L280.192 79h-2.738l-13.629-31.875h-.107V79h-4.507V41.01ZM312.392 57.752h4.023c4.992 0 11.487 0 11.487-6.282 0-5.47-4.776-6.276-9.177-6.276h-6.333v12.558Zm-4.506-16.744h9.711c7.352 0 15.132 1.072 15.132 10.462 0 5.527-3.594 9.125-9.495 10.037L334.018 79h-5.525l-10.304-17.063h-5.797V79h-4.506V41.01ZM358.123 47.712c-1.506-2.413-4.187-3.486-6.926-3.486-3.973 0-8.1 1.88-8.1 6.385 0 3.49 1.931 5.047 7.994 6.98 5.903 1.878 11.377 3.809 11.377 11.267 0 7.567-6.495 11.11-13.36 11.11-4.402 0-9.125-1.45-11.7-5.262l3.862-3.165c1.61 2.794 4.83 4.24 8.105 4.24 3.862 0 8.263-2.253 8.263-6.601 0-4.669-3.165-5.474-9.928-7.728-5.366-1.771-9.442-4.134-9.442-10.463 0-7.298 6.277-10.945 12.929-10.945 4.241 0 7.836 1.178 10.625 4.45l-3.699 3.218Z"}))),s().createElement("div",{className:tv},s().createElement("div",{className:tC},s().createElement("p",{className:tD},t("itemName","Item name")),s().createElement("p",{className:tI},(0,tf.A)(e)))))},tL=({columns:e,items:t,title:a})=>{let[o,l]=(0,r.useState)([]),[i,c]=(0,r.useState)({});return(0,r.useEffect)(()=>{(async()=>{let e=t.filter(e=>e.patientUuid).map(async e=>{let t=`${n.restBaseUrl}/patient/${e.patientUuid}?v=custom:(uuid,display,identifiers,links)`,a=await (0,n.openmrsFetch)(t);return{uuid:e.patientUuid,data:a.data}}),a=await Promise.all(e),o={};a.forEach(e=>{o[e.uuid]=e.data}),c(o)})()},[t]),(0,r.useEffect)(()=>{l(t.map(e=>{let t=e.patientUuid?i[e.patientUuid]:null;return{...e,id:e?.uuid,key:`key-${e?.uuid}`,uuid:`${e?.uuid}`,date:(0,e_.g1)(e?.dateCreated),location:e.operationSourcePartyName&&e.operationDestinationPartyName?e.operationSourcePartyName===e?.partyName?(e.quantity,s().createElement(s().Fragment,null,s().createElement("span",{className:"transaction-location"},e.operationSourcePartyName),s().createElement(ec.nk,{size:16})," ",e.operationDestinationPartyName)):e.operationDestinationPartyName===e?.partyName?(e.quantity,s().createElement(s().Fragment,null,s().createElement("span",{className:"transaction-location"},e.operationDestinationPartyName),s().createElement(ec.nk,{size:16})," ",e.operationSourcePartyName)):e?.partyName:e?.partyName,transaction:e?.isPatientTransaction?"Patient Dispense":e.stockOperationTypeName,quantity:`${e?.quantity?.toLocaleString()} ${e?.packagingUomName??""}`,batch:e.stockBatchNo?`${e.stockBatchNo}${e.expiration?` (${(0,e_.g1)(e.expiration)})`:""}`:"",out:e?.quantity<0?`${(-1*e?.quantity)?.toLocaleString()} ${e?.packagingUomName??""} of ${e.packagingUomFactor}`:"",totalout:e?.quantity<0?`${-1*e?.quantity*Number(e.packagingUomFactor)}`:"",patientId:e?.patientId??"",patientUuid:e?.patientUuid??"",patientName:t?.display??"",patientIdentifier:""}}))},[t,i]),s().createElement("div",null,s().createElement(tO,{itemName:a}),s().createElement("div",{className:tU},s().createElement("div",{className:tR},s().createElement(d.DataTable,{"data-floating-menu-container":!0,rows:o,headers:e,useZebraStyles:!0},({rows:e,headers:t,getHeaderProps:a,getTableProps:n,onInputChange:o})=>s().createElement("div",null,s().createElement(d.TableContainer,null,s().createElement(d.Table,n(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,t.map(e=>s().createElement(d.TableHeader,a({header:e}),e.header)))),s().createElement(d.TableBody,{style:{fontSize:"8px"}},e.map(e=>s().createElement(d.TableRow,{key:e.id},e.cells.map(e=>s().createElement(d.TableCell,{key:e.id},e.value))))))))))),s().createElement(tA,{title:""}))},tM="@openmrs/esm-stock-management-app",tB={featureName:"stock-management",moduleName:tM},tF=a(4767),tP=(0,n.getAsyncLifecycle)(()=>a.e("4214").then(a.bind(a,6085)),{featureName:"delete-stock-modal",moduleName:tM}),tz=(0,n.getAsyncLifecycle)(()=>a.e("822").then(a.bind(a,3333)),{featureName:"delete-stock-user-scope-modal",moduleName:tM}),tj=(0,n.getAsyncLifecycle)(()=>a.e("1600").then(a.bind(a,7939)),{featureName:"delete-packaging-unit-modal",moduleName:tM}),tq=(0,n.getSyncLifecycle)(p.A,{featureName:"delete-packaging-unit-button",moduleName:tM}),tH=(0,n.getAsyncLifecycle)(()=>a.e("6981").then(a.bind(a,5332)),{featureName:"expired-stock-modal",moduleName:tM}),tZ=(0,n.getAsyncLifecycle)(()=>a.e("8661").then(a.bind(a,9892)),{featureName:"import-bulk-stock-items-modal",moduleName:tM}),tG=(0,n.getAsyncLifecycle)(()=>a.e("1164").then(a.bind(a,7127)),{featureName:"issuing-stock-modal",moduleName:tM}),tY=(0,n.getSyncLifecycle)(()=>{let e=`${window.spaBase}/stock-management`;return(0,n.useLeftNav)({name:"stock-page-dashboard-slot",basePath:e}),s().createElement("main",{className:"omrs-main-content"},s().createElement(l.BrowserRouter,{basename:window.spaBase},s().createElement(l.Routes,null,s().createElement(l.Route,{path:"/stock-management",element:s().createElement(E,null)}),s().createElement(l.Route,{path:"/stock-management/:dashboard/*",element:s().createElement(E,null)}))))},tB),tW=(0,n.getAsyncLifecycle)(()=>a.e("8990").then(a.bind(a,4125)),{featureName:"receiving-stock-modal",moduleName:tM}),tV=(0,n.getSyncLifecycle)(()=>{let{t:e}=(0,i.useTranslation)(),t=e("manageStock","Manage Stock");return s().createElement(d.Layer,null,s().createElement(d.ClickableTile,{href:window.getOpenmrsSpaBase()+"stock-management",rel:"noopener noreferrer"},s().createElement("div",null,s().createElement("div",{className:"heading"},t),s().createElement("div",{className:"content"},e("stockManagement","Stock management"))),s().createElement("div",{className:"iconWrapper"},s().createElement(ec.Qp,{size:16}))))},tB),tQ=(0,n.getSyncLifecycle)(()=>s().createElement(n.LeftNavMenu,null),tB),tK=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{backgroundColor:"white"}},s().createElement(K,null),s().createElement(z,null))},tB),tJ=(0,n.getSyncLifecycle)(m({title:"Overview",titleKey:"overview",name:"stock-management"}),tB),tX=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{margin:"1rem"}},s().createElement(e5,null))},tB),t0=(0,n.getSyncLifecycle)(m({title:"Operations",titleKey:"operations",name:"operations"}),tB),t1=(0,n.getSyncLifecycle)(()=>((0,ee.W)(),s().createElement("div",{style:{margin:"1rem"}},s().createElement(ei,null))),tB),t5=(0,n.getSyncLifecycle)(m({title:"Items",titleKey:"items",name:"items"}),tB),t4=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{margin:"1rem"}},s().createElement(tE,null))},tB),t7=(0,n.getSyncLifecycle)(m({title:"User role scopes",titleKey:"userRoleScopes",name:"user-scopes"}),tB),t2=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{margin:"1rem"}},s().createElement(tp,null))},tB),t6=(0,n.getSyncLifecycle)(m({title:"Sources",titleKey:"sources",name:"sources"}),tB),t3=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{margin:"1rem"}},s().createElement(eu,null))},tB),t9=(0,n.getSyncLifecycle)(m({title:"Locations",titleKey:"locations",name:"locations"}),tB),t8=(0,n.getSyncLifecycle)(()=>{let{t:e}=(0,i.useTranslation)(),t=(0,X.K)(),a=()=>{t(`${n.restBaseUrl}/stockmanagement/batchjob?batchJobType=Report&v=default`)},{user:o}=(0,n.useSession)(),l=(0,n.userHasAccess)(ep.UE,o),c=(0,n.userHasAccess)(ep.v9,o),{reports:m,isLoading:u,currentPage:p,pageSizes:_,totalItems:g,goTo:b,currentPageSize:k,setPageSize:h}=(0,e6.$)(l),[E,f]=(0,r.useState)(()=>Date.now());(0,r.useEffect)(()=>{if(!l)return;let e=window.setInterval(()=>f(Date.now()),15e3);return()=>window.clearInterval(e)},[l]);let T=(0,r.useMemo)(()=>[{id:0,header:e("report","Report"),key:"report"},{id:1,header:e("parameters","Parameters"),key:"parameters"},{id:2,header:e("dateRequested","Date Requested"),key:"dateRequested"},{id:3,header:e("requestedBy","Requested By"),key:"requestedBy"},{id:4,header:e("status","Status"),key:"status"},{id:5,header:e("timeTaken","Time Taken"),key:"timeTaken"},{id:8,header:e("actions","Actions"),key:"actions"}],[e]),v=(0,r.useCallback)((e,t)=>{e&&window.open((0,ep.yu)(e,!0),"_blank")},[]),N=(0,r.useMemo)(()=>m?.map((t,a)=>{let n=function(e,t,a=Date.now()){if(e!==e3||!t)return!1;let n=t instanceof Date?t.getTime():new Date(t).getTime();return Number.isFinite(n)&&n<a}(t.status,t.expiration,E);return{...t,checkbox:"isBatchJobActive",id:t?.uuid,key:`key-${t?.uuid}`,uuid:`${t?.uuid}`,batchJobType:t?.batchJobType,dateRequested:(0,e_.P9)(t.dateCreated),parameters:s().createElement(tr,{model:m[a]}),report:t?.description,requestedBy:t?.owners?.map((e,a)=>s().createElement("div",{key:`${t.uuid}-owner-${a}`},`${e.ownerFamilyName} ${e.ownerGivenName}`)),status:s().createElement("div",{className:tn.reportStatus},t.status!==e3||n?null:s().createElement(d.InlineLoading,{status:"active",iconDescription:e("loading","Loading"),description:e("reportQueued","Report queued...")}),n&&s().createElement(s().Fragment,null,s().createElement(y.OR,{className:"report-stale","aria-hidden":"true"}),s().createElement("span",null,e("reportQueuedStale","Queued report has not started"))),"Running"===t.status&&s().createElement(d.InlineLoading,{status:"active",iconDescription:e("loading","Loading"),description:e("generatingReport","Generating report...")}),"Failed"===t.status&&s().createElement(s().Fragment,null,s().createElement(y.OR,{className:"report-failed","aria-hidden":"true"}),s().createElement("span",null,e("failed","Failed"))),t.status===e8&&s().createElement(s().Fragment,null,s().createElement(e4._f,{className:"report-cancelled","aria-hidden":"true"}),s().createElement("span",null,e("cancelled","Cancelled"))),t.status===e9&&s().createElement(s().Fragment,null,s().createElement(eN.cR,{className:"report-completed","aria-hidden":"true",size:16}),s().createElement("span",null,e("completed","Completed"))),"Expired"===t.status&&s().createElement(s().Fragment,null,s().createElement(e7.lz,{className:"report-expired","aria-hidden":"true"}),s().createElement("span",null,e("expired","Expired")))),timeTaken:((e,t)=>{let a=new Date(e).getTime(),n=new Date(t).getTime();if(!a||!n)return"";let o=Math.floor((n-a)/1e3);return[Math.floor(o/3600),Math.floor(o%3600/60),o%60].map(e=>String(e).padStart(2,"0")).join(":")})(t.dateCreated,t.endTime),actions:s().createElement("div",{key:`${t?.uuid}-actions`,style:{display:"inline-block",whiteSpace:"nowrap"}},t.outputArtifactViewable&&"hide"===t.batchJobType&&s().createElement(d.Button,{key:`${t?.uuid}-actions-view`,type:"button",size:"sm",className:"submitButton clear-padding-margin",iconDescription:e("edit","Edit"),kind:"ghost",renderIcon:y.Ss}),s().createElement(d.Button,{type:"button",size:"sm",className:"submitButton clear-padding-margin",iconDescription:"Copy",kind:"ghost",renderIcon:e2.QR}),t?.status===e9&&(t.outputArtifactSize??0)>0&&s().createElement(d.Button,{type:"button",size:"sm",className:"submitButton clear-padding-margin",iconDescription:"Download",kind:"ghost",renderIcon:J.f5,onClick:()=>v(t.uuid,t.outputArtifactFileExt)}))}}),[m,v,e,E]);return u?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):s().createElement("div",{className:tn.container},s().createElement("h2",{className:tn.tableHeader},e("stockReportsTableHeader","List of reports requested by users.")),s().createElement(d.DataTable,{rows:N,headers:T,isSortable:!0,useZebraStyles:!0},({rows:t,headers:o,getHeaderProps:r,getTableProps:i,getRowProps:u,onInputChange:p})=>s().createElement(d.TableContainer,null,s().createElement(d.TableToolbar,{"aria-label":e("dataTableToolbar","Data table toolbar"),style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableToolbarContent,{className:tn.toolbarContent},s().createElement(d.TableToolbarSearch,{labelText:e("filterTable","Filter table"),placeholder:e("filterTable","Filter table"),closeButtonLabelText:e("clearSearch","Clear search input"),persistent:!0,onChange:p}),s().createElement(d.TableToolbarMenu,{iconDescription:e("settings","Settings")},s().createElement(d.TableToolbarAction,{className:tn.toolbarMenuAction,onClick:a},e("refresh","Refresh"))),c&&s().createElement(ta,null))),s().createElement(d.Table,i(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,s().createElement(d.TableExpandHeader,null),o.map(e=>s().createElement(d.TableHeader,{...r({header:e,isSortable:e.isSortable}),className:n.isDesktop?tn.desktopHeader:tn.tabletHeader,key:`${e.key}`},e.header?.content??e.header)),s().createElement(d.TableHeader,null))),s().createElement(d.TableBody,null,t.map((e,t)=>s().createElement(s().Fragment,{key:e.id},s().createElement(d.TableExpandRow,{className:n.isDesktop?tn.desktopRow:tn.tabletRow,...u({row:e})},e.cells.map(e=>s().createElement(d.TableCell,{key:e.id},e.value))),e.isExpanded?s().createElement(d.TableExpandedRow,{colSpan:o.length+2},s().createElement(to,{model:m[t]})):s().createElement(d.TableExpandedRow,{className:tn.hiddenRow,colSpan:o.length+2}))))),l?0===t.length?s().createElement("div",{className:tn.tileContainer},s().createElement(d.Tile,{className:tn.tile},s().createElement("div",{className:tn.tileContent},s().createElement("p",{className:tn.content},e("noReportsToDisplay","No Stock reports to display")),s().createElement("p",{className:tn.helper},e("checkFilters","Check the filters above"))))):null:s().createElement(tt,{title:"Can not view stock reports",description:"You have no permissions to view reports"}))),s().createElement(d.Pagination,{...(0,L.LI)(e),page:p,pageSize:k,pageSizes:_,totalItems:g,onChange:({pageSize:e,page:t})=>{e!==k&&h(e),t!==p&&b(t)},className:tn.paginationOverride}))},tB),ae=(0,n.getSyncLifecycle)(m({title:"Reports",titleKey:"reports",name:"reports"}),tB),at=(0,n.getSyncLifecycle)(function(){let{t:e}=(0,i.useTranslation)();return s().createElement("div",{className:"-esm-stock-management__stock-settings__container___a4ZMo"},s().createElement("div",{className:"-esm-stock-management__stock-settings__tableHeader___yTdeQ"},e("comingSoonUnderDev","Exciting updates are on the way! In the meantime, use the link below to access Admin UI settings.")),s().createElement(d.Button,{onClick:()=>(0,n.navigate)({to:"${openmrsBase}/admin/maintenance/settings.list?show=Stockmanagement"}),size:"md",renderIcon:()=>s().createElement(ts.tl,{className:"cds--btn__icon",size:24}),kind:"ghost"},e("adminSettings","Admin settings")))},tB),aa=(0,n.getSyncLifecycle)(m({title:"Settings",titleKey:"settings",name:"settings"}),tB),an=(0,n.getSyncLifecycle)(function(){return s().createElement(n.ExtensionSlot,{name:"stock-management-dashboard-slot"})},tB),ao=(0,n.getAsyncLifecycle)(()=>a.e("6105").then(a.bind(a,9632)),{featureName:"stock-operation-modal",moduleName:tM}),ar=(0,n.getSyncLifecycle)(()=>{let e=window.getOpenmrsSpaBase();return s().createElement(d.ClickableTile,{className:"-esm-stock-management__item__customTile___bmBVE",id:"menu-item",href:`${e}stock-management`},s().createElement("div",{className:"customTileTitle"},s().createElement(u.pl,{size:24})),s().createElement("div",null,"Stock Management"))},tB),as=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("7369"),a.e("9457"),a.e("9720")]).then(a.bind(a,459)),tB),al=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("7369"),a.e("9457"),a.e("7115")]).then(a.bind(a,6902)),tB),ai=(0,n.getAsyncLifecycle)(()=>a.e("5838").then(a.bind(a,4301)),tB),ac=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("7369"),a.e("2713")]).then(a.bind(a,3824)),tB),am=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("9457"),a.e("3576")]).then(a.bind(a,5979)),tB),ad=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("7369"),a.e("5996")]).then(a.bind(a,8647)),tB),au=(0,n.getSyncLifecycle)(({onClose:e,title:t,columns:a,data:o,binOrStockCard:l})=>{let{t:c}=(0,i.useTranslation)(),m=(0,r.useRef)(null),u=(0,ty.useReactToPrint)({content:()=>m.current});return s().createElement(s().Fragment,null,s().createElement(d.ModalHeader,{iconDescription:c("close","Close"),closeModal:e,title:c("printBinCard","Print Bin Card")}),s().createElement(d.ModalBody,null,s().createElement("div",{ref:m},s().createElement(t$,{title:t,columns:a,data:o}))),s().createElement(d.ModalFooter,null,s().createElement(d.Button,{kind:"secondary",onClick:e},(0,n.getCoreTranslation)("cancel")),s().createElement(d.Button,{type:"button",onClick:u},(0,n.getCoreTranslation)("print"))))},tB),ap=(0,n.getSyncLifecycle)(({onClose:e,title:t,columns:a,data:o})=>{let{t:l}=(0,i.useTranslation)(),c=(0,r.useRef)(null),m=(0,ty.useReactToPrint)({content:()=>c.current});return s().createElement(s().Fragment,null,s().createElement(d.ModalHeader,{iconDescription:l("close","Close"),closeModal:e,title:l("printStockCard","Print Stock Card")}),s().createElement(d.ModalBody,null,s().createElement("div",{ref:c},s().createElement(tL,{title:t,columns:a,items:o}))),s().createElement(d.ModalFooter,null,s().createElement(d.Button,{kind:"secondary",onClick:e},(0,n.getCoreTranslation)("cancel")),s().createElement(d.Button,{type:"button",onClick:m},(0,n.getCoreTranslation)("print"))))},tB);function a_(){(0,n.defineConfigSchema)(tM,o)}let ag=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("9457"),a.e("1878")]).then(a.bind(a,6453)),tB)},3270(e,t,a){"use strict";a.d(t,{A:()=>c});var n=a(1455),o=a.n(n),r=a(7815),s=a(9252),l=a(5576),i=a(3716);let c=({row:e})=>{let{t}=(0,r.useTranslation)(),a=(0,n.useCallback)(()=>{let t=(0,i.showModal)("delete-packaging-unit-modal",{closeModal:()=>t(),row:e})},[e]);return o().createElement(s.Button,{type:"button",size:"sm",className:"submitButton clear-padding-margin",iconDescription:t("delete","Delete"),kind:"ghost",renderIcon:l.zH,onClick:a})}},7187(e,t,a){"use strict";a.d(t,{W:()=>l,m:()=>s});var n=a(1455),o=a(3716),r=a(7003);let s=e=>{(0,o.launchWorkspace2)("stock-item-form-workspace",{stockItem:e})},l=()=>{(0,n.useEffect)(()=>{let e=new URL(window.location.href),t=e.searchParams.get(r.R4);t&&(e.searchParams.delete(r.R4),window.history.replaceState(window.history.state,"",e.pathname+e.search+e.hash),(0,o.openmrsFetch)(`${o.restBaseUrl}/stockmanagement/stockitem/${encodeURIComponent(t)}?v=full`).then(({data:e})=>{e?.uuid&&s({...e,isDrug:!!e.drugUuid})}).catch(()=>{}))},[])}},9587(e,t,a){"use strict";a.d(t,{AR:()=>_,Jq:()=>b,ME:()=>d,QC:()=>l,R3:()=>f,W8:()=>i,Xu:()=>m,Yx:()=>u,__:()=>v,hA:()=>p,jf:()=>E,kC:()=>h,kl:()=>c,n6:()=>k,s_:()=>y,w_:()=>g,z8:()=>T});var n=a(3716),o=a(8611),r=a.n(o),s=a(3767);function l(e){let t=`${n.restBaseUrl}/stockmanagement/stockitem${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function i(e){let t=`${n.restBaseUrl}/stockmanagement/stockitem?drugUuid=${e}&limit=1`;return(0,n.openmrsFetch)(t).then(({data:e})=>e)}function c(e){let t=`${n.restBaseUrl}/stockmanagement/stockitemtransaction${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function m(e){let t=`${n.restBaseUrl}/stockmanagement/stockiteminventory${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function d(e){let t=`${n.restBaseUrl}/stockmanagement/stockbatch${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function u(e){let t=`${n.restBaseUrl}/stockmanagement/stockitempackaginguom${(0,s.q)(e)}`,{data:a,error:o,isLoading:l,mutate:i}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o,mutate:i}}function p(e){let t=`${n.restBaseUrl}/stockmanagement/stockitem/${e}?v=full`,{data:a,error:o,isLoading:s}=r()(t,n.openmrsFetch);return{item:a?.data||{},isLoading:s,error:o}}function _(e){let t=`${n.restBaseUrl}/stockmanagement/stockitempackaginguom/${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:a.signal})}function g(e){let t=`${n.restBaseUrl}/stockmanagement/stockitem`,a=new AbortController;return delete e.isDrug,(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function b(e,t){let a=`${n.restBaseUrl}/stockmanagement/stockitem/${e}`,o=new AbortController;return delete t.isDrug,delete t.dateCreated,(0,n.openmrsFetch)(a,{method:"POST",headers:{"Content-Type":"application/json"},signal:o.signal,body:t})}function k(e){let t=`${n.restBaseUrl}/stockmanagement/stockitempackaginguom`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function h(e,t){let a=`${n.restBaseUrl}/stockmanagement/stockitempackaginguom/${t}`,o=new AbortController;return(0,n.openmrsFetch)(a,{method:"POST",headers:{"Content-Type":"application/json"},signal:o.signal,body:e})}function E(e){let t=`${n.restBaseUrl}/stockmanagement/stockrule${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function y(e){let t=`${n.restBaseUrl}/stockmanagement/stockrule/${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:a.signal})}function f(e){let t=`${n.restBaseUrl}/stockmanagement/stockitemreference${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function T(e){let t=`${n.restBaseUrl}/stockmanagement/stockitemreference`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function v(e){let t=`${n.restBaseUrl}/stockmanagement/stockitemreference/${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:a.signal})}},1844(e,t,a){"use strict";a.d(t,{DW:()=>d,_D:()=>m,zC:()=>c});var n=a(1455),o=a(8611),r=a.n(o),s=a(3716),l=a(7815),i=a(5175);function c(e){let{stockLocations:t,error:a,isLoading:o,mutate:r}=(0,i.gQ)(),[c,m]=(0,n.useState)(10),{goTo:d,results:u,currentPage:p}=(0,s.usePagination)(t,c),{t:_}=(0,l.useTranslation)(),g=(0,n.useMemo)(()=>[{id:0,header:_("name","Name"),key:"name"},{id:1,header:_("tags","Tags"),key:"tags"},{id:2,header:_("childLocations","Child Locations"),key:"childLocations"},{id:3,header:_("actions","Actions"),key:"actions"}],[_]),b=(0,n.useMemo)(()=>t.map(e=>({id:e?.uuid,key:`key-${e?.uuid}`,uuid:`${e?.uuid}`,name:`${e?.name}`,tags:e?.meta.tag?.filter(e=>"SUBSETTED"!==e.code).map(e=>e.code)?.join(", ")??"",childLocations:e?.childLocations?.map(e=>e.display)?.join(", ")??""})),[t]);return{items:t,mutate:r,currentPage:p,currentPageSize:c,paginatedQueueEntries:u,goTo:d,pageSizes:[10,20,30,40,50],isLoading:o,error:a,setPageSize:m,tableHeaders:g,tableRows:b}}let m=()=>{let e=`${s.restBaseUrl}/locationtag/`,{data:t,isLoading:a,mutate:n}=r()(e,s.openmrsFetch);return{locationTagList:t?.data?.results?t?.data?.results:[],loading:a,mutate:n}};async function d({locationPayload:e}){return await (0,s.openmrsFetch)(`${s.restBaseUrl}/location/`,{method:"POST",headers:{"Content-Type":"application/json"},body:e})}},5175(e,t,a){"use strict";a.d(t,{G2:()=>m,Jd:()=>p,Ul:()=>k,VE:()=>b,VZ:()=>g,bh:()=>d,cj:()=>_,gQ:()=>i,kp:()=>u,zn:()=>c});var n=a(5453),o=a(8611),r=a.n(o),s=a(3716),l=a(3767);function i(){let e=`${s.fhirBaseUrl}/Location?_summary=data&_tag=main store,main pharmacy,dispensary `,{data:t,error:a,isLoading:o,mutate:r}=(0,s.useFhirFetchAll)(e);return{stockLocations:(0,n.A)(t,"id")??[],mutate:r,isLoading:o,error:a}}function c(e){let t=`${s.restBaseUrl}/role${(0,l.q)(e)}`,{data:a,error:n,isLoading:o}=r()(t,s.openmrsFetch);return{items:a?.data||{},isLoading:o,error:n}}function m(){let e=`${s.restBaseUrl}/stockmanagement/stockoperationtype?v=default`,{data:t,isLoading:a,error:n}=r()(e,s.openmrsFetch);return{types:t?.data||{},isLoading:a,error:n}}function d(){let e=`${s.restBaseUrl}/stockmanagement/stockoperationtype?v=default`;return(0,s.openmrsFetch)(e)}function u(e){let t=`${s.restBaseUrl}/user${(0,l.q)(e)}`,{data:a,error:n,isLoading:o}=r()(t,s.openmrsFetch,{keepPreviousData:!0});return{items:a?.data||{},isLoading:o,error:n}}function p(e,t){let a=`${s.restBaseUrl}/user/${e}${(0,l.q)({v:t||void 0})}`,{data:n,error:o,isLoading:i}=r()(e?a:null,s.openmrsFetch);return{data:n?.data||{},isLoading:i,error:o}}function _(e){let t=`${s.restBaseUrl}/concept/${e}`,{data:a,error:n,isLoading:o}=r()(e?t:null,s.openmrsFetch,{errorRetryCount:2});return{items:a?.data||{},isLoading:o,error:n}}function g(e,t=!0){let a=`${s.restBaseUrl}/drug${(0,l.q)(e)}`,{data:n,error:o,isLoading:i}=r()(t?a:null,s.openmrsFetch);return{items:n?.data||{},isLoading:i,error:o}}function b(e){let t=`${s.restBaseUrl}/concept${(0,l.q)(e)}`,{data:a,error:n,isLoading:o}=r()(t,s.openmrsFetch);return{items:a?.data||{},isLoading:o,error:n}}let k=()=>{let{user:e}=(0,s.useSession)(),t=`${s.restBaseUrl}/stockmanagement/userrolescope`,{data:a,isLoading:n,error:o}=r()(t,s.openmrsFetch);return{userRoles:a?.data?.results.find(t=>t.userUuid===e.uuid),isLoading:n,error:o}}},683(e,t,a){"use strict";a.d(t,{AE:()=>o,_H:()=>r,mh:()=>s,rA:()=>l});var n=a(3716);a(3387);let o=(e,t,a)=>{(0,n.launchWorkspace2)("stock-operation-form-workspace",{stockOperationType:e,stockOperation:t,stockRequisitionUuid:a})},r=e=>!e||("NEW"===e.status||"RETURNED"===e.status)&&e.permission?.canEdit!==!1;function s(){return`${new Date().getTime()}-${Math.random().toString(36).substring(2,16)}`}let l=(e,t,a)=>{let o=(0,n.showModal)("stock-operations-modal",{title:e,operation:a,requireReason:t,closeModal:()=>o()})}},4094(e,t,a){"use strict";a.d(t,{A:()=>o});var n=a(3466);let o=e=>{let t=(0,n.lj)(e.operationType);return{isNegativeQuantityAllowed:(0,n.R6)(t),requiresBatchUuid:(0,n.Xb)(t),requiresActualBatchInfo:(0,n.en)(t),isQuantityOptional:(0,n.Hu)(t),canCaptureQuantityPrice:(0,n.Wf)(t),requiresStockAdjustmentReason:(0,n.jQ)(t),requiresDispatchAcknowledgement:(0,n.Eh)(t),allowExpiredBatchNumbers:e?.allowExpiredBatchNumbers??!1,allowPrinting:(0,n.LD)(t)}}},4779(e,t,a){"use strict";a.d(t,{DT:()=>p,Eb:()=>c,G7:()=>m,Wu:()=>i,_o:()=>g,jU:()=>u,jp:()=>_,kR:()=>l,yJ:()=>d});var n=a(3716),o=a(8611),r=a.n(o),s=a(3767);function l(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperation${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch,{keepPreviousData:!0});return{items:a?.data||{},isLoading:l,error:o}}function i(e){if(!e)return;let t=`${n.restBaseUrl}/stockmanagement/stockoperation/${e}?v=full`;return(0,n.openmrsFetch)(t)}function c(e=""){let t=`${n.restBaseUrl}/stockmanagement/stockoperation/${e}?v=full`,{data:a,error:o,isLoading:s}=r()(e?t:null,n.openmrsFetch);return{items:a?.data,isLoading:s,error:o}}function m(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperationitem/${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:a.signal})}function d(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperation`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function u(e,t){let a=`${n.restBaseUrl}/stockmanagement/stockoperation/${e.uuid}`,o=new AbortController;return(0,n.openmrsFetch)(a,{method:"POST",headers:{"Content-Type":"application/json"},signal:o.signal,body:t})}function p(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperationaction`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function _(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperationitemcost?v=default&stockOperationUuid=${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"GET",headers:{"Content-Type":"application/json"},signal:a.signal})}function g(e){let t=`${n.restBaseUrl}/stockmanagement/stockiteminventory${(0,s.q)(e)}&v=default`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"GET",headers:{"Content-Type":"application/json"},signal:a.signal})}},1651(e,t,a){"use strict";a.d(t,{$:()=>i,X:()=>l});var n=a(3716),o=a(8611),r=a.n(o),s=a(1455);function l(){let e=`${n.restBaseUrl}/stockmanagement/report?v=default`,{data:t,error:a,isLoading:o}=r()(e,n.openmrsFetch);return{reportTypes:t?.data?.results??[],isLoading:o,error:a}}function i(e=!0){let t=`${n.restBaseUrl}/stockmanagement/batchjob?batchJobType=Report&v=default&limit=10&totalCount=true`,{data:a,error:o,isLoading:l,mutate:c}=r()(e?t:null,n.openmrsFetch,{refreshInterval:15e3,dedupingInterval:1e4}),[m,d]=(0,s.useState)(10),{goTo:u,results:p,currentPage:_}=(0,n.usePagination)(a?.data?.results,m);return{reports:a?.data?.results??[],isLoading:l,error:o,items:p,totalItems:a?.data?.results?.length??0,currentPage:_,currentPageSize:m,paginatedItems:p,goTo:u,pageSizes:[10,20,30,40,50],setPageSize:d,mutate:c}}},8455(e,t,a){"use strict";a.d(t,{UP:()=>l,Xh:()=>i,qi:()=>c});var n=a(3716),o=a(3767),r=a(8611),s=a.n(r);function l(e){let t=`${n.restBaseUrl}/stockmanagement/stocksource${(0,o.q)(e)}`,{data:a,error:r,isLoading:l}=s()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:r}}function i(e){let t=e.reduce((e,t,a)=>0===a?e:e+=(e.length>0?",":"")+encodeURIComponent(t),"");t.length>0&&(t="?ids="+t);let a=`${n.restBaseUrl}/stockmanagement/stocksource/${e[0]}${t}`,o=new AbortController;return(0,n.openmrsFetch)(a,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:o.signal})}function c(e){let t=null!=e.uuid,a=`${n.restBaseUrl}/stockmanagement/stocksource${t?"/"+e.uuid:""}`,o=new AbortController;return(0,n.openmrsFetch)(a,{method:"POST",headers:{"Content-Type":"application/json"},signal:o.signal,body:{...e,sourceType:e?.sourceType?.uuid}})}},1347(e,t,a){"use strict";a.d(t,{IV:()=>i,Wh:()=>l,ww:()=>c});var n=a(8611),o=a.n(n),r=a(3767),s=a(3716);function l(e){let t=`${s.restBaseUrl}/stockmanagement/userrolescope${(0,r.q)(e)}`,{data:a,error:n,isLoading:l}=o()(t,s.openmrsFetch);return{items:a?.data||{},isLoading:l,error:n}}function i(e){let t=e.reduce((e,t,a)=>0===a?e:e+=(e.length>0?",":"")+encodeURIComponent(t),"");t.length>0&&(t="?ids="+t);let a=`${s.restBaseUrl}/stockmanagement/userrolescope/${e[0]}${t}`,n=new AbortController;return(0,s.openmrsFetch)(a,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:n.signal})}function c(e){let t=new AbortController,a=null!=e.uuid,n=`${s.restBaseUrl}/stockmanagement/userrolescope${a?"/"+e.uuid:""}`;return(0,s.openmrsFetch)(n,{method:"POST",headers:{"Content-Type":"application/json"},signal:t.signal,body:e})}},7351(e,t,a){"use strict";a.d(t,{K:()=>r});var n=a(1455),o=a(8611);let r=()=>{let{mutate:e}=(0,o.useSWRConfig)();return(0,n.useCallback)(t=>e(e=>"string"==typeof e&&e.startsWith(t),void 0),[e])}}}]);