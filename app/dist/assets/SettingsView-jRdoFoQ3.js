import{av as j,az as w,h as b,o as u,aB as y,I as $,q as g,aA as X,b3 as B,b4 as I,b5 as U,a1 as Z,c as k,n as f,m as e,t as c,aC as L,x as fe,aD as M,aE as G,aF as be,J as O,d as ee,C as he,b as xe,A as ge,b2 as Se,b6 as ye,r as P,k as $e,b7 as _e,a as r,ac as ke,l as p,b8 as Ce,K,M as F,z as S,L as we,ah as Ve,ai as R,a4 as Y,v as Ie,b9 as N,G as te,a6 as Pe}from"./index-C48c6k3v.js";import{s as Ee}from"./index-BWAuPFrs.js";var De=`
    .p-steplist {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding: 0;
        list-style-type: none;
        overflow-x: auto;
    }

    .p-step {
        position: relative;
        display: flex;
        flex: 1 1 auto;
        align-items: center;
        gap: dt('stepper.step.gap');
        padding: dt('stepper.step.padding');
    }

    .p-step:last-of-type {
        flex: initial;
    }

    .p-step-header {
        border: 0 none;
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        cursor: pointer;
        transition:
            background dt('stepper.transition.duration'),
            color dt('stepper.transition.duration'),
            border-color dt('stepper.transition.duration'),
            outline-color dt('stepper.transition.duration'),
            box-shadow dt('stepper.transition.duration');
        border-radius: dt('stepper.step.header.border.radius');
        outline-color: transparent;
        background: transparent;
        padding: dt('stepper.step.header.padding');
        gap: dt('stepper.step.header.gap');
    }

    .p-step-header:focus-visible {
        box-shadow: dt('stepper.step.header.focus.ring.shadow');
        outline: dt('stepper.step.header.focus.ring.width') dt('stepper.step.header.focus.ring.style') dt('stepper.step.header.focus.ring.color');
        outline-offset: dt('stepper.step.header.focus.ring.offset');
    }

    .p-stepper.p-stepper-readonly .p-step {
        cursor: auto;
    }

    .p-step-title {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        color: dt('stepper.step.title.color');
        font-weight: dt('stepper.step.title.font.weight');
        transition:
            background dt('stepper.transition.duration'),
            color dt('stepper.transition.duration'),
            border-color dt('stepper.transition.duration'),
            box-shadow dt('stepper.transition.duration'),
            outline-color dt('stepper.transition.duration');
    }

    .p-step-number {
        display: flex;
        align-items: center;
        justify-content: center;
        color: dt('stepper.step.number.color');
        border: 2px solid dt('stepper.step.number.border.color');
        background: dt('stepper.step.number.background');
        min-width: dt('stepper.step.number.size');
        height: dt('stepper.step.number.size');
        line-height: dt('stepper.step.number.size');
        font-size: dt('stepper.step.number.font.size');
        z-index: 1;
        border-radius: dt('stepper.step.number.border.radius');
        position: relative;
        font-weight: dt('stepper.step.number.font.weight');
    }

    .p-step-number::after {
        content: ' ';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: dt('stepper.step.number.border.radius');
        box-shadow: dt('stepper.step.number.shadow');
    }

    .p-step-active .p-step-header {
        cursor: default;
    }

    .p-step-active .p-step-number {
        background: dt('stepper.step.number.active.background');
        border-color: dt('stepper.step.number.active.border.color');
        color: dt('stepper.step.number.active.color');
    }

    .p-step-active .p-step-title {
        color: dt('stepper.step.title.active.color');
    }

    .p-step:not(.p-disabled):focus-visible {
        outline: dt('focus.ring.width') dt('focus.ring.style') dt('focus.ring.color');
        outline-offset: dt('focus.ring.offset');
    }

    .p-step:has(~ .p-step-active) .p-stepper-separator {
        background: dt('stepper.separator.active.background');
    }

    .p-stepper-separator {
        flex: 1 1 0;
        background: dt('stepper.separator.background');
        width: 100%;
        height: dt('stepper.separator.size');
        transition:
            background dt('stepper.transition.duration'),
            color dt('stepper.transition.duration'),
            border-color dt('stepper.transition.duration'),
            box-shadow dt('stepper.transition.duration'),
            outline-color dt('stepper.transition.duration');
    }

    .p-steppanels {
        padding: dt('stepper.steppanels.padding');
    }

    .p-steppanel {
        background: dt('stepper.steppanel.background');
        color: dt('stepper.steppanel.color');
    }

    .p-stepper:has(.p-stepitem) {
        display: flex;
        flex-direction: column;
    }

    .p-stepitem {
        display: flex;
        flex-direction: column;
        flex: initial;
    }

    .p-stepitem.p-stepitem-active {
        flex: 1 1 auto;
    }

    .p-stepitem .p-step {
        flex: initial;
    }

    .p-stepitem .p-steppanel-content {
        width: 100%;
        padding: dt('stepper.steppanel.padding');
        margin-inline-start: 1rem;
    }

    .p-stepitem .p-steppanel {
        display: flex;
        flex: 1 1 auto;
    }

    .p-stepitem .p-stepper-separator {
        flex: 0 0 auto;
        width: dt('stepper.separator.size');
        height: auto;
        margin: dt('stepper.separator.margin');
        position: relative;
        left: calc(-1 * dt('stepper.separator.size'));
    }

    .p-stepitem .p-stepper-separator:dir(rtl) {
        left: calc(-9 * dt('stepper.separator.size'));
    }

    .p-stepitem:has(~ .p-stepitem-active) .p-stepper-separator {
        background: dt('stepper.separator.active.background');
    }

    .p-stepitem:last-of-type .p-steppanel {
        padding-inline-start: dt('stepper.step.number.size');
    }
`,Ae={root:function(a){var l=a.props;return["p-stepper p-component",{"p-readonly":l.linear}]},separator:"p-stepper-separator"},Be=j.extend({name:"stepper",style:De,classes:Ae}),je={name:"BaseStepper",extends:w,props:{value:{type:[String,Number],default:void 0},linear:{type:Boolean,default:!1}},style:Be,provide:function(){return{$pcStepper:this,$parentInstance:this}}},ae={name:"Stepper",extends:je,inheritAttrs:!1,emits:["update:value"],data:function(){return{d_value:this.value}},watch:{value:function(a){this.d_value=a}},methods:{updateValue:function(a){this.d_value!==a&&(this.d_value=a,this.$emit("update:value",a))},isStepActive:function(a){return this.d_value===a},isStepDisabled:function(){return this.linear}}};function ze(t,a,l,d,v,s){return u(),b("div",g({class:t.cx("root"),role:"tablist"},t.ptmi("root")),[t.$slots.start?y(t.$slots,"start",{key:0}):$("",!0),y(t.$slots,"default"),t.$slots.end?y(t.$slots,"end",{key:1}):$("",!0)],16)}ae.render=ze;var Te={root:"p-steplist"},Re=j.extend({name:"steplist",classes:Te}),Oe={name:"BaseStepList",extends:w,style:Re,provide:function(){return{$pcStepList:this,$parentInstance:this}}},se={name:"StepList",extends:Oe,inheritAttrs:!1};function Ne(t,a,l,d,v,s){return u(),b("div",g({class:t.cx("root")},t.ptmi("root")),[y(t.$slots,"default")],16)}se.render=Ne;var Ue={root:"p-steppanels"},Le=j.extend({name:"steppanels",classes:Ue}),Fe={name:"BaseStepPanels",extends:w,style:Le,provide:function(){return{$pcStepPanels:this,$parentInstance:this}}},ne={name:"StepPanels",extends:Fe,inheritAttrs:!1};function qe(t,a,l,d,v,s){return u(),b("div",g({class:t.cx("root")},t.ptmi("root")),[y(t.$slots,"default")],16)}ne.render=qe;var We={root:function(a){var l=a.instance;return["p-step",{"p-step-active":l.active,"p-disabled":l.isStepDisabled}]},header:"p-step-header",number:"p-step-number",title:"p-step-title"},Me=j.extend({name:"step",classes:We}),ie={name:"StepperSeparator",hostName:"Stepper",extends:w,inject:{$pcStepper:{default:null}}};function Ge(t,a,l,d,v,s){return u(),b("span",g({class:t.cx("separator")},t.ptmo(s.$pcStepper.pt,"separator")),null,16)}ie.render=Ge;var Ke={name:"BaseStep",extends:w,props:{value:{type:[String,Number],default:void 0},disabled:{type:Boolean,default:!1},asChild:{type:Boolean,default:!1},as:{type:[String,Object],default:"DIV"}},style:Me,provide:function(){return{$pcStep:this,$parentInstance:this}}},le={name:"Step",extends:Ke,inheritAttrs:!1,inject:{$pcStepper:{default:null},$pcStepList:{default:null},$pcStepItem:{default:null}},data:function(){return{isSeparatorVisible:!1,isCompleted:!1}},mounted:function(){if(this.$el&&this.$pcStepList){var a=B(this.$el,I(this.$pcStepper.$el,'[data-pc-name="step"]')),l=B(U(this.$pcStepper.$el,'[data-pc-name="step"][data-p-active="true"]'),I(this.$pcStepper.$el,'[data-pc-name="step"]')),d=I(this.$pcStepper.$el,'[data-pc-name="step"]').length;this.isSeparatorVisible=a!==d-1,this.isCompleted=a<l}},updated:function(){var a=B(this.$el,I(this.$pcStepper.$el,'[data-pc-name="step"]')),l=B(U(this.$pcStepper.$el,'[data-pc-name="step"][data-p-active="true"]'),I(this.$pcStepper.$el,'[data-pc-name="step"]'));this.isCompleted=a<l},methods:{getPTOptions:function(a){var l=a==="root"?this.ptmi:this.ptm;return l(a,{context:{active:this.active,disabled:this.isStepDisabled}})},onStepClick:function(){this.$pcStepper.updateValue(this.activeValue)}},computed:{active:function(){return this.$pcStepper.isStepActive(this.activeValue)},activeValue:function(){var a;return this.$pcStepItem?(a=this.$pcStepItem)===null||a===void 0?void 0:a.value:this.value},isStepDisabled:function(){return!this.active&&(this.$pcStepper.isStepDisabled()||this.disabled)},id:function(){var a;return"".concat((a=this.$pcStepper)===null||a===void 0?void 0:a.$id,"_step_").concat(this.activeValue)},ariaControls:function(){var a;return"".concat((a=this.$pcStepper)===null||a===void 0?void 0:a.$id,"_steppanel_").concat(this.activeValue)},a11yAttrs:function(){return{root:{role:"presentation","aria-current":this.active?"step":void 0,"data-pc-name":"step","data-pc-section":"root","data-p-disabled":this.isStepDisabled,"data-p-active":this.active},header:{id:this.id,role:"tab",taindex:this.disabled?-1:void 0,"aria-controls":this.ariaControls,"data-pc-section":"header",disabled:this.isStepDisabled,onClick:this.onStepClick}}},dataP:function(){return X({disabled:this.isStepDisabled,readonly:this.$pcStepper.linear,active:this.active,completed:this.isCompleted,vertical:this.$pcStepItem!=null})}},components:{StepperSeparator:ie}},Ye=["id","tabindex","aria-controls","disabled","data-p"],He=["data-p"],Je=["data-p"];function Qe(t,a,l,d,v,s){var V=Z("StepperSeparator");return t.asChild?y(t.$slots,"default",{key:1,class:fe(t.cx("root")),active:s.active,value:t.value,a11yAttrs:s.a11yAttrs,activateCallback:s.onStepClick}):(u(),k(L(t.as),g({key:0,class:t.cx("root"),"aria-current":s.active?"step":void 0,role:"presentation","data-p-active":s.active,"data-p-disabled":s.isStepDisabled,"data-p":s.dataP},s.getPTOptions("root")),{default:f(function(){return[e("button",g({id:s.id,class:t.cx("header"),role:"tab",type:"button",tabindex:s.isStepDisabled?-1:void 0,"aria-controls":s.ariaControls,disabled:s.isStepDisabled,onClick:a[0]||(a[0]=function(){return s.onStepClick&&s.onStepClick.apply(s,arguments)}),"data-p":s.dataP},s.getPTOptions("header")),[e("span",g({class:t.cx("number"),"data-p":s.dataP},s.getPTOptions("number")),c(s.activeValue),17,He),e("span",g({class:t.cx("title"),"data-p":s.dataP},s.getPTOptions("title")),[y(t.$slots,"default")],16,Je)],16,Ye),v.isSeparatorVisible?(u(),k(V,{key:0,"data-p":s.dataP},null,8,["data-p"])):$("",!0)]}),_:3},16,["class","aria-current","data-p-active","data-p-disabled","data-p"]))}le.render=Qe;var Xe={root:function(a){var l=a.instance;return["p-steppanel",{"p-steppanel-active":l.isVertical&&l.active}]},content:"p-steppanel-content"},Ze=j.extend({name:"steppanel",classes:Xe}),re={name:"StepperSeparator",hostName:"Stepper",extends:w,inject:{$pcStepper:{default:null}}};function et(t,a,l,d,v,s){return u(),b("span",g({class:t.cx("separator")},t.ptmo(s.$pcStepper.pt,"separator")),null,16)}re.render=et;var tt={name:"BaseStepPanel",extends:w,props:{value:{type:[String,Number],default:void 0},asChild:{type:Boolean,default:!1},as:{type:[String,Object],default:"DIV"}},style:Ze,provide:function(){return{$pcStepPanel:this,$parentInstance:this}}},E={name:"StepPanel",extends:tt,inheritAttrs:!1,inject:{$pcStepper:{default:null},$pcStepItem:{default:null},$pcStepList:{default:null}},data:function(){return{isSeparatorVisible:!1}},mounted:function(){if(this.$el){var a,l,d=I(this.$pcStepper.$el,'[data-pc-name="step"]'),v=U(this.isVertical?(a=this.$pcStepItem)===null||a===void 0?void 0:a.$el:(l=this.$pcStepList)===null||l===void 0?void 0:l.$el,'[data-pc-name="step"]'),s=B(v,d);this.isSeparatorVisible=this.isVertical&&s!==d.length-1}},methods:{getPTOptions:function(a){var l=a==="root"?this.ptmi:this.ptm;return l(a,{context:{active:this.active}})},updateValue:function(a){this.$pcStepper.updateValue(a)}},computed:{active:function(){var a,l,d=this.$pcStepItem?(a=this.$pcStepItem)===null||a===void 0?void 0:a.value:this.value;return d===((l=this.$pcStepper)===null||l===void 0?void 0:l.d_value)},isVertical:function(){return!!this.$pcStepItem},activeValue:function(){var a;return this.isVertical?(a=this.$pcStepItem)===null||a===void 0?void 0:a.value:this.value},id:function(){var a;return"".concat((a=this.$pcStepper)===null||a===void 0?void 0:a.$id,"_steppanel_").concat(this.activeValue)},ariaControls:function(){var a;return"".concat((a=this.$pcStepper)===null||a===void 0?void 0:a.$id,"_step_").concat(this.activeValue)},a11yAttrs:function(){return{id:this.id,role:"tabpanel","aria-controls":this.ariaControls,"data-pc-name":"steppanel","data-p-active":this.active}},dataP:function(){return X({vertical:this.$pcStepItem!=null})}},components:{StepperSeparator:re}},at=["data-p"];function st(t,a,l,d,v,s){var V=Z("StepperSeparator");return s.isVertical?(u(),b(O,{key:0},[t.asChild?y(t.$slots,"default",{key:1,active:s.active,a11yAttrs:s.a11yAttrs,activateCallback:function(_){return s.updateValue(_)}}):(u(),k(be,g({key:0,name:"p-toggleable-content"},t.ptm("transition")),{default:f(function(){return[M((u(),k(L(t.as),g({id:s.id,class:t.cx("root"),role:"tabpanel","aria-controls":s.ariaControls,"data-p":s.dataP},s.getPTOptions("root")),{default:f(function(){return[v.isSeparatorVisible?(u(),k(V,{key:0,"data-p":s.dataP},null,8,["data-p"])):$("",!0),e("div",g({class:t.cx("content"),"data-p":s.dataP},s.getPTOptions("content")),[y(t.$slots,"default",{active:s.active,activateCallback:function(_){return s.updateValue(_)}})],16,at)]}),_:3},16,["id","class","aria-controls","data-p"])),[[G,s.active]])]}),_:3},16))],64)):(u(),b(O,{key:1},[t.asChild?t.asChild&&s.active?y(t.$slots,"default",{key:1,active:s.active,a11yAttrs:s.a11yAttrs,activateCallback:function(_){return s.updateValue(_)}}):$("",!0):M((u(),k(L(t.as),g({key:0,id:s.id,class:t.cx("root"),role:"tabpanel","aria-controls":s.ariaControls},s.getPTOptions("root")),{default:f(function(){return[y(t.$slots,"default",{active:s.active,activateCallback:function(_){return s.updateValue(_)}})]}),_:3},16,["id","class","aria-controls"])),[[G,s.active]])],64))}E.render=st;const nt={class:"flex flex-column gap-4"},it={class:"flex flex-column align-items-center justify-content-center py-5 gap-4"},lt={key:0,class:"flex flex-column gap-3"},rt={class:"flex align-items-center justify-content-between p-3 surface-100 border-round"},ot={class:"flex gap-4"},pt={class:"flex flex-column"},dt={class:"text-2xl font-bold text-green-600"},ct={class:"flex flex-column"},ut={class:"text-2xl font-bold text-orange-600"},vt={class:"flex flex-column"},mt={class:"text-2xl font-bold text-blue-600"},ft={class:"flex flex-column"},bt={class:"text-2xl font-bold text-red-600"},ht={key:0},xt={class:"flex justify-content-end gap-2 mt-4"},gt={key:0,class:"flex flex-column gap-4"},St={class:"flex align-items-center justify-content-between"},yt={class:"m-0"},$t={class:"flex align-items-center gap-2"},_t={class:"flex flex-column gap-3 overflow-auto max-h-30rem pr-2"},kt={class:"flex align-items-center justify-content-between mb-3"},Ct={class:"font-bold text-lg"},wt={class:"flex gap-4"},Vt={class:"flex align-items-center"},It=["for"],Pt={class:"flex align-items-center"},Et=["for"],Dt={class:"flex align-items-center"},At=["for"],Bt={class:"grid text-sm"},jt={class:"col-6 py-1 border-right-1 surface-border"},zt={class:"flex flex-column"},Tt={class:"col-6 py-1"},Rt={class:"flex flex-column"},Ot={class:"flex justify-content-end gap-2 mt-4"},Nt={key:0,class:"flex flex-column gap-4 py-3"},Ut={class:"grid surface-100 border-round p-4 mt-2"},Lt={class:"col-12 py-2 flex justify-content-between border-bottom-1 surface-border"},Ft={class:"font-bold"},qt={class:"col-12 py-2 flex justify-content-between border-bottom-1 surface-border"},Wt={class:"font-bold"},Mt={class:"col-12 py-2 flex justify-content-between border-bottom-1 surface-border"},Gt={class:"font-bold"},Kt={class:"col-12 py-2 flex justify-content-between border-bottom-1 surface-border"},Yt={class:"font-bold"},Ht={class:"col-12 py-4 flex justify-content-between text-xl"},Jt={class:"font-bold text-primary"},Qt={class:"flex justify-content-end gap-2"},Xt={key:0,class:"flex flex-column align-items-center justify-content-center py-5 gap-4"},Zt={class:"flex gap-3"},ea={class:"w-full"},ta={class:"flex justify-content-between mb-2"},aa={class:"text-sm font-semibold"},H=1,J=2,Q=3,sa=4,na=5,ia=ee({__name:"DataImportWizard",props:{visible:{type:Boolean}},emits:["update:visible","import-complete"],setup(t,{emit:a}){const l=t,d=a,{t:v}=he(),s=xe(),V=ge(),D=Se(),{importFromFile:_,importing:q,error:oe}=ye(),h=P(1),z=P(null),o=P(null),T=P(!1),A=P(null),pe=[{label:v("common.importExport.stepUpload","Upload"),value:H},{label:v("common.importExport.stepPreview","Preview & Validate"),value:J},{label:v("common.importExport.stepResolve","Resolve Conflicts"),value:Q},{label:v("common.importExport.stepConfirm","Final Confirmation"),value:sa},{label:v("common.importExport.stepResults","Results"),value:na}],de=$e(()=>h.value===H?!!z.value:h.value===J?!!o.value&&o.value.valid.length+o.value.conflicts.length+o.value.partial.length>0:h.value===Q?o.value?.conflicts.every(x=>x.resolution)??!0:!0);async function ce(x){const n=x.files[0];if(n){z.value=n;try{o.value=await _(n),h.value=2}catch(i){console.error("Import analysis failed:",i),s.add({severity:"error",summary:v("common.error"),detail:oe.value||"Failed to analyze file",life:5e3})}}}function ue(){!A.value||!o.value||o.value.conflicts.forEach(x=>{x.resolution=A.value})}async function ve(){if(!o.value)return;T.value=!0;const x=o.value;let n=0,i=0;try{for(const m of x.valid)await V.add(m),n++;for(const m of x.conflicts)if(m.resolution==="overwrite"){const C={...m.existing,...m.imported};await V.update(m.existing.id,C),n++}else m.resolution,i++;x.partial.length>0&&await D.saveMany(x.partial),s.add({severity:"success",summary:v("common.importExport.importComplete","Import Complete"),detail:v("common.importExport.importSuccessDetail",`Successfully imported ${n} businesses. ${i} skipped.`),life:5e3}),h.value=5,d("import-complete",x)}catch(m){console.error("Import execution failed:",m),s.add({severity:"error",summary:v("common.error"),detail:"An error occurred during import execution",life:5e3})}finally{T.value=!1}}function W(){d("update:visible",l.visible),d("update:visible",!1),h.value=1,z.value=null,o.value=null,A.value=null}function me(){const n=["name","entrepreneurId","registrationNumber","email","telephone","street","city","country"].join(",")+`
Example Business,ENT-UUID-HERE,REG123,info@example.com,+123456789,123 Street,City,Country`,i=new Blob([n],{type:"text/csv;charset=utf-8;"}),m=document.createElement("a");m.setAttribute("href",URL.createObjectURL(i)),m.setAttribute("download","business_import_template.csv"),m.click()}return(x,n)=>(u(),k(r(ke),{visible:t.visible,modal:"",header:r(v)("common.importExport.importWizard","Business Import Wizard"),style:{width:"70vw"},breakpoints:{"1199px":"75vw","991px":"85vw","575px":"95vw"},"onUpdate:visible":n[8]||(n[8]=i=>d("update:visible",i))},_e({default:f(()=>[e("div",nt,[p(r(ae),{value:h.value,"onUpdate:value":n[7]||(n[7]=i=>h.value=i)},{default:f(()=>[p(r(se),null,{default:f(()=>[(u(),b(O,null,K(pe,i=>p(r(le),{key:i.value,value:i.value},{default:f(()=>[F(c(i.label),1)]),_:2},1032,["value"])),64))]),_:1}),p(r(ne),null,{default:f(()=>[p(r(E),{value:1},{default:f(()=>[e("div",it,[n[9]||(n[9]=e("div",{class:"text-center"},[e("i",{class:"pi pi-cloud-upload text-6xl text-primary mb-3"}),e("h3",{class:"m-0 text-xl font-bold"},"Upload Your CSV File"),e("p",{class:"text-color-secondary"},"Drag and drop your file here or click to browse")],-1)),p(r(Ee),{mode:"basic",name:"demo[]",accept:".csv","max-file-size":5242880,"choose-label":"Select CSV File",class:"p-button-lg",onSelect:ce}),p(r(S),{label:"Download CSV Template",icon:"pi pi-download",text:"",onClick:me})])]),_:1}),p(r(E),{value:2},{default:f(()=>[o.value?(u(),b("div",lt,[e("div",rt,[e("div",ot,[e("div",pt,[n[10]||(n[10]=e("span",{class:"text-color-secondary text-sm"},"Valid Records",-1)),e("span",dt,c(o.value.valid.length),1)]),e("div",ct,[n[11]||(n[11]=e("span",{class:"text-color-secondary text-sm"},"Conflicts",-1)),e("span",ut,c(o.value.conflicts.length),1)]),e("div",vt,[n[12]||(n[12]=e("span",{class:"text-color-secondary text-sm"},"Partial Records",-1)),e("span",mt,c(o.value.partial.length),1)]),e("div",ft,[n[13]||(n[13]=e("span",{class:"text-color-secondary text-sm"},"Rejected",-1)),e("span",bt,c(o.value.rejected.length),1)])]),o.value.rejected.length>0?(u(),b("div",ht,[p(r(we),{severity:"error",closable:!1},{default:f(()=>[...n[14]||(n[14]=[F("Found some completely invalid rows",-1)])]),_:1})])):$("",!0)]),p(r(Ve),{value:o.value.valid.concat(o.value.conflicts.map(i=>i.imported)).slice(0,5),class:"p-datatable-sm"},{default:f(()=>[p(r(R),{field:"name",header:"Business Name"}),p(r(R),{field:"entrepreneurId",header:"Entrepreneur ID"}),p(r(R),{field:"contact.email",header:"Email"}),p(r(R),{header:"Status"},{body:f(i=>[o.value.conflicts.some(m=>m.imported.name===i.data.name)?(u(),k(r(Y),{key:0,value:"CONFLICT",severity:"warn"})):(u(),k(r(Y),{key:1,value:"VALID",severity:"success"}))]),_:1})]),_:1},8,["value"]),e("div",xt,[p(r(S),{label:"Back",text:"",onClick:n[0]||(n[0]=i=>h.value=1)}),p(r(S),{label:"Next",onClick:n[1]||(n[1]=i=>o.value.conflicts.length>0?h.value=3:h.value=4)})])])):$("",!0)]),_:1}),p(r(E),{value:3},{default:f(()=>[o.value?(u(),b("div",gt,[e("div",St,[e("h3",yt,"Resolve Duplicates ("+c(o.value.conflicts.length)+")",1),e("div",$t,[n[15]||(n[15]=e("span",{class:"text-sm font-semibold"},"Apply to all:",-1)),p(r(Ie),{modelValue:A.value,"onUpdate:modelValue":n[2]||(n[2]=i=>A.value=i),options:[{label:"Skip all",value:"skip"},{label:"Overwrite all",value:"overwrite"},{label:"Keep existing",value:"keep"}],"option-label":"label","option-value":"value",placeholder:"Choose Action",class:"w-12rem",onChange:ue},null,8,["modelValue"])])]),e("div",_t,[(u(!0),b(O,null,K(o.value.conflicts,(i,m)=>(u(),b("div",{key:m,class:"border-1 surface-border border-round p-3 surface-card"},[e("div",kt,[e("span",Ct,c(i.imported.name),1),e("div",wt,[e("div",Vt,[p(r(N),{modelValue:i.resolution,"onUpdate:modelValue":C=>i.resolution=C,"input-id":"keep-"+m,value:"keep"},null,8,["modelValue","onUpdate:modelValue","input-id"]),e("label",{for:"keep-"+m,class:"ml-2"},"Keep Existing",8,It)]),e("div",Pt,[p(r(N),{modelValue:i.resolution,"onUpdate:modelValue":C=>i.resolution=C,"input-id":"over-"+m,value:"overwrite"},null,8,["modelValue","onUpdate:modelValue","input-id"]),e("label",{for:"over-"+m,class:"ml-2"},"Overwrite",8,Et)]),e("div",Dt,[p(r(N),{modelValue:i.resolution,"onUpdate:modelValue":C=>i.resolution=C,"input-id":"skip-"+m,value:"skip"},null,8,["modelValue","onUpdate:modelValue","input-id"]),e("label",{for:"skip-"+m,class:"ml-2"},"Skip Both",8,At)])])]),e("div",Bt,[n[16]||(n[16]=e("div",{class:"col-6 py-1 font-semibold text-color-secondary"},"Existing Record",-1)),n[17]||(n[17]=e("div",{class:"col-6 py-1 font-semibold text-color-secondary"},"Imported Record",-1)),e("div",jt,[e("div",zt,[e("span",null,"Email: "+c(i.existing.contact?.email||"N/A"),1),e("span",null,"Location: "+c(i.existing.location?.city||"N/A"),1)])]),e("div",Tt,[e("div",Rt,[e("span",null,"Email: "+c(i.imported.contact?.email||"N/A"),1),e("span",null,"Location: "+c(i.imported.location?.city||"N/A"),1)])])])]))),128))]),e("div",Ot,[p(r(S),{label:"Back",text:"",onClick:n[3]||(n[3]=i=>h.value=2)}),p(r(S),{label:"Next",disabled:!de.value,onClick:n[4]||(n[4]=i=>h.value=4)},null,8,["disabled"])])])):$("",!0)]),_:1}),p(r(E),{value:4},{default:f(()=>[o.value?(u(),b("div",Nt,[n[23]||(n[23]=e("div",{class:"text-center"},[e("i",{class:"pi pi-question-circle text-5xl text-primary mb-3"}),e("h3",{class:"m-0 text-xl font-bold"},"Ready to Import?")],-1)),e("div",Ut,[e("div",Lt,[n[18]||(n[18]=e("span",null,"New Businesses to Create:",-1)),e("span",Ft,c(o.value.valid.length),1)]),e("div",qt,[n[19]||(n[19]=e("span",null,"Duplicates to Update (Overwrite):",-1)),e("span",Wt,c(o.value.conflicts.filter(i=>i.resolution==="overwrite").length),1)]),e("div",Mt,[n[20]||(n[20]=e("span",null,"Duplicates to Skip:",-1)),e("span",Gt,c(o.value.conflicts.filter(i=>i.resolution==="skip"||i.resolution==="keep").length),1)]),e("div",Kt,[n[21]||(n[21]=e("span",null,"Partial Records (Saved as Drafts):",-1)),e("span",Yt,c(o.value.partial.length),1)]),e("div",Ht,[n[22]||(n[22]=e("span",{class:"font-bold"},"Total Operations:",-1)),e("span",Jt,c(o.value.valid.length+o.value.conflicts.filter(i=>i.resolution==="overwrite").length+o.value.partial.length),1)])]),e("div",Qt,[p(r(S),{label:"Cancel",text:"",onClick:W}),p(r(S),{label:"Go Back",text:"",onClick:n[5]||(n[5]=i=>h.value=o.value.conflicts.length>0?3:2)}),p(r(S),{label:"Confirm & Start Import",icon:"pi pi-check",loading:T.value,onClick:ve},null,8,["loading"])])])):$("",!0)]),_:1}),p(r(E),{value:5},{default:f(()=>[o.value?(u(),b("div",Xt,[n[24]||(n[24]=e("div",{class:"text-center"},[e("i",{class:"pi pi-check-circle text-6xl text-success mb-3"}),e("h3",{class:"m-0 text-2xl font-bold"},"Import Successful!"),e("p",{class:"text-color-secondary mt-2"},"The business registry has been updated.")],-1)),e("div",Zt,[p(r(S),{label:"View Businesses",icon:"pi pi-list",onClick:W}),p(r(S),{label:"Import Another",icon:"pi pi-refresh",text:"",onClick:n[6]||(n[6]=i=>{h.value=1,o.value=null,z.value=null})})])])):$("",!0)]),_:1})]),_:1})]),_:1},8,["value"])])]),_:2},[r(q)||T.value?{name:"footer",fn:f(()=>[e("div",ea,[e("div",ta,[e("span",aa,c(r(q)?"Analyzing CSV...":"Processing Import..."),1)]),p(r(Ce),{mode:"indeterminate",style:{height:"6px"}})])]),key:"0"}:void 0]),1032,["visible","header"]))}}),la=te(ia,[["__scopeId","data-v-a09b1477"]]),ra={class:"settings-view p-4"},oa={class:"mb-4"},pa={class:"text-3xl font-bold m-0"},da={class:"text-color-secondary mt-1"},ca={class:"grid"},ua={class:"col-12 md:col-6 lg:col-6"},va={class:"flex align-items-center gap-2"},ma={class:"m-0 mb-4 pb-2 border-bottom-1 surface-border"},fa={class:"flex flex-column gap-3"},ba={class:"flex align-items-start gap-3 p-3 surface-100 border-round"},ha={class:"font-bold mb-1"},xa={class:"m-0 pl-3 text-sm flex flex-column gap-1"},ga={class:"flex justify-content-end"},Sa=ee({__name:"SettingsView",setup(t){const a=P(!1);return(l,d)=>(u(),b("div",ra,[e("div",oa,[e("h1",pa,c(l.$t("pages.settings.title","Settings")),1),e("p",da,c(l.$t("pages.settings.subtitle","Manage application data and preferences")),1)]),e("div",ca,[e("div",ua,[p(r(Pe),null,{title:f(()=>[e("div",va,[d[2]||(d[2]=e("i",{class:"pi pi-upload text-primary text-xl"},null,-1)),e("span",null,c(l.$t("common.importExport.importData","Import Data")),1)])]),subtitle:f(()=>[F(c(l.$t("common.importExport.importSubtitle","Import businesses from a CSV file using a multi-step wizard.")),1)]),content:f(()=>[e("p",ma,c(l.$t("common.importExport.importDescription","Upload your CSV file, preview matching records, resolve any duplicates, and confirm the import.")),1),e("div",fa,[e("div",ba,[d[3]||(d[3]=e("i",{class:"pi pi-info-circle text-info mt-1"},null,-1)),e("div",null,[e("div",ha,c(l.$t("common.importExport.requirementsTitle","Import Requirements")),1),e("ul",xa,[e("li",null,c(l.$t("common.importExport.reqFormat","Only .csv files are supported")),1),e("li",null,c(l.$t("common.importExport.reqSize","Maximum file size: 5MB")),1),e("li",null,c(l.$t("common.importExport.reqDuplicates","Duplicates are detected by business name (case-insensitive)")),1)])])])])]),footer:f(()=>[e("div",ga,[p(r(S),{label:l.$t("common.importExport.startImport","Start Import Wizard"),icon:"pi pi-magic",onClick:d[0]||(d[0]=v=>a.value=!0)},null,8,["label"])])]),_:1})])]),p(la,{visible:a.value,"onUpdate:visible":d[1]||(d[1]=v=>a.value=v)},null,8,["visible"])]))}}),_a=te(Sa,[["__scopeId","data-v-08f1f734"]]);export{_a as default};
