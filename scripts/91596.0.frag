/*R040918作例　「ニャンパスマン」シリーズ　by ニシタマオ*/
/*サンドボックス上での試験用、簡易レイトレシステム、二段階反射・屈折機能、ぼかし影機能付（R040918版、反射機能の改良、屈折機能のバグ取り）*/
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

const bool cbSetting_March2nd_Reflect =true;
const bool cbSetting_March2nd_Refract =false;
const bool cbSetting_ShadeByLight1st =true;
const bool cbSetting_ShadeBySteps1st =false;
const bool cbSetting_ShadeByLight2nd_Reflect =true;
const bool cbSetting_ShadeBySteps2nd_Reflect =false;
const bool cbSetting_ShadeByLight2nd_Refract =false;
const bool cbSetting_ShadeBySteps2nd_Refract =true;
const bool cbSetting_CeilFloor1st =false;
const bool cbSetting_CeilFloor2nd_Reflect =false;
const bool cbSetting_CeilFloor2nd_Refract =false;
const bool cbSetting_Effect1st =false;
const bool cbSetting_Effect2nd_Reflect =false;
const bool cbSetting_Effect2nd_Refract =false;
const bool cbSetting_Refrax =false;
const bool cbSetting_Shadow =true;

vec4 VP_DefaultCamera =vec4(0, 0, -20, 0);
vec4 VP_DefaultLight =vec4(1,1,-1,0) *64.0;
vec4 VC_DefaultLight =vec4(1);
const int ciDefinition =50;

struct smarch{
	vec3 V3Direction;
	vec3 V3P_Start;
	vec3 V3P;
	float nLength;
	float nDistance_Min;
	bool bTouch;
	int iLoop;
	float nLoop;
	vec3 V3NormalLine;
};

struct sface{
	float nDistance;
	vec4 VColor;
	vec3 V3Real_Reflect_Refract;
	float nRefrax;
	float nLeapAfterRefract;
};

sface SF;

sface fSFSet_Default(void){
	sface SF;
	SF.VColor =vec4(1);
	SF.nDistance =1e+6;
	SF.V3Real_Reflect_Refract =vec3(1);
	SF.nRefrax =0.8;
	SF.nLeapAfterRefract =2.0;
	return SF;
}

vec4 VResolution =vec4(resolution, 0, 0);
float nTime =time *1.0;
vec4 VMouse =vec4((mouse -0.5)*vec2(1,-1), 0, 0);

mat3 fM3Rotate(vec3 V3R){
	mat3 M3R =mat3(1,0,0, 0,1,0, 0,0,1);
	M3R *=mat3( cos(V3R.z),-sin(V3R.z), 0, sin(V3R.z), cos(V3R.z), 0, 0, 0, 1);
	M3R *=mat3( 1, 0, 0, 0, cos(V3R.x),-sin(V3R.x), 0, sin(V3R.x), cos(V3R.x));
	M3R *=mat3( cos(V3R.y), 0, sin(V3R.y), 0, 1, 0,-sin(V3R.y), 0, cos(V3R.y));
	return M3R;
}

mat3 fM3Rotate(vec2 V2R){
	return fM3Rotate(vec3(V2R, 0));
}

mat2 fM2Rotate(float nR){
	return mat2( cos(nR),-sin(nR), sin(nR), cos(nR));
}

float fNSmoothMin(float nP1, float nP2, float nK){
	float nH =exp(-nP1 *nK) +exp(-nP2 *nK);
	nH = -log(nH) /nK;
	return nH;
}

int fISequencer(int iCycle, int iSQ){
	return	int(mod(nTime, float(iCycle)) /float(iCycle) *float(iSQ));
}

vec4 fVN(float nP){
	vec4 VCycle =vec4( 11 *13 *17, 11 *13, 11, 1);
	vec4 VLS =fract(VCycle *nP);
	return VLS;
}

float fNRandom(vec2 V2P){    return fract(sin(dot(V2P +1e2,vec2(12.9898,78.233))) * 43758.5453);}
float fNRandom(vec3 V3P){    return fNRandom(vec2(fNRandom(V3P.xy), V3P.z));}
float fNRandom(float nP){    return fNRandom(vec2(nP,1));}
float fNRandom(int   iP){    return fNRandom(vec2(iP,1));}

