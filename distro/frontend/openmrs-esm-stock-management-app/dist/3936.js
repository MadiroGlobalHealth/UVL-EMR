(globalThis.webpackChunk_openmrs_esm_stock_management_app=globalThis.webpackChunk_openmrs_esm_stock_management_app||[]).push([["3936"],{4126(e,t,a){"use strict";a.d(t,{A:()=>n});let n={headerBtnContainer:"-esm-stock-management__stock-items-table__headerBtnContainer___Lvtqz",tileContainer:"-esm-stock-management__stock-items-table__tileContainer___xZqOk",tile:"-esm-stock-management__stock-items-table__tile___yRrkk",tileContent:"-esm-stock-management__stock-items-table__tileContent___3HzgB",content:"-esm-stock-management__stock-items-table__content___Giie2",helper:"-esm-stock-management__stock-items-table__helper___coPmu",separator:"-esm-stock-management__stock-items-table__separator___Lo7I2",toolbarContent:"-esm-stock-management__stock-items-table__toolbarContent___JQ8Kq",filterContainer:"-esm-stock-management__stock-items-table__filterContainer___sAp1-",dateAlign:"-esm-stock-management__stock-items-table__dateAlign___OFoT8",filtersAlign:"-esm-stock-management__stock-items-table__filtersAlign___h9qb6",toolbarAction:"-esm-stock-management__stock-items-table__toolbarAction___0V8Wh",tableHeader:"-esm-stock-management__stock-items-table__tableHeader___vuIl7",tableScroll:"-esm-stock-management__stock-items-table__tableScroll___sTQZm"}},4767(e,t,a){var n={"./uk.json":["723","9072"],"./ar.json":["4132","7045"],"./ru_RU.json":["986","8359"],"./uz_UZ.json":["890","7175"],"./fr.json":["4055","6508"],"./sw_KE.json":["8618","903"],"./uz.json":["3584","6377"],"./en.json":["4300","5117"],"./ky.json":["8163","2416"],"./pl.json":["1119","6724"],"./sq.json":["8371","4928"],"./ka.json":["795","1480"],"./si.json":["6859","6904"],"./zh_TW.json":["439","556"],"./de.json":["4944","5145"],"./lg.json":["4618","8695"],"./vi.json":["9214","6371"],"./tr.json":["5241","434"],"./es_MX.json":["8349","1646"],"./tr_TR.json":["9900","1869"],"./zh_CN.json":["9879","5644"],"./en_US.json":["9569","4106"],"./he.json":["4652","2317"],"./id.json":["2690","6047"],"./ku.json":["9895","4348"],"./es.json":["3099","7912"],"./ne.json":["2146","5503"],"./ar_SY.json":["7617","282"],"./uz@Latn.json":["7097","4658"],"./bn.json":["7159","6444"],"./cs.json":["6589","7182"],"./zh.json":["5661","7742"],"./hi_IN.json":["5442","4383"],"./pt_BR.json":["6468","1877"],"./qu.json":["5173","8358"],"./ro_RO.json":["6022","3963"],"./sw.json":["9913","3378"],"./am.json":["1197","9806"],"./pt.json":["6679","5132"],"./it.json":["9538","4111"],"./km.json":["4335","5940"],"./hi.json":["6840","2881"]};function o(e){if(!a.o(n,e))return Promise.resolve().then(function(){var t=Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t});var t=n[e],o=t[0];return a.e(t[1]).then(function(){return a(o)})}o.keys=()=>Object.keys(n),o.id=4767,e.exports=o},7003(e,t,a){"use strict";a.d(t,{Cg:()=>p,Ec:()=>c,Mz:()=>l,Qg:()=>f,UE:()=>d,Ul:()=>b,Wh:()=>N,YI:()=>s,Zz:()=>k,bp:()=>E,dt:()=>v,fH:()=>g,fK:()=>S,iD:()=>T,je:()=>w,m0:()=>m,v9:()=>u,vI:()=>h,x9:()=>i,xM:()=>y,yj:()=>_,yu:()=>C});var n=a(7968),o=a.n(n),r=a(6008);window.getOpenmrsSpaBase,o()(new Date().setUTCHours(0,0,0,0)).format("YYYY-MM-DDTHH:mm:ss.SSSZZ"),Intl.DateTimeFormat().resolvedOptions().timeZone;let s="DD/MM/YYYY",l="d/m/Y",i=e=>(0,r.g1)(e,s),c=()=>{let e=new Date;return new Date(e.getFullYear(),e.getMonth(),e.getDate())},m=Object.freeze({SOURCES:"Sources",OPERATION:"Operation",STATUS:"Status"}),d="App: stockmanagement.reports",u="Task: stockmanagement.reports.mutate",p="d210eb66-2188-11ed-9dff-507b9dea1806",_="cca4be4b-2188-11ed-9dff-507b9dea1806",g="84bdd876-4694-11ed-8109-00155dcc3fc0",k="a49be648-6b0a-11ed-93a2-806d973f13a9",b="2083fd40-3391-11ed-a667-507b9dea1806",h=!0,E=!0,y="Health Center",f="moduleResources/stockmanagement/assets/print-logo.svg",v="Main Store",T=!0,N=e=>`/user-role-scopes/${e}`,S=(e,t)=>`/stock-items/${e}${t?`?tab=${t}`:""}`,C=(e,t)=>`/openmrs/ws/rest/v1/stockmanagement/batchjobartifact?id=${e}${t?"&download=1":""}`;function w(e){let t=e?.responseBody?.error?.fieldErrors;return t?Object.values(t).flatMap(e=>e.map(e=>e.message)):[e?.responseBody?.error?.message??e?.message]}},3767(e,t,a){"use strict";a.d(t,{G:()=>o,q:()=>r});var n,o=((n={}).Default="default",n.Full="full",n.REF="ref",n);function r(e,t=!0){if(!e)return"";let a=Object.keys(e)?.map(a=>{let n=e[a];return t&&(!1===n||!0===n||n)||!t&&(""===n||!1===n||!0===n||n)?`${encodeURIComponent(a)}=${encodeURIComponent(n.toString())}`:null}).filter(e=>null!=e).join("&");return a.length>0?"?"+a:""}},9684(e,t,a){"use strict";a.d(t,{By:()=>n});let n=["NEW","SUBMITTED","DISPATCHED","COMPLETED","RETURNED","CANCELLED","REJECTED"]},3466(e,t,a){"use strict";a.d(t,{Eh:()=>u,Hu:()=>m,LD:()=>p,R6:()=>l,S5:()=>o,Wf:()=>d,Xb:()=>i,en:()=>c,jQ:()=>s,lj:()=>r,t$:()=>b});var n,o=((n={}).TRANSFER_OUT_OPERATION_TYPE="transferout",n.DISPOSED_OPERATION_TYPE="disposed",n.STOCK_ISSUE_OPERATION_TYPE="stockissue",n.STOCK_TAKE_OPERATION_TYPE="stocktake",n.REQUISITION_OPERATION_TYPE="requisition",n.OPENING_STOCK_OPERATION_TYPE="initial",n.RECEIPT_OPERATION_TYPE="receipt",n.RETURN_OPERATION_TYPE="return",n.ADJUSTMENT_OPERATION_TYPE="adjustment",n);function r(e){return"transferout"===(e=e?.toLowerCase())?"transferout":"disposed"===e?"disposed":"stockissue"===e?"stockissue":"stocktake"===e?"stocktake":"requisition"===e?"requisition":"receipt"===e?"receipt":"return"===e?"return":"adjustment"===e?"adjustment":"initial"===e?"initial":void 0}let s=e=>"adjustment"===e||"stocktake"===e||"disposed"===e,l=e=>"adjustment"===e,i=e=>!c(e)&&"requisition"!==e,c=e=>"receipt"===e||"initial"===e,m=e=>"requisition"===e,d=e=>"receipt"===e||"initial"===e,u=e=>"stockissue"===e||"return"===e,p=e=>"stockissue"===e||_(e)||g(e)||k(e),_=e=>"requisition"===e,g=e=>"receipt"===e,k=e=>"transferout"===e,b=e=>"stockissue"===e},7092(e,t,a){"use strict";a.d(t,{A:()=>d});var n=a(4037),o=a.n(n),r=a(401),s=a(4213),l=a(1014),i=a(3654),c=a(5366);let m={widgetContainer:"-esm-stock-management__table__widgetContainer___yyK1I",widgetHeaderContainer:"-esm-stock-management__table__widgetHeaderContainer___LXuqs",toggleButtons:"-esm-stock-management__table__toggleButtons___IDXdF",searchField:"-esm-stock-management__table__searchField___JNd9O",searchBox:"-esm-stock-management__table__searchBox___zsTHQ",container:"-esm-stock-management__table__container___r5gjS",tabContainer:"-esm-stock-management__table__tabContainer___T0+Dm",itemListSearch:"-esm-stock-management__table__itemListSearch___kQCXe",tileContainer:"-esm-stock-management__table__tileContainer___y7bJu",tile:"-esm-stock-management__table__tile___tBLDw",tileContent:"-esm-stock-management__table__tileContent___PGTHq",menuItem:"-esm-stock-management__table__menuItem___Y1vXl",radioButtonGroup:"-esm-stock-management__table__radioButtonGroup___o0xvH",radioButton:"-esm-stock-management__table__radioButton___8e61a",section:"-esm-stock-management__table__section___DdCkE",sectionTitle:"-esm-stock-management__table__sectionTitle___2+NJM",modalBody:"-esm-stock-management__table__modalBody___jFvGH",tableContainer:"-esm-stock-management__table__tableContainer___WuS2z",search:"-esm-stock-management__table__search___ysc8+",toolbarContent:"-esm-stock-management__table__toolbarContent___NRN6N",itemListDownload:"-esm-stock-management__table__itemListDownload___jkHl6",content:"-esm-stock-management__table__content___-EUvd",helper:"-esm-stock-management__table__helper___uLyZY"},d=({columns:e,data:t,children:a,totalItems:d,goToPage:u,hasToolbar:p=!0})=>{let{t:_}=(0,r.useTranslation)(),g=(0,c.useLayoutType)(),[k,b]=(0,n.useState)([]),h="tablet"===(0,c.useLayoutType)(),[E]=(0,n.useState)(t),y=[10,20,30,40,50],[f,v]=(0,n.useState)(10),{goTo:T,results:N,currentPage:S}=(0,c.usePagination)(E,f);(0,n.useEffect)(()=>{let e=[];N.map((t,a)=>e.push({...t,id:a++})),b(e)},[N,k]);let C=()=>{let t=new Blob([I(E,e)],{type:"text/csv;charset=utf-8"});(0,s.saveAs)(t,"data.csv")},w=()=>{let e=new Blob([JSON.stringify(E,null,2)],{type:"application/json"});(0,s.saveAs)(e,"data.json")},I=(e,t)=>[t.map(e=>e.header).join(","),...e.map(e=>t.map(t=>JSON.stringify(e[t.key])).join(","))].join("\n");return o().createElement(o().Fragment,null,o().createElement(l.DataTable,{"data-floating-menu-container":!0,rows:k,headers:e,filterRows:({rowIds:e,headers:t,cellsById:a,inputValue:n,getCellId:o})=>e.filter(e=>t.some(({key:t})=>{let r=a[o(e,t)].value,s=n?.toLowerCase();return"boolean"!=typeof r&&(""+r)?.toLowerCase().includes(s)})),overflowMenuOnHover:(0,c.isDesktop)(g),size:h?"lg":"md",useZebraStyles:!0},({rows:e,headers:t,getHeaderProps:n,getTableProps:r,onInputChange:s})=>o().createElement("div",null,o().createElement(l.TableContainer,{className:m.tableContainer},p&&o().createElement(l.TableToolbar,{style:{position:"static",overflow:"visible",backgroundColor:"color"}},o().createElement(l.TableToolbarContent,{className:m.toolbarContent},a?a({onInputChange:s}):o().createElement(o().Fragment,null,o().createElement(l.OverflowMenu,{focusTrap:!1,iconDescription:_("downloadOptions","Download options"),renderIcon:i.QN,size:"sm"},o().createElement(l.OverflowMenuItem,{className:m.menuItem,itemText:_("downloadAsCSV","Download As CSV"),onClick:C}),o().createElement(l.OverflowMenuItem,{className:m.menuItem,itemText:_("downloadAsJson","Download As JSON"),onClick:w})),o().createElement(l.TableToolbarSearch,{className:m.itemListSearch,expanded:!0,onChange:s,placeholder:_("searchThisList","Search this list"),size:"sm"})))),o().createElement(l.Table,r(),o().createElement(l.TableHead,null,o().createElement(l.TableRow,null,t.map(e=>o().createElement(l.TableHeader,{...n({header:e}),key:e.key},e.header)))),o().createElement(l.TableBody,null,e.map(e=>o().createElement(l.TableRow,{key:e.id},e.cells.map(e=>o().createElement(l.TableCell,{key:e.id},e.value)))))),0===e.length?o().createElement("div",{className:m.tileContainer},o().createElement(l.Tile,{className:m.tile},o().createElement("div",{className:m.tileContent},o().createElement("p",{className:m.content},_("noData","No data to display")),o().createElement("p",{className:m.helper},_("checkFilters","Check the filters above"))))):null,o().createElement(l.Pagination,{forwardText:_("nextPage","Next page"),backwardText:_("previousPage","Previous page"),page:S,pageSize:f,pageSizes:y,totalItems:d||E?.length,className:m.pagination,onChange:({pageSize:e,page:t})=>{if(e!==f&&v(e),t!==S){if(u)return void u(t);T(t)}}})))))}},570(e,t,a){"use strict";a.d(t,{d:()=>o});var n=a(4037);function o(e,t=1e3){let a=(0,n.useRef)();return(0,n.useEffect)(()=>()=>{a.current&&clearTimeout(a.current)},[]),(...n)=>{let o=setTimeout(()=>{e(...n)},t);clearTimeout(a.current),a.current=o}}},6008(e,t,a){"use strict";a.d(t,{P9:()=>s,g1:()=>r,xp:()=>l});var n=a(7968),o=a.n(n);let r=(e,t)=>e?o()(e).format(t??"DD-MMM-YYYY"):"",s=(e,t)=>e?o()(e).format(t??"DD-MMM-YYYY HH:mm"):"",l=e=>e?o()(e).format("YYYY-MM-DD"):e},8728(e,t,a){"use strict";function n(e){let t=e?.match(/^(.*\S)\s*\((.*)\)$/s);return t&&t[1].trim().toLowerCase()===t[2].trim().toLowerCase()?t[1].trim():e}a.d(t,{U:()=>n})},1139(e,t,a){"use strict";a.r(t),a.d(t,{root:()=>tz,deletePackagingUnitModal:()=>tM,stockManagementAdminCardLink:()=>tq,stockManagement:()=>t2,stockOperationsModal:()=>t9,stockSourcesLink:()=>t0,stockOperationsLink:()=>tV,stockItemsLink:()=>tQ,stockOperations:()=>tZ,transactionStockcardPrintPreviewModal:()=>al,stockLocations:()=>t1,deleteUserScopeModal:()=>tO,deletePackagingUnitButton:()=>tL,importTranslation:()=>t$,stockReports:()=>t5,importBulkStockItemsModal:()=>tF,stockUserScopesLink:()=>tJ,stockOperationFormWorkspace:()=>ae,stockItemFormWorkspace:()=>at,stockUserScopesFormWorkspace:()=>ar,stockNavMenu:()=>tH,stockUserScopes:()=>tK,deleteStockModal:()=>tR,stockItems:()=>tW,stockOverviewLink:()=>tY,stockSourcesFormWorkspace:()=>an,issuingStockModal:()=>tP,transactionBincardPrintPreviewModal:()=>as,startupApp:()=>ai,receivingStockModal:()=>tj,stockReportsFormWorkspace:()=>ao,stockReportsLink:()=>t6,stockItemRulesFormWorkspace:()=>aa,stockLocationsLink:()=>t4,stockOverview:()=>tG,stockSettingsLink:()=>t7,stockManagementAppMenuItem:()=>t8,stockSettings:()=>t3,expiredStockModal:()=>tB,stockSources:()=>tX,createLocationModal:()=>ac});var n=a(5366);let o={autoPopulateResponsiblePerson:{_type:n.Type.Boolean,_default:!1,_description:"Auto-populate responsible person in stock operations with the currently logged-in user"},dispensingUnitsUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock dispensing units",_default:"162402AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},enablePrintButton:{_type:n.Type.Boolean,_default:!0,_description:"Enable or disable the print button in the stock management UI"},logo:{src:{_type:n.Type.String,_default:null,_description:"A path or URL to an image"},alt:{_type:n.Type.String,_default:"Logo",_description:"Alt text shown on hover"},name:{_type:n.Type.String,_default:null,_description:"The organization name displayed when image is absent"}},packingUnitsUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the packaging unit",_default:"a6d438fe-05c1-4d4d-9755-c11cf6b0b3b9"},printBalanceOnHand:{_type:n.Type.Boolean,_default:!1,_description:"Whether to include balance on hand on the printout"},printItemCost:{_type:n.Type.Boolean,_default:!1,_description:"Whether to include item costs on the printout"},responsiblePersonExcludedRoles:{_type:n.Type.Array,_elements:{_type:n.Type.String},_default:[],_description:'Users holding any of these roles (role names, e.g. "System Developer") are not offered as the responsible person of a stock operation, so that system and integration accounts do not crowd out staff'},stockAdjustmentReasonUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock adjustment reasons",_default:"3a9021d1-d6c1-4fc2-8e30-ca8e204e44de"},stockItemCategoryUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock item category",_default:"8ccf6066-9297-4d76-aaf3-00aa3714d198"},stockSourceTypeUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock source types",_default:"937a0440-95f7-42f6-aaef-16cf611fcf10"},stockTakeReasonUUID:{_type:n.Type.ConceptUuid,_description:"UUID for the stock take reasons",_default:"faa466c5-0953-4d4f-8ea7-d9a06341c3f3"},useItemCommonNameAsDisplay:{_type:n.Type.Boolean,_description:"Use item common name as display (true) or drug name as display (false)",_default:!0}};var r=a(4037),s=a.n(r),l=a(9657),i=a(401);function c({dashboardLinkConfig:e}){let{name:t,title:a,titleKey:o}=e,{t:m}=(0,i.useTranslation)(),d=(0,l.useLocation)(),u=`${window.spaBase}/stock-management`,p=(0,r.useMemo)(()=>{let e=d.pathname.split("/");return decodeURIComponent(e[e.length-1])},[d.pathname]);return s().createElement(n.ConfigurableLink,{to:`${u}/${t}`,className:`cds--side-nav__link ${p.match(t)&&"active-left-nav-link"}`},o?m(o,a):a)}let m=e=>()=>s().createElement(l.BrowserRouter,null,s().createElement(c,{dashboardLinkConfig:e}));var d=a(1014),u=a(9564),p=a(3270),_=a(7136),g=a(3335);let k="-esm-stock-management__stock-management-header__value___9tRKk",b=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,n.useSession)(),a=t?.sessionLocation?.display;return s().createElement(n.PageHeader,{className:"-esm-stock-management__stock-management-header__header___LKg86","data-testid":"stock-management-header"},s().createElement(n.PageHeaderContent,{illustration:s().createElement(n.StockManagementPictogram,null),title:e("stockManagement","Stock management")}),s().createElement("div",{className:"-esm-stock-management__stock-management-header__right-justified-items___oK4n1"},s().createElement("div",{className:"-esm-stock-management__stock-management-header__date-and-location___8nnlA"},s().createElement(_.aZ,{size:16}),s().createElement("span",{className:k},a),s().createElement("span",{className:"-esm-stock-management__stock-management-header__middot___MhHzj"},"\xb7"),s().createElement(g.Vv,{size:16}),s().createElement("span",{className:k},(0,n.formatDate)(new Date,{mode:"standard"})))))},h=({dashboardSlot:e,title:t})=>s().createElement(s().Fragment,null,s().createElement(b,null),s().createElement(n.ExtensionSlot,{name:e,state:{dashboardTitle:t}}));function E(){let e=(0,l.useParams)(),t=(0,n.useExtensionSlotMeta)("stock-page-dashboard-slot"),a=(0,n.useLayoutType)(),o=Object.values(t).filter(e=>Object.keys(e).length)||[],r=o.find(t=>t.name===e?.dashboard)||o[0];return s().createElement("div",{className:"-esm-stock-management__home-dashboard__homePageWrapper___TnM9T"},s().createElement("section",{className:(0,n.isDesktop)(a)?"-esm-stock-management__home-dashboard__dashboardContainer___lLkxS":"-esm-stock-management__home-dashboard__dashboardContainerTablet___3pvso"},(0,n.isDesktop)(a)&&s().createElement(n.ExtensionSlot,{name:"stock-sidebar-slot",key:a}),s().createElement(h,{title:r?.name,dashboardSlot:r?.slot})))}var y=a(2383),f=a(3767),v=a(9587);function T(){let[e,t]=(0,r.useState)({startIndex:0,v:f.G.Default,q:null,includeStockItemName:"true"});(0,r.useEffect)(()=>{t({v:f.G.Default,includeStockItemName:"true"})},[]);let{items:a,isLoading:n,error:o}=(0,v.ME)(e);return{items:a.results??[],isLoading:n,error:o}}function N(e){let[t,a]=(0,r.useState)({v:e||f.G.Default,q:null,totalCount:!0}),{items:n,isLoading:o,error:s}=(0,v.QC)(t);return(0,r.useEffect)(()=>{a({v:f.G.Default,totalCount:!0})},[]),{items:n?.results??[],isLoading:o,error:s}}let S="-esm-stock-management__stock-home-detail-card__content___k1ELO",C="-esm-stock-management__stock-home-detail-card__card___MuR+4",w="-esm-stock-management__stock-home-detail-card__icon___d49jB",I="-esm-stock-management__stock-home-detail-card__cardText___WIaKk",D=()=>{let{t:e}=(0,i.useTranslation)(),{items:t,isLoading:a}=T(),{items:o,isLoading:r}=N();if(r||a)return null;if(o?.length===0)return s().createElement("p",{className:S},e("noInventoryAlerts","No inventory alerts to display"));let l=new Date,c=t.map(e=>{let t=o?.find(t=>e?.stockItemUuid===t.uuid);return{...e,...t}}),m=(c=c.filter(e=>e.hasExpiration)).filter(e=>{let t=Math.ceil((new Date(e.expiration).getTime()-l.getTime())/864e5);return t<=180&&t>=0}).slice(0,5);return s().createElement(s().Fragment,null,m.map((t,a)=>s().createElement("div",{className:C,key:a},s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__colorLineRed___hXQea"}),s().createElement("div",{className:w},s().createElement(y.Cs,{size:40,color:"#DA1E28"})),s().createElement("div",{className:I},s().createElement("p",null,e("expiringStock","Expiring stock")),s().createElement("p",null,s().createElement("strong",null,t?.drugName)," ",e("batchNumberLabel","Batch number:")," ",t?.batchNo," ",e("quantityLabel","Quantity:")," ",t?.quantity," ",t?.dispensingUnitName)))),s().createElement(d.Button,{kind:"ghost",onClick:()=>{let e=(0,n.showModal)("expired-stock-modal",{closeModal:()=>e(),expiredStock:c})},size:"sm"},e("viewAll","View All")))};var x=a(3654),U=a(4779),A=a(8728);let $=()=>{let{t:e}=(0,i.useTranslation)(),{items:t,isLoading:a}=function(e){let{items:t,isLoading:a,error:n}=(0,U.kR)(e);return{items:t?.results?.filter(e=>e?.operationType==="stockissue"&&e?.status!=="COMPLETED"),isLoading:a,error:n}}({v:f.G.Full,totalCount:!0});if(a)return null;if(t?.length===0)return s().createElement("p",{className:S},e("noIssuedStock","No issued stock to display"));let o=t?.map((e,t)=>(e?.stockOperationItems||[]).map((a,n)=>({status:e?.status,sourceName:e?.sourceName,destinationName:e?.destinationName,stockItemName:(0,A.U)(a?.stockItemName),stockItemPackagingUOMName:a?.stockItemPackagingUOMName,quantity:a?.quantity,key:`${t}-${n}`}))),r=o?.flat().slice(0,10);return s().createElement(s().Fragment,null,r?.map((e,t)=>s().createElement("div",{className:C,key:t},s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__colorLineGreen___wm9i4"}),s().createElement("div",{className:w},s().createElement(x.t0,{size:40,color:"#198038"})),s().createElement("div",{className:I},s().createElement("p",null,e?.status," \xb7 ",e?.sourceName," \xb7 ",e?.destinationName),s().createElement("p",null,s().createElement("strong",null,e?.stockItemName)," ",e?.stockItemPackagingUOMName,", ",e?.quantity)))),s().createElement(d.Button,{kind:"ghost",onClick:()=>{let e=(0,n.showModal)("issuing-stock-modal",{closeModal:()=>e(),issuingStock:t})},size:"sm"},e("viewAll","View All")))},R=()=>{let{t:e}=(0,i.useTranslation)(),{items:t,isLoading:a}=function(e){let{items:t,isLoading:a,error:n}=(0,U.kR)(e);return{items:t?.results?.filter(e=>e?.operationType==="receipt"&&e?.status!=="COMPLETED"),isLoading:a,error:n}}({v:f.G.Full,totalCount:!0});return a?null:t?.length===0?s().createElement("p",{className:S},e("noReceivedStock","No received stock to display")):s().createElement(s().Fragment,null,t?.map((e,t)=>e?.stockOperationItems.map(a=>s().createElement("div",{className:C,key:t},s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__colorLineBlue___h+uO1"}),s().createElement("div",{className:w},s().createElement(x.rf,{size:40,color:"#0F62FE"})),s().createElement("div",{className:I},s().createElement("p",null,e?.status," \xb7 ",e?.sourceName," \xb7 ",e?.destinationName),s().createElement("p",null,s().createElement("strong",null,(0,A.U)(a?.stockItemName))," ",a?.stockItemPackagingUOMName,","," ",a?.quantity))))),s().createElement(d.Button,{kind:"ghost",onClick:()=>{let e=(0,n.showModal)("receiving-stock-modal",{closeModal:()=>e(),receivingStock:t})},size:"sm"},e("viewAll","View All")))},O=({title:e,children:t})=>{let a="tablet"===(0,n.useLayoutType)();return s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__tilesContainer___7Uurd"},s().createElement(d.Layer,null,s().createElement(d.Tile,null,s().createElement("div",{className:a?"-esm-stock-management__stock-home-detail-card__tabletHeading___cNMqn":"-esm-stock-management__stock-home-detail-card__desktopHeading___5EUrG"},s().createElement("h4",null,e)),t)))},M=()=>{let{t:e}=(0,i.useTranslation)();return s().createElement("div",{className:"-esm-stock-management__stock-home-detail-card__cardContainer___M502h"},s().createElement(O,{title:e("inventoryAlerts","Inventory alerts")},s().createElement(D,null)),s().createElement(O,{title:e("receiving","Receiving")},s().createElement(R,null)),s().createElement(O,{title:e("issuing","Issuing")},s().createElement($,null)))};var L=a(4189),B=a.n(L),F=a(7968),P=a.n(F),z=a(8906),j=a.n(z),q=a(6401);let H="-esm-stock-management__metrics-card__countGrid___rz7tr";P().extend(j());let G=({label:e,value:t,headerLabel:a,children:n,count:o,outOfStockCount:r,disposedCount:l})=>{let{t:c}=(0,i.useTranslation)();return s().createElement(d.Tile,{className:"-esm-stock-management__metrics-card__tileContainer___2dbmS"},s().createElement("div",{className:"-esm-stock-management__metrics-card__tileHeader___I+lc1"},s().createElement("div",{className:"-esm-stock-management__metrics-card__headerLabelContainer___FcNbu"},s().createElement("label",{className:"-esm-stock-management__metrics-card__headerLabel___ynB1N"},a),n)),s().createElement("div",{className:"-esm-stock-management__metrics-card__metricsGrid___7NagF"},s().createElement("div",null,s().createElement("label",{className:"-esm-stock-management__metrics-card__totalsLabel___6Mw2w"},e),s().createElement("p",{className:"-esm-stock-management__metrics-card__totalsValue___esjS3"},t)),!(0,q.A)(o)&&s().createElement("div",{className:H},s().createElement("span",null),s().createElement("span",{className:"-esm-stock-management__metrics-card__in6MonthsLabel___7yBr-"},c("in6Months","In 6 months")),s().createElement("p",null),s().createElement("p",{className:"-esm-stock-management__metrics-card__in6MonthsValue___6mIwS"},o.expiry6months?.length)),!(0,q.A)(r)&&s().createElement("div",{className:H},s().createElement("span",{className:"-esm-stock-management__metrics-card__belowMinLabel___28e5i"},c("understockedItems","Understocked items")),s().createElement("span",{className:"-esm-stock-management__metrics-card__aboveMaxLabel___z++jU"},c("overstockedItems","Overstocked items")),s().createElement("p",{className:"-esm-stock-management__metrics-card__belowMinValue___ZZJpg"},r.itemsBelowMin?.length),s().createElement("p",{className:"-esm-stock-management__metrics-card__aboveMaxValue___3W76E"},r.itemsAboveMax?.length)),!(0,q.A)(l)&&s().createElement("div",{className:H},s().createElement("span",{className:"-esm-stock-management__metrics-card__expiredLabel___0WP2Q"},c("expired","Expired")),s().createElement("span",{className:"-esm-stock-management__metrics-card__poorQualityLabel___dA002"},c("poorQuality","Poor Quality")),s().createElement("p",{className:"-esm-stock-management__metrics-card__expiredValue___46Xws"},l.expired?.length),s().createElement("p",{className:"-esm-stock-management__metrics-card__poorQualityValue___fsfCF"},l.poorQuality?.length))))},Y=e=>{let{t}=(0,i.useTranslation)(),{stockList:a,error:o}=(()=>{let e=`${n.restBaseUrl}/stockmanagement/stockitem?v=default&totalCount=true`,{data:t,error:a,isLoading:o}=B()(e,n.openmrsFetch);return{stockList:t?.data.results.map(e=>({uuid:e.uuid,hasExpiration:e.hasExpiration,expiryNotice:e.expiryNotice}))??[],isLoading:o,error:a}})(),{items:r}=T(),{items:l}=N(),c=new Date,m=r.map(e=>{let t=l?.find(t=>e?.stockItemUuid===t.uuid);return{...e,...t}}),d=(m=m.filter(e=>e.hasExpiration)).filter(e=>{let t=e.expiryNotice||0,a=Math.ceil((new Date(e.expiration).getTime()-c.getTime())/864e5);return a<=t||a<0}),u=d.filter(e=>e.hasExpiration&&e.expiryNotice<=180),{items:p}=function(e){let{items:t,isLoading:a,error:n}=(0,U.kR)(e);return{items:t?.results?.filter(e=>e?.operationType==="disposed"),isLoading:a,error:n}}({v:f.G.Full,totalCount:!0});if(o)return s().createElement(n.ErrorState,{headerTitle:t("errorStockMetric","Error fetching stock metrics"),error:o});let _=p&&p.filter(e=>"Drug not available due to expired medication"===e.reasonName),g=p&&p.filter(e=>"Poor Quality"===e.reasonName);return s().createElement("div",{className:"-esm-stock-management__stock-home__cardContainer___haC5o"},s().createElement(G,{count:{expiry6months:u},headerLabel:t("expiringStock","Expiring stock"),label:t("expiringStock","Expiring stock"),value:d?.length||0}),s().createElement(G,{label:t("outOfStock","Out of stock"),headerLabel:t("outOfStock","Out of stock"),outOfStockCount:{itemsBelowMin:[],itemsAboveMax:[]},value:a?.length}),s().createElement(G,{disposedCount:{expired:_,poorQuality:g},headerLabel:t("disposedStock","Disposed stock"),label:t("disposedStock","Disposed stock"),value:p?.length||0}))};var Z=a(771),V=a(7351),W=a(7187),Q=a(570);let K=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{(0,W.m)()},[]);return s().createElement(d.Button,{onClick:t,size:"md",kind:"primary"},e("addStockItem","Add stock item"))},J=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{let e=(0,n.showModal)("import-bulk-stock-items",{closeModal:()=>e()})},[]);return s().createElement(d.Button,{iconDescription:e("import","Import"),kind:"ghost",onClick:t},e("import","Import"))},X=({data:e})=>{let{t}=(0,i.useTranslation)();return s().createElement(d.Button,{kind:"ghost",size:"md",onClick:()=>{e.isDrug=!!e.drugUuid,(0,W.m)(e)},iconDescription:t("editStockItem","Edit stock item")},`${e?.drugName??e.conceptName}`)},ee=({filterType:e,changeFilterType:t})=>{let{t:a}=(0,i.useTranslation)();return s().createElement(d.RadioButtonGroup,{name:"is-drug",defaultSelected:e,onChange:e=>t(e),className:"-esm-stock-management__filter-stock-items__spacing___bU+u5"},s().createElement(d.RadioButton,{labelText:a("all","All"),value:"",id:"is-drug-all"}),s().createElement(d.RadioButton,{labelText:a("pharmaceuticals","Pharmaceuticals"),value:"true",id:"is-drug-drug"}),s().createElement(d.RadioButton,{labelText:a("nonPharmaceuticals","Non Pharmaceuticals"),value:"false",id:"is-drug-other"}))};var et=a(4126);let ea=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,V.K)(),[a,o]=(0,r.useState)(""),l=()=>{t(`${n.restBaseUrl}/stockmanagement/stockitem`)},{currentPage:c,currentPageSize:m,isDrug:u,isLoading:p,items:_,pageSizes:g,setCurrentPage:k,setDrug:b,setPageSize:h,setSearchString:E,totalCount:y}=function(e){let{t}=(0,i.useTranslation)(),[a,o]=(0,r.useState)(1),[s,l]=(0,r.useState)(10),[c,m]=(0,r.useState)(null),[d,u]=(0,r.useState)(""),[p,_]=(0,r.useState)({startIndex:a-1,v:e||f.G.Default,limit:s,q:null,totalCount:!0}),{items:g,isLoading:k,error:b}=(0,v.QC)(p),h=(0,n.usePagination)(g.results,s);return(0,r.useEffect)(()=>{_({startIndex:a-1,v:f.G.Default,limit:s,q:c,totalCount:!0,isDrug:d})},[c,a,s,d]),{items:h.results,pagination:h,totalCount:g.totalCount,currentPageSize:s,currentPage:a,setCurrentPage:o,setPageSize:l,pageSizes:[10,20,30,40,50],isLoading:k,error:b,isDrug:d,setDrug:e=>{o(1),u(e)},setSearchString:m}}(f.G.Full),T=(0,Q.d)(e=>{E(e)},1e3);(0,r.useEffect)(()=>{T(a)},[a,T]);let N=(0,r.useMemo)(()=>[{id:0,header:e("type","Type"),key:"type"},{id:1,header:e("genericName","Generic name"),key:"genericName"},{id:2,header:e("commonName","Common name"),key:"commonName"},{id:3,header:e("tradeName","Trade name"),key:"tradeName"},{id:4,header:e("dispensingUnitName","Dispensing UoM"),key:"dispensingUnitName"},{id:5,header:e("defaultStockOperationsUoMName","Bulk packaging"),key:"defaultStockOperationsUoMName"},{id:6,header:e("reorderLevel","Reorder level"),key:"reorderLevel"},{id:7,header:e("actions","Actions"),key:"actions"}],[e]),S=(0,r.useMemo)(()=>_?.map((t,a)=>({...t,id:t?.uuid,key:`key-${t?.uuid}`,uuid:`${t?.uuid}`,type:t?.drugUuid?e("drug","Drug"):e("other","Other"),genericName:s().createElement(X,{data:_[a]}),commonName:t?.commonName,tradeName:t?.drugUuid?t?.conceptName:"",preferredVendorName:t?.preferredVendorName,dispensingUoM:t?.defaultStockOperationsUoMName,dispensingUnitName:t?.dispensingUnitName,defaultStockOperationsUoMName:t?.defaultStockOperationsUoMName,reorderLevel:t?.reorderLevelUoMName&&t?.reorderLevel?`${t?.reorderLevel?.toLocaleString()} ${t?.reorderLevelUoMName}`:"",actions:s().createElement(d.IconButton,{kind:"ghost",label:e("editStockItem","Edit stock item"),onClick:()=>{t.isDrug=!!t.drugUuid,(0,W.m)(t)}},s().createElement(Z.ff,{size:16}))})),[_,e]);return p?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):s().createElement(s().Fragment,null,s().createElement("h2",{className:et.A.tableHeader},e("stockItemsTableHeader","Drugs and other stock items managed by the system.")),s().createElement(d.DataTable,{rows:S,headers:N,isSortable:!0,useZebraStyles:!0},({rows:t,headers:r,getHeaderProps:i,getTableProps:c,getRowProps:m,getBatchActionProps:p})=>s().createElement(d.TableContainer,null,s().createElement(d.TableToolbar,{style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableBatchActions,p()),s().createElement(d.TableToolbarContent,{className:et.A.toolbarContent},s().createElement(d.TableToolbarSearch,{onChange:e=>{o("string"==typeof e?e:e.target.value)},persistent:!0,placeholder:e("searchStockItems","Search stock items"),value:a}),s().createElement(ee,{filterType:u,changeFilterType:b}),s().createElement(J,null),s().createElement(d.TableToolbarMenu,{"data-testid":"stock-items-menu"},s().createElement(d.TableToolbarAction,{className:et.A.toolbarAction,onClick:l},e("refresh","Refresh"))),s().createElement(K,null))),s().createElement("div",{className:et.A.tableScroll},s().createElement(d.Table,c(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,r.map(e=>"details"!==e.key&&s().createElement(d.TableHeader,{...i({header:e,isSortable:e.isSortable}),className:n.isDesktop?et.A.desktopHeader:et.A.tabletHeader,key:`${e.key}`,isSortable:"name"!==e.key},"object"==typeof e.header&&null!==e.header&&"content"in e.header?e.header.content:e.header)),s().createElement(d.TableHeader,null))),s().createElement(d.TableBody,null,t.map(e=>s().createElement(s().Fragment,{key:e.id},s().createElement(d.TableRow,{...m({row:e}),className:n.isDesktop?et.A.desktopRow:et.A.tabletRow,key:e.id},e.cells.map(e=>e?.info?.header!=="details"&&s().createElement(d.TableCell,{key:e.id},e.value)))))))),0===t.length?s().createElement("div",{className:et.A.tileContainer},s().createElement(d.Tile,{className:et.A.tile},s().createElement("div",{className:et.A.tileContent},s().createElement("p",{className:et.A.content},e("noStockItemsToDisplay","No stock items to display")),s().createElement("p",{className:et.A.helper},e("checkFilters","Check the filters above"))))):null)),s().createElement(d.Pagination,{className:et.A.paginationOverride,onChange:({page:e,pageSize:t})=>{k(e),h(t)},page:c,pageSize:m,pageSizes:g,totalItems:y}))};var en=a(2137),eo=a(1844),er=a(7092);let es=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useRef)();(0,r.useEffect)(()=>()=>t.current?.(),[]);let{tableHeaders:a,tableRows:o,items:l,isLoading:c,mutate:m}=(0,eo.zC)({v:f.G.Full}),u=()=>{m()};return c?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):l?.length?s().createElement(er.A,{columns:a,data:o},({onInputChange:a})=>s().createElement(s().Fragment,null,s().createElement(d.TableToolbarSearch,{persistent:!0,onChange:a}),s().createElement(d.TableToolbarMenu,null,s().createElement(d.TableToolbarAction,{className:et.A.toolbarMenuAction,onClick:u},e("refresh","Refresh"))),s().createElement(d.Button,{kind:"ghost",renderIcon:e=>s().createElement(en.OM,{size:16,...e}),onClick:()=>{t.current?.(),t.current=(0,n.showModal)("stock-create-location-modal",{mutate:m})}},e("createLocation","Create Location")))):s().createElement("div",{className:et.A.tileContainer},s().createElement(d.Tile,{className:et.A.tile},s().createElement("p",{className:et.A.content},e("noLocationsToDisplay","No locations to display"))))};var el=a(7003),ei=a(6008),ec=a(683),em=a(5175);let ed=()=>{let{types:{results:e},isLoading:t,error:a}=(0,em.G2)(),{userRoles:n,isLoading:o,error:s}=(0,em.Ul)();return{operationTypes:(0,r.useMemo)(()=>{let t=[...new Set(n?.operationTypes?.map(e=>e.operationTypeUuid)||[])];return e?.filter(e=>t.includes(e.uuid))||[]},[e,n]),isLoading:t||o,error:a||s}},eu=({stockOperation:e,showIcon:t=!0,showprops:a=!0})=>{let{t:o}=(0,i.useTranslation)(),{error:l,isLoading:c,operationTypes:m}=ed(),{isLoading:u,items:p,error:_}=(0,U.Eb)(e?.uuid),g=(0,r.useMemo)(()=>m?.find(e=>e?.uuid===p?.operationTypeUuid),[m,p]),k=(0,r.useCallback)(()=>{(0,ec.AE)(g,p,p?.requisitionStockOperationUuid)},[g,p]);return((0,r.useEffect)(()=>{(l||_)&&(0,n.showSnackbar)({kind:"error",title:o("stockOperationLoadError","Error loading stock operation"),subtitle:l?.message||_?.message||""})},[l,_,o]),c||u)?s().createElement(d.InlineLoading,{status:"active",iconDescription:"Loading"}):l||_?s().createElement(s().Fragment,null,"--"):s().createElement(d.Button,{className:"-esm-stock-management__edit-stock-operation-button__editStockButton___aF9CI",kind:"ghost",size:"sm",onClick:k,renderIcon:t?()=>s().createElement(Z.ff,{size:16}):void 0},a&&s().createElement("span",{className:"-esm-stock-management__edit-stock-operation-button__operationNumberText___sw6oi"},p?.operationNumber))};var ep=a(1673),e_=a(3466);let eg=()=>{let{t:e}=(0,i.useTranslation)(),{error:t,isLoading:a,operationTypes:o}=ed(),l=(0,r.useCallback)(e=>{e.operationType,e_.S5.STOCK_ISSUE_OPERATION_TYPE,(0,ec.AE)(e,void 0)},[]);return((0,r.useEffect)(()=>{t&&(0,n.showSnackbar)({kind:"error",title:e("stockOperationTypesError","Error loading stock operation types"),subtitle:t?.message})},[t,e]),a)?s().createElement(d.ButtonSkeleton,null):t?null:o&&o.length?s().createElement(d.OverflowMenu,{renderIcon:()=>s().createElement(s().Fragment,null,e("startNew","Start New"),"\xa0\xa0",s().createElement(ep.CH,{size:16})),menuOffset:{top:0,left:-100},style:{backgroundColor:"#007d79",backgroundImage:"none",color:"#fff",minHeight:"1rem",padding:".95rem !important",width:"8rem",marginRight:"0.5rem",whiteSpace:"nowrap"}},o.sort((e,t)=>e.name.localeCompare(t.name)).map(e=>s().createElement(d.OverflowMenuItem,{key:e.uuid,itemText:e.name,onClick:()=>{l(e)}}))):null};var ek=a(9684);let eb=({conceptUuid:e,onFilterChange:t,filterName:a})=>{let{t:n}=(0,i.useTranslation)(),{items:o,isLoading:l}=(0,em.cj)(e),[c,m]=(0,r.useState)(!1),[u,p]=(0,r.useState)([]);return((0,r.useEffect)(()=>{switch(m(!0),a){case el.m0.STATUS:p(ek.By.map(e=>({uuid:e,display:e})));break;case el.m0.SOURCES:o?.answers?.length&&(p([...o.answers]),m(l));break;case el.m0.OPERATION:(0,em.bh)().then(e=>{m(!0),e.data?.results.length&&p(e.data.results.map(e=>({uuid:e.uuid,display:e.name}))),m(!1)})}m(!1)},[a,l,o.answers]),c)?s().createElement(d.DropdownSkeleton,null):s().createElement(d.MultiSelect,{autoAlign:!0,className:et.A.filtersAlign,disabled:!u.length,id:"multiSelect",label:a,labelInline:!0,items:u,itemToString:e=>e?e.display:n("notSet","Not Set"),onChange:({selectedItems:e})=>{e&&t(e.map(e=>e.uuid),a)},placeholder:n("filterBy","Filter by {{filterName}}",{filterName:a})})};var eh=a(9184);let eE=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Approve",operation:e,requireReason:!1,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,renderIcon:e=>s().createElement(eh.cR,{size:16,...e})},t("approve","Approve"))},ey=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Dispatch",operation:e,requireReason:!1,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,renderIcon:e=>s().createElement(x.jw,{size:16,...e})},t("dispatch","Dispatch"))},ef=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Cancel",operation:e,requireReason:!0,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,kind:"danger--ghost",renderIcon:e=>s().createElement(Z.$D,{size:16,...e})},t("cancel","Cancel "))},ev=({operation:e,reason:t})=>{let{t:a}=(0,i.useTranslation)(),o=(0,r.useCallback)(()=>{let a=(0,n.showModal)("stock-operations-modal",{title:"Complete Dispatch",operation:e,requireReason:t,closeModal:()=>a()})},[e,t]);return s().createElement(d.Button,{onClick:o,renderIcon:e=>s().createElement(en.cD,{size:16,...e})},a("completeDispatch","Complete dispatch"))},eT=({operation:e})=>{let{t}=(0,i.useTranslation)(),{error:a,isLoading:o,types:l}=(0,em.G2)(),c=(0,r.useMemo)(()=>l?.results?.find(e=>e.operationType===e_.S5.STOCK_ISSUE_OPERATION_TYPE),[l]);return((0,r.useEffect)(()=>{a&&(0,n.showSnackbar)({kind:"error",title:t("stockOperationTypesError","Error loading stock operation types"),subtitle:a?.message})},[a,t]),o)?s().createElement(d.InlineLoading,{description:"",iconDescription:t("loadingOperationTypes","Loading operation types")}):s().createElement(d.Button,{onClick:()=>{(0,ec.AE)(c,void 0,e.uuid)},kind:"tertiary",renderIcon:e=>s().createElement(x.U$,{size:16,...e})},t("issueStock","Issue Stock "))},eN=`
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
`,eS=async()=>{let e=await (0,n.getConfig)("@openmrs/esm-stock-management-app"),t=e?.logo?.src;return new Promise((e,a)=>{if(!t)return void e(null);let n=document.getElementById("hdnTxtPrintLogo");if(n&&n.value?.length>0){let t=n.getAttribute("isSvg");e({image:n.value,isSvg:"1"===t});return}if(t.toLowerCase().endsWith(".svg"))fetch(t,{headers:{"Disable-WWW-Authenticate":"true"}}).then(e=>{if(!e.ok)throw Error("Print logo fetch network response was not OK");return e.text()}).then(t=>{n&&(n.value=t,n.setAttribute("isSvg","1")),e({image:t,isSvg:!0})}).catch(e=>{console.error("Error fetching print logo: ",e),a("Error fetching print logo")});else{let o=new Image;o.addEventListener("load",()=>{try{let t=document.createElement("canvas");t.width=o.width,t.height=o.height;let r=t.getContext("2d");if(r){r.drawImage(o,0,0);let a=t.toDataURL("image/png");n&&(n.value=a,n.setAttribute("isSvg","0")),e({image:a,isSvg:!1})}else a("Failed to allocate canvas context for print logo")}catch(e){a(e)}}),o.addEventListener("error",e=>{a(e)}),o.src=t}})},eC=(e,t,a=!1,n=!0)=>`<html>
<head>
<meta http-equiv=Content-Type content="text/html; charset=utf8">
<title>${t??""}</title>
<style>
${eN}
</style>
</head>
<body onload="${a?"window.print()":""}" style='word-wrap:break-word' ${n?'onafterprint="self.close()"':""}>
    ${e}
</body>
</html>`,ew=async()=>{let e=await (0,n.getConfig)("@openmrs/esm-stock-management-app"),t=e?.logo?.name,a=null;if(el.Qg)try{a=await eS()}catch(e){console.error(e)}return a||t?`
<div class="logo" >
    ${a?a.isSvg?a.image:`<img alt='' src='${a.image}' />`:""}
    ${t?`<span class='logo-text text'>${t}</span>`:""}
</div>    
    `:""},eI=async()=>{let e=await ew();return`
<div class="logo-row right">
${e}
</div>    
    `},eD=e=>{setTimeout(()=>{let t;(t=window.open("","Print-Window"))&&(t.document.open(),t.document.write(e),t.document.close())},300)},ex=async e=>{let t=Math.max(0,25-(e?.items?.length??0)),a=await eI();return`
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
                        <b><span>${(0,ei.g1)(e?.operationDate)}</span></b>
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
                    <td valign="middle" class="center">${(0,ei.g1)(e.expiryDate)}</td>                    
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
    `},eU=async e=>{eD(eC(await ex(e),e?.documentTitle,!0,el.iD))},eA=async e=>{let t=Math.max(0,28-(e?.items?.length??0)),a=await eI();return`
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
                        <b><span>${(0,ei.g1)(e?.operationDate)}</span></b>
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
                    <td valign="middle" class="center">${el.vI||!e.balanceOnHand?"":`${e.balanceOnHand?.toLocaleString()}  ${e.balanceOnHandUoM??""}`}</td>
                    <td valign="middle" class="center">${e.quantityRequired?.toLocaleString()??""} ${e.quantityRequiredUoM??""}</td>
                    <td valign="middle" class="center">${e.quantityIssued?.toLocaleString()??""} ${e.quantityIssuedUoM??""}</td>
                    <td valign="middle" class="center">${el.bp?"":`${e.unitCost?.toLocaleString()??""}${e.unitCostUoM?`/${e.unitCostUoM}`:""}`}</td>
                    <td valign="middle" class="center">${el.bp?"":`${e.totalCost?.toLocaleString()??""}`}</td>
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
    `},e$=async e=>{eD(eC(await eA(e),e?.documentTitle,!0,el.iD))},eR=async(e,t,a,n,o)=>{let r={};return e_.S5.REQUISITION_OPERATION_TYPE!==e.operationType&&(r.authorizedBy=e?.dispatchedDate?`${e.dispatchedByFamilyName??""} ${e.dispatchedByGivenName??""}`:e?.completedDate?`${e.completedByFamilyName??""} ${e.completedByGivenName??""}`:""),r.remarks=e.remarks,r.operationNumber=e?.operationNumber,r.operationDate=a?.operationDate??e?.operationDate,r.location=a?.atLocationName??e?.atLocationName,r.source=e?.sourceName,r.destination=e?.destinationName,r.responsiblePerson=r.orderedBy=a?.responsiblePersonFamilyName?`${a.responsiblePersonFamilyName??""} ${a?.responsiblePersonGivenName??""}`:`${e.responsiblePersonFamilyName??""} ${e.responsiblePersonGivenName??""}`,r.organizationName=el.xM,r.documentTitle=`${e.operationTypeName} ${e?.operationNumber}${a?` of ${a.operationTypeName} ${a?.operationNumber}`:""}`,r.items=t.map(t=>{let r={};if(r.itemCode=t?.acronym,r.itemDescription=(0,A.U)(t?.stockItemName),r.purchasePrice=t?.purchasePrice,r.batchNumber=t?.batchNo,r.expiryDate=t?.expiration,a?(r.quantityRequired=t?.quantityRequested,r.quantityRequiredUoM=t?.quantityRequestedPackagingUOMName,r.quantityIssued=t?.quantity,r.quantityIssuedUoM=t?.stockItemPackagingUOMName):e_.S5.STOCK_ISSUE_OPERATION_TYPE===e.operationType?(r.quantityIssued=t?.quantity,r.quantityIssuedUoM=t?.stockItemPackagingUOMName):(r.quantityRequired=t?.quantity,r.quantityRequiredUoM=t?.stockItemPackagingUOMName),n){let e=n.find(e=>e.uuid===t.uuid);e&&(r.unitCost=e.unitCost,r.unitCostUoM=e.unitCostUOMName,r.totalCost=e.totalCost)}if(o){let e=o.find(e=>e.stockItemUuid===t.stockItemUuid);e&&(r.balanceOnHand=e.quantity,r.balanceOnHandUoM=e.quantityUoM)}return r}),r},eO=async e=>{let t=Math.max(0,25-(e?.items?.length??0)),a=await eI();return`
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
                        <b><span>${(0,ei.g1)(e?.operationDate)}</span></b>
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
                    <td valign="middle" class="center">${(0,ei.g1)(e.expiryDate)}</td>                    
                    <td valign="middle" class="center">${e.quantityRequired?.toLocaleString()??""} ${e.quantityRequiredUoM??""}</td>
                    <td valign="middle" class="center">${el.bp?"":`${e.unitCost?.toLocaleString()??""}${e.unitCostUoM?`/${e.unitCostUoM}`:""}`}</td>
                    <td valign="middle" class="center">${el.bp?"":`${e.totalCost?.toLocaleString()??""}`}</td>
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
    `},eM=async e=>{eD(eC(await eO(e),e?.documentTitle,!0,el.iD))},eL=({operation:e})=>{let{t}=(0,i.useTranslation)(),{isLoading:a,items:o,error:l}=(0,U.Eb)(e.uuid),[c,m]=(0,r.useState)(!1),p=async()=>{m(!0);try{let t,a=null,n=null;if(o.requisitionStockOperationUuid&&!(t=(await (0,U.Wu)(o.requisitionStockOperationUuid)).data))return;if((t||t?.operationType==="stockissue"||t?.operationType==="transferout")&&1){let e={};o?.uuid&&(e.stockOperationUuid=o.uuid);let t=await (0,U.jp)(e);a=t.data?.results}if(t||t?.operationType==="requisition"){let e={};o?.uuid,e.locationUuid=o.atLocationUuid,e.stockOperationUuid=o.uuid,e.v=f.G.Default,e.groupBy="LocationStockItem",e.includeStockItemName="true",e.date=t?.dateCreated?new Date(t.dateCreated).toISOString():o?.dateCreated?new Date(o.dateCreated).toISOString():null;let a=await (0,U._o)(e);n=a.data?.results}let r=await eR(o,o.stockOperationItems??e?.stockOperationItems??[],t,a,n);r?o?.operationType===e_.S5.RECEIPT_OPERATION_TYPE?await eU(r):o?.operationType===e_.S5.TRANSFER_OUT_OPERATION_TYPE?await eM(r):await e$(r):console.warn(r)}catch(e){console.error(e),(0,n.showSnackbar)({kind:"error",title:t("errorPrintingStockOperation","Error printing stock operation"),subtitle:(0,el.je)(e).join(", ")})}finally{m(!1)}};return s().createElement(d.Button,{onClick:p,kind:"tertiary",disabled:a||c,renderIcon:e=>s().createElement(u.xj,{size:16,...e})},c||a?s().createElement(d.InlineLoading,{description:t("loadingPlaceholder","Loading..."),iconDescription:t("loading","Loading")}):t("print","Print"))},eB=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Reject",operation:e,requireReason:!0,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,renderIcon:e=>s().createElement(u.kM,{size:16,...e})},t("reject","Reject"))},eF=({operation:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{let t=(0,n.showModal)("stock-operations-modal",{title:"Return",operation:e,requireReason:!0,closeModal:()=>t()})},[e]);return s().createElement(d.Button,{onClick:a,kind:"tertiary",renderIcon:e=>s().createElement(eh.XE,{size:16,...e})},t("return","Return "))};var eP=a(4094);let ez={tileContainer:"-esm-stock-management__stock-operations-table__tileContainer___Hf3bi",tile:"-esm-stock-management__stock-operations-table__tile___Rltv3",tileContent:"-esm-stock-management__stock-operations-table__tileContent___PKYUb",content:"-esm-stock-management__stock-operations-table__content___5YHki",helper:"-esm-stock-management__stock-operations-table__helper___hMVu7",toolbarContent:"-esm-stock-management__stock-operations-table__toolbarContent___ioLvK",container:"-esm-stock-management__stock-operations-table__container___lqN-P",filterContainer:"-esm-stock-management__stock-operations-table__filterContainer___dgDtc",rowLoadingContainer:"-esm-stock-management__stock-operations-table__rowLoadingContainer___2mLNR",statusContainer:"-esm-stock-management__stock-operations-table__statusContainer___ZOYeD",textHeading:"-esm-stock-management__stock-operations-table__textHeading___xKm0I",statusDescriptions:"-esm-stock-management__stock-operations-table__statusDescriptions___ofld0",text:"-esm-stock-management__stock-operations-table__text___yjDAz",actionBtns:"-esm-stock-management__stock-operations-table__actionBtns___lkAho",relatedLink:"-esm-stock-management__stock-operations-table__relatedLink___ZKj5j",relatedTransactionHeader:"-esm-stock-management__stock-operations-table__relatedTransactionHeader___siCKr",toolbarMenuAction:"-esm-stock-management__stock-operations-table__toolbarMenuAction___7cJiz",dataTableSkeleton:"-esm-stock-management__stock-operations-table__dataTableSkeleton___WNbMf",datePicker:"-esm-stock-management__stock-operations-table__datePicker___xyvJu",arrowIcon:"-esm-stock-management__stock-operations-table__arrowIcon___nKYBV",tableHeader:"-esm-stock-management__stock-operations-table__tableHeader___9b8Dj"},ej=({stockOperation:e,stockOperationType:t})=>{let a=(0,eP.A)(t),n=(0,r.useMemo)(()=>(0,e_.lj)(t.operationType),[t]);return s().createElement(s().Fragment,null,(!e.permission?.canEdit&&(e.permission?.canApprove||e.permission?.canReceiveItems)||e.permission?.canEdit||(0,e_.LD)(n)||(e?.permission?.isRequisitionAndCanIssueStock??!1)||e.permission?.isRequisitionAndCanIssueStock)&&s().createElement("div",{className:ez.actionBtns},s().createElement(s().Fragment,null,!e.permission?.canEdit&&e.permission?.canApprove&&s().createElement(s().Fragment,null,!a.requiresDispatchAcknowledgement&&s().createElement(eE,{operation:e}),a.requiresDispatchAcknowledgement&&s().createElement(ey,{operation:e}),s().createElement(eB,{operation:e}),s().createElement(eF,{operation:e}),s().createElement(ef,{operation:e})),!e.permission?.canEdit&&e.permission?.canReceiveItems&&s().createElement(s().Fragment,null,s().createElement(ev,{operation:e,reason:!1}),s().createElement(eF,{operation:e})),e.permission?.canEdit&&s().createElement(ef,{operation:e}),e.permission?.isRequisitionAndCanIssueStock&&s().createElement(eT,{operation:e}),(e.permission?.isRequisitionAndCanIssueStock||e.operationType===e_.S5.STOCK_ISSUE_OPERATION_TYPE||e.operationType===e_.S5.REQUISITION_OPERATION_TYPE||e.operationType===e_.S5.RECEIPT_OPERATION_TYPE||e.operationType===e_.S5.TRANSFER_OUT_OPERATION_TYPE)&&s().createElement(eL,{operation:e}))))},eq=({stockOperationUuid:e,operationNumber:t})=>{let{error:a,isLoading:n,types:o}=(0,em.G2)(),{error:l,isLoading:i,items:c}=(0,U.Eb)(e),m=(0,r.useCallback)(()=>{let e=o?.results?.find(e=>e?.uuid===c?.operationTypeUuid);e&&(0,ec.AE)(e,c,c?.requisitionStockOperationUuid)},[o,c]);return n||a||l||i?null:s().createElement("span",{onClick:m,style:{cursor:"pointer",textDecoration:"underline"}},t)},eH=({stockOperation:e,stockOperationType:t})=>{let{error:a,isLoading:o,operationLinks:l}=(e=>{let t=`${n.restBaseUrl}/stockmanagement/stockoperationlink?v=default&q=${e}`,{data:a,error:o,isLoading:r,mutate:s}=B()(e?t:null,n.openmrsFetch);return{error:o,isLoading:r,mutate:s,operationLinks:a?.data?.results??[]}})((0,r.useMemo)(()=>t?.operationType===e_.S5.REQUISITION_OPERATION_TYPE||e?.operationType===e_.S5.REQUISITION_OPERATION_TYPE||t?.operationType===e_.S5.STOCK_ISSUE_OPERATION_TYPE||e?.operationType===e_.S5.STOCK_ISSUE_OPERATION_TYPE?e.uuid:null,[t,e]));return o||a?null:s().createElement("div",null," ",l&&l.length>0&&s().createElement("div",null,s().createElement("h6",{className:ez.relatedTransactionHeader},"Related Transactions:"),l.map(a=>(e.uuid===a?.parentUuid||t?.uuid===a?.parentUuid)&&s().createElement(s().Fragment,{key:a.uuid},s().createElement("span",null,a?.childOperationTypeName),s().createElement("span",{className:a?.childVoided?"voided":""}," ",a?.childVoided&&a?.childOperationNumber,!a?.childVoided&&s().createElement("span",{className:ez.relatedLink},s().createElement(eq,{stockOperationUuid:a?.childUuid,operationNumber:a?.childOperationNumber})))," ",s().createElement("span",null,"[",a?.childStatus,"]"))),s().createElement("span",null," "),l.map(a=>(e.uuid===a?.childUuid||t.uuid===a?.childUuid)&&s().createElement(s().Fragment,{key:a.uuid},s().createElement("span",null,a?.parentOperationTypeName),s().createElement("span",{className:a?.parentVoided?"voided":""}," ",a?.parentVoided&&a?.parentOperationNumber,!a?.parentVoided&&s().createElement("span",{className:ez.relatedLink},s().createElement(eq,{stockOperationUuid:a?.parentUuid,operationNumber:a?.parentOperationNumber})))," ",s().createElement("span",null,"[",a?.parentStatus,"]")))))},eG=({items:e})=>{let{t}=(0,i.useTranslation)(),[a,o]=(0,r.useState)(10),l=(0,r.useMemo)(()=>[5,10,20,50,100],[]),[c,m]=(0,r.useState)(""),u=e.filter(e=>{let t=c.trim().toLowerCase();return!t||(e.commonName??"").toLowerCase().includes(t)}),{results:p,totalPages:_,currentPage:g,goTo:k}=(0,n.usePagination)(u,a),b=(0,r.useMemo)(()=>[{header:t("item","Item"),key:"commonName"},{header:t("batchNo","Batch number"),key:"batchNo"},{header:t("expiry","Expiry"),key:"expiration"},{header:t("quantity","Quantity"),key:"quantity"},{header:t("uom","Unit of Measurement"),key:"stockItemPackagingUOMName"}],[t]),h=(0,r.useMemo)(()=>p.map((e,t)=>({id:t,...e,expiration:e.expiration?(0,n.formatDate)((0,n.parseDate)(`${e.expiration}`)):"--"})),[p]);return s().createElement(d.Tile,{className:"-esm-stock-management__stock-items-table__container___EJrwZ"},s().createElement("span",{className:"-esm-stock-management__stock-items-table__title___yPzNC"},t("stockItems","Stock items")),s().createElement(d.Search,{labelText:t("search","Search"),value:c,onChange:({target:{value:e}})=>m(e)}),s().createElement(d.DataTable,{useZebraStyles:!0,rows:h,headers:b},({rows:e,headers:t,getTableProps:a,getHeaderProps:n,getRowProps:o})=>s().createElement(d.Table,a(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,t.map(e=>s().createElement(d.TableHeader,n({header:e}),e.header)))),s().createElement(d.TableBody,null,e.map(e=>s().createElement(d.TableRow,o({row:e}),e.cells.map(e=>s().createElement(d.TableCell,{key:e.id},e.value))))))),s().createElement(d.Pagination,{page:g,pageSize:a,pageSizes:l,totalItems:u.length,onChange:({page:e,pageSize:t})=>{k(e),o(t)}}))},eY="-esm-stock-management__stock-operation-expanded-row__text___57AWf",eZ="-esm-stock-management__stock-operation-expanded-row__statusContainerRow___NCj+K",eV=({status:e,statusFillerFamilyName:t,statusFillerGivenName:a,statusFilledDate:o,extraStatusinfo:r})=>{let{t:l}=(0,i.useTranslation)();return s().createElement("div",null,s().createElement("span",{className:"-esm-stock-management__stock-operation-expanded-row__textHeading___jsti5"},e,":"),s().createElement("div",{className:"-esm-stock-management__stock-operation-expanded-row__statusDescriptions___Zk1Ht"},s().createElement("span",{className:eY},(0,n.formatDate)((0,n.parseDate)(o),{time:!0,mode:"standard"})),s().createElement("span",{className:eY},l("by","By")),s().createElement("span",{className:eY},t," \xa0",a),r))},eW=e=>{let{t}=(0,i.useTranslation)(),{types:a,isLoading:n,error:o}=(0,em.G2)(),l=(0,r.useMemo)(()=>a?.results?.find(({uuid:t})=>e.model.operationTypeUuid===t),[e.model.operationTypeUuid,a?.results]);return s().createElement(s().Fragment,null,s().createElement(d.Layer,{className:"-esm-stock-management__stock-operation-expanded-row__statusContainer___e8ZHc"},s().createElement(d.Row,{className:eZ},e.model?.dateCreated&&s().createElement(eV,{status:t("started","Started"),statusFilledDate:e.model?.dateCreated.toString(),statusFillerFamilyName:e.model?.creatorFamilyName,statusFillerGivenName:e.model?.creatorGivenName}),e.model.submittedDate&&s().createElement(eV,{status:t("submitted","Submitted"),statusFilledDate:e.model?.submittedDate.toString(),statusFillerFamilyName:e.model?.submittedByFamilyName,statusFillerGivenName:e.model?.submittedByGivenName}),e.model?.dispatchedDate&&s().createElement(eV,{status:t("dispatched","Dispatched"),statusFilledDate:e.model?.dispatchedDate.toString(),statusFillerFamilyName:e.model?.dispatchedByFamilyName,statusFillerGivenName:e.model?.dispatchedByGivenName}),e.model?.returnedDate&&s().createElement(eV,{status:t("returned","Returned"),statusFilledDate:e.model?.returnedDate.toString(),statusFillerFamilyName:e.model?.returnedByFamilyName,statusFillerGivenName:e.model?.returnedByGivenName,extraStatusinfo:s().createElement("span",{className:eY},e.model?.returnReason)}),e.model?.completedDate&&s().createElement(eV,{status:t("completed","Completed"),statusFilledDate:e.model?.completedDate.toString(),statusFillerFamilyName:e.model?.completedByFamilyName,statusFillerGivenName:e.model?.completedByGivenName}),e.model?.status==="CANCELLED"&&s().createElement(eV,{status:t("cancelled","Cancelled"),statusFilledDate:e.model?.cancelledDate.toString(),statusFillerFamilyName:e.model?.cancelledByFamilyName,statusFillerGivenName:e.model?.cancelledByGivenName,extraStatusinfo:s().createElement("span",{className:eY},e.model?.cancelReason)}),e.model?.status==="REJECTED"&&s().createElement(eV,{status:t("rejected","Rejected"),statusFilledDate:e.model?.rejectedDate.toString(),statusFillerFamilyName:e.model?.rejectedByFamilyName,statusFillerGivenName:e.model?.rejectedByGivenName,extraStatusinfo:s().createElement("span",null,e.model?.rejectionReason)})),s().createElement(d.Row,{className:eZ},n&&s().createElement(d.InlineLoading,{description:t("loadingStockOperationLinks","Loading stock operation links..."),iconDescription:t("loadingStockOperationLinksIcon","Loading stock operation links")}),l&&s().createElement(eH,{stockOperationType:l,stockOperation:e.model})),s().createElement(d.Row,{className:eZ},s().createElement(eG,{items:e.model.stockOperationItems})),s().createElement(d.Row,{className:eZ},n&&s().createElement(d.InlineLoading,{description:t("loadingOperationActions","Loading stock operation actions..."),iconDescription:t("loadingOperationActionsIcon","Loading stock operation actions")}),l&&s().createElement(ej,{stockOperationType:l,stockOperation:e.model}))))},eQ=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,V.K)(),a=()=>{t(`${n.restBaseUrl}/stockmanagement/stockoperation`)},[o,l]=(0,r.useState)(null),[c,m]=(0,r.useState)(null),[u,p]=(0,r.useState)([]),[_,g]=(0,r.useState)([]),[k,b]=(0,r.useState)([]),{items:h,tableHeaders:E,currentPage:y,pageSizes:v,totalItems:T,goTo:N,currentPageSize:S,setPageSize:C,isLoading:w}=function(e){let{items:t,isLoading:a,error:o}=(0,U.kR)(e),[s,l]=(0,r.useState)(10),{goTo:c,results:m,currentPage:d}=(0,n.usePagination)(t.results,s),{t:u}=(0,i.useTranslation)(),p=(0,r.useMemo)(()=>[{id:0,header:u("type","Type"),key:"operationTypeName"},{id:1,header:u("number","Number"),key:"operationNumber"},{id:2,header:u("stockOperationItemsTableHeader","Items"),key:"stockOperationItems"},{id:3,header:u("status","Status"),key:"status"},{id:4,header:u("location","Location"),key:"location"},{id:5,header:u("responsiblePerson","Responsible Person"),key:"responsiblePerson"},{id:6,header:u("date","Date"),key:"operationDate"},{id:7,key:"details",header:""},{key:"actions",header:""}],[u]);return{items:m,totalItems:t?.totalCount,currentPage:d,currentPageSize:s,paginatedItems:m,goTo:c,pageSizes:[10,20,30,40,50],isLoading:a,error:o,setPageSize:l,tableHeaders:p}}({v:f.G.Full,totalCount:!0,operationDateMin:o?.toISOString(),operationDateMax:c?.toISOString(),status:_.join(","),sourceTypeUuid:u.join(","),operationTypeUuid:k.join(",")}),I=o||c||u.length||_.length||k.length,D=(0,r.useCallback)((e,t)=>{t===el.m0.SOURCES?p(e):t===el.m0.OPERATION?b(e):g(e)},[]),x=(0,r.useMemo)(()=>h?.map((e,t)=>{let a=(e?.stockOperationItems?.length??0)>1,n=e?.stockOperationItems?.slice(0,a?1:void 0).map(e=>e.commonName).join(", ")??"";return{...e,id:e?.uuid,key:`key-${e?.uuid}`,operationTypeName:`${e?.operationTypeName}`,operationNumber:s().createElement(eu,{stockOperation:e,showIcon:!1,showprops:!0}),stockOperationItems:{commonNames:n,more:a?e?.stockOperationItems?.length-1:0},status:`${e?.status}`,source:`${e?.sourceName??""}`,destination:`${e?.destinationName??""}`,location:s().createElement(s().Fragment,null,e?.sourceName??"",e?.sourceName&&e?.destinationName?s().createElement(en.Qp,{className:ez.arrowIcon,key:`${t}-0`,size:12}):""," ",e?.destinationName??""),responsiblePerson:`${e?.responsiblePersonFamilyName??e?.responsiblePersonOther??""} ${e?.responsiblePersonGivenName??""}`,operationDate:(0,ei.g1)(e?.operationDate),actions:s().createElement(eu,{stockOperation:e,showIcon:!0,showprops:!1})}}),[h]);return w&&!I?s().createElement(d.DataTableSkeleton,{className:ez.dataTableSkeleton,showHeader:!1,rowCount:5,columnCount:5,zebra:!0}):s().createElement(s().Fragment,null,s().createElement("h2",{className:ez.tableHeader},e("stockOperationsTableHeader","Stock operations to track movement of stock.")),s().createElement(d.DataTable,{headers:E,isSortable:!0,rows:x,useZebraStyles:!0},({expandRow:t,getExpandedRowProps:r,getHeaderProps:i,getRowProps:u,getTableProps:p,headers:_,onInputChange:g,rows:k})=>s().createElement(d.TableContainer,null,s().createElement(d.TableToolbar,{style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableToolbarContent,{className:ez.toolbarContent},s().createElement(d.TableToolbarSearch,{expanded:!0,labelText:e("searchStockOperations","Search stock operations"),onChange:g,placeholder:e("searchStockOperations","Search stock operations")}),s().createElement("div",{className:ez.container},s().createElement(d.DatePicker,{className:ez.datePicker,datePickerType:"range",dateFormat:el.Mz,onChange:([e,t])=>(([e,t])=>{e&&(l(e),c&&e&&c<e&&m(e)),t&&(m(t),o&&t&&o>t&&l(t))})([e,t]),value:[o,c]},s().createElement(d.DatePickerInput,{id:"stock-operations-start-date",labelText:e("startDate","Start date"),placeholder:el.YI}),s().createElement(d.DatePickerInput,{id:"stock-operations-end-date",labelText:e("endDate","End date"),placeholder:el.YI})),s().createElement(eb,{filterName:el.m0.SOURCES,onFilterChange:D}),s().createElement(eb,{filterName:el.m0.STATUS,onFilterChange:D}),s().createElement(eb,{filterName:el.m0.OPERATION,onFilterChange:D})),s().createElement(d.TableToolbarMenu,null,s().createElement(d.TableToolbarAction,{className:ez.toolbarMenuAction,onClick:a},e("refresh","Refresh"))),s().createElement(eg,null))),s().createElement(d.Table,p(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,s().createElement(d.TableExpandHeader,null),_.map(e=>"details"!==e.key&&s().createElement(d.TableHeader,{...i({header:e,isSortable:e.isSortable}),className:n.isDesktop?ez.desktopHeader:ez.tabletHeader,key:`${e.key}`},e.header?.content??e.header)),s().createElement(d.TableHeader,null))),s().createElement(d.TableBody,null,k?.map((e,a)=>{let o=u({row:e});return r({row:e}),s().createElement(s().Fragment,{key:e.id},s().createElement(d.TableExpandRow,{className:n.isDesktop?ez.desktopRow:ez.tabletRow,...o},e.cells.map(a=>s().createElement(d.TableCell,{key:a.id},a?.info?.header==="stockOperationItems"?s().createElement("span",null,s().createElement("span",null,a.value.commonNames),a.value.more>0&&s().createElement(d.Link,{onClick:()=>t(e.id)},`...(${a.value.more} more)`)):a.value))),e.isExpanded?s().createElement(d.TableExpandedRow,{colSpan:_.length+2},s().createElement(eW,{model:h[a]})):s().createElement(d.TableExpandedRow,{className:ez.hiddenRow,colSpan:_.length+2}))}))),0!==k.length||w?null:s().createElement("div",{className:ez.tileContainer},s().createElement(d.Tile,{className:ez.tile},s().createElement("div",{className:ez.tileContent},s().createElement("p",{className:ez.content},e("noOperationsToDisplay","No stock operations to display")),s().createElement("p",{className:ez.helper},e("checkFilters","Check the filters above"))))),!!(I&&w)&&s().createElement("div",{className:ez.rowLoadingContainer},s().createElement(d.InlineLoading,{description:e("loadingPlaceholder","Loading...")})))),h.length>0&&s().createElement(d.Pagination,{page:y,pageSize:S,pageSizes:v,totalItems:T,onChange:({pageSize:e,page:t})=>{e!==S&&C(e),t!==y&&N(t)},className:ez.paginationOverride}))};var eK=a(4535),eJ=a(1362),eX=a(1397),e0=a(1651);let e1="Pending",e4="Completed",e5="Cancelled",e6=(e,t=[])=>{if(!e)return null;let a={};return e.split(/\r?\n|\r/).forEach(e=>{if(e.startsWith("#")||t&&t.some(t=>e.startsWith(t)))return;let n=e.split("=",2);if(2===n.length)if(n[0].startsWith("param.")){let e=n[0].substring(6),t=e.lastIndexOf(".value.desc");if(t>0&&(e=e.substring(0,t)+".display"),e){let t=e.split("."),o=t.length>1?t.slice(0,t.length-1).join("."):t[0],r=t.length>1?t[t.length-1]:"value";a[o]||(a[o]={}),a[o][r]=n[1]}}else{let e=n[0].split(".",2),t=e[0],o=e.length>1?e[1]:"value";a[t]||(a[t]={}),a[t][o]=n[1]}}),a},e3=({title:e,description:t})=>{let{t:a}=(0,i.useTranslation)();return s().createElement("div",{className:"-esm-stock-management__privileged-view__tileContainer___Yl4Vp"},s().createElement(d.Tile,{className:"-esm-stock-management__privileged-view__tile___IYz7X"},s().createElement("div",{className:"-esm-stock-management__privileged-view__tileContent___Gc2Rz"},s().createElement(x._N,{size:"24"}),s().createElement("p",{className:"-esm-stock-management__privileged-view__content___yTq+x"},a("noPrivilegesTitle",`${e}`)),t&&s().createElement("p",{className:"-esm-stock-management__privileged-view__helper___TmynX"},a("noViewPrivilegesDescription","Description: {{description}}",{description:t})))))},e7=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-reports-form-workspace")},[]);return s().createElement(d.Button,{onClick:t,size:"md",kind:"primary"},e("newReport","New Report"))},e2={container:"-esm-stock-management__stock-reports__container___ZKAc9",content:"-esm-stock-management__stock-reports__content___EyyhY",helper:"-esm-stock-management__stock-reports__helper___ZF3Ny",separator:"-esm-stock-management__stock-reports__separator___OJG7M",tileContainer:"-esm-stock-management__stock-reports__tileContainer___EQcu0",tile:"-esm-stock-management__stock-reports__tile___lwOqT",tileContent:"-esm-stock-management__stock-reports__tileContent___NirI4",statusContainer:"-esm-stock-management__stock-reports__statusContainer___-ixXF",reportStatus:"-esm-stock-management__stock-reports__reportStatus___x2TYB",textHeading:"-esm-stock-management__stock-reports__textHeading___RgSrr",statusDescriptions:"-esm-stock-management__stock-reports__statusDescriptions___+7DLu",text:"-esm-stock-management__stock-reports__text___SXJQp",toolbarMenuAction:"-esm-stock-management__stock-reports__toolbarMenuAction___gIZtH",tableHeader:"-esm-stock-management__stock-reports__tableHeader___YQ8V+"},e9=e=>{let t,{t:a}=(0,i.useTranslation)();try{t=((e,t)=>{if(!t)return null;let a=Object.keys(t);return 0===a.length?null:a.map((a,n)=>{let o=t[a].description??a,r=t[a].display??t[a].value;return s().createElement("div",{key:`${e}-param-${n}`},o,": ",r)})})(e.model?.uuid,e6(e.model?.executionState))}catch(e){console.error(e)}return s().createElement("div",{className:e2.statusContainer},e.model?.status===e5&&s().createElement("div",null,s().createElement("span",{className:e2.textHeading},a("cancelled","Cancelled"),":"),s().createElement("div",{className:e2.statusDescriptions},s().createElement("span",{className:e2.text},(0,n.formatDate)((0,n.parseDate)(e.model?.cancelledDate.toString()),{time:!0,mode:"standard"}),s().createElement("p",null,e.model?.cancelReason)))),e.model?.startTime&&s().createElement("div",null,s().createElement("span",{className:e2.textHeading},a("started","Started"),":"),s().createElement("div",{className:e2.statusDescriptions},s().createElement("span",{className:e2.text},(0,n.formatDate)((0,n.parseDate)(e.model?.startTime.toString()),{time:!0,mode:"standard"})))),e.model?.endTime&&s().createElement("div",null,s().createElement("span",{className:e2.textHeading},a("ended","Ended"),":"),s().createElement("div",{className:e2.statusDescriptions},s().createElement("span",{className:e2.text},(0,n.formatDate)((0,n.parseDate)(e.model?.endTime.toString()),{time:!0,mode:"standard"})))),e.model?.expiration&&s().createElement("div",null,s().createElement("span",{className:e2.textHeading},a("expires","Expires"),":"),s().createElement("div",{className:e2.statusDescriptions},s().createElement("span",{className:e2.text},(0,n.formatDate)((0,n.parseDate)(e.model?.expiration.toString()),{time:!0,mode:"standard"})))),t&&s().createElement("div",null,s().createElement("span",{className:e2.textHeading},a("executionState","Execution State"),":"),s().createElement("div",{className:e2.statusDescriptions},s().createElement("span",{className:e2.text},t))),e.model?.completedDate&&s().createElement("div",null,s().createElement("span",{className:e2.textHeading},a("completed","Completed"),":"),s().createElement("div",{className:e2.statusDescriptions},s().createElement("span",{className:e2.text},(0,n.formatDate)((0,n.parseDate)(e.model?.completedDate.toString()),{time:!0,mode:"standard"})))),e.model?.exitMessage&&s().createElement("div",null,s().createElement("span",{className:e2.textHeading},a("exitMessage","Message"),":"),s().createElement("div",{className:e2.statusDescriptions},s().createElement("span",{className:e2.text},s().createElement("p",null,e.model?.exitMessage)))))},e8=e=>{let t;try{t=((e,t)=>{if(!t)return null;let a=Object.keys(t);return 0===a.length?null:a.map((a,n)=>{let o=t[a].description??a,r=t[a].display??t[a].value;return s().createElement("div",{key:`${e}-param-${n}`},o,": ",r)})})(e.model?.uuid,e6(e.model?.parameters,["param.report"]))}catch(e){console.error(e)}return s().createElement("span",null,t)};var te=a(5576);let tt=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-sources-form-workspace")},[]);return s().createElement(d.Button,{onClick:t,size:"md",kind:"primary"},e("addNewStockSource","Add new source"))},ta=({data:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-sources-form-workspace",{model:e})},[e]);return s().createElement(d.IconButton,{kind:"ghost",size:"md",onClick:a,label:t("editStockSource","Edit stock source")},s().createElement(Z.ff,{size:16}))};var tn=a(8455);let to=({uuid:e})=>{let{t}=(0,i.useTranslation)(),a=(0,V.K)(),[o,l]=(0,r.useState)(!1),c=s().useCallback(()=>{let o=(0,n.showModal)("delete-stock-modal",{close:()=>o(),uuid:e,onConfirmation:()=>{let r=[];r.push(e),(0,tn.Xh)(r).then(()=>{l(!1),a(`${n.restBaseUrl}/stockmanagement/stocksource`),(0,n.showSnackbar)({isLowContrast:!0,title:t("deletingSource","Delete Source"),kind:"success",subtitle:t("stockSourceDeletedSuccessfully","Stock Source Deleted Successfully")})},e=>{l(!1),(0,n.showSnackbar)({title:t("errorDeletingSource","Error deleting a source"),kind:"error",isLowContrast:!0,subtitle:e?.message})}).catch(),o()}})},[t,e,a]),m=s().createElement(d.Button,{kind:"ghost",size:"md",onClick:c,"aria-label":t("deleteSource","Delete Source")},s().createElement(te.zH,{size:16}));return o?s().createElement(d.InlineLoading,null):m},tr=({onFilterChange:e})=>{let{t}=(0,i.useTranslation)(),{stockSourceTypeUUID:a}=(0,n.useConfig)(),{items:o,isLoading:r,error:l}=(0,em.cj)(a);return r?s().createElement(d.DropdownSkeleton,{size:"sm"}):(l&&(0,n.showSnackbar)({title:t("errorFetchingStockSourceTypes","Error fetching stock source types"),subtitle:l.message,kind:"error",isLowContrast:!0}),0===Object.keys(o).length)?null:s().createElement("div",{className:"-esm-stock-management__stock-sources-filter__filterContainer___Bb9v0"},s().createElement(d.Dropdown,{id:"stockSourcesFilter",initialSelectedItem:o?.answers?.[0],items:[...o?.answers||[]],itemToString:e=>e?e.display:t("notSet","Not Set"),label:"",onChange:({selectedItem:t})=>e(t?.display),size:"sm",titleText:t("selectSourceType","Select source type"),type:"inline"}))},ts={container:"-esm-stock-management__stock-sources__container___oayXM",headerContainer:"-esm-stock-management__stock-sources__headerContainer___8t1IZ",headerButtons:"-esm-stock-management__stock-sources__headerButtons___UOS+X",heading:"-esm-stock-management__stock-sources__heading___edIfR",filterContainer:"-esm-stock-management__stock-sources__filterContainer___vC26j",tooltip:"-esm-stock-management__stock-sources__tooltip___WBWQs",tag:"-esm-stock-management__stock-sources__tag___yDzTi",backgroundDataFetchingIndicator:"-esm-stock-management__stock-sources__backgroundDataFetchingIndicator___g-a2v",search:"-esm-stock-management__stock-sources__search___Bzrt2",tableContainer:"-esm-stock-management__stock-sources__tableContainer___sLSlE",toolbarContent:"-esm-stock-management__stock-sources__toolbarContent___mzMtt",emptyRow:"-esm-stock-management__stock-sources__emptyRow___5NiWZ",stockSourcesTable:"-esm-stock-management__stock-sources__stockSourcesTable___S3SzO",content:"-esm-stock-management__stock-sources__content___SPY43",helper:"-esm-stock-management__stock-sources__helper___u9ge-",separator:"-esm-stock-management__stock-sources__separator___047KC",tileContainer:"-esm-stock-management__stock-sources__tileContainer___xskbH",tile:"-esm-stock-management__stock-sources__tile___Vgj2L",tileContent:"-esm-stock-management__stock-sources__tileContent___pbxoz",menuItem:"-esm-stock-management__stock-sources__menuItem___MUoew",desktopHeading:"-esm-stock-management__stock-sources__desktopHeading___b1pI5",tabletHeading:"-esm-stock-management__stock-sources__tabletHeading___pLZUa",statusContainer:"-esm-stock-management__stock-sources__statusContainer___te34Z",visitType:"-esm-stock-management__stock-sources__visitType___UXsDD",headerBtnContainer:"-esm-stock-management__stock-sources__headerBtnContainer___IhIgF",addPatientToListBtn:"-esm-stock-management__stock-sources__addPatientToListBtn___tCLhZ",editIcon:"-esm-stock-management__stock-sources__editIcon___AUCBC",toolbarMenuAction:"-esm-stock-management__stock-sources__toolbarMenuAction___LMamR",tableHeader:"-esm-stock-management__stock-sources__tableHeader___Z1JQE"},tl=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,V.K)(),[a,o]=s().useState(""),l=()=>{t(`${n.restBaseUrl}/stockmanagement/stocksource`)},{items:c,totalItems:m,tableHeaders:u,currentPage:p,pageSizes:_,goTo:g,currentPageSize:k,setPageSize:b,isLoading:h}=function(e){let{t}=(0,i.useTranslation)(),{items:a,isLoading:o,error:s}=(0,tn.UP)(e),[l,c]=(0,r.useState)(10),{goTo:m,results:d,currentPage:u}=(0,n.usePagination)(a.results,l),p=(0,r.useMemo)(()=>[{id:1,header:t("name","Name"),key:"name"},{id:2,header:t("acronym","Acronym"),key:"acronym"},{id:3,header:t("sourceType","Source type"),key:"sourceType"},{id:4,header:t("actions","Actions"),key:"actions"}],[t]);return{items:d,totalItems:a?.totalCount,currentPage:u,currentPageSize:l,paginatedItems:d,goTo:m,pageSizes:[10,20,30,40,50],isLoading:o,error:s,setPageSize:c,tableHeaders:p}}({v:f.G.Default,totalCount:!0}),E=(0,r.useMemo)(()=>c?.map((e,t)=>({...e,id:e?.uuid,key:`key-${e?.uuid}`,uuid:e?.uuid,name:e?.name,acronym:e?.acronym,sourceType:e?.sourceType?.display,actions:s().createElement(s().Fragment,null,s().createElement(ta,{data:c[t]}),s().createElement(to,{uuid:c[t].uuid}))})),[c]),y=e=>{o(e)},v=(0,r.useMemo)(()=>a?E.filter(e=>e.sourceType===a):E,[E,a]);return h?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):s().createElement("div",{className:ts.tableOverride},s().createElement("h2",{className:ts.tableHeader},e("stockSourcesTableHeader","List of partners who provide stock to the facility.")),s().createElement(d.DataTable,{rows:v,headers:u,isSortable:!0,useZebraStyles:!0},({rows:t,headers:a,getHeaderProps:o,getTableProps:r,getRowProps:i,onInputChange:c})=>s().createElement(d.TableContainer,null,s().createElement(d.TableToolbar,{style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableToolbarContent,{className:ts.toolbarContent},s().createElement(d.TableToolbarSearch,{persistent:!0,onChange:c}),s().createElement("div",{style:{display:"flex",alignItems:"center"}},s().createElement(tr,{onFilterChange:y})),s().createElement(d.TableToolbarMenu,null,s().createElement(d.TableToolbarAction,{className:ts.toolbarMenuAction,onClick:l},e("refresh","Refresh"))),s().createElement(tt,null))),s().createElement(d.Table,r(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,a.map(e=>"details"!==e.key&&s().createElement(d.TableHeader,{...o({header:e,isSortable:e.isSortable}),className:n.isDesktop?ts.desktopHeader:ts.tabletHeader,key:`${e.key}`},"object"==typeof e.header&&null!==e.header&&"content"in e.header?e.header.content:e.header)),s().createElement(d.TableHeader,null))),s().createElement(d.TableBody,null,t.map(e=>s().createElement(s().Fragment,{key:e.id},s().createElement(d.TableRow,{className:n.isDesktop?ts.desktopRow:ts.tabletRow,...i({row:e})},e.cells.map(e=>e?.info?.header!=="details"&&s().createElement(d.TableCell,{key:e.id},e.value))))))),0===t.length?s().createElement("div",{className:ts.tileContainer},s().createElement(d.Tile,{className:ts.tile},s().createElement("div",{className:ts.tileContent},s().createElement("p",{className:ts.content},e("noSourcesToDisplay","No stock sources to display")),s().createElement("p",{className:ts.helper},e("checkFilters","Check the filters above"))))):null)),s().createElement(d.Pagination,{page:p,pageSize:k,pageSizes:_,totalItems:m,onChange:({pageSize:e,page:t})=>{e!==k&&b(e),t!==p&&g(t)},className:ts.paginationOverride}))},ti=()=>{let{t:e}=(0,i.useTranslation)(),t=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-user-role-scopes-form-workspace")},[]);return s().createElement(d.Button,{kind:"primary",onClick:t,size:"md"},e("addNewUserRoleScope","Add new user role scope"))},tc=({data:e})=>{let{t}=(0,i.useTranslation)(),a=(0,r.useCallback)(()=>{(0,n.launchWorkspace2)("stock-user-role-scopes-form-workspace",{model:e})},[e]);return s().createElement(d.IconButton,{autoAlign:!0,kind:"ghost",label:t("editUserRoleScope","Edit user role scope"),onClick:a},s().createElement(Z.ff,{size:16}))};var tm=a(1347);let td=({uuid:e})=>{let{t}=(0,i.useTranslation)(),a=(0,V.K)(),[o,l]=(0,r.useState)(!1),c=s().useCallback(()=>{let o=(0,n.showModal)("delete-stock-user-scope-modal",{close:()=>o(),uuid:e,onConfirmation:()=>{let r=[];r.push(e),(0,tm.IV)(r).then(()=>{a(`${n.restBaseUrl}/stockmanagement/userrolescope`),l(!1),(0,n.showSnackbar)({isLowContrast:!0,title:t("deletingStockUserScope","Delete Stock User Scope"),kind:"success",subtitle:t("stockUserScopeDeletedSuccessfully","Stock User Scope Deleted Successfully")})},e=>{l(!1),(0,n.showSnackbar)({title:t("errorDeletingUserScope","Error deleting a user scope"),kind:"error",isLowContrast:!0,subtitle:e?.message})}).catch(),o()}})},[t,e,a]),m=s().createElement(d.IconButton,{autoAlign:!0,kind:"ghost",label:t("deleteUserRoleScope","Delete user role scope"),onClick:c},s().createElement(te.zH,{size:16}));return o?s().createElement(d.InlineLoading,null):m},tu={content:"-esm-stock-management__stock-user-role-scopes__content___yGACN",helper:"-esm-stock-management__stock-user-role-scopes__helper___StCJF",separator:"-esm-stock-management__stock-user-role-scopes__separator___3sqL6",tileContainer:"-esm-stock-management__stock-user-role-scopes__tileContainer___tjBuD",tile:"-esm-stock-management__stock-user-role-scopes__tile___XEtB5",tileContent:"-esm-stock-management__stock-user-role-scopes__tileContent___DGNm3",toolbarAction:"-esm-stock-management__stock-user-role-scopes__toolbarAction___mn3IJ",arrowIcon:"-esm-stock-management__stock-user-role-scopes__arrowIcon___hWOcY",tableHeader:"-esm-stock-management__stock-user-role-scopes__tableHeader___CU9PH"},tp=function(){let{t:e}=(0,i.useTranslation)(),t=(0,V.K)(),a=(0,n.useSession)(),o=()=>{t(`${n.restBaseUrl}/stockmanagement/userrolescope`)},{items:l,totalItems:c,currentPage:m,pageSizes:u,goTo:p,currentPageSize:_,setPageSize:g,isLoading:k}=function(e){let{items:t,isLoading:a,error:o}=(0,tm.Wh)(e),[s,l]=(0,r.useState)(10),{goTo:i,results:c,currentPage:m}=(0,n.usePagination)(t.results,s);return{items:c,totalItems:t?.totalCount,currentPage:m,currentPageSize:s,paginatedItems:c,goTo:i,pageSizes:[10,20,30,40,50],isLoading:a,error:o,setPageSize:l}}({v:f.G.Default,totalCount:!0}),b=(0,r.useMemo)(()=>[{id:0,header:e("user","User"),key:"user"},{id:1,header:e("role","Role"),key:"role"},{id:2,header:e("locations","Locations"),key:"locations"},{id:3,header:e("stockOperations","Stock operations"),key:"stockOperations"},{id:4,header:e("permanent","Permanent"),key:"permanent"},{id:5,header:e("activeFrom","Active From"),key:"activeFrom"},{id:6,header:e("activeTo","Active To"),key:"activeTo"},{id:7,header:e("enabled","Enabled"),key:"enabled"},{id:8,header:e("actions","Actions"),key:"actions"}],[e]),h=(0,r.useMemo)(()=>l?.map((t,n)=>{let o=a.user.uuid===t.userUuid;return{...t,id:t?.uuid,key:`key-${t?.uuid}`,uuid:`${t?.uuid}`,user:a.user.uuid===t.userUuid?`${t?.userFamilyName} ${t.userGivenName}`:s().createElement(d.Link,{href:(0,el.Wh)(t?.uuid)},`${t?.userFamilyName} ${t.userGivenName}`),roleName:t?.role,locations:t?.locations?.map(e=>{let a=`loc-${t?.uuid}-${e.locationUuid}`;return s().createElement("span",{key:a},e?.locationName,e?.enableDescendants?s().createElement(en.PS,{className:tu.arrowIcon,key:`${a}-${n}-0`,size:12}):s().createElement(en.nk,{className:tu.arrowIcon,key:`${a}-${n}-1`,size:12}))}),stockOperations:t?.operationTypes?.map(e=>e?.operationTypeName)?.join(", "),permanent:t?.permanent?e("yes","Yes"):e("no","No"),activeFrom:(0,ei.g1)(t?.activeFrom)??"Not Set",activeTo:(0,ei.g1)(t?.activeTo)??"Not Set",enabled:t?.enabled?e("yes","Yes"):e("no","No"),actions:s().createElement("div",{style:{display:"flex"}},!o&&s().createElement(s().Fragment,null,s().createElement(tc,{data:l[n]}),s().createElement(td,{uuid:l[n].uuid})))}}),[a.user.uuid,l,e]);return k?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):s().createElement("div",{className:tu.tableOverride},s().createElement("h2",{className:tu.tableHeader},e("stockUserRoleScopesTableHeader","To access stock management features, users must have assigned roles specifying location and stock operation type scopes.")),s().createElement(d.DataTable,{headers:b,isSortable:!0,rows:h??[],useZebraStyles:!0},({rows:t,headers:a,getHeaderProps:r,getTableProps:l,getRowProps:i,onInputChange:c})=>s().createElement(d.TableContainer,null,s().createElement(d.TableToolbar,{style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableToolbarContent,{className:tu.toolbarContent},s().createElement(d.TableToolbarSearch,{persistent:!0,onChange:c}),s().createElement(d.TableToolbarMenu,null,s().createElement(d.TableToolbarAction,{className:tu.toolbarAction,onClick:o},e("refresh","Refresh"))),s().createElement(ti,null))),s().createElement(d.Table,l(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,a.map(e=>"details"!==e.key&&s().createElement(d.TableHeader,{...r({header:e,isSortable:e.isSortable}),className:n.isDesktop?tu.desktopHeader:tu.tabletHeader,key:`${e.key}`},e.header?.content??e.header)),s().createElement(d.TableHeader,null))),s().createElement(d.TableBody,null,t.map(e=>s().createElement(s().Fragment,{key:e.id},s().createElement(d.TableRow,{className:n.isDesktop?tu.desktopRow:tu.tabletRow,...i({row:e})},e.cells.map(e=>e?.info?.header!=="details"&&s().createElement(d.TableCell,{key:e.id},e.value))))))),0===t.length?s().createElement("div",{className:tu.tileContainer},s().createElement(d.Tile,{className:tu.tile},s().createElement("div",{className:tu.tileContent},s().createElement("p",{className:tu.content},e("noStockUserRoleScopesToDisplay","No stock user role scopes to display")),s().createElement("p",{className:tu.helper},e("checkFilters","Check the filters above"))))):null)),s().createElement(d.Pagination,{page:m,pageSize:_,pageSizes:u,totalItems:c,onChange:({pageSize:e,page:t})=>{e!==_&&g(e),t!==m&&p(t)},className:tu.paginationOverride}))};var t_=a(7240),tg=a(9878);let tk="-esm-stock-management__printable-transaction-header__container___WBdX5",tb="-esm-stock-management__printable-transaction-header__printableBody___FF4ZS",th="-esm-stock-management__printable-transaction-header__printableHeader___gpe8b",tE="-esm-stock-management__printable-transaction-header__img___1rO2J",ty="-esm-stock-management__printable-transaction-header__transactionDetails___8BOaI",tf="-esm-stock-management__printable-transaction-header__heading___FCJEU",tv="-esm-stock-management__printable-transaction-header__itemHeading___j9yVA",tT="-esm-stock-management__printable-transaction-header__itemLabel___Y1AWV",tN=({itemName:e})=>{let{t}=(0,i.useTranslation)(),{logo:a}=(0,n.useConfig)({externalModuleName:"@kenyaemr/esm-login-app"});return s().createElement("div",{className:tk},s().createElement("div",{className:th},s().createElement("p",{className:tf},t("binCard","Bin card")),a?.src?s().createElement("img",{className:tE,height:60,width:250,src:a.src,alt:a.alt}):a?.name?a.name:s().createElement("svg",{className:tE,role:"img",width:110,height:40,viewBox:"0 0 380 119",xmlns:"http://www.w3.org/2000/svg"},s().createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M40.29 40.328a27.755 27.755 0 0 1 19.688-8.154c7.669 0 14.613 3.102 19.647 8.116l.02-18.54A42.835 42.835 0 0 0 59.978 17c-7.089 0-13.813 1.93-19.709 4.968l.021 18.36ZM79.645 79.671a27.744 27.744 0 0 1-19.684 8.154c-7.67 0-14.614-3.101-19.651-8.116l-.02 18.54A42.857 42.857 0 0 0 59.96 103a42.833 42.833 0 0 0 19.672-4.751l.013-18.578ZM40.328 79.696c-5.038-5.037-8.154-11.995-8.154-19.685 0-7.669 3.102-14.612 8.116-19.65l-18.54-.02A42.85 42.85 0 0 0 17 60.012a42.819 42.819 0 0 0 4.752 19.672l18.576.013ZM79.634 40.289a27.753 27.753 0 0 1 8.154 19.688 27.744 27.744 0 0 1-8.117 19.646l18.542.02a42.842 42.842 0 0 0 4.749-19.666c0-7.09-1.714-13.779-4.751-19.675l-18.577-.013ZM156.184 60.002c0-8.748-6.118-15.776-15.025-15.776-8.909 0-15.025 7.028-15.025 15.776 0 8.749 6.116 15.78 15.025 15.78 8.907 0 15.025-7.031 15.025-15.78Zm-34.881 0c0-11.482 8.318-19.958 19.856-19.958 11.536 0 19.855 8.477 19.855 19.959 0 11.484-8.319 19.964-19.855 19.964-11.538 0-19.856-8.48-19.856-19.965ZM179.514 75.54c5.507 0 9.05-4.14 9.05-9.482 0-5.341-3.543-9.483-9.05-9.483-5.505 0-9.046 4.142-9.046 9.483 0 5.342 3.541 9.482 9.046 9.482ZM166.22 53.306h4.248v3.704h.11c2.344-2.725 5.449-4.36 9.154-4.36 8.014 0 13.408 5.67 13.408 13.408 0 7.63-5.613 13.406-12.752 13.406-4.58 0-8.231-2.29-9.81-5.178h-.11V90.87h-4.248V53.306ZM217.773 63.768c-.163-4.305-3-7.193-7.686-7.193-4.685 0-7.79 2.888-8.335 7.193h16.021Zm3.653 10.412c-3.001 3.868-6.596 5.284-11.339 5.284-8.01 0-12.914-5.993-12.914-13.406 0-7.901 5.559-13.407 13.08-13.407 7.196 0 12.096 4.906 12.096 13.354v1.362h-20.597c.325 4.413 3.704 8.173 8.335 8.173 3.65 0 6.105-1.307 8.12-3.868l3.219 2.508ZM227.854 59.356c0-2.346-.216-4.36-.216-6.05h4.031c0 1.363.11 2.777.11 4.195h.11c1.144-2.505 4.306-4.85 8.5-4.85 6.705 0 9.699 4.252 9.699 10.41v15.748h-4.248v-15.31c0-4.253-1.856-6.924-5.833-6.924-5.503 0-7.903 3.979-7.903 9.811V78.81h-4.25V59.356ZM259.211 41.008h6.708L278.8 70.791h.107l12.982-29.782h6.549v37.99h-4.506V47.124h-.106L280.192 79h-2.738l-13.629-31.875h-.107V79h-4.507V41.01ZM312.392 57.752h4.023c4.992 0 11.487 0 11.487-6.282 0-5.47-4.776-6.276-9.177-6.276h-6.333v12.558Zm-4.506-16.744h9.711c7.352 0 15.132 1.072 15.132 10.462 0 5.527-3.594 9.125-9.495 10.037L334.018 79h-5.525l-10.304-17.063h-5.797V79h-4.506V41.01ZM358.123 47.712c-1.506-2.413-4.187-3.486-6.926-3.486-3.973 0-8.1 1.88-8.1 6.385 0 3.49 1.931 5.047 7.994 6.98 5.903 1.878 11.377 3.809 11.377 11.267 0 7.567-6.495 11.11-13.36 11.11-4.402 0-9.125-1.45-11.7-5.262l3.862-3.165c1.61 2.794 4.83 4.24 8.105 4.24 3.862 0 8.263-2.253 8.263-6.601 0-4.669-3.165-5.474-9.928-7.728-5.366-1.771-9.442-4.134-9.442-10.463 0-7.298 6.277-10.945 12.929-10.945 4.241 0 7.836 1.178 10.625 4.45l-3.699 3.218Z"}))),s().createElement("div",{className:tb},s().createElement("div",{className:ty},s().createElement("p",{className:tv},t("itemName","Item name")),s().createElement("p",{className:tT},(0,tg.A)(e)))))},tS=({title:e})=>{let{t}=(0,i.useTranslation)(),a=(0,n.useSession)();return s().createElement("div",{className:"-esm-stock-management__printable-transaction-footer__container___f+Jry"},s().createElement("p",{className:"-esm-stock-management__printable-transaction-footer__itemFooter___GAxjn"},e),s().createElement("p",{className:"-esm-stock-management__printable-transaction-footer__footDescription___0zbqs"},t("generatedMessage","The card has been electronically generated and is a valid document. It was created by {{userName}} on {{date}}",{userName:`${a?.user?.display}`,date:`${(0,n.formatDate)(new Date,{mode:"standard",noToday:!0})}`})))},tC="-esm-stock-management__printable-transaction__itemsContainer___7r2kf",tw="-esm-stock-management__printable-transaction__tableContainer___XdOI5",tI=({columns:e,data:t,title:a})=>s().createElement("div",null,s().createElement(tN,{itemName:a}),s().createElement("div",{className:tC},s().createElement("div",{className:tw},s().createElement(d.DataTable,{"data-floating-menu-container":!0,rows:t,headers:e,useZebraStyles:!0},({rows:e,headers:t,getHeaderProps:a,getTableProps:n,onInputChange:o})=>s().createElement("div",null,s().createElement(d.TableContainer,null,s().createElement(d.Table,n(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,t.map(e=>s().createElement(d.TableHeader,a({header:e}),e.header)))),s().createElement(d.TableBody,{style:{fontSize:"8px"}},e.map(e=>s().createElement(d.TableRow,{key:e.id},e.cells.map(e=>s().createElement(d.TableCell,{key:e.id},e.value))))))))))),s().createElement(tS,{title:""})),tD=({itemName:e})=>{let{t}=(0,i.useTranslation)(),{logo:a}=(0,n.useConfig)({externalModuleName:"@kenyaemr/esm-login-app"});return s().createElement("div",{className:tk},s().createElement("div",{className:th},s().createElement("p",{className:tf},t("stockCard","Stock card")),a?.src?s().createElement("img",{className:tE,height:60,width:250,src:a.src,alt:a.alt}):a?.name?a.name:s().createElement("svg",{className:tE,role:"img",width:110,height:40,viewBox:"0 0 380 119",xmlns:"http://www.w3.org/2000/svg"},s().createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M40.29 40.328a27.755 27.755 0 0 1 19.688-8.154c7.669 0 14.613 3.102 19.647 8.116l.02-18.54A42.835 42.835 0 0 0 59.978 17c-7.089 0-13.813 1.93-19.709 4.968l.021 18.36ZM79.645 79.671a27.744 27.744 0 0 1-19.684 8.154c-7.67 0-14.614-3.101-19.651-8.116l-.02 18.54A42.857 42.857 0 0 0 59.96 103a42.833 42.833 0 0 0 19.672-4.751l.013-18.578ZM40.328 79.696c-5.038-5.037-8.154-11.995-8.154-19.685 0-7.669 3.102-14.612 8.116-19.65l-18.54-.02A42.85 42.85 0 0 0 17 60.012a42.819 42.819 0 0 0 4.752 19.672l18.576.013ZM79.634 40.289a27.753 27.753 0 0 1 8.154 19.688 27.744 27.744 0 0 1-8.117 19.646l18.542.02a42.842 42.842 0 0 0 4.749-19.666c0-7.09-1.714-13.779-4.751-19.675l-18.577-.013ZM156.184 60.002c0-8.748-6.118-15.776-15.025-15.776-8.909 0-15.025 7.028-15.025 15.776 0 8.749 6.116 15.78 15.025 15.78 8.907 0 15.025-7.031 15.025-15.78Zm-34.881 0c0-11.482 8.318-19.958 19.856-19.958 11.536 0 19.855 8.477 19.855 19.959 0 11.484-8.319 19.964-19.855 19.964-11.538 0-19.856-8.48-19.856-19.965ZM179.514 75.54c5.507 0 9.05-4.14 9.05-9.482 0-5.341-3.543-9.483-9.05-9.483-5.505 0-9.046 4.142-9.046 9.483 0 5.342 3.541 9.482 9.046 9.482ZM166.22 53.306h4.248v3.704h.11c2.344-2.725 5.449-4.36 9.154-4.36 8.014 0 13.408 5.67 13.408 13.408 0 7.63-5.613 13.406-12.752 13.406-4.58 0-8.231-2.29-9.81-5.178h-.11V90.87h-4.248V53.306ZM217.773 63.768c-.163-4.305-3-7.193-7.686-7.193-4.685 0-7.79 2.888-8.335 7.193h16.021Zm3.653 10.412c-3.001 3.868-6.596 5.284-11.339 5.284-8.01 0-12.914-5.993-12.914-13.406 0-7.901 5.559-13.407 13.08-13.407 7.196 0 12.096 4.906 12.096 13.354v1.362h-20.597c.325 4.413 3.704 8.173 8.335 8.173 3.65 0 6.105-1.307 8.12-3.868l3.219 2.508ZM227.854 59.356c0-2.346-.216-4.36-.216-6.05h4.031c0 1.363.11 2.777.11 4.195h.11c1.144-2.505 4.306-4.85 8.5-4.85 6.705 0 9.699 4.252 9.699 10.41v15.748h-4.248v-15.31c0-4.253-1.856-6.924-5.833-6.924-5.503 0-7.903 3.979-7.903 9.811V78.81h-4.25V59.356ZM259.211 41.008h6.708L278.8 70.791h.107l12.982-29.782h6.549v37.99h-4.506V47.124h-.106L280.192 79h-2.738l-13.629-31.875h-.107V79h-4.507V41.01ZM312.392 57.752h4.023c4.992 0 11.487 0 11.487-6.282 0-5.47-4.776-6.276-9.177-6.276h-6.333v12.558Zm-4.506-16.744h9.711c7.352 0 15.132 1.072 15.132 10.462 0 5.527-3.594 9.125-9.495 10.037L334.018 79h-5.525l-10.304-17.063h-5.797V79h-4.506V41.01ZM358.123 47.712c-1.506-2.413-4.187-3.486-6.926-3.486-3.973 0-8.1 1.88-8.1 6.385 0 3.49 1.931 5.047 7.994 6.98 5.903 1.878 11.377 3.809 11.377 11.267 0 7.567-6.495 11.11-13.36 11.11-4.402 0-9.125-1.45-11.7-5.262l3.862-3.165c1.61 2.794 4.83 4.24 8.105 4.24 3.862 0 8.263-2.253 8.263-6.601 0-4.669-3.165-5.474-9.928-7.728-5.366-1.771-9.442-4.134-9.442-10.463 0-7.298 6.277-10.945 12.929-10.945 4.241 0 7.836 1.178 10.625 4.45l-3.699 3.218Z"}))),s().createElement("div",{className:tb},s().createElement("div",{className:ty},s().createElement("p",{className:tv},t("itemName","Item name")),s().createElement("p",{className:tT},(0,tg.A)(e)))))},tx=({columns:e,items:t,title:a})=>{let[o,l]=(0,r.useState)([]),[i,c]=(0,r.useState)({});return(0,r.useEffect)(()=>{(async()=>{let e=t.filter(e=>e.patientUuid).map(async e=>{let t=`${n.restBaseUrl}/patient/${e.patientUuid}?v=custom:(uuid,display,identifiers,links)`,a=await (0,n.openmrsFetch)(t);return{uuid:e.patientUuid,data:a.data}}),a=await Promise.all(e),o={};a.forEach(e=>{o[e.uuid]=e.data}),c(o)})()},[t]),(0,r.useEffect)(()=>{l(t.map(e=>{let t=e.patientUuid?i[e.patientUuid]:null;return{...e,id:e?.uuid,key:`key-${e?.uuid}`,uuid:`${e?.uuid}`,date:(0,ei.g1)(e?.dateCreated),location:e.operationSourcePartyName&&e.operationDestinationPartyName?e.operationSourcePartyName===e?.partyName?(e.quantity,s().createElement(s().Fragment,null,s().createElement("span",{className:"transaction-location"},e.operationSourcePartyName),s().createElement(en.nk,{size:16})," ",e.operationDestinationPartyName)):e.operationDestinationPartyName===e?.partyName?(e.quantity,s().createElement(s().Fragment,null,s().createElement("span",{className:"transaction-location"},e.operationDestinationPartyName),s().createElement(en.nk,{size:16})," ",e.operationSourcePartyName)):e?.partyName:e?.partyName,transaction:e?.isPatientTransaction?"Patient Dispense":e.stockOperationTypeName,quantity:`${e?.quantity?.toLocaleString()} ${e?.packagingUomName??""}`,batch:e.stockBatchNo?`${e.stockBatchNo}${e.expiration?` (${(0,ei.g1)(e.expiration)})`:""}`:"",out:e?.quantity<0?`${(-1*e?.quantity)?.toLocaleString()} ${e?.packagingUomName??""} of ${e.packagingUomFactor}`:"",totalout:e?.quantity<0?`${-1*e?.quantity*Number(e.packagingUomFactor)}`:"",patientId:e?.patientId??"",patientUuid:e?.patientUuid??"",patientName:t?.display??"",patientIdentifier:""}}))},[t,i]),s().createElement("div",null,s().createElement(tD,{itemName:a}),s().createElement("div",{className:tC},s().createElement("div",{className:tw},s().createElement(d.DataTable,{"data-floating-menu-container":!0,rows:o,headers:e,useZebraStyles:!0},({rows:e,headers:t,getHeaderProps:a,getTableProps:n,onInputChange:o})=>s().createElement("div",null,s().createElement(d.TableContainer,null,s().createElement(d.Table,n(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,t.map(e=>s().createElement(d.TableHeader,a({header:e}),e.header)))),s().createElement(d.TableBody,{style:{fontSize:"8px"}},e.map(e=>s().createElement(d.TableRow,{key:e.id},e.cells.map(e=>s().createElement(d.TableCell,{key:e.id},e.value))))))))))),s().createElement(tS,{title:""}))},tU="@openmrs/esm-stock-management-app",tA={featureName:"stock-management",moduleName:tU},t$=a(4767),tR=(0,n.getAsyncLifecycle)(()=>a.e("4214").then(a.bind(a,6085)),{featureName:"delete-stock-modal",moduleName:tU}),tO=(0,n.getAsyncLifecycle)(()=>a.e("822").then(a.bind(a,3333)),{featureName:"delete-stock-user-scope-modal",moduleName:tU}),tM=(0,n.getAsyncLifecycle)(()=>a.e("1600").then(a.bind(a,7939)),{featureName:"delete-packaging-unit-modal",moduleName:tU}),tL=(0,n.getSyncLifecycle)(p.A,{featureName:"delete-packaging-unit-button",moduleName:tU}),tB=(0,n.getAsyncLifecycle)(()=>a.e("6981").then(a.bind(a,5332)),{featureName:"expired-stock-modal",moduleName:tU}),tF=(0,n.getAsyncLifecycle)(()=>a.e("8661").then(a.bind(a,9892)),{featureName:"import-bulk-stock-items-modal",moduleName:tU}),tP=(0,n.getAsyncLifecycle)(()=>a.e("1164").then(a.bind(a,7127)),{featureName:"issuing-stock-modal",moduleName:tU}),tz=(0,n.getSyncLifecycle)(()=>{let e=`${window.spaBase}/stock-management`;return(0,n.useLeftNav)({name:"stock-page-dashboard-slot",basePath:e}),s().createElement("main",{className:"omrs-main-content"},s().createElement(l.BrowserRouter,{basename:window.spaBase},s().createElement(l.Routes,null,s().createElement(l.Route,{path:"/stock-management",element:s().createElement(E,null)}),s().createElement(l.Route,{path:"/stock-management/:dashboard/*",element:s().createElement(E,null)}))))},tA),tj=(0,n.getAsyncLifecycle)(()=>a.e("8990").then(a.bind(a,4125)),{featureName:"receiving-stock-modal",moduleName:tU}),tq=(0,n.getSyncLifecycle)(()=>{let{t:e}=(0,i.useTranslation)(),t=e("manageStock","Manage Stock");return s().createElement(d.Layer,null,s().createElement(d.ClickableTile,{href:window.getOpenmrsSpaBase()+"stock-management",rel:"noopener noreferrer"},s().createElement("div",null,s().createElement("div",{className:"heading"},t),s().createElement("div",{className:"content"},e("stockManagement","Stock management"))),s().createElement("div",{className:"iconWrapper"},s().createElement(en.Qp,{size:16}))))},tA),tH=(0,n.getSyncLifecycle)(()=>s().createElement(n.LeftNavMenu,null),tA),tG=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{backgroundColor:"white"}},s().createElement(Y,null),s().createElement(M,null))},tA),tY=(0,n.getSyncLifecycle)(m({title:"Overview",titleKey:"overview",name:"stock-management"}),tA),tZ=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{margin:"1rem"}},s().createElement(eQ,null))},tA),tV=(0,n.getSyncLifecycle)(m({title:"Operations",titleKey:"operations",name:"operations"}),tA),tW=(0,n.getSyncLifecycle)(()=>s().createElement("div",{style:{margin:"1rem"}},s().createElement(ea,null)),tA),tQ=(0,n.getSyncLifecycle)(m({title:"Items",titleKey:"items",name:"items"}),tA),tK=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{margin:"1rem"}},s().createElement(tp,null))},tA),tJ=(0,n.getSyncLifecycle)(m({title:"User role scopes",name:"user-scopes"}),tA),tX=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{margin:"1rem"}},s().createElement(tl,null))},tA),t0=(0,n.getSyncLifecycle)(m({title:"Sources",name:"sources"}),tA),t1=(0,n.getSyncLifecycle)(function(){return s().createElement("div",{style:{margin:"1rem"}},s().createElement(es,null))},tA),t4=(0,n.getSyncLifecycle)(m({title:"Locations",name:"locations"}),tA),t5=(0,n.getSyncLifecycle)(()=>{let{t:e}=(0,i.useTranslation)(),t=(0,V.K)(),a=()=>{t(`${n.restBaseUrl}/stockmanagement/batchjob?batchJobType=Report&v=default`)},{user:o}=(0,n.useSession)(),l=(0,n.userHasAccess)(el.UE,o),c=(0,n.userHasAccess)(el.v9,o),{reports:m,isLoading:u,currentPage:p,pageSizes:_,totalItems:g,goTo:k,currentPageSize:b,setPageSize:h}=(0,e0.$)(l),[E,f]=(0,r.useState)(()=>Date.now());(0,r.useEffect)(()=>{if(!l)return;let e=window.setInterval(()=>f(Date.now()),15e3);return()=>window.clearInterval(e)},[l]);let v=(0,r.useMemo)(()=>[{id:0,header:e("report","Report"),key:"report"},{id:1,header:e("parameters","Parameters"),key:"parameters"},{id:2,header:e("dateRequested","Date Requested"),key:"dateRequested"},{id:3,header:e("requestedBy","Requested By"),key:"requestedBy"},{id:4,header:e("status","Status"),key:"status"},{id:5,header:e("timeTaken","Time Taken"),key:"timeTaken"},{id:8,header:e("actions","Actions"),key:"actions"}],[e]),T=(0,r.useCallback)((e,t)=>{e&&window.open((0,el.yu)(e,!0),"_blank")},[]),N=(0,r.useMemo)(()=>m?.map((t,a)=>{let n=function(e,t,a=Date.now()){if(e!==e1||!t)return!1;let n=t instanceof Date?t.getTime():new Date(t).getTime();return Number.isFinite(n)&&n<a}(t.status,t.expiration,E);return{...t,checkbox:"isBatchJobActive",id:t?.uuid,key:`key-${t?.uuid}`,uuid:`${t?.uuid}`,batchJobType:t?.batchJobType,dateRequested:(0,ei.P9)(t.dateCreated),parameters:s().createElement(e8,{model:m[a]}),report:t?.description,requestedBy:t?.owners?.map((e,a)=>s().createElement("div",{key:`${t.uuid}-owner-${a}`},`${e.ownerFamilyName} ${e.ownerGivenName}`)),status:s().createElement("div",{className:e2.reportStatus},t.status!==e1||n?null:s().createElement(d.InlineLoading,{status:"active",iconDescription:e("loading","Loading"),description:e("reportQueued","Report queued...")}),n&&s().createElement(s().Fragment,null,s().createElement(y.OR,{className:"report-stale","aria-hidden":"true"}),s().createElement("span",null,e("reportQueuedStale","Queued report has not started"))),"Running"===t.status&&s().createElement(d.InlineLoading,{status:"active",iconDescription:e("loading","Loading"),description:e("generatingReport","Generating report...")}),"Failed"===t.status&&s().createElement(s().Fragment,null,s().createElement(y.OR,{className:"report-failed","aria-hidden":"true"}),s().createElement("span",null,e("failed","Failed"))),t.status===e5&&s().createElement(s().Fragment,null,s().createElement(eK._f,{className:"report-cancelled","aria-hidden":"true"}),s().createElement("span",null,e("cancelled","Cancelled"))),t.status===e4&&s().createElement(s().Fragment,null,s().createElement(eh.cR,{className:"report-completed","aria-hidden":"true",size:16}),s().createElement("span",null,e("completed","Completed"))),"Expired"===t.status&&s().createElement(s().Fragment,null,s().createElement(eJ.lz,{className:"report-expired","aria-hidden":"true"}),s().createElement("span",null,e("expired","Expired")))),timeTaken:((e,t)=>{let a=new Date(e).getTime(),n=new Date(t).getTime();if(!a||!n)return"";let o=Math.floor((n-a)/1e3);return[Math.floor(o/3600),Math.floor(o%3600/60),o%60].map(e=>String(e).padStart(2,"0")).join(":")})(t.dateCreated,t.endTime),actions:s().createElement("div",{key:`${t?.uuid}-actions`,style:{display:"inline-block",whiteSpace:"nowrap"}},t.outputArtifactViewable&&"hide"===t.batchJobType&&s().createElement(d.Button,{key:`${t?.uuid}-actions-view`,type:"button",size:"sm",className:"submitButton clear-padding-margin",iconDescription:e("edit","Edit"),kind:"ghost",renderIcon:y.Ss}),s().createElement(d.Button,{type:"button",size:"sm",className:"submitButton clear-padding-margin",iconDescription:"Copy",kind:"ghost",renderIcon:eX.QR}),t?.status===e4&&(t.outputArtifactSize??0)>0&&s().createElement(d.Button,{type:"button",size:"sm",className:"submitButton clear-padding-margin",iconDescription:"Download",kind:"ghost",renderIcon:Z.f5,onClick:()=>T(t.uuid,t.outputArtifactFileExt)}))}}),[m,T,e,E]);return u?s().createElement(d.DataTableSkeleton,{role:"progressbar"}):s().createElement("div",{className:e2.container},s().createElement("h2",{className:e2.tableHeader},e("stockReportsTableHeader","List of reports requested by users.")),s().createElement(d.DataTable,{rows:N,headers:v,isSortable:!0,useZebraStyles:!0},({rows:t,headers:o,getHeaderProps:r,getTableProps:i,getRowProps:u,onInputChange:p})=>s().createElement(d.TableContainer,null,s().createElement(d.TableToolbar,{style:{position:"static",overflow:"visible",backgroundColor:"color"}},s().createElement(d.TableToolbarContent,{className:e2.toolbarContent},s().createElement(d.TableToolbarSearch,{persistent:!0,onChange:p}),s().createElement(d.TableToolbarMenu,null,s().createElement(d.TableToolbarAction,{className:e2.toolbarMenuAction,onClick:a},e("refresh","Refresh"))),c&&s().createElement(e7,null))),s().createElement(d.Table,i(),s().createElement(d.TableHead,null,s().createElement(d.TableRow,null,s().createElement(d.TableExpandHeader,null),o.map(e=>s().createElement(d.TableHeader,{...r({header:e,isSortable:e.isSortable}),className:n.isDesktop?e2.desktopHeader:e2.tabletHeader,key:`${e.key}`},e.header?.content??e.header)),s().createElement(d.TableHeader,null))),s().createElement(d.TableBody,null,t.map((e,t)=>s().createElement(s().Fragment,{key:e.id},s().createElement(d.TableExpandRow,{className:n.isDesktop?e2.desktopRow:e2.tabletRow,...u({row:e})},e.cells.map(e=>s().createElement(d.TableCell,{key:e.id},e.value))),e.isExpanded?s().createElement(d.TableExpandedRow,{colSpan:o.length+2},s().createElement(e9,{model:m[t]})):s().createElement(d.TableExpandedRow,{className:e2.hiddenRow,colSpan:o.length+2}))))),l?0===t.length?s().createElement("div",{className:e2.tileContainer},s().createElement(d.Tile,{className:e2.tile},s().createElement("div",{className:e2.tileContent},s().createElement("p",{className:e2.content},e("noReportsToDisplay","No Stock reports to display")),s().createElement("p",{className:e2.helper},e("checkFilters","Check the filters above"))))):null:s().createElement(e3,{title:"Can not view stock reports",description:"You have no permissions to view reports"}))),s().createElement(d.Pagination,{page:p,pageSize:b,pageSizes:_,totalItems:g,onChange:({pageSize:e,page:t})=>{e!==b&&h(e),t!==p&&k(t)},className:e2.paginationOverride}))},tA),t6=(0,n.getSyncLifecycle)(m({title:"Reports",name:"reports"}),tA),t3=(0,n.getSyncLifecycle)(function(){let{t:e}=(0,i.useTranslation)();return s().createElement("div",{className:"-esm-stock-management__stock-settings__container___a4ZMo"},s().createElement("div",{className:"-esm-stock-management__stock-settings__tableHeader___yTdeQ"},e("comingSoonUnderDev","Exciting updates are on the way! In the meantime, use the link below to access Admin UI settings.")),s().createElement(d.Button,{onClick:()=>(0,n.navigate)({to:"${openmrsBase}/admin/maintenance/settings.list?show=Stockmanagement"}),size:"md",renderIcon:()=>s().createElement(te.tl,{className:"cds--btn__icon",size:24}),kind:"ghost"},e("adminSettings","Admin settings")))},tA),t7=(0,n.getSyncLifecycle)(m({title:"Settings",name:"settings"}),tA),t2=(0,n.getSyncLifecycle)(function(){return s().createElement(n.ExtensionSlot,{name:"stock-management-dashboard-slot"})},tA),t9=(0,n.getAsyncLifecycle)(()=>a.e("6105").then(a.bind(a,9632)),{featureName:"stock-operation-modal",moduleName:tU}),t8=(0,n.getSyncLifecycle)(()=>{let e=window.getOpenmrsSpaBase();return s().createElement(d.ClickableTile,{className:"-esm-stock-management__item__customTile___bmBVE",id:"menu-item",href:`${e}stock-management`},s().createElement("div",{className:"customTileTitle"},s().createElement(u.pl,{size:24})),s().createElement("div",null,"Stock Management"))},tA),ae=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("7369"),a.e("9457"),a.e("3946")]).then(a.bind(a,3441)),tA),at=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("7369"),a.e("9457"),a.e("8156")]).then(a.bind(a,4519)),tA),aa=(0,n.getAsyncLifecycle)(()=>a.e("5838").then(a.bind(a,4301)),tA),an=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("7369"),a.e("2713")]).then(a.bind(a,3824)),tA),ao=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("9457"),a.e("3576")]).then(a.bind(a,5979)),tA),ar=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("7369"),a.e("5996")]).then(a.bind(a,8647)),tA),as=(0,n.getSyncLifecycle)(({onClose:e,title:t,columns:a,data:o,binOrStockCard:l})=>{let{t:c}=(0,i.useTranslation)(),m=(0,r.useRef)(null),u=(0,t_.useReactToPrint)({content:()=>m.current});return s().createElement(s().Fragment,null,s().createElement(d.ModalHeader,{closeModal:e,title:c("printBinCard","Print Bin Card")}),s().createElement(d.ModalBody,null,s().createElement("div",{ref:m},s().createElement(tI,{title:t,columns:a,data:o}))),s().createElement(d.ModalFooter,null,s().createElement(d.Button,{kind:"secondary",onClick:e},(0,n.getCoreTranslation)("cancel")),s().createElement(d.Button,{type:"button",onClick:u},(0,n.getCoreTranslation)("print"))))},tA),al=(0,n.getSyncLifecycle)(({onClose:e,title:t,columns:a,data:o})=>{let{t:l}=(0,i.useTranslation)(),c=(0,r.useRef)(null),m=(0,t_.useReactToPrint)({content:()=>c.current});return s().createElement(s().Fragment,null,s().createElement(d.ModalHeader,{closeModal:e,title:l("printStockCard","Print Stock Card")}),s().createElement(d.ModalBody,null,s().createElement("div",{ref:c},s().createElement(tx,{title:t,columns:a,items:o}))),s().createElement(d.ModalFooter,null,s().createElement(d.Button,{kind:"secondary",onClick:e},(0,n.getCoreTranslation)("cancel")),s().createElement(d.Button,{type:"button",onClick:m},(0,n.getCoreTranslation)("print"))))},tA);function ai(){(0,n.defineConfigSchema)(tU,o)}let ac=(0,n.getAsyncLifecycle)(()=>Promise.all([a.e("9457"),a.e("1878")]).then(a.bind(a,6453)),tA)},3270(e,t,a){"use strict";a.d(t,{A:()=>c});var n=a(4037),o=a.n(n),r=a(401),s=a(1014),l=a(5576),i=a(5366);let c=({row:e})=>{let{t}=(0,r.useTranslation)(),a=(0,n.useCallback)(()=>{let t=(0,i.showModal)("delete-packaging-unit-modal",{closeModal:()=>t(),row:e})},[e]);return o().createElement(s.Button,{type:"button",size:"sm",className:"submitButton clear-padding-margin",iconDescription:t("delete","Delete"),kind:"ghost",renderIcon:l.zH,onClick:a})}},7187(e,t,a){"use strict";a.d(t,{m:()=>o});var n=a(5366);let o=e=>{(0,n.launchWorkspace2)("stock-item-form-workspace",{stockItem:e})}},9587(e,t,a){"use strict";a.d(t,{AR:()=>_,Jq:()=>k,ME:()=>d,QC:()=>l,R3:()=>f,W8:()=>i,Xu:()=>m,Yx:()=>u,__:()=>T,hA:()=>p,jf:()=>E,kC:()=>h,kl:()=>c,n6:()=>b,s_:()=>y,w_:()=>g,z8:()=>v});var n=a(5366),o=a(4189),r=a.n(o),s=a(3767);function l(e){let t=`${n.restBaseUrl}/stockmanagement/stockitem${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function i(e){let t=`${n.restBaseUrl}/stockmanagement/stockitem?drugUuid=${e}&limit=1`;return(0,n.openmrsFetch)(t).then(({data:e})=>e)}function c(e){let t=`${n.restBaseUrl}/stockmanagement/stockitemtransaction${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function m(e){let t=`${n.restBaseUrl}/stockmanagement/stockiteminventory${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function d(e){let t=`${n.restBaseUrl}/stockmanagement/stockbatch${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function u(e){let t=`${n.restBaseUrl}/stockmanagement/stockitempackaginguom${(0,s.q)(e)}`,{data:a,error:o,isLoading:l,mutate:i}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o,mutate:i}}function p(e){let t=`${n.restBaseUrl}/stockmanagement/stockitem/${e}?v=full`,{data:a,error:o,isLoading:s}=r()(t,n.openmrsFetch);return{item:a?.data||{},isLoading:s,error:o}}function _(e){let t=`${n.restBaseUrl}/stockmanagement/stockitempackaginguom/${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:a.signal})}function g(e){let t=`${n.restBaseUrl}/stockmanagement/stockitem`,a=new AbortController;return delete e.isDrug,(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function k(e,t){let a=`${n.restBaseUrl}/stockmanagement/stockitem/${e}`,o=new AbortController;return delete t.isDrug,delete t.dateCreated,(0,n.openmrsFetch)(a,{method:"POST",headers:{"Content-Type":"application/json"},signal:o.signal,body:t})}function b(e){let t=`${n.restBaseUrl}/stockmanagement/stockitempackaginguom`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function h(e,t){let a=`${n.restBaseUrl}/stockmanagement/stockitempackaginguom/${t}`,o=new AbortController;return(0,n.openmrsFetch)(a,{method:"POST",headers:{"Content-Type":"application/json"},signal:o.signal,body:e})}function E(e){let t=`${n.restBaseUrl}/stockmanagement/stockrule${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function y(e){let t=`${n.restBaseUrl}/stockmanagement/stockrule/${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:a.signal})}function f(e){let t=`${n.restBaseUrl}/stockmanagement/stockitemreference${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function v(e){let t=`${n.restBaseUrl}/stockmanagement/stockitemreference`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function T(e){let t=`${n.restBaseUrl}/stockmanagement/stockitemreference/${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:a.signal})}},1844(e,t,a){"use strict";a.d(t,{DW:()=>d,_D:()=>m,zC:()=>c});var n=a(4037),o=a(4189),r=a.n(o),s=a(5366),l=a(401),i=a(5175);function c(e){let{stockLocations:t,error:a,isLoading:o,mutate:r}=(0,i.gQ)(),[c,m]=(0,n.useState)(10),{goTo:d,results:u,currentPage:p}=(0,s.usePagination)(t,c),{t:_}=(0,l.useTranslation)(),g=(0,n.useMemo)(()=>[{id:0,header:_("name","Name"),key:"name"},{id:1,header:_("tags","Tags"),key:"tags"},{id:2,header:_("childLocations","Child Locations"),key:"childLocations"},{id:3,header:_("actions","Actions"),key:"actions"}],[_]),k=(0,n.useMemo)(()=>t.map(e=>({id:e?.uuid,key:`key-${e?.uuid}`,uuid:`${e?.uuid}`,name:`${e?.name}`,tags:e?.meta.tag?.filter(e=>"SUBSETTED"!==e.code).map(e=>e.code)?.join(", ")??"",childLocations:e?.childLocations?.map(e=>e.display)?.join(", ")??""})),[t]);return{items:t,mutate:r,currentPage:p,currentPageSize:c,paginatedQueueEntries:u,goTo:d,pageSizes:[10,20,30,40,50],isLoading:o,error:a,setPageSize:m,tableHeaders:g,tableRows:k}}let m=()=>{let e=`${s.restBaseUrl}/locationtag/`,{data:t,isLoading:a,mutate:n}=r()(e,s.openmrsFetch);return{locationTagList:t?.data?.results?t?.data?.results:[],loading:a,mutate:n}};async function d({locationPayload:e}){return await (0,s.openmrsFetch)(`${s.restBaseUrl}/location/`,{method:"POST",headers:{"Content-Type":"application/json"},body:e})}},5175(e,t,a){"use strict";a.d(t,{G2:()=>m,Jd:()=>p,Ul:()=>b,VE:()=>k,VZ:()=>g,bh:()=>d,cj:()=>_,gQ:()=>i,kp:()=>u,zn:()=>c});var n=a(5453),o=a(4189),r=a.n(o),s=a(5366),l=a(3767);function i(){let e=`${s.fhirBaseUrl}/Location?_summary=data&_tag=main store,main pharmacy,dispensary `,{data:t,error:a,isLoading:o,mutate:r}=(0,s.useFhirFetchAll)(e);return{stockLocations:(0,n.A)(t,"id")??[],mutate:r,isLoading:o,error:a}}function c(e){let t=`${s.restBaseUrl}/role${(0,l.q)(e)}`,{data:a,error:n,isLoading:o}=r()(t,s.openmrsFetch);return{items:a?.data||{},isLoading:o,error:n}}function m(){let e=`${s.restBaseUrl}/stockmanagement/stockoperationtype?v=default`,{data:t,isLoading:a,error:n}=r()(e,s.openmrsFetch);return{types:t?.data||{},isLoading:a,error:n}}function d(){let e=`${s.restBaseUrl}/stockmanagement/stockoperationtype?v=default`;return(0,s.openmrsFetch)(e)}function u(e){let t=`${s.restBaseUrl}/user${(0,l.q)(e)}`,{data:a,error:n,isLoading:o}=r()(t,s.openmrsFetch,{keepPreviousData:!0});return{items:a?.data||{},isLoading:o,error:n}}function p(e,t){let a=`${s.restBaseUrl}/user/${e}${(0,l.q)({v:t||void 0})}`,{data:n,error:o,isLoading:i}=r()(e?a:null,s.openmrsFetch);return{data:n?.data||{},isLoading:i,error:o}}function _(e){let t=`${s.restBaseUrl}/concept/${e}`,{data:a,error:n,isLoading:o}=r()(e?t:null,s.openmrsFetch,{errorRetryCount:2});return{items:a?.data||{},isLoading:o,error:n}}function g(e,t=!0){let a=`${s.restBaseUrl}/drug${(0,l.q)(e)}`,{data:n,error:o,isLoading:i}=r()(t?a:null,s.openmrsFetch);return{items:n?.data||{},isLoading:i,error:o}}function k(e){let t=`${s.restBaseUrl}/concept${(0,l.q)(e)}`,{data:a,error:n,isLoading:o}=r()(t,s.openmrsFetch);return{items:a?.data||{},isLoading:o,error:n}}let b=()=>{let{user:e}=(0,s.useSession)(),t=`${s.restBaseUrl}/stockmanagement/userrolescope`,{data:a,isLoading:n,error:o}=r()(t,s.openmrsFetch);return{userRoles:a?.data?.results.find(t=>t.userUuid===e.uuid),isLoading:n,error:o}}},683(e,t,a){"use strict";a.d(t,{AE:()=>o,mh:()=>r,rA:()=>s});var n=a(5366);a(9657);let o=(e,t,a)=>{(0,n.launchWorkspace2)("stock-operation-form-workspace",{stockOperationType:e,stockOperation:t,stockRequisitionUuid:a})};function r(){return`${new Date().getTime()}-${Math.random().toString(36).substring(2,16)}`}let s=(e,t,a)=>{let o=(0,n.showModal)("stock-operations-modal",{title:e,operation:a,requireReason:t,closeModal:()=>o()})}},4094(e,t,a){"use strict";a.d(t,{A:()=>o});var n=a(3466);let o=e=>{let t=(0,n.lj)(e.operationType);return{isNegativeQuantityAllowed:(0,n.R6)(t),requiresBatchUuid:(0,n.Xb)(t),requiresActualBatchInfo:(0,n.en)(t),isQuantityOptional:(0,n.Hu)(t),canCaptureQuantityPrice:(0,n.Wf)(t),requiresStockAdjustmentReason:(0,n.jQ)(t),requiresDispatchAcknowledgement:(0,n.Eh)(t),allowExpiredBatchNumbers:e?.allowExpiredBatchNumbers??!1,allowPrinting:(0,n.LD)(t)}}},4779(e,t,a){"use strict";a.d(t,{DT:()=>p,Eb:()=>c,G7:()=>m,Wu:()=>i,_o:()=>g,jU:()=>u,jp:()=>_,kR:()=>l,yJ:()=>d});var n=a(5366),o=a(4189),r=a.n(o),s=a(3767);function l(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperation${(0,s.q)(e)}`,{data:a,error:o,isLoading:l}=r()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:o}}function i(e){if(!e)return;let t=`${n.restBaseUrl}/stockmanagement/stockoperation/${e}?v=full`;return(0,n.openmrsFetch)(t)}function c(e=""){let t=`${n.restBaseUrl}/stockmanagement/stockoperation/${e}?v=full`,{data:a,error:o,isLoading:s}=r()(e?t:null,n.openmrsFetch);return{items:a?.data,isLoading:s,error:o}}function m(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperationitem/${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:a.signal})}function d(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperation`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function u(e,t){let a=`${n.restBaseUrl}/stockmanagement/stockoperation/${e.uuid}`,o=new AbortController;return(0,n.openmrsFetch)(a,{method:"POST",headers:{"Content-Type":"application/json"},signal:o.signal,body:t})}function p(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperationaction`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"POST",headers:{"Content-Type":"application/json"},signal:a.signal,body:e})}function _(e){let t=`${n.restBaseUrl}/stockmanagement/stockoperationitemcost?v=default&stockOperationUuid=${e}`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"GET",headers:{"Content-Type":"application/json"},signal:a.signal})}function g(e){let t=`${n.restBaseUrl}/stockmanagement/stockiteminventory${(0,s.q)(e)}&v=default`,a=new AbortController;return(0,n.openmrsFetch)(t,{method:"GET",headers:{"Content-Type":"application/json"},signal:a.signal})}},1651(e,t,a){"use strict";a.d(t,{$:()=>i,X:()=>l});var n=a(5366),o=a(4189),r=a.n(o),s=a(4037);function l(){let e=`${n.restBaseUrl}/stockmanagement/report?v=default`,{data:t,error:a,isLoading:o}=r()(e,n.openmrsFetch);return{reportTypes:t?.data?.results??[],isLoading:o,error:a}}function i(e=!0){let t=`${n.restBaseUrl}/stockmanagement/batchjob?batchJobType=Report&v=default&limit=10&totalCount=true`,{data:a,error:o,isLoading:l,mutate:c}=r()(e?t:null,n.openmrsFetch,{refreshInterval:15e3,dedupingInterval:1e4}),[m,d]=(0,s.useState)(10),{goTo:u,results:p,currentPage:_}=(0,n.usePagination)(a?.data?.results,m);return{reports:a?.data?.results??[],isLoading:l,error:o,items:p,totalItems:a?.data?.results?.length??0,currentPage:_,currentPageSize:m,paginatedItems:p,goTo:u,pageSizes:[10,20,30,40,50],setPageSize:d,mutate:c}}},8455(e,t,a){"use strict";a.d(t,{UP:()=>l,Xh:()=>i,qi:()=>c});var n=a(5366),o=a(3767),r=a(4189),s=a.n(r);function l(e){let t=`${n.restBaseUrl}/stockmanagement/stocksource${(0,o.q)(e)}`,{data:a,error:r,isLoading:l}=s()(t,n.openmrsFetch);return{items:a?.data||{},isLoading:l,error:r}}function i(e){let t=e.reduce((e,t,a)=>0===a?e:e+=(e.length>0?",":"")+encodeURIComponent(t),"");t.length>0&&(t="?ids="+t);let a=`${n.restBaseUrl}/stockmanagement/stocksource/${e[0]}${t}`,o=new AbortController;return(0,n.openmrsFetch)(a,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:o.signal})}function c(e){let t=null!=e.uuid,a=`${n.restBaseUrl}/stockmanagement/stocksource${t?"/"+e.uuid:""}`,o=new AbortController;return(0,n.openmrsFetch)(a,{method:"POST",headers:{"Content-Type":"application/json"},signal:o.signal,body:{...e,sourceType:e?.sourceType?.uuid}})}},1347(e,t,a){"use strict";a.d(t,{IV:()=>i,Wh:()=>l,ww:()=>c});var n=a(4189),o=a.n(n),r=a(3767),s=a(5366);function l(e){let t=`${s.restBaseUrl}/stockmanagement/userrolescope${(0,r.q)(e)}`,{data:a,error:n,isLoading:l}=o()(t,s.openmrsFetch);return{items:a?.data||{},isLoading:l,error:n}}function i(e){let t=e.reduce((e,t,a)=>0===a?e:e+=(e.length>0?",":"")+encodeURIComponent(t),"");t.length>0&&(t="?ids="+t);let a=`${s.restBaseUrl}/stockmanagement/userrolescope/${e[0]}${t}`,n=new AbortController;return(0,s.openmrsFetch)(a,{method:"DELETE",headers:{"Content-Type":"application/json"},signal:n.signal})}function c(e){let t=new AbortController,a=null!=e.uuid,n=`${s.restBaseUrl}/stockmanagement/userrolescope${a?"/"+e.uuid:""}`;return(0,s.openmrsFetch)(n,{method:"POST",headers:{"Content-Type":"application/json"},signal:t.signal,body:e})}},7351(e,t,a){"use strict";a.d(t,{K:()=>r});var n=a(4037),o=a(4189);let r=()=>{let{mutate:e}=(0,o.useSWRConfig)();return(0,n.useCallback)(t=>e(e=>"string"==typeof e&&e.startsWith(t),void 0),[e])}}}]);