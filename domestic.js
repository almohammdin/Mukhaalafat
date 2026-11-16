/* Domestic labor and recruitment flow, v5.4.0 */
const domesticRoles={employer:"صاحب عمل منزلي",worker:"عامل منزلي",office:"مكتب استقدام",company:"شركة استقدام"};
const domesticCases={fine:"اعتراض على عقوبة",labor:"خلاف بين العامل وصاحب العمل",recruitment:"شكوى أو رد على مكتب أو شركة استقدام"};
const domesticTopics={wages:"الأجور وتوثيقها",rights:"تصفية الحقوق والإجازات والراحة",documents:"الوثائق والمتعلقات الشخصية",assignment:"المهنة أو العمل لدى الغير",worker:"مخالفة منسوبة للعامل",recruitment:"ممارسة نشاط الاستقدام",other:"حالة أخرى"};
const domesticLinks={
  decision:"https://www.hrsd.gov.sa/sites/default/files/2026-02/qrar-wzary---112377.pdf",
  musaned:"https://www.musaned.gov.sa/ar/home",
  labor:"https://www.hrsd.gov.sa/media-center/news/021020241",
  ministry:"https://www.hrsd.gov.sa/contact-us"
};
const domesticQuestions={
  wages:[["period","ما الأشهر محل الحالة؟"],["amount","ما الأجر المستحق والمبلغ المدفوع؟"],["payment","متى وكيف تم الدفع؟ وما مرجع التحويل؟"],["record","ما حالة توثيق الدفع في القناة المعتمدة؟"]],
  rights:[["period","ما الفترة أو تاريخ انتهاء العلاقة؟"],["entitlement","ما الحق محل الحالة وكيف تم احتسابه؟"],["action","ما الإجراء الذي تم ومتى؟"]],
  documents:[["document","ما الوثيقة أو المتعلقات محل الحالة؟"],["custody","لدى من كانت ومتى تم تسليمها؟"],["proof","ما إثبات التسليم أو المراسلات المتوفرة؟"]],
  assignment:[["profession","ما المهنة الواردة في العقد؟"],["actual","ما العمل الفعلي ومكانه وصاحب العمل وقت الواقعة؟"],["period","ما تاريخ الواقعة وما المستند المؤيد؟"]],
  worker:[["actual","ما الواقعة المنسوبة للعامل؟"],["period","متى حدثت وما ظروفها؟"],["proof","ما المستند أو المراسلات التي تدعم الرد؟"]],
  recruitment:[["contract","ما رقم العقد وتاريخه ونوع الخدمة؟"],["due","ما الموعد أو الالتزام المتفق عليه؟"],["actual","ما الذي تم تنفيذه فعليا ومتى؟"],["payment","ما المبالغ المدفوعة أو المستردة ومراجعها؟"]],
  other:[["actual","ما الوقائع والتواريخ المهمة؟"],["proof","ما المستند المؤيد؟"]]
};
const domesticEvidence={labor_contract:"عقد العمل أو الاستقدام",payment_record:"إثبات تحويل الأجر أو المبلغ",wage_record:"سجل توثيق الأجور",correspondence:"المراسلات والطلبات السابقة",settlement_record:"كشف الحقوق أو المخالصة",handover_record:"إثبات تسليم الوثائق"};
Object.assign(evidenceLabels,domesticEvidence);
Object.assign(baseState,{domesticRole:"",domesticCase:"fine",domesticTopic:"",domesticBasis:false,domesticCounterparty:"",domesticFacts:"",domesticRequest:"",domesticAttachments:"",domesticAnswers:{}});
state={...structuredClone(baseState),...state};
const domesticHost=document.createElement("div");
domesticHost.id="domesticFields";
$("platformGrid").after(domesticHost);
const domesticStyle=document.createElement("style");
domesticStyle.textContent='[hidden]{display:none!important}.domestic-box{margin-top:15px;border:1px solid #D8C888;background:#FFFCF4;padding:14px;border-radius:14px}.domestic-box h4{margin:0;color:var(--navy)}.domestic-source{display:block;margin-top:10px;font-size:12px;color:#765710}.domestic-box textarea{min-height:80px}';
document.head.append(domesticStyle);
function isDomestic(){return state.platform==="domestic"}
function isDomesticDispute(){return isDomestic()&&state.domesticCase!=="fine"}
function domesticSelect(id,label,items,value){return '<div class="field"><label for="'+id+'">'+label+'</label><select class="select" id="'+id+'" data-domestic="'+id+'"><option value="">اختر</option>'+Object.entries(items).map(([k,v])=>'<option value="'+k+'" '+(value===k?'selected':'')+'>'+v+'</option>').join("")+'</select></div>'}
function domesticText(id,label,value){return '<div class="field"><label for="'+id+'">'+label+'</label><textarea class="input" id="'+id+'" data-domestic="'+id+'">'+escapeHtml(value||"")+'</textarea></div>'}
function domesticProfile(){
  return isDomestic()&&state.domesticCase==="fine"&&state.domesticRole==="employer"&&state.domesticBasis?"domestic_employer":"domestic_manual";
}
function resetDomesticDeadline(){useDeadlineProfile(domesticProfile(),true)}
function clearPreviewForRoute(){editCache={short:{dirty:false,text:""},detailed:{dirty:false,text:""},letter:{dirty:false,text:""}};$("postCopy").classList.remove("show")}
function renderDomestic(){
  const active=isDomestic(),dispute=isDomesticDispute();
  domesticHost.hidden=!active;
  const sections=[...$("objectionForm").querySelectorAll(".form-body > .section")];
  [1,2,3,4,5].forEach(i=>sections[i].hidden=dispute);
  $("violationNumber").closest(".inline-fields").hidden=dispute;
  $("deadlineSticky").hidden=dispute;
  $("mobileCopy").textContent=dispute?"نسخ نص الطلب":"نسخ نص الاعتراض";
  $("drawerTitle").textContent=dispute?"نص الطلب":"نص الاعتراض";
  $("previewEditor").setAttribute("aria-label",dispute?"نص الطلب":"نص الاعتراض");
  $("postCopy").innerHTML=dispute?'<h4>بعد فتح الخدمة</h4><ul><li>راجع بيانات الأطراف والعقد</li><li>الصق الوقائع والطلب</li><li>أرفق المستندات</li><li>احفظ رقم الطلب وتابع الرد</li></ul>':'<h4>بعد فتح خدمة الاعتراض</h4><ul><li>راجع رقم المخالفة</li><li>الصق النص وأرفق المستندات</li><li>قدم الاعتراض واحفظ رقمه</li></ul>';
  if(!active){domesticHost.innerHTML="";$("copyText").textContent="نسخ نص الاعتراض";return}
  const roles=domesticRoles;
  let html='<div class="domestic-box"><h4>العمالة المنزلية والاستقدام</h4>'+domesticSelect("domesticRole","ما صفتك؟",roles,state.domesticRole);
  const cases=state.domesticRole==="office"||state.domesticRole==="company"?{fine:domesticCases.fine,recruitment:domesticCases.recruitment}:state.domesticRole==="worker"?{fine:domesticCases.fine,labor:domesticCases.labor}:domesticCases;
  html+=domesticSelect("domesticCase","ما نوع الحالة؟",cases,state.domesticCase);
  if(!dispute){
    const topics=state.domesticRole==="office"||state.domesticRole==="company"?{recruitment:domesticTopics.recruitment,other:domesticTopics.other}:Object.fromEntries(Object.entries(domesticTopics).filter(([k])=>k!=="recruitment"));
    html+=domesticSelect("domesticTopic","موضوع المخالفة",topics,state.domesticTopic);
    if(state.domesticRole==="employer")html+='<label class="check-line"><input type="checkbox" data-domestic="domesticBasis" '+(state.domesticBasis?'checked':'')+'>تحققت أن العقوبة تخضع للقرار 112377 ونطاق سريانه</label><p class="field-help">عند التأكيد تستخدم مهلة 60 يوم من التبليغ. راجع تاريخ الواقعة والقرار والإشعار.</p>';
    html+='<a class="domestic-source" href="'+domesticLinks.decision+'" target="_blank" rel="noopener">عرض جدول المخالفات والقرار 112377</a>';
  }else{
    html+=domesticText("domesticCounterparty","من الطرف الآخر؟",state.domesticCounterparty);
    html+=domesticText("domesticFacts","اكتب الوقائع والتواريخ ورقم العقد أو الطلب",state.domesticFacts);
    html+=domesticText("domesticRequest","ما طلبك المحدد أو ردك على المطالبة؟",state.domesticRequest);
    html+=domesticText("domesticAttachments","ما المستندات التي ستقدمها؟",state.domesticAttachments);
    html+='<p class="field-help">'+(state.domesticCase==="labor"?"جهز العقد، وبيانات الأجور والحقوق، والمراسلات المتعلقة بالخلاف. تبدأ المطالبة بالتسوية الودية لدى الوزارة.":"جهز عقد الاستقدام، وإيصالات الدفع، والموعد المتفق عليه، والمراسلات وأرقام الشكاوى السابقة.")+'</p>';
  }
  domesticHost.innerHTML=html+'</div>';
  $("copyText").textContent=dispute?"نسخ نص الطلب":"نسخ نص الاعتراض";
  if(dispute){$("previewTitle").textContent="نص الطلب";$("modeTitle").textContent="جهز نص طلبك";$("modeDescription").textContent="رتب الوقائع والطلبات والمستندات قبل التقديم."}
}
const standardDeadlineProfiles=platformDeadlineProfiles;
platformDeadlineProfiles=function(){return isDomestic()?[[domesticProfile(),deadlineProfiles[domesticProfile()]]]:standardDeadlineProfiles()};
const standardRenderAll=renderAll;
renderAll=function(){
  state.domesticAnswers=state.domesticAnswers||{};
  if(isDomestic()&&state.deadlineProfile!==domesticProfile())resetDomesticDeadline();
  standardRenderAll();renderDomestic();
};
const standardQuestions=renderQuestions;
renderQuestions=function(){
  standardQuestions();
  if(!isDomestic()||isDomesticDispute()||!state.domesticTopic)return;
  const qs=domesticQuestions[state.domesticTopic]||[];
  $("conditionalQuestions").insertAdjacentHTML("afterbegin",'<div class="question-card"><h4>تفاصيل '+escapeHtml(domesticTopics[state.domesticTopic])+'</h4>'+qs.map(([id,label])=>'<div class="field"><label for="domesticAnswer_'+id+'">'+label+'</label><textarea class="input" id="domesticAnswer_'+id+'" data-domestic-answer="'+id+'">'+escapeHtml(state.domesticAnswers?.[id]||"")+'</textarea></div>').join("")+'</div>');
};
const standardEvidence=evidenceOptions;
evidenceOptions=function(){
  const options=standardEvidence();
  if(isDomestic()){
    options.push("labor_contract","correspondence");
    if(state.domesticTopic==="wages")options.push("payment_record","wage_record");
    if(state.domesticTopic==="rights")options.push("settlement_record","payment_record");
    if(state.domesticTopic==="documents")options.push("handover_record");
    if(state.domesticTopic==="recruitment")options.push("payment_record");
  }
  return [...new Set(options)];
};
const standardRoute=renderRoute;
renderRoute=function(){
  if(!isDomestic())return standardRoute();
  let title,body,link,label;
  if(state.domesticCase==="recruitment"){
    title="متابعة شكاوى الاستقدام عبر مساند";
    body="افتح حسابك، ثم العقد أو الشكوى ذات الصلة، وقدم الوقائع والطلب والمستندات. تابع الرد والمواعيد داخل حسابك.";
    link=domesticLinks.musaned;label="فتح مساند";
  }else if(state.domesticCase==="labor"){
    title="التسوية الودية لخلافات العمالة المنزلية";
    body="ابدأ بخدمة رفع دعوى عمالة منزلية لدى الوزارة. عند تعذر التسوية، اتبع إجراءات التقدم للمحكمة العمالية.";
    link=domesticLinks.labor;label="عرض مسار تقديم الدعوى لدى الوزارة";
  }else{
    title="تقديم الاعتراض على العقوبة";
    body="استخدم قناة الاعتراض المذكورة في إشعار القرار. عند غياب الرابط، تواصل مع الوزارة على 19911 لتحديد الخدمة المختصة برقم المخالفة. الرابط أدناه للاستفسار عن القناة؛ تقديم الاستفسار إجراء منفصل عن تسجيل الاعتراض.";
    link=domesticLinks.ministry;label="التواصل مع وزارة الموارد البشرية";
  }
  $("routeCard").innerHTML='<h4>'+title+'</h4><p class="field-help">'+body+'</p><a class="primary-btn" href="'+link+'" target="_blank" rel="noopener">'+label+'</a>';
};
function domesticDetails(){
  if(!isDomestic()||isDomesticDispute())return "";
  const lines=[];
  if(state.domesticRole)lines.push("الصفة: "+domesticRoles[state.domesticRole]+".");
  (domesticQuestions[state.domesticTopic]||[]).forEach(([key,label])=>{const value=state.domesticAnswers?.[key]?.trim();if(value)lines.push(label+" "+value)});
  return lines.join("\n");
}
function buildDomesticDispute(){
  const lines=[state.domesticCase==="labor"?"طلب تسوية خلاف عمالة منزلية":"طلب بشأن عقد استقدام"];
  if(state.domesticRole)lines.push("صفتي: "+domesticRoles[state.domesticRole]);
  if(state.domesticCounterparty)lines.push("الطرف الآخر: "+state.domesticCounterparty);
  if(state.domesticFacts)lines.push("الوقائع: "+state.domesticFacts);
  if(state.domesticRequest)lines.push("الطلب أو الرد: "+state.domesticRequest);
  if(state.domesticAttachments)lines.push("المستندات التي سأقدمها: "+state.domesticAttachments);
  if(lines.length===1)return "حدد صفتك وأضف الوقائع والطلب لتجهيز النص.";
  if(state.mode==="letter"){
    lines.unshift("السادة / "+(state.domesticCase==="labor"?"إدارة تسوية خلافات العمالة المنزلية":"الجهة المختصة بشكاوى الاستقدام"),"السلام عليكم ورحمة الله وبركاته،");
    if(state.applicantName)lines.push("الاسم: "+state.applicantName);
    if(state.phone)lines.push("رقم الجوال: "+state.phone);
  }
  return lines.join("\n\n");
}
const standardShort=buildShort,standardDetailed=buildDetailed;
buildShort=function(){if(isDomesticDispute())return buildDomesticDispute();const text=standardShort(),details=domesticDetails();return details&&state.reasons.length?text+"\n"+details:text};
buildDetailed=function(){if(isDomesticDispute())return buildDomesticDispute();const text=standardDetailed(),details=domesticDetails();return details&&state.reasons.length?text+"\n"+details:text};
const standardGenerated=generatedText;
generatedText=function(){return isDomesticDispute()?buildDomesticDispute():standardGenerated()};
const standardReadiness=readiness,standardReadinessTip=readinessTip;
readiness=function(){
  if(!isDomesticDispute())return standardReadiness();
  const items=[[!!state.domesticRole,"تم تحديد الصفة"],[!!state.domesticCounterparty.trim(),"تم تحديد الطرف الآخر"],[!!state.domesticFacts.trim(),"تمت إضافة الوقائع والتواريخ"],[!!state.domesticRequest.trim(),"تم تحديد الطلب"],[!!state.domesticAttachments.trim(),"تم تحديد المستندات"]];
  return {items,score:items.filter(([ok])=>ok).length*20};
};
readinessTip=function(){return isDomesticDispute()?"راجع مواعيد الرد والمتابعة في الخدمة المختصة.":standardReadinessTip()};
domesticHost.addEventListener("input",e=>{
  const key=e.target.dataset.domestic;
  if(key&&e.target.tagName==="TEXTAREA"){state[key]=toLatin(e.target.value);saveDraft();refreshPreview(false)}
});
domesticHost.addEventListener("change",e=>{
  const key=e.target.dataset.domestic;if(!key||e.target.tagName==="TEXTAREA")return;
  state[key]=e.target.type==="checkbox"?e.target.checked:e.target.value;
  if(key==="domesticRole"||key==="domesticCase"){
    state.reasons=[];state.answers={};state.evidence=[];state.requestType="";state.violationNumber="";state.violationDate="";state.violationDescription="";state.extraInfo="";state.descriptionUnavailable=false;
    state.domesticAnswers={};state.domesticFacts="";state.domesticRequest="";state.domesticCounterparty="";state.domesticAttachments="";
  }
  if(key==="domesticRole"){
    state.domesticCase="fine";state.domesticTopic="";state.domesticBasis=false;state.domesticAnswers={};
  }
  if(key==="domesticCase"){
    state.domesticCase=state.domesticCase||"fine";
    state.domesticFacts="";state.domesticRequest="";state.domesticCounterparty="";state.domesticAttachments="";
  }
  if(key==="domesticTopic")state.domesticAnswers={};
  resetDomesticDeadline();clearPreviewForRoute();renderAll();saveDraft();
});
$("conditionalQuestions").addEventListener("input",e=>{
  const key=e.target.dataset.domesticAnswer;if(!key)return;
  state.domesticAnswers[key]=toLatin(e.target.value);saveDraft();refreshPreview(false);
});
// Clear route-specific evidence and edited output when changing sectors.
$("platformGrid").addEventListener("click",e=>{
  const button=e.target.closest("[data-platform]");if(!button||button.dataset.platform===state.platform)return;
  state.reasons=[];state.answers={};state.evidence=[];state.requestType="";state.violationNumber="";state.violationDate="";state.violationDescription="";state.extraInfo="";state.descriptionUnavailable=false;
  state.domesticRole="";state.domesticCase="fine";state.domesticTopic="";state.domesticBasis=false;state.domesticAnswers={};state.domesticFacts="";state.domesticRequest="";state.domesticCounterparty="";state.domesticAttachments="";
  clearPreviewForRoute();
},true);
renderAll();
