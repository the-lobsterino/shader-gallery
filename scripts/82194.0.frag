//R040701作例　by ニシタマオ
//サンドボックス上での試験用、簡易レイトレシステム、二段階反射機能付（R040628版）
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

const bool cbSetting_March2nd =true;
const bool cbSetting_Back =false;

vec4 VDefaultCamera =vec4(0, 0, -20, 0);
vec4 VDefaultLight =vec4(1,1,-1,0);

struct scrd{
	vec4 VColor;
	float nReflex;
	float nDistance;
};

scrd SCRD;

vec4 VResolution =vec4(resolution, 0, 0);
float nTime =time;
vec4 VMouse =vec4(mouse *2.0 -1.0, 0, 0);

//文字列形状生成機能（R040630版）by ニシタマオ
vec3 fV3LL(vec4 VP, vec4 VA, vec4 VB){
	float nRadius =VA.w;
	vec3 V3PA =VP.xyz -VA.xyz, V3BA =VB.xyz -VA.xyz;
	float nA =clamp(dot(V3PA, V3BA) /dot(V3BA, V3BA), 0.0, 1.0);
	vec3 V3P =V3PA -V3BA *nA;
	return V3P;
}

float fNLL(vec4 VP, vec4 VA, vec4 VB){
	float NP, nRadius =VA.w;
	vec3 V3P =fV3LL(VP, VA, VB);

//	NP =length(V3P) -nRadius;
	NP =length(max(abs(V3P) -nRadius *0.25, 0.0)) -0.25;

	return NP;
}

float fNLetters00(vec4 VP){
	float NP =1000000.0;

	{ vec3 V3C =vec3(5,5,3),  V3D =vec3(5,0,0), V3P;V3P.y +=V3C.y;V3P.y +=V3C.y;V3P.x -=V3C.x;V3P.x -=V3C.x; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,2); VB.xy =vec2(2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1); VB.xy =vec2(-2,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0); VB.xy =vec2(2,-1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-1); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1); VB.xy =vec2(-2,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0); VB.xy =vec2(2,-1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-1); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0); VB.xy =vec2(2,-1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-1); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-1); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(2,2); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0); VB.xy =vec2(2,0); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,-2); VB.xy =vec2(0,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,0); VB.xy =vec2(1,0); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,2); VB.xy =vec2(2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1); VB.xy =vec2(-2,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,2); VB.xy =vec2(2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1); VB.xy =vec2(-2,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1); VB.xy =vec2(-2,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D;V3P =vec3(0);V3P.z +=V3C.z;V3P.y +=V3C.y;V3P.x -=V3C.x;V3P.x -=V3C.x; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(2,2); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0); VB.xy =vec2(2,0); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(2,2); VB.xy =vec2(-2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1); VB.xy =vec2(2,-1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-1); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1); VB.xy =vec2(2,-1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-1); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-1); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,2); VB.xy =vec2(0,-2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D;}

	return NP;
}

//人体形状生成機能、中割機能付（R040701版）by ニシタマオ
vec3 fV3Rotate(vec3 V3P, vec3 V3R){
	V3P.xy *=mat2(cos(V3R.z), -sin(V3R.z), sin(V3R.z), cos(V3R.z));
	V3P.yz *=mat2(cos(V3R.x), -sin(V3R.x), sin(V3R.x), cos(V3R.x));
	V3P.zx *=mat2(cos(V3R.y), -sin(V3R.y), sin(V3R.y), cos(V3R.y));
	return V3P;
}

float fNCappedCylinder(vec4 VP, vec4 VA, vec4 VB){
	float NP, nRadius =VA.w;
	vec3 V3PA =VP.xyz -VA.xyz, V3BA =VB.xyz -VA.xyz;
	float nBABA =dot(V3BA, V3BA), nPABA =dot(V3PA, V3BA);
	float nX =length(V3PA *nBABA -V3BA *nPABA) -nRadius *nBABA;
	float nY =abs(nPABA -nBABA *0.5) -nBABA *0.5;
	float nXX =nX *nX, nYY =nY *nY;
	float nD =(max(nX, nY) <0.0)? -min(nXX, nYY *nBABA):((nX >0.0)? nXX:0.0) +((nY >0.0) ?nYY *nBABA :0.0);
	NP = sign(nD) *sqrt(abs(nD)) /nBABA;
	return NP;
}

float fNCapsule(vec4 VP, vec4 VA, vec4 VB){
	float NP, nRadius =VA.w;
	vec3 V3PA =VP.xyz -VA.xyz, V3BA =VB.xyz -VA.xyz;
	float nA =clamp(dot(V3PA, V3BA) /dot(V3BA, V3BA), 0.0, 1.0);
	vec3 V3P =V3PA -V3BA *nA;
	NP =length(V3P) -nRadius;
	return NP;
}

float fNSmoothMin(float nP1, float nP2, float nK){
	float nH =exp(-nP1 *nK) +exp(-nP2 *nK);
	nH = -log(nH) /nK;
	return nH;
}

struct sskelton{
	vec4 VP_Cntr;
	vec4 VP_Body;
	vec4 VP_Shld;
	vec4 VP_Neck;
	vec4 VP_Head;
	vec4 VP_ArRU;
	vec4 VP_ArLU; 
	vec4 VP_ArRL;
	vec4 VP_ArLL;
	vec4 VP_LeRU;
	vec4 VP_LeLU; 
	vec4 VP_LeRL; 
	vec4 VP_LeLL;
	vec4 VP_HndR;
	vec4 VP_HndL; 
	vec4 VP_FotR; 
	vec4 VP_FotL;

