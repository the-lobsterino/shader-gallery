/*R041204作例　サーカス　by ニシタマオ*/
/*サンドボックス上での試験用、簡易レイトレシステム、廉価ＰＣ用軽量版
}

sface fSFMin(sface SF0, sface SF1){
	if(SF0.nDistance < SF1.nDistance){
		return SF0;
	}else
		return SF1;
	}
}

sface fSFSmoothMin(sface SF0, sface SF1, float nK){

	sface SF =fSFMin(SF0, SF1);

	float nP0 =SF0.nDistance, nP1 =SF1.nDistance;
	float nH =exp(-nP0 *nK) +exp(-nP1 *nK);
	float nP =-log(nH) /nK;
	SF.nDistance = nP;

	float nFusion =abs(nP -nP0) /(abs(nP -nP0) +abs(nP -nP1));

	if(true){	/*色彩、反射・屈折率モチャモチャ合成*/
		SF.VColor =mix(SF0.VColor, SF1.VColor, nFusion);
		SF.V3Real_Reflect_Refract =mix(normalize(SF0.V3Real_Reflect_Refract), normalize(SF1.V3Real_Reflect_Refract), nFusion);
		SF.nRefrax =mix(SF0.nRefrax, SF1.nRefrax, nFusion);
	}
	return SF;
}

/*汎用関数（R041117版）ここから*/
mat3 fM3RotateX(float nR){	return mat3( 1, 0, 0, 0, cos(nR),-sin(nR), 0, sin(nR), cos(nR));}
mat3 fM3RotateY(float nR){	return mat3( cos(nR), 0, sin(nR), 0, 1, 0,-sin(nR), 0, cos(nR));}
mat3 fM3RotateZ(float nR){	return mat3( cos(nR),-sin(nR), 0, sin(nR), cos(nR), 0, 0, 0, 1);}

mat3 fM3Rotate(vec3 V3R){
	mat3 M3R =mat3(1,0,0, 0,1,0, 0,0,1);
	M3R *=fM3RotateZ(V3R.z);
	M3R *=fM3RotateX(V3R.x);
	M3R *=fM3RotateY(V3R.y);
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

float fNRandom(float nP){	return fract(sin(nP) * 687.3123);}
float fNRandom(vec2 V2P){	return fract(sin(dot(V2P +1e2,vec2(12.9898,78.233))) * 43758.5453);}
float fNRandom(vec3 V3P){	return fNRandom(vec2(fNRandom(V3P.xy), fNRandom(V3P.z)));}
float fNRandom(int   iP){	return fNRandom(vec2(iP,1));}
/*汎用関数ここまで*/

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

	/*線分の形状*/
	NP =length(V3P) -nRadius *0.5;

	return NP;
}

float fNLetters00(vec4 VP){
	float NP =1e+6;
	/*REPLACEE_LETTERS00*/
	return NP;
}
/*文字列形状生成機能ここまで*/

/*人体形状生成機能、中割機能付（R041201版）by ニシタマオ*/
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
	vec4 VP_Cntr, VP_Body, VP_Shld, VP_Neck, VP_Head, VP_ArRU, VP_ArLU, VP_ArRL, VP_ArLL, VP_LeRU, VP_LeLU, VP_LeRL, VP_LeLL, VP_HndR, VP_HndL, VP_FotR, VP_FotL;
	vec4 VR_Cntr, VR_Body, VR_Shld, VR_Neck, VR_Head, VR_ArRU, VR_ArLU, VR_ArRL, VR_ArLL, VR_LeRU, VR_LeLU, VR_LeRL, VR_LeLL, VR_HndR, VR_HndL, VR_FotR, VR_FotL;

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

sskelton fSSRChange_Multiple(sskelton SS, vec4 VD){
	SS.VR_Cntr *= VD;
	SS.VR_Body *= VD;
	SS.VR_Shld *= VD;
	SS.VR_Neck *= VD;
	SS.VR_Head *= VD;
	SS.VR_ArRU *= VD;
	SS.VR_ArLU *= VD;
	SS.VR_ArRL *= VD;
	SS.VR_ArLL *= VD;
	SS.VR_LeRU *= VD;
	SS.VR_LeLU *= VD;
	SS.VR_LeRL *= VD;
	SS.VR_LeLL *= VD;
	SS.VR_HndR *= VD;
	SS.VR_HndL *= VD;
	SS.VR_FotR *= VD;
	SS.VR_FotL *= VD;
	return SS;
}

