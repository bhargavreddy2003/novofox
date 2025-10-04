(function(G){
  // tiny joiner + string table
  function J(){for(var i=0,s="";i<arguments.length;i++)s+=arguments[i];return s;}
  var S={
    msgSel: J("Please"," ","select"," ","a"," ","composition","."),

    // layer names
    L_INV: "INVERT",
    L_UNS: "UNSHARP",
    L_BW : "BLACK & WHITE",
    L_RGB: "RGB",
    L_SCL: "SCALE",
    L_GRD: "GRID",
    L_EXP: "EXPOSURE",
    L_GRN: "GRAIN",
    L_FLK: "FLICKER",
    L_SHK: "SHAKE",
    L_FPS: "FPS",

    // preset paths
    P_FPS: J("/","FFX","/","fps",".ffx"),
    P_SCL: J("/","FFX","/","scale",".ffx"),
    P_INV: J("/","FFX","/","invert",".ffx"),
    P_UNS: J("/","FFX","/","unsharp",".ffx"),
    P_BW : J("/","FFX","/","blackandwhite",".ffx"),
    P_RGB: J("/","FFX","/","rgb",".ffx"),
    P_GRD: J("/","FFX","/","grid",".ffx"),
    P_EXP: J("/","FFX","/","exposure",".ffx"),
    P_GRN: J("/","FFX","/","grain",".ffx"),
    P_SHK: J("/","FFX","/","shake",".ffx"),
    P_FLK: J("/","FFX","/","flicker",".ffx"),

    // props/effects
    EFX : J("ADBE"," ","Effect"," ","Parade"),
    FXS : "Effects",
    AP  : J("Anchor"," ","Point"),
    POS : "Position",
    POI : J("Point"," ","of"," ","Interest"),
    TRN : "Transform",
    TR2 : J("Transform"," ", "2"),
    SCL : "SCALE",
    BNC : J("Brightness"," ","&"," ","Contrast"),
    BR  : "Brightness",
    NOI : "Noise",
    AON : J("Amount"," ","of"," ","Noise"),
    PST : J("Posterize"," ","Time"),
    FR  : J("Frame"," ","Rate"),

    // undo name
    UDG : J("Create"," ","Adjustment"," ","Layers")
  };

  function p(layerName,comp,dur,ip,op){
    var L=comp.layers.addSolid([0,0,0],layerName,comp.width,comp.height,comp.pixelAspect,dur);
    L.adjustmentLayer=true; L.shy=true; app.project.activeItem.hideShyLayers=true;
    L.startTime=ip; L.inPoint=ip; L.outPoint=op; return L;
  }

  function P(root,rel){return new File(root.fsName+rel);}

  function C(){ // main
    var c=app.project.activeItem;
    if(!(c instanceof CompItem)){alert(S.msgSel);return;}

    // selection snapshot
    var sel=c.selectedLayers, has=sel.length>0, base=has?sel[0]:null;

    app.beginUndoGroup(S.UDG);

    var dur=has?(base.outPoint-base.inPoint):c.duration,
        ip =has?base.inPoint:0,
        op =has?base.outPoint:c.duration;

    var root=new File($.fileName).parent.parent;

    // preset files
    var fFPS=P(root,S.P_FPS), fSCL=P(root,S.P_SCL), fINV=P(root,S.P_INV), fUNS=P(root,S.P_UNS),
        fBW =P(root,S.P_BW ), fRGB=P(root,S.P_RGB), fGRD=P(root,S.P_GRD), fEXP=P(root,S.P_EXP),
        fGRN=P(root,S.P_GRN), fSHK=P(root,S.P_SHK), fFLK=P(root,S.P_FLK);

    // layers
    var L_INV=p(S.L_INV,c,dur,ip,op); L_INV.applyPreset(fINV);
    var L_UNS=p(S.L_UNS,c,dur,ip,op); L_UNS.applyPreset(fUNS);
    var L_BW =p(S.L_BW ,c,dur,ip,op); L_BW .applyPreset(fBW );
    var L_RGB=p(S.L_RGB,c,dur,ip,op); L_RGB.applyPreset(fRGB);
    var L_SCL=p(S.L_SCL,c,dur,ip,op); L_SCL.applyPreset(fSCL);
    var L_GRD=p(S.L_GRD,c,dur,ip,op); L_GRD.applyPreset(fGRD);
    var L_EXP=p(S.L_EXP,c,dur,ip,op); L_EXP.applyPreset(fEXP);
    var L_GRN=p(S.L_GRN,c,dur,ip,op); L_GRN.applyPreset(fGRN);
    var L_FLK=p(S.L_FLK,c,dur,ip,op); L_FLK.applyPreset(fFLK);
    var L_SHK=p(S.L_SHK,c,dur,ip,op); L_SHK.applyPreset(fSHK);
    var L_FPS=p(S.L_FPS,c,dur,ip,op); L_FPS.applyPreset(fFPS);

    // ===== helpers =====
    function setAP(layer,fxName){
      var fx=layer.property(S.FXS).property(fxName); if(fx){
        var ap=fx.property(S.AP); ap&&ap.setValue([c.width/2,c.height/2]);
        var ps=fx.property(S.POS); if(ps) ps.setValue([c.width/2,c.height/2]);
      }
    }
    function setPOI(layer,fxName){
      var fx=layer.property(S.EFX).property(fxName); if(fx){
        var poi=fx.property(S.POI); poi&&poi.setValue([app.project.activeItem.width/2,app.project.activeItem.height/2]);
      }
    }

    // Shake anchors
    setAP(L_SHK,"Shake1");
    setAP(L_SHK,"Shake2");
    setAP(L_SHK,"Shake3");

    // Scale anchors (SCALE on SCALE and on FPS)
    setAP(L_SCL,S.SCL);
    setAP(L_FPS,S.SCL);

    // RGB POIs
    setPOI(L_RGB,"RGB1");
    setPOI(L_RGB,"RGB2");
    setPOI(L_RGB,"RGB3");

    // FPS Transform anchors
    setAP(L_FPS,S.TRN);
    setAP(L_FPS,S.TR2);

    // Position INVERT layer
    if(base){ L_INV.moveBefore(base); } else { L_INV.moveToBeginning(); }

    // Deselect FPS (like original)
    L_FPS.selected=false;

    // Ordering
    L_UNS.moveBefore(L_INV);
    L_BW .moveBefore(L_UNS);
    L_RGB.moveBefore(L_BW );
    L_SCL.moveBefore(L_RGB);
    L_GRD.moveBefore(L_SCL);
    L_FLK.moveBefore(L_GRD);
    L_EXP.moveBefore(L_FLK);
    L_SHK.moveBefore(L_EXP);
    L_GRN.moveBefore(L_SHK);
    L_FPS.moveBefore(L_GRN);

    // Reselect prior or 12th layer (1-based index)
    if(base){ base.selected=true; }
    else if(c.layers.length>=12){ c.layers[12].selected=true; }

    app.endUndoGroup();
  }

  // expose and run (keeps your entry point intact)
  G[J("create","Adjustment","Layers")]=C;
  C();
})(this);