	vec4 VR_Cntr;
	vec4 VR_Body;
	vec4 VR_Shld;
	vec4 VR_Neck;
	vec4 VR_Head;
	vec4 VR_ArRU;
	vec4 VR_ArLU; 
	vec4 VR_ArRL;
	vec4 VR_ArLL;
	vec4 VR_LeRU;
	vec4 VR_LeLU; 
	vec4 VR_LeRL; 
	vec4 VR_LeLL;
	vec4 VR_HndR;
	vec4 VR_HndL; 
	vec4 VR_FotR; 
	vec4 VR_FotL;
	vec4 VP;
	vec4 VMisc00;
	vec4 VMisc01;
	vec4 VMisc02;
	vec4 VMisc03;
	float nMisc00;
	float nMisc01;
	float nMisc02;
	float nMisc03;
};

sskelton fSSkeltonMake(sskelton SS){
	SS.VR_Cntr.xyz;
	SS.VR_Body.xyz;
	SS.VR_Shld.xyz +=SS.VR_Body.xyz *SS.VR_Shld.w;
	SS.VR_Neck.xyz +=SS.VR_Shld.xyz *SS.VR_Neck.w;
	SS.VR_Head.xyz +=SS.VR_Neck.xyz *SS.VR_Head.w;

	SS.VR_ArRU.xyz +=SS.VR_Shld.xyz *SS.VR_ArRU.w;
	SS.VR_ArLU.xyz +=SS.VR_Shld.xyz *SS.VR_ArLU.w;

	SS.VR_ArRL.xyz +=SS.VR_ArRU.xyz *SS.VR_ArRL.w;
	SS.VR_ArLL.xyz +=SS.VR_ArLU.xyz *SS.VR_ArLL.w;

	SS.VR_HndR.xyz +=SS.VR_ArRL.xyz *SS.VR_HndR.w;
	SS.VR_HndL.xyz +=SS.VR_ArLL.xyz *SS.VR_HndL.w;

	SS.VR_LeRU.xyz +=SS.VR_Body.xyz *SS.VR_LeRU.w;
	SS.VR_LeLU.xyz +=SS.VR_Body.xyz *SS.VR_LeLU.w;

	SS.VR_LeRL.xyz +=SS.VR_LeRU.xyz *SS.VR_LeRL.w;
	SS.VR_LeLL.xyz +=SS.VR_LeLU.xyz *SS.VR_LeLL.w;

	SS.VR_FotR.xyz +=SS.VR_LeRL.xyz *SS.VR_FotR.w;
	SS.VR_FotL.xyz +=SS.VR_LeLL.xyz *SS.VR_FotL.w;

//	SS.VP_Body.xyz =fV3Rotate(SS.VP_Body.xyz, SS.VR_Cntr.xyz);
	SS.VP_Shld.xyz =fV3Rotate(SS.VP_Shld.xyz, SS.VR_Body.xyz);
	SS.VP_Neck.xyz =fV3Rotate(SS.VP_Neck.xyz, SS.VR_Shld.xyz);
	SS.VP_Head.xyz =fV3Rotate(SS.VP_Head.xyz, SS.VR_Neck.xyz);

	SS.VP_ArRU.xyz =fV3Rotate(SS.VP_ArRU.xyz, SS.VR_Shld.xyz);
	SS.VP_ArLU.xyz =fV3Rotate(SS.VP_ArLU.xyz, SS.VR_Shld.xyz);

	SS.VP_ArRL.xyz =fV3Rotate(SS.VP_ArRL.xyz, SS.VR_ArRU.xyz);
	SS.VP_ArLL.xyz =fV3Rotate(SS.VP_ArLL.xyz, SS.VR_ArLU.xyz);

	SS.VP_HndR.xyz =fV3Rotate(SS.VP_HndR.xyz, SS.VR_ArRL.xyz);
	SS.VP_HndL.xyz =fV3Rotate(SS.VP_HndL.xyz, SS.VR_ArLL.xyz);

	SS.VP_LeRU.xyz =fV3Rotate(SS.VP_LeRU.xyz, SS.VR_Body.xyz);
	SS.VP_LeLU.xyz =fV3Rotate(SS.VP_LeLU.xyz, SS.VR_Body.xyz);

	SS.VP_LeRL.xyz =fV3Rotate(SS.VP_LeRL.xyz, SS.VR_LeRU.xyz);
	SS.VP_LeLL.xyz =fV3Rotate(SS.VP_LeLL.xyz, SS.VR_LeLU.xyz);

	SS.VP_FotR.xyz =fV3Rotate(SS.VP_FotR.xyz, SS.VR_FotR.xyz);
	SS.VP_FotL.xyz =fV3Rotate(SS.VP_FotL.xyz, SS.VR_FotL.xyz);

	SS.VP_Body.xyz +=SS.VP_Cntr.xyz;
	SS.VP_Shld.xyz +=SS.VP_Body.xyz;
	SS.VP_Neck.xyz +=SS.VP_Shld.xyz;
	SS.VP_Head.xyz +=SS.VP_Neck.xyz;

	SS.VP_ArRU.xyz +=SS.VP_Shld.xyz;
	SS.VP_ArLU.xyz +=SS.VP_Shld.xyz;

	SS.VP_ArRL.xyz +=SS.VP_ArRU.xyz;
	SS.VP_ArLL.xyz +=SS.VP_ArLU.xyz;

	SS.VP_HndR.xyz +=SS.VP_ArRL.xyz;
	SS.VP_HndL.xyz +=SS.VP_ArLL.xyz;

//	SS.VP_LeRU.xyz +=SS.VP_Cntr.xyz;
//	SS.VP_LeLU.xyz +=SS.VP_Cntr.xyz;
	SS.VP_LeRU.xyz +=SS.VP_Body.xyz;
	SS.VP_LeLU.xyz +=SS.VP_Body.xyz;

	SS.VP_LeRL.xyz +=SS.VP_LeRU.xyz;
	SS.VP_LeLL.xyz +=SS.VP_LeLU.xyz;

	SS.VP_FotR.xyz +=SS.VP_LeRL.xyz;
	SS.VP_FotL.xyz +=SS.VP_LeLL.xyz;

	return SS;
}