/*文字列形状生成機能（R040809版）by ニシタマオ*/
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

/*	NP =length(max(abs(V3P) -nRadius *0.25, 0.0)) -0.25;*/
	NP =length(V3P) -nRadius *0.75;

	return NP;
}

float fNLetters00(vec4 VP){
	float NP =1000000.0;
	/*REPLACEE_LETTERS00*/
	return NP;
}
/*ここまで*/

/*人体形状生成機能、中割機能付（R040908版）（縮小版）by ニシタマオ*/
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
	vec4  VMisc00, VMisc01, VMisc02, VMisc03;
	float nMisc00, nMisc01, nMisc02, nMisc03;
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

	SS.VP_Shld.xyz *=fM3Rotate(SS.VR_Body.xyz);
	SS.VP_Neck.xyz *=fM3Rotate(SS.VR_Shld.xyz);
	SS.VP_Head.xyz *=fM3Rotate(SS.VR_Neck.xyz);

	SS.VP_ArRU.xyz *=fM3Rotate(SS.VR_Shld.xyz);
	SS.VP_ArLU.xyz *=fM3Rotate(SS.VR_Shld.xyz);

	SS.VP_ArRL.xyz *=fM3Rotate(SS.VR_ArRU.xyz);
	SS.VP_ArLL.xyz *=fM3Rotate(SS.VR_ArLU.xyz);

	SS.VP_HndR.xyz *=fM3Rotate(SS.VR_ArRL.xyz);
	SS.VP_HndL.xyz *=fM3Rotate(SS.VR_ArLL.xyz);

	SS.VP_LeRU.xyz *=fM3Rotate(SS.VR_Body.xyz);
	SS.VP_LeLU.xyz *=fM3Rotate(SS.VR_Body.xyz);

	SS.VP_LeRL.xyz *=fM3Rotate(SS.VR_LeRU.xyz);
	SS.VP_LeLL.xyz *=fM3Rotate(SS.VR_LeLU.xyz);

	SS.VP_FotR.xyz *=fM3Rotate(SS.VR_FotR.xyz);
	SS.VP_FotL.xyz *=fM3Rotate(SS.VR_FotL.xyz);

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