sskelton fSSRChange_Multiple(sskelton SS, float nD){
	return fSSRChange_Multiple(SS, vec4(nD, nD, nD, 1));
}

vec3 fV3Attach(vec3 V3P, vec3 V3S, vec3 V3R){
	return (V3P -V3S) *fM3Rotate(-V3R);
}

/*筋肉部*/
float fNMusclePart01(vec4 VP, vec4 VA, vec4 VB){
	return fNCappedCylinder(VP, VA, VB);
}

float fNMusclePart02(vec4 VP, vec4 VA, vec4 VB){
	return fNCapsule(VP, VA, VB);
}

float fNMuscle_Animal01(sskelton SS){
	vec4 VP =SS.VP, VA, VB;
	float NP =1e+6, nK =12.0;
	VP.xyz *=fM3Rotate(SS.VR_Cntr.xyz);

	VA =SS.VP_Body, VB =SS.VP_Shld;
	NP =fNSmoothMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_Neck, VB =SS.VP_Head;
	NP =fNSmoothMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_ArRU, VB =SS.VP_ArRL;
	NP =fNSmoothMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_ArRL, VB =SS.VP_HndR;
	NP =fNSmoothMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_ArLU, VB =SS.VP_ArLL;
	NP =fNSmoothMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_ArLL, VB =SS.VP_HndL;
	NP =fNSmoothMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_LeRU, VB =SS.VP_LeRL;
	NP =fNSmoothMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_LeRL, VB =SS.VP_FotR;
	NP =fNSmoothMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_LeLU, VB =SS.VP_LeLL;
	NP =fNSmoothMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_LeLL, VB =SS.VP_FotL;
	NP =fNSmoothMin(NP, fNMusclePart02(VP, VA, VB), nK);
	return NP;
}

/*骨格部*/
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

/*動作部*/
sskelton fSSRSet_CycleBear02(sskelton SS){
	float nD =acos(-1.0) /180.0, nSP =sin(SS.VP.w), nSPP =sin(SS.VP.w -acos(-1.0) *0.5), nSN =sin(SS.VP.w -acos(-1.0) *1.0), nSNN =sin(SS.VP.w -acos(-1.0) *1.5);
	SS.VR_Cntr;
	SS.VR_Body =vec4(0,	0,	+15.0 *nSP,	0);
	SS.VR_Shld =vec4(0,	0,	0,	0);
	SS.VR_Neck =vec4(0,	0,	0,	1);
	SS.VR_Head =vec4(0,	0,	0,	1);
	SS.VR_ArRU =vec4(0,	0,	+60.0 +30.0 *nSP,	1);
	SS.VR_ArLU =vec4(0,	0,	-60.0 -30.0 *nSN,	1);
	SS.VR_ArRL =vec4(0,	0,	+30.0 +30.0 *nSN,	1);
	SS.VR_ArLL =vec4(0,	0,	-30.0 -30.0 *nSP,	1);
	SS.VR_LeRU =vec4(+30.0 +30.0 *nSP,	0,	+5,	0);
	SS.VR_LeLU =vec4(+30.0 +30.0 *nSN,	0,	-5,	0);
	SS.VR_LeRL =vec4(-45.0 +45.0 *nSPP,	0,	0,	1);
	SS.VR_LeLL =vec4(-45.0 +45.0 *nSNN,	0,	0,	1);
	SS.VR_HndR =vec4(0,	0,	0,	1);
	SS.VR_HndL =vec4(0,	0,	0,	1);
	SS.VR_FotR =vec4(0,	0,	0,	1);
	SS.VR_FotL =vec4(0,	0,	0,	1);

	SS =fSSRChange_Multiple(SS, nD);

	return SS;
}

/*手足頭等の末節部*/
float fNAttachment_HeadBear01(vec4 VP){
	float NP =1e+6, nPP, nA =1.0;
	vec3 V3P =VP.xyz;
	{
		nPP =length(V3P) -1.0 *nA;
		NP =min(NP, nPP);			
		nPP =length(V3P -vec3(0,0,-1) *nA) -0.5 *nA;
		NP =min(NP, nPP);			
		nPP =length(V3P -vec3(0,0.3,-1.4) *nA) -0.2 *nA;
		NP =min(NP, nPP);			
		nPP =length(vec3(abs(V3P.x), V3P.yz) -vec3(0.4,0.5,-0.7) *nA) -0.15 *nA;
		NP =min(NP, nPP);			
		nPP =length(vec3(abs(V3P.x), V3P.yz) -vec3(0.7,0.8,0.4) *nA) -0.3 *nA;
		nPP =max(nPP, -(V3P.z -0.4 *nA));
		NP =min(NP, nPP);			
	}
	return NP;
}