sskelton fSSChange_Inbetween(sskelton SSP, sskelton SSN, float nIB){
	float nP = +nIB *0.5 +0.5, nN = -nIB *0.5 +0.5;
	sskelton SS =SSP;
	SS.VP_Cntr =	SSP.VP_Cntr *nP +SSN.VP_Cntr *nN;
	SS.VP_Body =	SSP.VP_Body *nP +SSN.VP_Body *nN;
	SS.VP_Shld =	SSP.VP_Shld *nP +SSN.VP_Shld *nN;
	SS.VP_Neck =	SSP.VP_Neck *nP +SSN.VP_Neck *nN;
	SS.VP_Head =	SSP.VP_Head *nP +SSN.VP_Head *nN;
	SS.VP_ArRU =	SSP.VP_ArRU *nP +SSN.VP_ArRU *nN;
	SS.VP_ArLU =	SSP.VP_ArLU *nP +SSN.VP_ArLU *nN;
	SS.VP_ArRL =	SSP.VP_ArRL *nP +SSN.VP_ArRL *nN;
	SS.VP_ArLL =	SSP.VP_ArLL *nP +SSN.VP_ArLL *nN;
	SS.VP_LeRU =	SSP.VP_LeRU *nP +SSN.VP_LeRU *nN;
	SS.VP_LeLU =	SSP.VP_LeLU *nP +SSN.VP_LeLU *nN;
	SS.VP_LeRL =	SSP.VP_LeRL *nP +SSN.VP_LeRL *nN;
	SS.VP_LeLL =	SSP.VP_LeLL *nP +SSN.VP_LeLL *nN;
	SS.VP_HndR =	SSP.VP_HndR *nP +SSN.VP_HndR *nN;
	SS.VP_HndL =	SSP.VP_HndL *nP +SSN.VP_HndL *nN;
	SS.VP_FotR =	SSP.VP_FotR *nP +SSN.VP_FotR *nN;
	SS.VP_FotL =	SSP.VP_FotL *nP +SSN.VP_FotL *nN;

	SS.VR_Cntr =	SSP.VR_Cntr *nP +SSN.VR_Cntr *nN;
	SS.VR_Body =	SSP.VR_Body *nP +SSN.VR_Body *nN;
	SS.VR_Shld =	SSP.VR_Shld *nP +SSN.VR_Shld *nN;
	SS.VR_Neck =	SSP.VR_Neck *nP +SSN.VR_Neck *nN;
	SS.VR_Head =	SSP.VR_Head *nP +SSN.VR_Head *nN;
	SS.VR_ArRU =	SSP.VR_ArRU *nP +SSN.VR_ArRU *nN;
	SS.VR_ArLU =	SSP.VR_ArLU *nP +SSN.VR_ArLU *nN;
	SS.VR_ArRL =	SSP.VR_ArRL *nP +SSN.VR_ArRL *nN;
	SS.VR_ArLL =	SSP.VR_ArLL *nP +SSN.VR_ArLL *nN;
	SS.VR_LeRU =	SSP.VR_LeRU *nP +SSN.VR_LeRU *nN;
	SS.VR_LeLU =	SSP.VR_LeLU *nP +SSN.VR_LeLU *nN;
	SS.VR_LeRL =	SSP.VR_LeRL *nP +SSN.VR_LeRL *nN;
	SS.VR_LeLL =	SSP.VR_LeLL *nP +SSN.VR_LeLL *nN;
	SS.VR_HndR =	SSP.VR_HndR *nP +SSN.VR_HndR *nN;
	SS.VR_HndL =	SSP.VR_HndL *nP +SSN.VR_HndL *nN;
	SS.VR_FotR =	SSP.VR_FotR *nP +SSN.VR_FotR *nN;
	SS.VR_FotL =	SSP.VR_FotL *nP +SSN.VR_FotL *nN;
	return SS;
}

void fExchangeV(inout vec4 VR, inout vec4 VL){
	vec4 Vtmp =VR;
	VR =VL, VL =Vtmp;
} 

sskelton fSSChange_MirrorX(sskelton SS){
	SS.VR_Cntr.yz *=-1.0;
	SS.VR_Body.yz *=-1.0;
	SS.VR_Shld.yz *=-1.0;
	SS.VR_Neck.yz *=-1.0;
	SS.VR_Head.yz *=-1.0;
	SS.VR_ArRU.yz *=-1.0;
	SS.VR_ArLU.yz *=-1.0; 
	SS.VR_ArRL.yz *=-1.0;
	SS.VR_ArLL.yz *=-1.0;
	SS.VR_LeRU.yz *=-1.0;
	SS.VR_LeLU.yz *=-1.0; 
	SS.VR_LeRL.yz *=-1.0; 
	SS.VR_LeLL.yz *=-1.0;
	SS.VR_HndR.yz *=-1.0;
	SS.VR_HndL.yz *=-1.0; 
	SS.VR_FotR.yz *=-1.0; 
	SS.VR_FotL.yz *=-1.0;
	fExchangeV(SS.VR_ArRU, SS.VR_ArLU);
	fExchangeV(SS.VR_ArRL, SS.VR_ArLL);
	fExchangeV(SS.VR_LeRU, SS.VR_LeLU);
	fExchangeV(SS.VR_LeRL, SS.VR_LeLL);
	fExchangeV(SS.VR_HndR, SS.VR_HndL);
	fExchangeV(SS.VR_FotR, SS.VR_FotL);

	SS.VP_Cntr.x *=-1.0;
	return SS;
}

