//サンドボックス上での試験用、簡易レイトレシステム、二段階反射機能付（R040612版）
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

const int iSetting_Marching2nd =2;

float nDefaultReflex =1.0;
vec4 VDefaultColor =vec4(1);
vec4 VDefaultCamera =vec4(0, 2, -10, 0);
vec4 VDefaultLight =vec4(1,1,-1,0);

vec4 VResolution =vec4(resolution, 0, 0);
float nTime =time *4.0;
vec4 VMouse =vec4(mouse *2.0 -1.0, 0, 0);

//簡易人体形状生成システム関数群（R040611版）by　ニシタマオ THE SEA PANTHER
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

struct SSkelton{
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

SSkelton fSSkeltonMake(SSkelton SS){
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

	SS.VP_Body.xyz =fV3Rotate(SS.VP_Body.xyz, SS.VR_Cntr.xyz);
	SS.VP_Shld.xyz =fV3Rotate(SS.VP_Shld.xyz, SS.VR_Body.xyz);
	SS.VP_Neck.xyz =fV3Rotate(SS.VP_Neck.xyz, SS.VR_Shld.xyz);
	SS.VP_Head.xyz =fV3Rotate(SS.VP_Head.xyz, SS.VR_Neck.xyz);

	SS.VP_ArRU.xyz =fV3Rotate(SS.VP_ArRU.xyz, SS.VR_Shld.xyz);
	SS.VP_ArLU.xyz =fV3Rotate(SS.VP_ArLU.xyz, SS.VR_Shld.xyz);

	SS.VP_ArRL.xyz =fV3Rotate(SS.VP_ArRL.xyz, SS.VR_ArRU.xyz);
	SS.VP_ArLL.xyz =fV3Rotate(SS.VP_ArLL.xyz, SS.VR_ArLU.xyz);

	SS.VP_HndR.xyz =fV3Rotate(SS.VP_HndR.xyz, SS.VR_ArRL.xyz);
	SS.VP_HndL.xyz =fV3Rotate(SS.VP_HndL.xyz, SS.VR_ArLL.xyz);

	SS.VP_LeRU.xyz =fV3Rotate(SS.VP_LeRU.xyz, SS.VR_Cntr.xyz);
	SS.VP_LeLU.xyz =fV3Rotate(SS.VP_LeLU.xyz, SS.VR_Cntr.xyz);

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

float fNMuscle_Man01(SSkelton SS){
	vec4 VP =SS.VP;
	float NP =1000000.0, nPP;
	VP.xyz =fV3Rotate(VP.xyz, SS.VR_Cntr.xyz);

	nPP =fNCappedCylinder(VP, SS.VP_Body, SS.VP_Shld);
	NP =min(NP, nPP);
	nPP =fNCappedCylinder(VP, SS.VP_Neck, SS.VP_Head);
	NP =min(NP, nPP);
	nPP =fNCappedCylinder(VP, SS.VP_ArRU, SS.VP_ArRL);
	NP =min(NP, nPP);
	nPP =fNCappedCylinder(VP, SS.VP_ArRL, SS.VP_HndR);
	NP =min(NP, nPP);
	nPP =fNCappedCylinder(VP, SS.VP_ArLU, SS.VP_ArLL);
	NP =min(NP, nPP);
	nPP =fNCappedCylinder(VP, SS.VP_ArLL, SS.VP_HndL);
	NP =min(NP, nPP);
	nPP =fNCappedCylinder(VP, SS.VP_LeRU, SS.VP_LeRL);
	NP =min(NP, nPP);
	nPP =fNCappedCylinder(VP, SS.VP_LeRL, SS.VP_FotR);
	NP =min(NP, nPP);
	nPP =fNCappedCylinder(VP, SS.VP_LeLU, SS.VP_LeLL);
	NP =min(NP, nPP);
	nPP =fNCappedCylinder(VP, SS.VP_LeLL, SS.VP_FotL);
	NP =min(NP, nPP);
	return NP;
}

float fNMuscle_Animal01(SSkelton SS){
	vec4 VP =SS.VP;
	float NP =1000000.0, nPP;
	VP.xyz =fV3Rotate(VP.xyz, SS.VR_Cntr.xyz);

	nPP =fNCapsule(VP, SS.VP_Body, SS.VP_Shld);
	NP =min(NP, nPP);
	nPP =fNCapsule(VP, SS.VP_Neck, SS.VP_Head);
	NP =min(NP, nPP);
	nPP =fNCapsule(VP, SS.VP_ArRU, SS.VP_ArRL);
	NP =min(NP, nPP);
	nPP =fNCapsule(VP, SS.VP_ArRL, SS.VP_HndR);
	NP =min(NP, nPP);
	nPP =fNCapsule(VP, SS.VP_ArLU, SS.VP_ArLL);
	NP =min(NP, nPP);
	nPP =fNCapsule(VP, SS.VP_ArLL, SS.VP_HndL);
	NP =min(NP, nPP);
	nPP =fNCapsule(VP, SS.VP_LeRU, SS.VP_LeRL);
	NP =min(NP, nPP);
	nPP =fNCapsule(VP, SS.VP_LeRL, SS.VP_FotR);
	NP =min(NP, nPP);
	nPP =fNCapsule(VP, SS.VP_LeLU, SS.VP_LeLL);
	NP =min(NP, nPP);
	nPP =fNCapsule(VP, SS.VP_LeLL, SS.VP_FotL);
	NP =min(NP, nPP);
	return NP;
}

SSkelton fSSChange_Inbetween(SSkelton SSP, SSkelton SSN, float nIB){
	float nP = +nIB *0.5 +0.5, nN = -nIB *0.5 +0.5;
	SSkelton SS =SSP;
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

SSkelton fSSPSet_Man01(SSkelton SS){
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

SSkelton fSSPSet_Animal01(SSkelton SS){
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

SSkelton fSSRSet_Walker01(SSkelton SS){
	float nD =acos(-1.0) /180.0 *SS.nMisc00, nS =sin(SS.VP.w);
	SS.VP_Cntr;
	SS.VR_Body =vec4(-10,			0,		+10.0 *nS,	0) *nD;
	SS.VR_Shld =vec4(0,			+15.0 *nS,	0,		0) *nD;
	SS.VR_Neck =vec4(-15,			-10.0 *nS,	-5.0 *nS,	0) *nD;
	SS.VR_Head;
	SS.VR_ArRU =vec4(+60.0 *nS,		0,		+15,		0) *nD;
	SS.VR_ArLU =vec4(-60.0 *nS,		0,		-15,		0) *nD;
	SS.VR_ArRL =vec4(+45.0 *nS +60.0,	0,		0,		0) *nD;
	SS.VR_ArLL =vec4(-45.0 *nS +60.0,	0,		0,		0) *nD;
	SS.VR_LeRU =vec4(-60.0 *nS,		0,		0,		0) *nD;
	SS.VR_LeLU =vec4(+60.0 *nS,		0,		0,		0) *nD;
	SS.VR_LeRL =vec4(-45.0 *nS -60.0,	0,		0,		0) *nD;
	SS.VR_LeLL =vec4(+45.0 *nS -60.0,	0,		0,		0) *nD;
	SS.VR_HndR;
	SS.VR_HndL;
	SS.VR_FotR;
	SS.VR_FotL;
	SS.VR_Cntr.w;
	SS.VR_Body.w;
	SS.VR_Shld.w;
	SS.VR_Neck.w =1.0;
	SS.VR_Head.w =1.0;
	SS.VR_ArRU.w =1.0;
	SS.VR_ArLU.w =1.0;
	SS.VR_ArRL.w =1.0;
	SS.VR_ArLL.w =1.0;
	SS.VR_LeRU.w;
	SS.VR_LeLU.w;
	SS.VR_LeRL.w =1.0;
	SS.VR_LeLL.w =1.0;
	SS.VR_HndR.w =1.05;
	SS.VR_HndL.w =1.05;
	SS.VR_FotR.w =1.0;
	SS.VR_FotL.w =1.0;
	return SS;
}

SSkelton fSSRSet_Bear01(SSkelton SS){
	float nD =acos(-1.0) /180.0 *SS.nMisc00, nS =sin(SS.VP.w), nSL =sin(SS.VP.w +3.14 /180.0 *30.0);
	SS.VR_Cntr;
	SS.VR_Body =vec4(-90.0 +15.0 *nS,	0,	0,		0) *nD;
	SS.VR_Shld =vec4(0,			0,	0,		0) *nD;
	SS.VR_Neck =vec4(-45.0,			0,	0,		0) *nD;
	SS.VR_Head;
	SS.VR_ArRU =vec4(30.0 +60.0 *nS,	0,	-5.0 +5.0 *nS,	0) *nD;
	SS.VR_ArLU =vec4(30.0 +60.0 *nSL,	0,	+5.0 -5.0 *nSL,	0) *nD;
	SS.VR_ArRL =vec4(15.0 +15.0 *nS,	0,	0,		0) *nD;
	SS.VR_ArLL =vec4(15.0 +15.0 *nSL,	0,	0,		0) *nD;
	SS.VR_LeRU =vec4(-15.0 -75.0 *nS,	0,	+5.0 -5.0 *nS,	0) *nD;
	SS.VR_LeLU =vec4(-15.0 -75.0 *nSL,	0,	-5.0 +5.0 *nSL,	0) *nD;
	SS.VR_LeRL =vec4(-30.0 +45.0 *nS,	0,	0,		0) *nD;
	SS.VR_LeLL =vec4(-30.0 +45.0 *nSL,	0,	0,		0) *nD;
	SS.VR_HndR;
	SS.VR_HndL;
	SS.VR_FotR;
	SS.VR_FotL;
	SS.VR_Cntr.w;
	SS.VR_Body.w;
	SS.VR_Shld.w;
	SS.VR_Neck.w =1.0;
	SS.VR_Head.w =1.0;
	SS.VR_ArRU.w =1.0;
	SS.VR_ArLU.w =1.0;
	SS.VR_ArRL.w =1.0;
	SS.VR_ArLL.w =1.0;
	SS.VR_LeRU.w;
	SS.VR_LeLU.w;
	SS.VR_LeRL.w =1.0;
	SS.VR_LeLL.w =1.0;
	SS.VR_HndR.w =1.0;
	SS.VR_HndL.w =1.0;
	SS.VR_FotR.w =1.0;
	SS.VR_FotL.w =1.0;
	return SS;
}

float fNAttachment_Walker01(vec4 VP, SSkelton SS){
	float NP =1000000.0, nPP;
	vec3 V3P, V3R;
	VP.xyz =fV3Rotate(VP.xyz, SS.VR_Cntr.xyz);

//頭部
	V3P =VP.xyz -SS.VP_Head.xyz;
	V3R = -SS.VR_Head.xyz;
	V3P =fV3Rotate(V3P, V3R);
	{
		nPP =length(V3P -vec3(0,-0.2,0)) -0.6;
		NP =min(NP, nPP);				
		nPP =max(length(V3P) -0.8, -V3P.y -V3P.z);
		NP =min(NP, nPP);			
	}

//右手
	V3P =VP.xyz -SS.VP_HndR.xyz;
	V3R = -SS.VR_HndR.xyz;
	V3P =fV3Rotate(V3P, V3R);
	{
		nPP =length(V3P) -0.4;
		NP =min(NP, nPP);				
		nPP =max(length(V3P.xy) -0.15, max(-V3P.z -3.0, +V3P.z));
		NP =min(NP, nPP);				
	}

//左手
	V3P =VP.xyz -SS.VP_HndL.xyz;
	V3R = -SS.VR_HndL.xyz;
	V3P =fV3Rotate(V3P, V3R);
	{
//		nPP =length(V3P) -0.4;
//		NP =min(NP, nPP);				
		nPP =max(length(V3P.xz) -1.5, abs(V3P.y) -0.05);
		NP =min(NP, nPP);				
	}

//右足
	V3P =VP.xyz -SS.VP_FotR.xyz;
	V3R = -SS.VR_FotR.xyz;
	V3P =fV3Rotate(V3P, V3R);
	{
		nPP =max(length(V3P) -0.6, -V3P.y);
		NP =min(NP, nPP);
	}

//右足
	V3P =VP.xyz -SS.VP_FotL.xyz;
	V3R = -SS.VR_FotL.xyz;
	V3P =fV3Rotate(V3P, V3R);
	{
		nPP =max(length(V3P) -0.6, -V3P.y);
		NP =min(NP, nPP);
	}
	return NP;
}

float fNAttachment_Bear01(vec4 VP, SSkelton SS){
	float NP =1000000.0, nPP;
	vec3 V3P, V3R;
	VP.xyz =fV3Rotate(VP.xyz, SS.VR_Cntr.xyz);

//頭部
	V3P =VP.xyz -SS.VP_Head.xyz;
	V3R = -SS.VR_Head.xyz;
	V3P =fV3Rotate(V3P, V3R);
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

//尾部
	V3P =VP.xyz -SS.VP_Body.xyz;
	V3R = -SS.VR_Body.xyz;
	V3P =fV3Rotate(V3P, V3R);
	{
		nPP =length(V3P -vec3(0,-0.6,1)) -0.4;
		NP =min(NP, nPP);
	}


	return NP;
}

float fNWalker01(vec4 VP, float nDynm){
	SSkelton SS;
	SS.VP =VP;
	SS.nMisc00 =nDynm;
	SS =fSSPSet_Man01( SS);
	SS =fSSRSet_Walker01( SS);
	SS =fSSkeltonMake( SS);

	float NP, nPP;
	NP =fNMuscle_Man01(SS);

	nPP =fNAttachment_Walker01( VP, SS);
	NP =min(NP, nPP);

	return NP;
}

float fNBear01(vec4 VP, float nDynm){
	SSkelton SS;
	SS.VP =VP;
	SS.nMisc00 =nDynm;
	SS =fSSPSet_Animal01( SS);
	SS =fSSRSet_Bear01( SS);
	SS =fSSkeltonMake( SS);

	float NP, nPP;
	NP =fNMuscle_Animal01(SS);

	nPP =fNAttachment_Bear01( VP, SS);
	NP =min(NP, nPP);

	return NP;
}

float fNTest01(vec4 VP, float nA){
	SSkelton SS, SSP, SSN;

	SSP.VP =VP;
	SSP.nMisc00 =1.0;
	SSP =fSSPSet_Animal01( SSP);
	SSP =fSSRSet_Bear01( SSP);

	SSN.VP =VP *vec4(1,1,1,0.5);
	SSN.nMisc00 =1.0;
	SSN =fSSPSet_Animal01( SSN);
	SSN =fSSRSet_Walker01( SSN);

	SS =fSSChange_Inbetween(SSP, SSN, nA);
	SS =fSSkeltonMake( SS);

	float NP, nPP;
	NP =fNMuscle_Animal01(SS);

	nPP =fNAttachment_Bear01( VP, SS);
	NP =min(NP, nPP);

	return NP;
}

float fNMap(vec3 V3P){
	vec4 VP =vec4(V3P, nTime), VC =vec4(1);
	VP.xz *=mat2(cos(VMouse.x), -sin(VMouse.x), sin(VMouse.x), cos(VMouse.x));
//	VP.zy *=mat2(cos(VMouse.y *0.5), -sin(VMouse.y *0.5), sin(VMouse.y *0.5), cos(VMouse.y *0.5));
	float NP =1000000.0, nPP;
	
	{
		vec3 V3P =VP.xyz +vec3(0,0,1) *VP.w, V3PMod =V3P, V3PDom =V3P;
		V3PMod.xz =mod(V3PMod.xz, vec2(8, 12)) -vec2(4 ,6), V3PDom -=V3PMod;
		float nRandom =fract(sin(dot(vec2(13.17, 17.19), V3PDom.xz) *19.23 +23.13));
		V3PMod.y +=sin(-(VP.w +nRandom)) *1.2;
//		nPP =fNWalker01(vec4(V3PMod, (VP.w +nRandom)), 1.0);
//		nPP =fNBear01(vec4(V3PMod, (VP.w +nRandom)), 1.0);
		nPP =fNTest01(vec4(V3PMod, (VP.w +nRandom)), cos(VP.w *0.1 +nRandom *3.14 *2.0));

		VC.rgb =(NP <nPP)? VC.rgb:sin((nRandom +vec3(0,1,2) /3.0)*3.14 *2.0) *0.4 +0.6;
		NP =min(NP, nPP);

		V3P =VP.xyz +vec3(0.1,0,-1) *VP.w, V3PMod =V3P;
		V3PMod.xz =mod(V3PMod.xz, 24.0) -12.0;
		nPP =length(max(abs(V3PMod) -vec3(1,12,1), 0.0)) -0.1;
		VC.rgb =(NP <nPP)? VC.rgb:sin(vec3(0,1,2) /3.0 *3.14 *2.0 +VP.w) *0.2 +0.8;
		NP =fNSmoothMin(NP, nPP, 4.0);

		nPP =VP.y +3.5 +sin(length(VP.xz) -VP.w) *0.2;
		VC.rgb =(NP <nPP)? VC.rgb:sin(vec3(2,1,0) /3.0 *3.14 *2.0 +VP.w) *0.1 +0.9;
		NP =fNSmoothMin(NP, nPP, 4.0);
	}

	VDefaultColor  =VC;
	nDefaultReflex =0.5;
	return NP;
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

vec4 fVBack(vec2 V2P){
	vec4 VC =vec4(1);
	VC.rgb =vec3(1) *sign(sin(V2P.x *16.0) *sin(V2P.y *16.0)) *0.2 +0.6;
	return VC;
}
vec4 fVBackReflection(vec3 V3P){
	vec4 VP =vec4(V3P, nTime);
	vec2 V2P =VP.xz /VP.y;
	vec4 VC =vec4(1);
	VC.rgb =(VP.y >0.0)?
		vec3(1) *sin(V2P.x *4.0) *sin(V2P.y *4.0 +VP.w *5.0) *0.3 +0.7:
		vec3(1) *sign(sin(V2P.x *4.0) *sin(V2P.y *4.0 -VP.w *1.0)) *0.3 +0.7;
	VC.rgb +=length(V2P) *0.05;
	return VC;
}

void fMain(void){
	vec2 V2UV =(gl_FragCoord.xy *2.0 -VResolution.xy) /max(VResolution.x, VResolution.y);
	vec3 V3Camera =VDefaultCamera.xyz, V3Direction =normalize(vec3(V2UV, 1)), V3Light =VDefaultLight.xyz;
	vec4 VColor =vec4(1);
	const int ciDefinition =50;
	float nDistance, nA, nT, nDistance_Max =100.0, nReflex =1.0;
	int iTouch;
	vec3 V3IP;

	for(int I =0; I <ciDefinition; I++){
		V3IP =V3Camera +nA *V3Direction;
		nDistance =fNMap(V3IP);
		nDistance =min(nDistance, 1.0);
		if(nDistance <0.01){
			iTouch++;
			break;
		}
		if(nA >nDistance_Max)	break;
		nA +=nDistance;
		nT++;
	}

	if(iTouch >=1){
//		VColor.rgb -=nT /float(ciDefinition) *0.5;
		vec3 V3NL =fV3NormalLine(V3IP);
		VColor.rgb *=dot(V3NL, normalize(V3Light)) *0.5 +0.5;
		V3Direction =reflect(V3Direction, V3NL);
		V3Camera =V3IP;
		nA =0.02;
		VColor *=VDefaultColor;
		nReflex =nDefaultReflex;
	}

	if(iSetting_Marching2nd >=2){
		for(int I =0; I <ciDefinition; I++){
			V3IP =V3Camera +nA *V3Direction;
			nDistance =fNMap(V3IP);
			nDistance =min(nDistance, 1.0);
			if(nDistance <0.01){
				iTouch++;
				break;
			}
			if(nA >nDistance_Max)	break;
			nA +=nDistance;
			nT++;
		}
		if(iTouch >=2){
//			VColor.rgb -=nT /float(ciDefinition) *0.5;
			vec3 V3NL =fV3NormalLine(V3IP);
			VColor.rgb *=dot(V3NL, normalize(V3Light)) *0.5 +0.5;
			V3Direction =reflect(V3Direction, V3NL);
			V3Camera =V3IP;
			nA =0.02;
			VColor *=(VDefaultColor -1.0) *nReflex +1.0;
		}
	}

//	VColor *=fVBackReflection(V3Direction);
	if(iTouch ==0)	VColor =fVBack(V2UV);

	gl_FragColor =VColor;
}

void main(void){
	fMain();
}