/*末節部を統合した総体部*/
float fNOutfit_Bear01(sskelton SS){
	float NP =1e+6;
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

float fNOutfit_CycleBear02(sskelton SS){
	float NP =1e+6;

	vec4 VP =SS.VP;
	VP.xyz *=fM3Rotate(SS.VR_Cntr.xyz);

	{
		vec3 V3P =fV3Attach(VP.xyz, SS.VP_Cntr.xyz, SS.VR_Cntr.xyz);
		V3P.y +=2.5;
		float nPi =max(length(V3P.yz) -1.5, abs(V3P.x) -0.2);
		NP =min(NP, nPi);
	}

	return NP;
}


/*全て統合した完成部*/
float fNObject_CycleBear02(vec4 VP){
	sskelton SS;
	SS.VP =VP -vec4(0,4,0,0);
	SS =fSSPSet_Bear01( SS);
	SS =fSSRSet_CycleBear02( SS);
	SS =fSSkeltonMake( SS);

	float NP, nPP;
	NP =fNMuscle_Animal01(SS);

	nPP =fNOutfit_Bear01(SS);
	NP =min(NP, nPP);

	nPP =fNOutfit_CycleBear02(SS);
	NP =min(NP, nPP);

	return NP;
}


/*ここまで*/
/*個別デモ用関数*/

/*個別デモの専用機能ここまで*/

/*主機能ここから*/

float fNMap(vec3 V3P){
	vec4 VP =vec4(V3P, nTime);
	float NP =1e+6;

	/*所要の図形の表面距離を記述*/
	sface SF =fSFSet_Default();


	if(true){
		vec4 VPi =VP;
		VPi.w =sin(VPi.w *2.0) *4.0;
		VPi.xy -=sin(VPi.z *0.1) *vec2(4,2);

		VPi.z +=VPi.w *2.0;

		float nZ_Mod =mod(VPi.z +VP.w, 16.0) -8.0, nZ_Dom =VPi.z -nZ_Mod;
		VPi.z =nZ_Mod;
		VPi.y -=4.0;

		VPi.yz *=fM2Rotate(-VPi.w *0.1);
		float nPi =fNObject_CycleBear02(VPi);
		sface SFi =fSFSet_Default();
		SFi.nDistance =nPi;
		SFi.ID_Object =1;
		SFi.VP =VPi;
		SF =fSFMin(SF, SFi);
	}

	if(true){	/*紐*/
		vec4 VPi =VP;
		VPi.xy -=sin(VPi.z *0.1) *vec2(4,2);
		VPi.y -=4.0;
		float nPi =length(VPi.xy) -0.4;
		VPi.z =mod(VPi.z, 16.0) -8.0;
		nPi =min(nPi, max(length(VPi.xz) -0.2, VPi.y));


		sface SFi =fSFSet_Default();
		SFi.nDistance =nPi;
		SFi.ID_Object =103;
		SFi.VP =VPi;
		SF =fSFMin(SF, SFi);
	}

	if(true){	/*柱*/
		vec4 VPi =VP;
		VPi.xz =mod(VPi.xz, 32.0) -16.0;
		float nPi =length(max(abs(VPi.xz) -2.0, 0.0)) -0.1;
		sface SFi =fSFSet_Default();
		SFi.nDistance =nPi;
		SFi.ID_Object =102;
		SFi.VP =VPi;
		SF =fSFMin(SF, SFi);
	}

	if(true){	/*水面*/
		float nPi =VP.y +(sin(VP.x +sin(VP.z *0.5 +VP.w)) +sin(VP.z +sin(VP.x *0.5 +VP.w))) *0.05;
		sface SFi =fSFSet_Default();
		SFi.nDistance =nPi;
		SFi.ID_Object =101;
		SFi.VP =VP;
		SF =fSFSmoothMin(SF, SFi, 4.0);
	}


	NP =min(NP, SF.nDistance);
	SF_Default =SF;
	/*ここまで*/

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

smarch fSMRayMarch(vec3 V3P_Start, vec3 V3Direction, float nLength){
	V3Direction =normalize(V3Direction);
	vec3 V3P;
	float nDistance_Min =1e+6, nAdjust =0.5;
	bool bTouch;
	int iLoop;
	nLength +=0.02;
	for(int I =0; I <ciDefinition; I++){
		V3P =V3P_Start +V3Direction *nLength;
		float nDistance =abs(fNMap(V3P));
		nDistance *=nAdjust;
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

sface fSFEffect(smarch SM, sface SF){
	vec3 V3P_Light =VP_DefaultLight.xyz;
	vec4 VP =vec4(SM.V3P, nTime);
	vec4 VColor =SF.VColor;

	int ID_Object =SF.ID_Object, ID_Pallet =SF.ID_Pallet;

	/*オブジェクト・パレットごとの色彩効果を記述*/

	if(true){	/*基本*/
		if(ID_Pallet ==  1) VColor.rgb =vec3(0.75,	0,	0);
		if(ID_Pallet ==  2) VColor.rgb =vec3(1,		0,	0);
		if(ID_Pallet ==  3) VColor.rgb =vec3(1,		0.75,	0);
		if(ID_Pallet ==  4) VColor.rgb =vec3(1,		1,	0);
		if(ID_Pallet ==  5) VColor.rgb =vec3(0,		1,	0);
		if(ID_Pallet ==  6) VColor.rgb =vec3(0,		0,	1);
		if(ID_Pallet ==  7) VColor.rgb =vec3(1,		0,	1);
		if(ID_Pallet ==  8) VColor.rgb =vec3(0.75);
		if(ID_Pallet ==  9) VColor.rgb =vec3(1);
		if(ID_Pallet == 10) VColor.rgb =vec3(0);
		VColor.rgb =VColor.rgb *0.4 +0.6;
	}

	if(ID_Object ==1)		VColor.rgb =sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VP.z *0.1) *0.2 +0.8;
	if(ID_Object ==101)	VColor.rgb =sign(sin(VP.x) *sin(VP.z)) *0.1 +vec3(1);
	if(ID_Object ==102)	VColor.rgb =sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VP.w) *0.1 +0.9;
	if(ID_Object ==103)	VColor.rgb =sign(sin(VP.z)) *0.3 +vec3(0.7);

	/*シェーディング等の効果を記述*/

	if(false){	/*光源シェーディング*/
		VColor.rgb *=dot(SM.V3NormalLine, normalize(V3P_Light))*0.5 +0.5;
	}

	if(true){	/*縁取シェーディング*/
		VColor.rgb *=1.0 -SM.nLoop *2.0;
	}

	if(false){	/*影*/
		if(SM.bTouch){
			float nShadow;
			smarch SM_Shadow =fSMRayMarch(SM.V3P, normalize(V3P_Light -SM.V3P), 1.0);
			nShadow =1.0 -clamp(SM_Shadow.nDistance_Min, 0.0, 1.0);
			if(SM_Shadow.bTouch)	nShadow =1.0;
			VColor.rgb -=nShadow *0.25;
		}
	}

	SF.VColor =VColor;
	return SF;
}

void fCameraSet(vec2 V2UV, out vec3 V3P, out vec3 V3D){
	V3P =VP_DefaultCamera.xyz;
	V3P.xy +=VMouse.xy *vec2(8,-8);
	V3P.zy *=fM2Rotate(+VMouse.y -0.25);
	V3P.zx *=fM2Rotate(-VMouse.x *4.0);

	V3P.z +=nTime *2.0;

	V3D =normalize(vec3(V2UV, 1));
	V3D.zy *=fM2Rotate(+VMouse.y);
	V3D.zx *=fM2Rotate(-VMouse.x *4.0);
}

vec4 fVMain(vec2 V2UV){
	vec3 V3Camera, V3Direction;
	fCameraSet(V2UV, V3Camera, V3Direction);

	SF_Default =fSFSet_Default();
	vec4 VColor =vec4(1);

	{
		smarch SM =fSMRayMarch(V3Camera, V3Direction, 0.0);

		sface SF =SF_Default;

		if(SM.bTouch){
			SF =fSFEffect(SM, SF);
	