float fNMuscle_Man01(sskelton SS){
	vec4 VP =SS.VP, VA, VB;
	float NP =1000000.0;
	VP.xyz =fV3Rotate(VP.xyz, SS.VR_Cntr.xyz);

	VA =SS.VP_Body, VB =SS.VP_Shld;
	NP =min(NP, fNCappedCylinder(VP, VA, VB));
	VA =SS.VP_Neck, VB =SS.VP_Head;
	NP =min(NP, fNCappedCylinder(VP, VA, VB));
	VA =SS.VP_ArRU, VB =SS.VP_ArRL;
	NP =min(NP, fNCappedCylinder(VP, VA, VB));
	VA =SS.VP_ArRL, VB =SS.VP_HndR;
	NP =min(NP, fNCappedCylinder(VP, VA, VB));
	VA =SS.VP_ArLU, VB =SS.VP_ArLL;
	NP =min(NP, fNCappedCylinder(VP, VA, VB));
	VA =SS.VP_ArLL, VB =SS.VP_HndL;
	NP =min(NP, fNCappedCylinder(VP, VA, VB));
	VA =SS.VP_LeRU, VB =SS.VP_LeRL;
	NP =min(NP, fNCappedCylinder(VP, VA, VB));
	VA =SS.VP_LeRL, VB =SS.VP_FotR;
	NP =min(NP, fNCappedCylinder(VP, VA, VB));
	VA =SS.VP_LeLU, VB =SS.VP_LeLL;
	NP =min(NP, fNCappedCylinder(VP, VA, VB));
	VA =SS.VP_LeLL, VB =SS.VP_FotL;
	NP =min(NP, fNCappedCylinder(VP, VA, VB));
	return NP;
}

float fNMuscle_Animal01(sskelton SS){
	vec4 VP =SS.VP, VA, VB;
	float NP =1000000.0, nK =12.0;
	VP.xyz =fV3Rotate(VP.xyz, SS.VR_Cntr.xyz);

	VA =SS.VP_Body, VB =SS.VP_Shld;
	NP =fNSmoothMin(NP, fNCapsule(VP, VA, VB), nK);
	VA =SS.VP_Neck, VB =SS.VP_Head;
	NP =fNSmoothMin(NP, fNCapsule(VP, VA, VB), nK);
	VA =SS.VP_ArRU, VB =SS.VP_ArRL;
	NP =fNSmoothMin(NP, fNCapsule(VP, VA, VB), nK);
	VA =SS.VP_ArRL, VB =SS.VP_HndR;
	NP =fNSmoothMin(NP, fNCapsule(VP, VA, VB), nK);
	VA =SS.VP_ArLU, VB =SS.VP_ArLL;
	NP =fNSmoothMin(NP, fNCapsule(VP, VA, VB), nK);
	VA =SS.VP_ArLL, VB =SS.VP_HndL;
	NP =fNSmoothMin(NP, fNCapsule(VP, VA, VB), nK);
	VA =SS.VP_LeRU, VB =SS.VP_LeRL;
	NP =fNSmoothMin(NP, fNCapsule(VP, VA, VB), nK);
	VA =SS.VP_LeRL, VB =SS.VP_FotR;
	NP =fNSmoothMin(NP, fNCapsule(VP, VA, VB), nK);
	VA =SS.VP_LeLU, VB =SS.VP_LeLL;
	NP =fNSmoothMin(NP, fNCapsule(VP, VA, VB), nK);
	VA =SS.VP_LeLL, VB =SS.VP_FotL;
	NP =fNSmoothMin(NP, fNCapsule(VP, VA, VB), nK);
	return NP;
}

sskelton fSSPSet_Man01(sskelton SS){
	SS.VP_Cntr;
	SS.VP_Body =vec4(0,	0,	0,	1);
	SS.VP_Shld =vec4(0,	2.5,	0,	0);
	SS.VP_Neck =vec4(0,	-0.25,	0,	0.5);
	SS.VP_Head =vec4(0,	1,	0,	0);
	SS.VP_ArRU =vec4(+1.2,-0.25,	0,	0.3);
	SS.VP_ArLU =vec4(-1.2,-0.25,	0,	0.3);
	SS.VP_ArRL =vec4(0,	-1.2,	0,	0.25);
	SS.VP_ArLL =vec4(0,	-1.2,	0,	0.25);
	SS.VP_LeRU =vec4(+0.5,0,	0,	0.4);
	SS.VP_LeLU =vec4(-0.5,0,	0,	0.4);
	SS.VP_LeRL =vec4(0,	-1.5,	0,	0.35);
	SS.VP_LeLL =vec4(0,	-1.5,	0,	0.35);
	SS.VP_HndR =vec4(0,	-1.2,	0,	0);
	SS.VP_HndL =vec4(0,	-1.2,	0,	0);
	SS.VP_FotR =vec4(0,	-1.5,	0,	0);
	SS.VP_FotL =vec4(0,	-1.5,	0,	0);
	return SS;
}

sskelton fSSPSet_Bear01(sskelton SS){
	SS.VP_Cntr;
	SS.VP_Body =vec4(0,	0,	0,	1);
	SS.VP_Shld =vec4(0,	1.5,	0,	0);
	SS.VP_Neck =vec4(0,	0,	0,	0.7);
	SS.VP_Head =vec4(0,	1,	0,	0);
	SS.VP_ArRU =vec4(+0.8,	0,	0,	0.4);
	SS.VP_ArLU =vec4(-0.8,-	0,	0,	0.4);
	SS.VP_ArRL =vec4(0,	-1,	0,	0.3);
	SS.VP_ArLL =vec4(0,	-1,	0,	0.3);
	SS.VP_LeRU =vec4(+0.6,0,	0,	0.45);
	SS.VP_LeLU =vec4(-0.6,0,	0,	0.45);
	SS.VP_LeRL =vec4(0,	-1,	0,	0.4);
	SS.VP_LeLL =vec4(0,	-1,	0,	0.4);
	SS.VP_HndR =vec4(0,	-1,	0,	0);
	SS.VP_HndL =vec4(0,	-1,	0,	0);
	SS.VP_FotR =vec4(0,	-1,	0,	0);
	SS.VP_FotL =vec4(0,	-1,	0,	0);
	return SS;
}

