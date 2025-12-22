import{av as v,aw as B,z as w,ax as k,ay as $,az as C,aA as P,a1 as D,h as u,o as d,m as r,l as h,aB as l,I as g,q as n,t as b,x as A,n as i,c as f,aC as S,aD as I,aE as E,aF as K,d as L,a as T}from"./index-C48c6k3v.js";var N=`
    .p-panel {
        display: block;
        border: 1px solid dt('panel.border.color');
        border-radius: dt('panel.border.radius');
        background: dt('panel.background');
        color: dt('panel.color');
    }

    .p-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: dt('panel.header.padding');
        background: dt('panel.header.background');
        color: dt('panel.header.color');
        border-style: solid;
        border-width: dt('panel.header.border.width');
        border-color: dt('panel.header.border.color');
        border-radius: dt('panel.header.border.radius');
    }

    .p-panel-toggleable .p-panel-header {
        padding: dt('panel.toggleable.header.padding');
    }

    .p-panel-title {
        line-height: 1;
        font-weight: dt('panel.title.font.weight');
    }

    .p-panel-content {
        padding: dt('panel.content.padding');
    }

    .p-panel-footer {
        padding: dt('panel.footer.padding');
    }
`,j={root:function(t){var p=t.props;return["p-panel p-component",{"p-panel-toggleable":p.toggleable}]},header:"p-panel-header",title:"p-panel-title",headerActions:"p-panel-header-actions",pcToggleButton:"p-panel-toggle-button",contentContainer:"p-panel-content-container",content:"p-panel-content",footer:"p-panel-footer"},z=v.extend({name:"panel",style:N,classes:j}),V={name:"BasePanel",extends:C,props:{header:String,toggleable:Boolean,collapsed:Boolean,toggleButtonProps:{type:Object,default:function(){return{severity:"secondary",text:!0,rounded:!0}}}},style:z,provide:function(){return{$pcPanel:this,$parentInstance:this}}},m={name:"Panel",extends:V,inheritAttrs:!1,emits:["update:collapsed","toggle"],data:function(){return{d_collapsed:this.collapsed}},watch:{collapsed:function(t){this.d_collapsed=t}},methods:{toggle:function(t){this.d_collapsed=!this.d_collapsed,this.$emit("update:collapsed",this.d_collapsed),this.$emit("toggle",{originalEvent:t,value:this.d_collapsed})},onKeyDown:function(t){(t.code==="Enter"||t.code==="NumpadEnter"||t.code==="Space")&&(this.toggle(t),t.preventDefault())}},computed:{buttonAriaLabel:function(){return this.toggleButtonProps&&this.toggleButtonProps.ariaLabel?this.toggleButtonProps.ariaLabel:this.header},dataP:function(){return P({toggleable:this.toggleable})}},components:{PlusIcon:$,MinusIcon:k,Button:w},directives:{ripple:B}},F=["data-p"],M=["data-p"],_=["id"],q=["id","aria-labelledby"];function O(e,t,p,J,s,a){var y=D("Button");return d(),u("div",n({class:e.cx("root"),"data-p":a.dataP},e.ptmi("root")),[r("div",n({class:e.cx("header"),"data-p":a.dataP},e.ptm("header")),[l(e.$slots,"header",{id:e.$id+"_header",class:A(e.cx("title")),collapsed:s.d_collapsed},function(){return[e.header?(d(),u("span",n({key:0,id:e.$id+"_header",class:e.cx("title")},e.ptm("title")),b(e.header),17,_)):g("",!0)]}),r("div",n({class:e.cx("headerActions")},e.ptm("headerActions")),[l(e.$slots,"icons"),e.toggleable?l(e.$slots,"togglebutton",{key:0,collapsed:s.d_collapsed,toggleCallback:function(c){return a.toggle(c)},keydownCallback:function(c){return a.onKeyDown(c)}},function(){return[h(y,n({id:e.$id+"_header",class:e.cx("pcToggleButton"),"aria-label":a.buttonAriaLabel,"aria-controls":e.$id+"_content","aria-expanded":!s.d_collapsed,unstyled:e.unstyled,onClick:t[0]||(t[0]=function(o){return a.toggle(o)}),onKeydown:t[1]||(t[1]=function(o){return a.onKeyDown(o)})},e.toggleButtonProps,{pt:e.ptm("pcToggleButton")}),{icon:i(function(o){return[l(e.$slots,e.$slots.toggleicon?"toggleicon":"togglericon",{collapsed:s.d_collapsed},function(){return[(d(),f(S(s.d_collapsed?"PlusIcon":"MinusIcon"),n({class:o.class},e.ptm("pcToggleButton").icon),null,16,["class"]))]})]}),_:3},16,["id","class","aria-label","aria-controls","aria-expanded","unstyled","pt"])]}):g("",!0)],16)],16,M),h(K,n({name:"p-toggleable-content"},e.ptm("transition")),{default:i(function(){return[I(r("div",n({id:e.$id+"_content",class:e.cx("contentContainer"),role:"region","aria-labelledby":e.$id+"_header"},e.ptm("contentContainer")),[r("div",n({class:e.cx("content")},e.ptm("content")),[l(e.$slots,"default")],16),e.$slots.footer?(d(),u("div",n({key:0,class:e.cx("footer")},e.ptm("footer")),[l(e.$slots,"footer")],16)):g("",!0)],16,q),[[E,!s.d_collapsed]])]}),_:3},16)],16,F)}m.render=O;const R={class:"flex justify-content-between align-items-center w-full"},G={class:"text-900 font-bold text-xl m-0"},H={class:"mt-2"},U=L({__name:"FormSection",props:{title:{},initiallyCollapsed:{type:Boolean}},setup(e){return(t,p)=>(d(),f(T(m),{toggleable:"",collapsed:e.initiallyCollapsed,class:"mb-6 form-section"},{header:i(()=>[r("div",R,[r("h2",G,b(e.title),1)])]),default:i(()=>[r("div",H,[l(t.$slots,"default")])]),_:3},8,["collapsed"]))}});export{U as _};