sskelton fSSChange_Multiple(sskelton SS, float nD){
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

float fNMuscle_Man01(sskelton SS){
	vec4 VP =SS.VP, VA, VB;
	float NP =1000000.0;
	VP.xyz *=fM3Rotate(SS.VR_Cntr.xyz);

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
	VP.xyz *=fM3Rotate(SS.VR_Cntr.xyz);

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
//	nD *=SS.nMisc00;

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

	SS =fSSChange_Multiple(SS, nD);
	return SS;
}

sskelton fSSRSet_Chanbara01P(sskelton SS){
	float nD =acos(-1.0) /180.0;

	SS.VR_Body =vec4(+15,	0,	0,	0);
	SS.VR_Shld =vec4(0,	-30,	0,	0);
	SS.VR_Neck =vec4(0,	0,	0,	0);
	SS.VR_Head =vec4(0,	0,	0,	1);
	SS.VR_ArRU =vec4(+120,	0,	0,	0);
	SS.VR_ArLU =vec4(+90,	-15,	0,	0);
	SS.VR_ArRL =vec4(+45,	0,	0,	1);
	SS.VR_ArLL =vec4(+30,	0,	0,	1);
	SS.VR_LeRU =vec4(-30,	0,	0,	0);
	SS.VR_LeLU =vec4(+30,	0,	0,	0);
	SS.VR_LeRL =vec4(-30,	0,	0,	1);
	SS.VR_LeLL =vec4(-15,	0,	0,	1);
	SS.VR_HndR =vec4(0,	0,	0,	1);
	SS.VR_HndL =vec4(-30,	0,	0,	1);
	SS.VR_FotR =vec4(0,	0,	0,	1);
	SS.VR_FotL =vec4(0,	0,	0,	1);

	SS =fSSChange_Multiple(SS, nD);

	return SS;
}

sskelton fSSRSet_Chanbara01N(sskelton SS){
	float nD =acos(-1.0) /180.0;

	SS.VR_Body =vec4(-15,	0,	0,	0);
	SS.VR_Shld =vec4(0,	+30,	0,	0);
	SS.VR_Neck =vec4(0,	0,	0,	0);
	SS.VR_Head =vec4(0,	0,	0,	1);
	SS.VR_ArRU =vec4(+75,	0,	0,	0);
	SS.VR_ArLU =vec4(+30,	+30,	0,	0);
	SS.VR_ArRL =vec4(+30,	0,	0,	1);
	SS.VR_ArLL =vec4(+15,	0,	0,	1);
	SS.VR_LeRU =vec4(+30,	0,	0,	0);
	SS.VR_LeLU =vec4(-30,	0,	0,	0);
	SS.VR_LeRL =vec4(-15,	0,	0,	1);
	SS.VR_LeLL =vec4(-30,	0,	0,	1);
	SS.VR_HndR =vec4(-30,	0,	0,	1);
	SS.VR_HndL =vec4(0,	0,	0,	1);
	SS.VR_FotR =vec4(0,	0,	0,	1);
	SS.VR_FotL =vec4(0,	0,	0,	1);

	SS =fSSChange_Multiple(SS, nD);

	return SS;
}

sskelton fSSRSet_Chanbara02P(sskelton SS){
	float nD =acos(-1.0) /180.0;

	SS.VR_Body =vec4(-15,	0,	-30,	0);
	SS.VR_Shld =vec4(0,	+30,	-15,	0);
	SS.VR_Neck =vec4(0,	0,	0,	0);
	SS.VR_Head =vec4(0,	0,	0,	1);
	SS.VR_ArRU =vec4(+15,	0,	+30,	0);
	SS.VR_ArLU =vec4(+15,	0,	-30,	0);
	SS.VR_ArRL =vec4(+60,	0,	0,	1);
	SS.VR_ArLL =vec4(+60,	0,	0,	1);
	SS.VR_LeRU =vec4(+60,	0,	+45,	0);
	SS.VR_LeLU =vec4(-15,	0,	-45,	0);
	SS.VR_LeRL =vec4(-90,	0,	0,	1);
	SS.VR_LeLL =vec4(-30,	0,	0,	1);
	SS.VR_HndR =vec4(-30,	0,	0,	1);
	SS.VR_HndL =vec4(0,	0,	0,	1);
	SS.VR_FotR =vec4(0,	0,	0,	1);
	SS.VR_FotL =vec4(0,	0,	0,	1);

	SS =fSSChange_Multiple(SS, nD);

	return SS;
}

sskelton fSSRSet_Chanbara02N(sskelton SS){
	SS =fSSChange_MirrorX(fSSRSet_Chanbara02P(SS));
	return SS;
}


sskelton fSSRSet_Bear01(sskelton SS){
	float nD =acos(-1.0) /180.0, nS =sin(SS.VP.w), nSL =sin(SS.VP.w +acos(-1.0) /180.0 *30.0);
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

	SS =fSSChange_Multiple(SS, nD);

	SS.VP_Cntr.y =+cos(SS.VP.w);
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

float fNAttachment_HeadDilbert01(vec4 VP){
	float NP =1e+6, nPi, nA =1.0;
	{
		vec3 V3P;

		V3P =VP.xyz;
		float nPi;
		nPi =length(V3P.xz) -0.5 *(1.0 -V3P.y *0.2) *nA;
		nPi =max(nPi, abs(V3P.y) -1.0 *nA);
		NP =min(NP, nPi);

		V3P =VP.xyz +vec3(0,-0.9, 0) *nA;
		{
			float nTh =atan(V3P.x, V3P.z);
			vec2 V2P =vec2(length(V3P.xz) -0.45 *nA, V3P.y);
			nPi =length(V2P) -0.15 *(0.6 +abs(sin(nTh *6.0)) *0.4) *nA;
		}
		NP =min(NP, nPi);

		V3P =VP.xyz +vec3(0,+0.1, 0.5) *nA;
		nPi =length(V3P) -0.25 *nA;
		NP =min(NP, nPi);

		V3P =VP.xyz +vec3(0,-0.3, 0.6) *nA;
		V3P.x =abs(V3P.x) -0.2;
		nPi =length(V3P.xy) -0.15 *nA;
		nPi =max(nPi, abs(V3P.z) -0.025 *nA);
		NP =min(NP, nPi);

		V3P =VP.xyz;
		V3P.x =abs(V3P.x) -0.5 *nA;
		nPi =length(V3P.xy) -0.25 *nA;
		nPi =max(nPi, abs(V3P.z) -0.05 *nA);
		NP =min(NP, nPi);
	}
	return NP;
}

vec3 fV3Attach(vec3 V3P, vec3 V3S, vec3 V3R){
	return (V3P -V3S) *fM3Rotate(-V3R);
}

float fNOutfit_Bear01(sskelton SS){
	float NP =1000000.0;
	vec4 VP =SS.VP;
	VP.xyz *=fM3Rotate(SS.VR_Cntr.xyz);

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

float fNOutfit_Warrior01(sskelton SS){
	float NP =1000000.0;
	vec4 VP =SS.VP;
	VP.xyz *=fM3Rotate(SS.VR_Cntr.xyz);

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

float fNOutfit_Dilbert01(sskelton SS){
	float NP =1000000.0;
	vec4 VP =SS.VP;
	VP.xyz *=fM3Rotate(SS.VR_Cntr.xyz);

	{
		vec4 VPi =VP;
		VPi.xyz =fV3Attach(VPi.xyz, SS.VP_Head.xyz, SS.VR_Head.xyz);

		float nPi =fNAttachment_HeadDilbert01(VPi);
		NP =min(NP, nPi);			
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

float fNChanbaraWarrior01(vec4 VP, float nIB){
	sskelton SS, SSYP, SSYN;
	SS.VP =VP;
	SS =fSSPSet_Man01( SS);
//	SSYP =fSSRSet_Chanbara01P( SS);
//	SSYN =fSSRSet_Chanbara01N( SS);

	SSYP =fSSRSet_Chanbara02P( SS);
	SSYN =fSSRSet_Chanbara02N( SS);

	SS =fSSChange_Inbetween(SSYP, SSYN, nIB);
	SS =fSSkeltonMake( SS);

	SS.VP.z -=nIB *0.5;

	float NP, nPP;
	NP =fNMuscle_Man01(SS);

	nPP =fNOutfit_Warrior01(SS);
	NP =min(NP, nPP);

	return NP;
}

float fNChanbaraWarriorV2_01(vec4 VP, vec2 V2IB){
	sskelton SS, SSYP, SSYN, SSXP, SSXN, SSY, SSX;
	SS.VP =VP;
	SS =fSSPSet_Man01( SS);

	SSYP =fSSRSet_Chanbara01P( SS);
	SSYN =fSSRSet_Chanbara01N( SS);

	SSXP =fSSRSet_Chanbara02P( SS);
	SSXN =fSSRSet_Chanbara02N( SS);

	SSY =fSSChange_Inbetween(SSYP, SSYN, V2IB.y);
	SSX =fSSChange_Inbetween(SSXP, SSXN, V2IB.x);

	float nX =abs(V2IB.x), nY =abs(V2IB.y), nIB =(nX -nY) /(nX +nY);

	SS =fSSChange_Inbetween(SSX, SSY, nIB);

	SS =fSSkeltonMake( SS);

//	SS.VP.z -=V2IB.y *0.5;

	float NP, nPP;
	NP =fNMuscle_Man01(SS);

	nPP =fNOutfit_Warrior01(SS);
	NP =min(NP, nPP);

	return NP;
}


float fNWalkDilbert01(vec4 VP, float nDummy){
	sskelton SS;
	SS.VP =VP;
	SS =fSSPSet_Man01( SS);
	SS =fSSRSet_Walker01( SS);
	SS =fSSkeltonMake( SS);

	float NP, nPP;
	NP =fNMuscle_Man01(SS);

	nPP =fNOutfit_Dilbert01(SS);
	NP =min(NP, nPP);

	return NP;
}
/*人体形状生成機能ここまで*/

vec4 fVPSet(vec3 V3P){
	vec4 VP =vec4(V3P, nTime);

	VP.xyz *=fM3Rotate(-VMouse.yx *vec2(0.5) +vec2(0.5,0));
	return VP;
}

float fNMap(vec3 V3P){
	sface SFo =fSFSet_Default(), SFi =SFo;

	vec4 VP =fVPSet(V3P), VC_Light =vec4(1);

	SFi =SFo;
	float NP =1e+6;

	/*所要の図形の表面距離を記述*/

	if(true){	/*ニャンパスマン*/
		vec4 VPi =VP;
		float nIB = -clamp(VMouse.y *4.0, -1.0, +1.0);
		VPi.z -=nIB *4.0;
		float nSignZ =sign(VPi.z);

		VPi.z =abs(VPi.z) -6.0;
		vec2 V2IB = clamp(-VMouse.xy *8.0,-1.0,+1.0);
		VPi.x +=V2IB.x *nSignZ *4.0;
		VPi.y +=abs(V2IB.x);

		float nPi;
		nPi = fNChanbaraWarriorV2_01(VPi, V2IB *nSignZ);

		if(NP >nPi){
			SFo.nDistance =nPi;
			SFi= SFo;
			SFi.VColor.rgb =vec3(0.6,0.6,0.5) +vec3(0.4,-0.4,0) *nSignZ;		
			NP =nPi;
		}
	}

	if(true){	/*水面*/
		vec4 VPi =VP;
		float nPi =abs(VPi.y +3.5 +sin(VPi.x +sin(VPi.z +VPi.w)) *sin(VPi.z +sin(VPi.x +VPi.w)) *0.05) -0.1;

		if(NP >nPi){
			SFo.nDistance =nPi;
			SFi= SFo;
			SFi.VColor.rgb =vec3(1) *(sign(sin(VPi.x) *sin(VPi.z)) *0.1 +0.9);
		}
		NP =fNSmoothMin(NP, nPi, 2.0);
	}
	/*ここまで*/

	SF =SFi;
	VC_DefaultLight =VC_Light;
	return NP;
}

vec4 fVCeilFloor(vec3 V3P){
	vec4 VP =vec4(V3P /V3P.y, nTime), VC =vec4(1);
	/*天井と床面の色彩を記述*/
	{
		float nC;
		vec3 V3P =abs(normalize(VP.xyz) *fM3Rotate(vec3(1,10,100) /100.0 *VP.w)) -normalize(vec3(1));
		nC =1e-4 *pow(length(V3P),-4.0);
		VC.rgb =vec3(1) *nC;
	}
	/*ここまで*/
	return VC;
}

vec4 fVBack(vec2 V2UV){
	vec4 VP =vec4(V2UV *4.0, 0, nTime), VC =vec4(1);
	/*背景の色彩を記述*/
	/*ここまで*/
	return VC;
}

vec4 fVEffect(vec4 VColor, smarch SM){
	if(!SM.bTouch)	return VColor;
	vec4 VP =fVPSet(SM.V3P);
	vec3 V3NL =SM.V3NormalLine;

	/*特殊効果の色彩を記述*/
	if(false){	/*点格子*/
		vec4 VPi =VP;
		VPi.xyz =mod(VPi.xyz, 1.0) -0.5;
		float nL =length(VPi.xyz);
		VColor.rgb +=(sin((vec3(0,1,2) /3.0 -VPi.w) *acos(-1.0) *2.0) *0.5 +0.5) *pow(nL, -2.0) *1e-2;
	}

	if(false){	/*線格子*/
		vec4 VPi =VP;
		VPi.xyz =mod(VPi.xyz, 4.0) -2.0;
		float nL =min(min(abs(VPi.x), abs(VPi.y)), abs(VPi.z));
		vec3 V3C =(sin((vec3(0,1,2) /3.0 -VPi.w) *acos(-1.0) *2.0) *0.5 +0.5) *pow(nL, -2.0) *1e-3;
		V3C =clamp(V3C, 0.0, 1.0);
		VColor.rgb +=V3C;
	}
	/*ここまで*/
	return VColor;
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

smarch fSMRayMarch(vec3 V3P_Start, vec3 V3Direction, float nLength){
	V3Direction =normalize(V3Direction);
	vec3 V3P;
	float nDistance_Min =1e+6;
	bool bTouch;
	int iLoop;
	nLength +=0.02;
	for(int I =0; I <ciDefinition; I++){
		V3P =V3P_Start +V3Direction *nLength;
		float nDistance =fNMap(V3P);
		if(nDistance <0.01){
			bTouch =true;
			break;
		}
		nLength +=nDistance;
		nDistance_Min =min(nDistance_Min, nDistance);
		iLoop++;
	}
	smarch SM;
	SM.V3Direction =V3Direction;
	SM.V3P_Start =V3P_Start;
	SM.V3P =V3P;
	SM.nLength =nLength;
	SM.nDistance_Min =nDistance_Min;
	SM.bTouch =bTouch;
	SM.iLoop =iLoop;
	SM.nLoop =float(iLoop) /float(ciDefinition);
	SM.V3NormalLine =fV3NormalLine(V3P);
	return SM;
}

float fNShadow(vec3 V3Position, vec3 V3P_Light){
	float nShadow =0.0;

	smarch SM =fSMRayMarch(V3Position, normalize(V3P_Light -V3Position), 1.0);

	nShadow =1.0 -clamp(SM.nDistance_Min, 0.0, 1.0);
	if(SM.bTouch)	nShadow =1.0;
	return nShadow;
}

void fMain(void){
	vec2 V2UV =(gl_FragCoord.xy *2.0 -VResolution.xy) /max(VResolution.x, VResolution.y);
	vec3 V3Camera =VP_DefaultCamera.xyz, V3Direction =normalize(vec3(V2UV, 1)), V3P_Light =VP_DefaultLight.xyz;

	SF =fSFSet_Default();

	vec4 VColor, VColor1st, VColor2nd_Reflect, VColor2nd_Refract;
	bool bTouch1st, bTouch2nd_Reflect, bTouch2nd_Refract;
	float nA, nShadow =0.25;

	smarch SM, SM1st, SM2nd_Reflect, SM2nd_Refract;

	{
		SM =fSMRayMarch(V3Camera, V3Direction, 0.0);
		SM1st =SM, SM2nd_Reflect =SM, SM2nd_Refract =SM;

		if(SM.bTouch){
			vec4 VC =SF.VColor;
			if(cbSetting_ShadeByLight1st)	VC.rgb *=dot(SM.V3NormalLine, normalize(V3P_Light))*0.5 +0.5;
			if(cbSetting_ShadeBySteps1st)	VC.rgb *=1.0 -SM.nLoop;
			VColor1st =VC;
	
			SM2nd_Reflect.V3Direction =reflect(SM.V3Direction, SM.V3NormalLine);
			SM2nd_Reflect.V3P_Start =SM.V3P;
			SM2nd_Reflect.nLength =0.0;

			SM2nd_Refract.V3Direction =SM.V3Direction;
			if(cbSetting_Refrax)	SM2nd_Refract.V3Direction =refract( SM.V3Direction, SM.V3NormalLine, SF.nRefrax);
			SM2nd_Refract.V3P_Start =SM.V3P;
			SM2nd_Refract.nLength =SF.nLeapAfterRefract;
		}
		SM1st =SM;
	}

	VColor2nd_Reflect =VColor1st;
	VColor2nd_Refract =VColor1st;
	sface SF1st =SF;

	if(cbSetting_March2nd_Reflect){

		SM =fSMRayMarch(SM2nd_Reflect.V3P_Start, SM2nd_Reflect.V3Direction, 0.0);

		if(SM.bTouch){
			vec4 VC =SF.VColor;
			vec3 V3NL =fV3NormalLine(SM.V3P);
			SM.V3NormalLine =V3NL;
			if(cbSetting_ShadeByLight2nd_Reflect)	VC.rgb *=dot(V3NL, normalize(V3P_Light))*0.5 +0.5;
			if(cbSetting_ShadeBySteps2nd_Reflect)	VC.rgb *=1.0 -SM.nLoop;
			VColor2nd_Reflect =VC;
		}
		SM2nd_Reflect =SM;

	}

	if(cbSetting_March2nd_Refract){

		SM =fSMRayMarch(SM2nd_Refract.V3P_Start, SM2nd_Refract.V3Direction, SF.nLeapAfterRefract);

		if(SM.bTouch){
			vec4 VC =SF.VColor;
			vec3 V3NL =fV3NormalLine(SM.V3P);
			if(cbSetting_ShadeByLight2nd_Refract)	VC.rgb *=dot(V3NL, normalize(V3P_Light))*0.5 +0.5;
			if(cbSetting_ShadeBySteps2nd_Refract)	VC.rgb *=1.0 -SM.nLoop;
			VColor2nd_Refract =VC;
		}
		SM2nd_Refract =SM;
	}

	vec3 V3RRR =SF1st.V3Real_Reflect_Refract;

	if(!SM1st.bTouch){
		VColor1st =vec4(1);
		VColor2nd_Reflect =VColor1st;
		VColor2nd_Refract =VColor1st;
	}

	if(cbSetting_CeilFloor1st){
		if(!SM1st.bTouch){
			VColor1st =fVCeilFloor(SM1st.V3Direction);
			VColor2nd_Reflect =VColor2nd_Refract =VColor1st;
		}else{
			if(!cbSetting_March2nd_Reflect && !cbSetting_March2nd_Refract){	/*二段反射等しない時には背景だけを反射*/
				vec3 V3Direction =reflect(SM1st.V3Direction, SM1st.V3NormalLine);
				vec2 V2RR =V3RRR.xy;
				V2RR /=abs(V2RR.x) +abs(V2RR.y);
				VColor1st =VColor1st *V2RR.x +fVCeilFloor(V3Direction) *V2RR.y;
				VColor2nd_Reflect =VColor2nd_Refract =VColor1st;
			}
		}
	}

	if(cbSetting_CeilFloor2nd_Reflect && SM1st.bTouch && !SM2nd_Reflect.bTouch){
		vec2 V2RR =V3RRR.xy;
		V2RR /=abs(V2RR.x) +abs(V2RR.y);
		VColor2nd_Reflect =VColor2nd_Reflect *V2RR.x +fVCeilFloor(SM2nd_Reflect.V3Direction) *V2RR.y;
	}

	if(cbSetting_CeilFloor2nd_Refract && SM1st.bTouch && !SM2nd_Refract.bTouch){
		vec2 V2RR =V3RRR.xz;
		V2RR /=abs(V2RR.x) +abs(V2RR.y);
		VColor2nd_Refract =VColor2nd_Refract *V2RR.x +fVCeilFloor(SM2nd_Refract.V3Direction) *V2RR.y;
	}

	VColor1st.rgb *=VC_DefaultLight.rgb;
	VColor2nd_Reflect.rgb *=VC_DefaultLight.rgb;
	VColor2nd_Refract.rgb *=VC_DefaultLight.rgb;

	if(cbSetting_Effect1st)	VColor1st =fVEffect(VColor1st, SM1st);
	if(cbSetting_Effect2nd_Reflect)	VColor2nd_Reflect =fVEffect(VColor2nd_Reflect, SM2nd_Reflect);
	if(cbSetting_Effect2nd_Refract)	VColor2nd_Refract =fVEffect(VColor2nd_Refract, SM2nd_Refract);

	V3RRR /=abs(V3RRR.x) +abs(V3RRR.y) +abs(V3RRR.z);
	VColor =VColor1st *V3RRR.x +VColor2nd_Reflect *V3RRR.y +VColor2nd_Refract *V3RRR.z;

	if(cbSetting_Shadow && SM1st.bTouch)	VColor.rgb -=fNShadow(SM1st.V3P, V3P_Light) *nShadow;

	if(!cbSetting_CeilFloor1st && !SM1st.bTouch)	VColor =fVBack(V2UV);

	VColor.a =1.0;
	gl_FragColor =VColor;
}

void main(void){
	fMain();
}