sskelton fSSRSet_Walker01(sskelton SS){
	float nD =acos(-1.0) /180.0, nS =sin(SS.VP.w);
	SS.VR_Body =vec4(-10,			0,		+10.0 *nS,	0);
	SS.VR_Shld =vec4(0,			+15.0 *nS,	0,		0);
	SS.VR_Neck =vec4(-15,			-10.0 *nS,	-5.0 *nS,	1);
	SS.VR_Head =vec4(0,			+5.0 *nS,	0,		1);
	SS.VR_ArRU =vec4(+60.0 *nS,		0,		+15,		1);
	SS.VR_ArLU =vec4(-60.0 *nS,		0,		-15,		1);
	SS.VR_ArRL =vec4(+45.0 *nS +60.0,	0,		0,		1);
	SS.VR_ArLL =vec4(-45.0 *nS +60.0,	0,		0,		1);
	SS.VR_LeRU =vec4(-60.0 *nS,		0,		0,		0);
	SS.VR_LeLU =vec4(+60.0 *nS,		0,		0,		0);
	SS.VR_LeRL =vec4(-45.0 *nS -60.0,	0,		0,		1);
	SS.VR_LeLL =vec4(+45.0 *nS -60.0,	0,		0,		1);
	SS.VR_HndR =vec4(0,			0,		0,		1);
	SS.VR_HndL =vec4(0,			0,		0,		1);
	SS.VR_FotR =vec4(0,			0,		0,		1);
	SS.VR_FotL =vec4(0,			0,		0,		1);
	SS.VR_Cntr.xyz *= nD;
	SS.VR_Body.xyz *= nD;
	SS.VR_Shld.xyz *= nD;
	SS.VR_Neck.xyz *= nD;
	SS.VR_Head.xyz *= nD;
	SS.VR_ArRU.xyz *= nD;
	SS.VR_ArLU.xyz *= nD;
	SS.VR_ArRL.xyz *= nD;
	SS.VR_ArLL.xyz *= nD;
	SS.VR_LeRU.xyz *= nD;
	SS.VR_LeLU.xyz *= nD;
	SS.VR_LeRL.xyz *= nD;
	SS.VR_LeLL.xyz *= nD;
	SS.VR_HndR.xyz *= nD;
	SS.VR_HndL.xyz *= nD;
	SS.VR_FotR.xyz *= nD;
	SS.VR_FotL.xyz *= nD;
	return SS;
}

sskelton fSSRSet_Bear01(sskelton SS){
	float nD =acos(-1.0) /180.0, nS =sin(SS.VP.w), nSL =sin(SS.VP.w +3.14 /180.0 *30.0);
	SS.VR_Cntr;
	SS.VR_Body =vec4(-90.0 +15.0 *nS,	0,	0,		0);
	SS.VR_Shld =vec4(0,			0,	0,		0);
	SS.VR_Neck =vec4(-45.0,			0,	0,		1);
	SS.VR_Head =vec4(0,			0,	0,		1);
	SS.VR_ArRU =vec4(30.0 +60.0 *nS,	0,	-5.0 +5.0 *nS,	1);
	SS.VR_ArLU =vec4(30.0 +60.0 *nSL,	0,	+5.0 -5.0 *nSL,	1);
	SS.VR_ArRL =vec4(15.0 +15.0 *nS,	0,	0,		1);
	SS.VR_ArLL =vec4(15.0 +15.0 *nSL,	0,	0,		1);
	SS.VR_LeRU =vec4(-15.0 -75.0 *nS,	0,	+5.0 -5.0 *nS,	0);
	SS.VR_LeLU =vec4(-15.0 -75.0 *nSL,	0,	-5.0 +5.0 *nSL,	0);
	SS.VR_LeRL =vec4(-30.0 +45.0 *nS,	0,	0,		1);
	SS.VR_LeLL =vec4(-30.0 +45.0 *nSL,	0,	0,		1);
	SS.VR_HndR =vec4(0,			0,	0,		1);
	SS.VR_HndL =vec4(0,			0,	0,		1);
	SS.VR_FotR =vec4(0,			0,	0,		1);
	SS.VR_FotL =vec4(0,			0,	0,		1);
	SS.VR_Cntr.xyz *=nD;
	SS.VR_Body.xyz *=nD;
	SS.VR_Shld.xyz *=nD;
	SS.VR_Neck.xyz *=nD;
	SS.VR_Head.xyz *=nD;
	SS.VR_ArRU.xyz *=nD;
	SS.VR_ArLU.xyz *=nD;
	SS.VR_ArRL.xyz *=nD;
	SS.VR_ArLL.xyz *=nD;
	SS.VR_LeRU.xyz *=nD;
	SS.VR_LeLU.xyz *=nD;
	SS.VR_LeRL.xyz *=nD;
	SS.VR_LeLL.xyz *=nD;
	SS.VR_HndR.xyz *=nD;
	SS.VR_HndL.xyz *=nD;
	SS.VR_FotR.xyz *=nD;
	SS.VR_FotL.xyz *=nD;

	SS.VP_Cntr.y =+cos(SS.VP.w);
	return SS;
}

sskelton fSSRSet_Dancer01(sskelton SS){
	float nD =acos(-1.0) /180.0, nS =sin(SS.VP.w), nSL =sin(SS.VP.w +acos(-1.0) /180.0 *30.0);
	SS.VR_Cntr;
	SS.VR_Body =vec4(0,	0,	30,	0);
	SS.VR_Shld =vec4(0,	30,	0,	0);
	SS.VR_Neck =vec4(0,	0,	-15,	1);
	SS.VR_Head =vec4(0,	-15,	0,	1);
	SS.VR_ArRU =vec4(+120,	0,	0,	1);
	SS.VR_ArLU =vec4(+60,	0,	0,	1);
	SS.VR_ArRL =vec4(+30,	0,	0,	1);
	SS.VR_ArLL =vec4(+60,	0,	0,	1);
	SS.VR_LeRU =vec4(0,	0,	0,	0);
	SS.VR_LeLU =vec4(+105,	0,	0,	0);
	SS.VR_LeRL =vec4(0,	0,	0,	1);
	SS.VR_LeLL =vec4(-120,	0,	0,	1);
	SS.VR_HndR =vec4(+60,	0,	0,	1);
	SS.VR_HndL =vec4(-30,	0,	0,	1);
	SS.VR_FotR =vec4(0,	0,	0,	1);
	SS.VR_FotL =vec4(0,	0,	0,	1);
	SS.VR_Cntr.xyz *=nD;
	SS.VR_Body.xyz *=nD;
	SS.VR_Shld.xyz *=nD;
	SS.VR_Neck.xyz *=nD;
	SS.VR_Head.xyz *=nD;
	SS.VR_ArRU.xyz *=nD;
	SS.VR_ArLU.xyz *=nD;
	SS.VR_ArRL.xyz *=nD;
	SS.VR_ArLL.xyz *=nD;
	SS.VR_LeRU.xyz *=nD;
	SS.VR_LeLU.xyz *=nD;
	SS.VR_LeRL.xyz *=nD;
	SS.VR_LeLL.xyz *=nD;
	SS.VR_HndR.xyz *=nD;
	SS.VR_HndL.xyz *=nD;
	SS.VR_FotR.xyz *=nD;
	SS.VR_FotL.xyz *=nD;

	SS.VP_Cntr.x =+1.0;
	return SS;
}

float fNAttachment_HeadBear01(vec4 VP){
	float NP =1000000.0, nPP;
	vec3 V3P =VP.xyz;
	{
		nPP =length(V3P) -1.0;
		NP =min(NP, nPP);			
		nPP =length(V3P -vec3(0,0,-1)) -0.5;
		NP =min(NP, nPP);			
		nPP =length(V3P -vec3(0,0.3,-1.4)) -0.2;
		NP =min(NP, nPP);			
		nPP =length(vec3(abs(V3P.x), V3P.yz) -vec3(0.4,0.5,-0.7)) -0.15;
		NP =min(NP, nPP);			
		nPP =length(vec3(abs(V3P.x), V3P.yz) -vec3(0.7,0.8,0.4)) -0.3;
		nPP =max(nPP, -(V3P.z -0.4));
		NP =min(NP, nPP);			
	}
	return NP;
}

float fNAttachment_HeadPig01(vec4 VP){
	float NP =1000000.0, nPP;
	vec3 V3P;
	{
		V3P =VP.xyz;
		V3P.xz *=1.0 +V3P.y *0.2;
		nPP =length(V3P) -1.0;
		NP =min(NP, nPP);

		V3P =VP.xyz;
		V3P -=vec3(0,-0.1,0);
		V3P.xy *=1.0 -VP.z;
		V3P.x *=1.0 +V3P.y *0.3;
		nPP =max(length(V3P.xy) -1.0, max(VP.z, -VP.z -1.3));
		NP =min(NP, nPP);

		V3P =VP.xyz;
		V3P.x =abs(V3P.x);
		V3P -=vec3(0.2,-0.2,-1.35);
		nPP =length(V3P) -0.15;
		NP =max(NP, -nPP);

		V3P =VP.xyz;
		V3P.x =abs(V3P.x);
		V3P -=vec3(0.4,0.5,-0.7 +0.1);
		nPP =length(V3P) -0.15;
		NP =min(NP, nPP);

		V3P =VP.xyz;
		V3P.x =abs(V3P.x);
		V3P -=vec3(0.7 +0.1,0.8 -0.7,0.4 -0.2);
		nPP =max(length(V3P) -0.3 -0.2, max(-V3P.y, -V3P.z));
		NP =min(NP, nPP);
			
	}
	return NP;
}

vec3 fV3Attach(vec3 V3P, vec3 V3S, vec3 V3R){
	return fV3Rotate(V3P -V3S, -V3R);
}

float fNOutfit_Bear01(sskelton SS){
	float NP =1000000.0;
	vec4 VP =SS.VP;
	VP.xyz =fV3Rotate(VP.xyz, SS.VR_Cntr.xyz);

	vec3 V3P;
	V3P =fV3Attach(VP.xyz, SS.VP_Head.xyz, SS.VR_Head.xyz);
	{
		float nPP;
		nPP =fNAttachment_HeadBear01(vec4(V3P, VP.w));
		NP =min(NP, nPP);
	}

	V3P =fV3Attach(VP.xyz, SS.VP_Body.xyz, SS.VR_Body.xyz);
	{
		float nPP;
		nPP =length(V3P -vec3(0,-0.6,1)) -0.4;
		NP =min(NP, nPP);
	}

	return NP;
}

float fNOutfit_Pig01(sskelton SS){
	float NP =1000000.0;
	vec4 VP =SS.VP;
	VP.xyz =fV3Rotate(VP.xyz, SS.VR_Cntr.xyz);

	vec3 V3P;
	V3P =fV3Attach(VP.xyz, SS.VP_Head.xyz, SS.VR_Head.xyz);
	{
		float nPP;
		nPP =fNAttachment_HeadPig01(vec4(V3P, VP.w));
		NP =min(NP, nPP);
	}

	V3P =fV3Attach(VP.xyz, SS.VP_Body.xyz, SS.VR_Body.xyz);
	{
		float nPP;
		nPP =fNCapsule(vec4(V3P, VP.w), vec4(0,-0.5,0.5, 0.2), vec4(0, -0.8, 1.3, 0));
		NP =min(NP, nPP);
	}

	V3P =fV3Attach(VP.xyz, SS.VP_HndR.xyz, SS.VR_HndR.xyz);
	{
		float nPP;
		nPP =max(max(length(V3P.xy) -1.5, abs(V3P.z) -0.075), max(+V3P.x +V3P.y, -V3P.x +V3P.y));
		NP =min(NP, nPP);
	}

	return NP;
}

float fNOutfit_Warrior01(sskelton SS){
	float NP =1000000.0;
	vec4 VP =SS.VP;
	VP.xyz =fV3Rotate(VP.xyz, SS.VR_Cntr.xyz);

	vec3 V3P;
	V3P =fV3Attach(VP.xyz, SS.VP_Head.xyz, SS.VR_Head.xyz);
	{
		float nPP;
		nPP =length(V3P -vec3(0,-0.2,0)) -0.6;
		NP =min(NP, nPP);				
		nPP =max(length(V3P) -0.8, -V3P.y -V3P.z);
		NP =min(NP, nPP);			
	}

	V3P =fV3Attach(VP.xyz, SS.VP_HndR.xyz, SS.VR_HndR.xyz);
	{
		float nPP;
		nPP =length(V3P) -0.4;
		NP =min(NP, nPP);				
		nPP =max(length(V3P.xy) -0.15, max(-V3P.z -3.0, +V3P.z));
		NP =min(NP, nPP);				
	}

	V3P =fV3Attach(VP.xyz, SS.VP_HndL.xyz, SS.VR_HndL.xyz);
	{
		float nPP;
//		nPP =length(V3P) -0.4;
//		NP =min(NP, nPP);				
		nPP =max(length(V3P.xz) -1.5, abs(V3P.y) -0.05);
		NP =min(NP, nPP);				
	}

	V3P =fV3Attach(VP.xyz, SS.VP_FotR.xyz, SS.VR_FotR.xyz);
	{
		float nPP;
		nPP =max(length(V3P) -0.6, -V3P.y);
		NP =min(NP, nPP);
	}

	V3P =fV3Attach(VP.xyz, SS.VP_FotL.xyz, SS.VR_FotL.xyz);
	{
		float nPP;
		nPP =max(length(V3P) -0.6, -V3P.y);
		NP =min(NP, nPP);
	}

	return NP;
}

float fNWalkWarrior01(vec4 VP, float nDummy){
	sskelton SS;
	SS.VP =VP;
	SS =fSSPSet_Man01( SS);
	SS =fSSRSet_Walker01( SS);
	SS =fSSkeltonMake( SS);

	float NP, nPP;
	NP =fNMuscle_Man01(SS);

	nPP =fNOutfit_Warrior01(SS);
	NP =min(NP, nPP);

	return NP;
}

float fNWalkBear01(vec4 VP, float nDummy){
	sskelton SS;
	SS.VP =VP;
	SS =fSSPSet_Bear01( SS);
	SS =fSSRSet_Bear01( SS);
	SS =fSSkeltonMake( SS);

	float NP, nPP;
	NP =fNMuscle_Animal01(SS);

	nPP =fNOutfit_Bear01(SS);
	NP =min(NP, nPP);

	return NP;
}

float fNDancePig01(vec4 VP, float nIB){
	sskelton SS, SSP, SSN;
	nIB =clamp(nIB, -1.0, +1.0);

	SSP.VP =VP;
	SSP =fSSPSet_Bear01( SSP);
//	SSP =fSSRSet_Walker01( SSP);
	SSP =fSSRSet_Dancer01( SSP);

//	SSN.VP =VP *vec4(1,1,1,0.5);
//	SSN =fSSPSet_Bear01( SSN);
//	SSN =fSSRSet_Bear01( SSN);

	SSN =fSSChange_MirrorX(SSP);

	SS =fSSChange_Inbetween(SSP, SSN, nIB);
	SS =fSSkeltonMake( SS);

	float NP, nPP;
	NP =fNMuscle_Animal01(SS);

//	nPP =fNOutfit_Bear01(SS);
	nPP =fNOutfit_Pig01(SS);
	NP =min(NP, nPP);

	return NP;
}

float fNMap(vec3 V3P){
	vec4 VP =vec4(V3P, nTime), VColor =vec4(1);
//	VP.zy *=mat2(cos(VMouse.y), -sin(VMouse.y), sin(VMouse.y), cos(VMouse.y));
	VP.zy *=mat2(cos(-0.25), -sin(-0.25), sin(-0.25), cos(-0.25));
	VP.xz *=mat2(cos(VMouse.x), -sin(VMouse.x), sin(VMouse.x), cos(VMouse.x));
	float NP =1000000.0, nReflex =1.0;

//ここから下に距離数式を記述
//距離（NP）と座標（VP）は必須、色彩（VColor）と反射率（nReflex）は任意
	int iMode =int(floor(mod(VP.w, 2.0)));
	{
		NP =min(NP, fNLetters00(VP));
	}
	
	{
		float nPP, nRL =1.0;
		vec4 VC =vec4(1);

		vec3 V3Lis =normalize(vec3(2,0,3.1)) *acos(-1.0) *0.1;
		vec3 V3P =sin(V3Lis *VP.w), V3Pd =sin(V3Lis *(VP.w +0.01)) -V3P;
		V3P *=12.0;
		V3P +=VP.xyz;
		V3P =fV3Rotate(V3P, vec3(0,-atan(V3Pd.x, V3Pd.z), 0));

		nPP =fNWalkWarrior01(vec4(V3P, VP.w), 0.0);

		VC.rgb = +sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VP.w *1.3) *0.3 +0.7;
		nReflex =0.4;

		VColor =(NP <nPP)?	VColor:VC;
		nReflex =(NP <nPP)?	nReflex:nRL;
		NP =min(NP, nPP);
	}

	{
		float nPP, nRL =1.0;
		vec4 VC =vec4(1);

		vec3 V3Lis =normalize(vec3(2,0,3.1)) *acos(-1.0) *0.1;
		vec3 V3P =sin(V3Lis *(VP.w +5.0)), V3Pd =sin(V3Lis *((VP.w +5.0) +0.01)) -V3P;
		V3P *=12.0;
		V3P +=VP.xyz;
		V3P =fV3Rotate(V3P, vec3(0,-atan(V3Pd.x, V3Pd.z), 0));

		nPP =fNWalkBear01(vec4(V3P, VP.w), 0.0);

		VC.rgb = -sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VP.w *1.3) *0.3 +0.7;
		nReflex =0.4;

		VColor =(NP <nPP)?	VColor:VC;
		nReflex =(NP <nPP)?	nReflex:nRL;
		NP =min(NP, nPP);
	}

	{
		float nPP, nRL =1.0;
		vec4 VC =vec4(1);

		nPP =abs(VP.y +3.0) -0.5 +sin(VP.x +VP.z *0.5 +VP.w) *0.05 +sin(VP.z *0.2 +VP.x *0.1+VP.w *0.1) *0.1;
		VC.rgb =sin(vec3(2,1,0) /3.0 *3.14 *2.0 -VP.w) *0.1 +0.9;
		nRL =0.6;
		VColor =(NP <nPP)?	VColor:VC;
		nReflex =(NP <nPP)?	nReflex:nRL;
		NP =fNSmoothMin(NP, nPP, 4.0);
	}
//距離数式ここまで

	SCRD.VColor  =VColor;
	SCRD.nReflex =nReflex;
	return NP;
}

vec4 fVCBack(vec3 V3D){
	vec4 VP =vec4(V3D /V3D.y *4.0, nTime), VC =vec4(1);
	if(V3D.y >0.0){
		float nC;
		nC =sin(VP.x) *sin(VP.z +VP.w);
		VC.rgb = nC *sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VP.w) *0.2 +0.8;
	}else{
		float nC;
		nC =sign(sin(VP.x) *sin(VP.z +VP.w *0.1));
		VC.rgb = nC *vec3(1) *0.2 +0.8;
	}
	VC.rgb +=length(VP.xz) *0.01;
	return VC;
}

vec3 fV3NormalLine(vec3 V3P){
	float nNL =fNMap(V3P);
	float nD =1.0 /2560.0;
	vec3 V3NL =vec3(nNL);
	V3NL.x -=fNMap(V3P -vec3(nD,0,0));
	V3NL.y -=fNMap(V3P -vec3(0,nD,0));
	V3NL.z -=fNMap(V3P -vec3(0,0,nD));
	V3NL =normalize(V3NL);
	return V3NL;
}

void fMain(void){
	vec2 V2UV =(gl_FragCoord.xy *2.0 -VResolution.xy) /max(VResolution.x, VResolution.y);
	vec3 V3Camera =VDefaultCamera.xyz, V3Direction =normalize(vec3(V2UV, 1)), V3Light =VDefaultLight.xyz;
	SCRD.VColor =vec4(1), SCRD.nReflex =1.0, SCRD.nDistance =1000000.0;
	vec4 VColor =vec4(1);
	const int ciDefinition =50;
	float nDistance, nA, nT, nDistance_Max =100.0, nReflex =1.0;
	int iTouch;
	vec3 V3IP;

	{
		for(int I =0; I <ciDefinition; I++){
			V3IP =V3Camera +nA *V3Direction;
			nDistance =fNMap(V3IP);
			nDistance =min(nDistance, 1.0);
			SCRD.nDistance =min(SCRD.nDistance, nDistance);
			if(nDistance <0.01){
				iTouch++;
				break;
			}
			if(nA >nDistance_Max)	break;
			nA +=nDistance;
			nT++;
		}

		if(iTouch >=1){
//			VColor.rgb -=nT /float(ciDefinition) *0.3;
			vec3 V3NL =fV3NormalLine(V3IP);
			VColor.rgb *=dot(V3NL, normalize(V3Light)) *0.3 +0.7;
			V3Direction =reflect(V3Direction, V3NL);
			V3Camera =V3IP;
			nA =0.02;
			VColor *=SCRD.VColor;
			nReflex =SCRD.nReflex;
		}
	}

	if(cbSetting_March2nd){
		for(int I =0; I <ciDefinition /2; I++){
			V3IP =V3Camera +nA *V3Direction;
			nDistance =fNMap(V3IP);
//			nDistance =min(nDistance, 1.0);
			SCRD.nDistance =min(SCRD.nDistance, nDistance);
			if(nDistance <0.01){
				iTouch++;
				break;
			}
			if(nA >nDistance_Max)	break;
			nA +=nDistance;
			nT++;
		}
		if(iTouch >=2){
			VColor.rgb -=nT /float(ciDefinition /2) *0.3;
//			vec3 V3NL =fV3NormalLine(V3IP);
//			VColor.rgb *=dot(V3NL, normalize(V3Light)) *0.3 +0.7;
//			V3Direction =reflect(V3Direction, V3NL);
//			V3Camera =V3IP;
//			nA =0.02;
			VColor *=(SCRD.VColor -1.0) *nReflex +1.0;
			nReflex =0.0;
		}
	}
	if(cbSetting_Back)	VColor *=(fVCBack(V3Direction) -1.0) *nReflex +1.0;
	
	gl_FragColor =VColor;
}

void main(void){
	fMain();
}
