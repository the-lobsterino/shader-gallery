//R050624作例　バニー祭り　by ニシタマオ　＆　宦官
//サンドボックス上での試験用、簡易レイトレシステム、反射・屈折、ぼかし影、カラーパレット機能付（R050525版）
//直近の改修：数字機能追加、関数整理、注釈追加、ロドリゲス回転行列
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

float nTime =mod(time *1.0, 1000.0);
vec4 VMouse =vec4((mouse -0.5) *vec2(1,-1), 0, 0);

const bool cbSetting_March2nd_Reflect =false;	//反射
const bool cbSetting_March2nd_Refract =false;	//屈折
const bool cbSetting_CeilFloor =true;	//床天井
const bool cbSetting_Back =false;	//背景
const bool cbSetting_Front =true;	//手前

const bool cbSetting_Effect1st_Before =true;	//特殊効果（基本）
const bool cbSetting_Effect2nd_Reflect_Before =true;	//同、反射
const bool cbSetting_Effect2nd_Refract_Before =true;	//同、屈折

const bool cbSetting_Effect1st_After =true;	//特殊効果（応用）
const bool cbSetting_Effect2nd_Reflect_After =true;	//同、反射
const bool cbSetting_Effect2nd_Refract_After =true;	//同、屈折

const bool cbSetting_Refrax =false;	//屈折率
const bool cbSetting_Preprocess =false;	//前処理

vec4 VP_Camera_Default =vec4(0, 2,-12, 0);	//視点

const int ciDefinition =200;
float cnMarchStepAdjust_Default =0.5;
float cnMarchStepLimit_Default =1e+6;
float nSetting_CeilFloor_Default =0.25;

vec4 VMisc00, VMisc01, VMisc02, VMisc03;
vec4 aVMisc00[16],aVMisc01[16],aVMisc02[16],aVMisc03[16];

struct sface{	//表面情報構造体
	float nDistance;
	vec4 VColor;
	vec3 V3Real_Reflect_Refract;
	float nRefrax;
	int ID_Object;
	int ID_Pallet;
	vec4 VP;
	vec4 VMisc00, VMisc01, VMisc02, VMisc03;

	int ID_Muscle;
	vec4 VP_Muscle, VR_Muscle;
};

sface SF_Default;

//表面情報構造体初期化・設定
sface fSFSet_Default(void){
	sface SF;
	SF.VColor =vec4(1);
	SF.nDistance =1e+6;
	SF.V3Real_Reflect_Refract =vec3(1);
	SF.nRefrax =0.75;
	return SF;
}

sface fSFSet_Default(float nDistance){
	sface SF =fSFSet_Default();
	SF.nDistance =nDistance;
	return SF;
}

sface fSFSet_Default(float nDistance, vec4 VP, int ID_Object, int ID_Pallet){
	sface SF =fSFSet_Default();
	SF.nDistance =nDistance, SF.VP =VP, SF.ID_Object =ID_Object, ID_Pallet =ID_Pallet;
	return SF;
}

struct smarch{	//レイマーチング情報構造体
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

//表面情報構造体比較・制御
sface fSFMin(sface SF0, sface SF1){
	if(SF0.nDistance < SF1.nDistance){
		return SF0;
	}else{
		return SF1;
	}
}

sface fSFMin(sface SF0, sface SF1, float nK){

	sface SF =fSFMin(SF0, SF1);

	float nP0 =SF0.nDistance, nP1 =SF1.nDistance;
	float nH =exp(-nP0 *nK) +exp(-nP1 *nK);
	float nP =-log(nH) /nK;
	SF.nDistance = nP;

	if(true){	//色彩、反射・屈折率モチャモチャ合成、パレット非使用時のみ対応
		float nFusion =abs(nP -nP0) /(abs(nP -nP0) +abs(nP -nP1));
		SF.VColor =mix(SF0.VColor, SF1.VColor, nFusion);
		SF.V3Real_Reflect_Refract =mix(normalize(SF0.V3Real_Reflect_Refract), normalize(SF1.V3Real_Reflect_Refract), nFusion);
		SF.nRefrax =mix(SF0.nRefrax, SF1.nRefrax, nFusion);
	}
	return SF;
}

//回転行列
mat3 fM3RotateX(float nR){	return mat3( 1, 0, 0, 0, cos(nR),-sin(nR), 0, sin(nR), cos(nR));}
mat3 fM3RotateY(float nR){	return mat3( cos(nR), 0, sin(nR), 0, 1, 0,-sin(nR), 0, cos(nR));}
mat3 fM3RotateZ(float nR){	return mat3( cos(nR),-sin(nR), 0, sin(nR), cos(nR), 0, 0, 0, 1);}
mat3 fM3Rotate(vec3 V3R){	mat3 M3R =mat3(1,0,0, 0,1,0, 0,0,1);	M3R *=fM3RotateZ(V3R.z);	M3R *=fM3RotateX(V3R.x);	M3R *=fM3RotateY(V3R.y);	return M3R;}
mat2 fM2Rotate(float nR){	return mat2( cos(nR),-sin(nR), sin(nR), cos(nR));}

mat3 fM3Rodrigues(vec4 VAxisR){
	VAxisR.xyz =normalize(VAxisR.xyz);
	float  nS =sin(VAxisR.w), nC =cos(VAxisR.w), nCC =1.0 -nC;
	float nX =VAxisR.x, nY =VAxisR.y, nZ =VAxisR.z;
	float nXX =nX *nX, nYY =nY *nY, nZZ =nZ *nZ;
	float nXY =nX *nY, nYZ =nY *nZ, nZX =nZ *nX;
	mat3 M3R =mat3(
		nXX *nCC +nC,	nXY *nCC -nZ *nS,	nZX *nCC +nY *nS,
		nXY *nCC +nZ *nS,	nYY *nCC +nC,	nYZ *nCC -nX *nS,
		nZX *nCC -nY *nS,	nYZ *nCC +nX *nS,	nZZ *nCC +nC
	);
	return M3R;
}

vec4 fVAxisRX(vec3 V3P0, vec3 V3P1){
	vec3 V3D =V3P1 -V3P0;
	vec4 VAxisR;
	VAxisR.yz =V3D.zy *vec2(+1,-1);
	VAxisR.w =atan(length(V3D.yz), V3D.x);
	return VAxisR; 
}
//数値比較・制御
float fNMin(float nP1, float nP2, float nK){	float nH =exp(-nP1 *nK) +exp(-nP2 *nK);	nH = -log(nH) /nK;	return nH;}
float fNMin(float nP1, float nP2){	return min(nP1, nP2);}
float fNMin(float nP1, float nP2, inout int ID, int ID_New){	if(nP1 >nP2)	ID =ID_New;	return min(nP1, nP2);}

//シーケンサー
int fISequencer(int iCycle, int iSQ, float nTime){	return	int(mod(nTime, float(iCycle)) /float(iCycle) *float(iSQ));}
int fISequencer(int iCycle, int iSQ){	return	fISequencer(iCycle, iSQ, nTime);}

//乱数等
vec4 fVN(float nP){	vec4 VCycle =vec4( 11 *13 *17, 11 *13, 11, 1);	vec4 VLS =fract(VCycle *nP);	return VLS;}
float fNRandom(vec2 V2P){    return fract(sin(dot(V2P +1e2,vec2(12.9898,78.233))) * 43758.5453);}
float fNRandom(vec3 V3P){    return fNRandom(vec2(fNRandom(V3P.xy), V3P.z));}
float fNRandom(float nP){    return fNRandom(vec2(nP,1));}
float fNRandom(int   iP){    return fNRandom(vec2(iP,1));}
float nRandomSequencialSeed;
float fNRandomSequencial(float nSeed){	nRandomSequencialSeed =nSeed;	float nRandom =fNRandom(nRandomSequencialSeed);	return nRandom;}
float fNRandomSequencial(void){	nRandomSequencialSeed =fract(nRandomSequencialSeed *2.13);	float nRandom =fNRandom(nRandomSequencialSeed);	return nRandom;}

//文字列形状生成機能（R050511版）
vec3 fV3LL(vec4 VP, vec4 VA, vec4 VB){	//２点間ベクトル
	float nRadius =VA.w;
	vec3 V3PA =VP.xyz -VA.xyz, V3BA =VB.xyz -VA.xyz;
	float nA =clamp(dot(V3PA, V3BA) /dot(V3BA, V3BA), 0.0, 1.0);
	vec3 V3P =V3PA -V3BA *nA;
	return V3P;
}

float fNLL(vec4 VP, vec4 VA, vec4 VB){	//同、図形
	float NP, nRadius =VA.w;
	vec3 V3P =fV3LL(VP, VA, VB);

	/*線分の形状*/
	NP =length(V3P) -nRadius *0.5;

	return NP;
}

//数字部
bool fBSegment(int iNumber, int iSegment){
	bool bSegment;
	if(iSegment ==1) bSegment = iNumber !=1 && iNumber !=4;
	if(iSegment ==2) bSegment = iNumber !=1 && iNumber !=7 && iNumber !=0;
	if(iSegment ==3) bSegment = iNumber !=1 && iNumber !=4 && iNumber !=7;
	if(iSegment ==4) bSegment = iNumber !=1 && iNumber !=2 && iNumber !=3 && iNumber !=7;
	if(iSegment ==5) bSegment = iNumber ==2 || iNumber ==6 || iNumber ==8 || iNumber ==0;
	if(iSegment ==6) bSegment = iNumber !=5 && iNumber !=6;
	if(iSegment ==7) bSegment = iNumber !=2;
	return bSegment;
}

float fNDigit(vec4 VP, int iDigit, vec2 V2E){
	vec2 aV2P0[8],aV2P1[8];
	aV2P0[1] =vec2(-1,-1), 	aV2P1[1] =vec2(+1,-1);
	aV2P0[2] =vec2(-1, 0), 	aV2P1[2] =vec2(+1, 0);
	aV2P0[3] =vec2(-1,+1), 	aV2P1[3] =vec2(+1,+1);
	aV2P0[4] =vec2(-1,-1), 	aV2P1[4] =vec2(-1, 0);
	aV2P0[5] =vec2(-1, 0), 	aV2P1[5] =vec2(-1,+1);
	aV2P0[6] =vec2(+1,-1), 	aV2P1[6] =vec2(+1, 0);
	aV2P0[7] =vec2(+1, 0), 	aV2P1[7] =vec2(+1,+1);
	float NP =1e+6, nRadius =min(V2E.x, V2E.y) *0.25;

	for(int I =1; I <8; I++){
		if(fBSegment(iDigit, I)){
			vec4 VA,VB;
			VA.xy =aV2P0[I], VB.xy =aV2P1[I];
			VA.xy *=V2E *vec2(1,-1), VB.xy *=V2E *vec2(1,-1);
			VA.w =VB.w =nRadius;
			NP =min(NP, fNLL(VP, VA, VB));
		}
	}
	return NP;
}

float fNumber(vec4 VP, float nNumber, vec2 V2E){
	nNumber =abs(nNumber);
	float NP =1e+6;
	for(int I =0; I <3; I++){
		vec4 VP =VP;
		VP.x +=V2E.x *float(I) *2.5;

		int iDigit =int(mod(nNumber *pow(10.0,-float(I)), 10.0));
		NP =min(NP, fNDigit(VP, iDigit, V2E));
	}
	return NP;
}

float Number_Default;
float fNumber(vec4 VP, vec2 V2E){	return fNumber(VP, Number_Default, V2E);}
float fNumber(vec4 VP){	return fNumber(VP, vec2(1));}

//自由文字部
float fNLetters00(vec4 VP){
	float NP =1e+6;
		{ float nE =float(1);  vec3 V3C =vec3(2.5,2.5,1) *nE,  V3D =vec3(5,0,0) *nE, V3P;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(-1,2) *nE; VB.xy =vec2(-2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,2) *nE; VB.xy =vec2(2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,3) *nE; VB.xy =vec2(2,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,3) *nE; VB.xy =vec2(3,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(-1,2) *nE; VB.xy =vec2(1,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2) *nE; VB.xy =vec2(2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(-2,0) *nE; VB.xy =vec2(2,0) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(-2,0) *nE; VB.xy =vec2(0,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,2) *nE; VB.xy =vec2(-1,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,2) *nE; VB.xy =vec2(-2,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1) *nE; VB.xy =vec2(-1.5,0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,2) *nE; VB.xy =vec2(-1,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,2) *nE; VB.xy =vec2(-2,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1) *nE; VB.xy =vec2(-1.5,0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,2) *nE; VB.xy =vec2(-2,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1) *nE; VB.xy =vec2(-1.5,0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1) *nE; VB.xy =vec2(-1.5,0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,1.5) *nE; VB.xy =vec2(-1,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,2) *nE; VB.xy =vec2(2,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2) *nE; VB.xy =vec2(0.5,0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2) *nE; VB.xy =vec2(0.5,0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1.5) *nE; VB.xy =vec2(2,0) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,0) *nE; VB.xy =vec2(1,0) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-0.5) *nE; VB.xy =vec2(1.5,-0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-0.5) *nE; VB.xy =vec2(0,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5) *nE; VB.xy =vec2(-2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-1.5) *nE; VB.xy =vec2(2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(-2,2) *nE; VB.xy =vec2(-2,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2) *nE; VB.xy =vec2(1,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D;}

	return NP;
}
//文字機能ここまで

//熊体形状生成機能、中割機能付（R050525版）by ニシタマオ
//	主要関数（R050525版）
struct sskelton{	//骨格・関節構造体
	vec4 VP_Cntr, VP_Body, VP_Shld, VP_Neck, VP_Head, VP_ArRU, VP_ArLU, VP_ArRL, VP_ArLL, VP_LeRU, VP_LeLU, VP_LeRL, VP_LeLL, VP_HndR, VP_HndL, VP_FotR, VP_FotL;
	vec4 VR_Cntr, VR_Body, VR_Shld, VR_Neck, VR_Head, VR_ArRU, VR_ArLU, VR_ArRL, VR_ArLL, VR_LeRU, VR_LeLU, VR_LeRL, VR_LeLL, VR_HndR, VR_HndL, VR_FotR, VR_FotL;

	vec4 VP;
	vec4  VMisc00, VMisc01, VMisc02, VMisc03;
	float nMisc00, nMisc01, nMisc02, nMisc03;
	vec4 VP_Offset, VR_Offset;
};

sskelton SS_Default;

sskelton fSSkeltonMake(sskelton SS){	//骨格・関節の計算
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

	vec3 V3R =SS.VR_Cntr.xyz;
	SS.VR_Body.xyz +=V3R;
	SS.VR_Shld.xyz +=V3R;
	SS.VR_Neck.xyz +=V3R;
	SS.VR_Head.xyz +=V3R;
	SS.VR_ArRU.xyz +=V3R;
	SS.VR_ArLU.xyz +=V3R;
	SS.VR_LeRU.xyz +=V3R;
	SS.VR_LeLU.xyz +=V3R;
	SS.VR_ArRL.xyz +=V3R;
	SS.VR_ArLL.xyz +=V3R;
	SS.VR_LeRL.xyz +=V3R;
	SS.VR_LeLL.xyz +=V3R;
	SS.VR_HndR.xyz +=V3R;
	SS.VR_HndL.xyz +=V3R;
	SS.VR_FotR.xyz +=V3R;
	SS.VR_FotL.xyz +=V3R;

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

	SS.VP_FotR.xyz *=fM3Rotate(SS.VR_LeRL.xyz);
	SS.VP_FotL.xyz *=fM3Rotate(SS.VR_LeLL.xyz);

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

	SS_Default =SS;
	return SS;
}

sskelton fSSChange_Inbetween(sskelton SSP, sskelton SSN, float nIB){	//中割
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

void fExchangeV(inout vec4 VR, inout vec4 VL){	//交換
	vec4 Vtmp =VR;
	VR =VL, VL =Vtmp;
} 

sskelton fSSChange_MirrorX(sskelton SS){	//左右反転
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

sskelton fSSRChange_Multiple(sskelton SS, vec4 VD){	//倍率
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

sskelton fSSRChange_Multiple(sskelton SS, float nD){	//同上、その２
	return fSSRChange_Multiple(SS, vec4(nD, nD, nD, 1));
}

sskelton fSSRChange_Radians(sskelton SS){	//弧度法→円周法
	SS.VR_Cntr.xyz =radians(SS.VR_Cntr.xyz);
	SS.VR_Body.xyz =radians(SS.VR_Body.xyz);
	SS.VR_Shld.xyz =radians(SS.VR_Shld.xyz);
	SS.VR_Neck.xyz =radians(SS.VR_Neck.xyz);
	SS.VR_Head.xyz =radians(SS.VR_Head.xyz);
	SS.VR_ArRU.xyz =radians(SS.VR_ArRU.xyz);
	SS.VR_ArLU.xyz =radians(SS.VR_ArLU.xyz);
	SS.VR_ArRL.xyz =radians(SS.VR_ArRL.xyz);
	SS.VR_ArLL.xyz =radians(SS.VR_ArLL.xyz);
	SS.VR_LeRU.xyz =radians(SS.VR_LeRU.xyz);
	SS.VR_LeLU.xyz =radians(SS.VR_LeLU.xyz);
	SS.VR_LeRL.xyz =radians(SS.VR_LeRL.xyz);
	SS.VR_LeLL.xyz =radians(SS.VR_LeLL.xyz);
	SS.VR_HndR.xyz =radians(SS.VR_HndR.xyz);
	SS.VR_HndL.xyz =radians(SS.VR_HndL.xyz);
	SS.VR_FotR.xyz =radians(SS.VR_FotR.xyz);
	SS.VR_FotL.xyz =radians(SS.VR_FotL.xyz);
	return SS;
}

//アタッチ・ホールド
vec3 fV3Attach(vec3 V3P, vec3 V3S, vec3 V3R, vec3 V3Ratio){
	return (V3P -V3S) *fM3Rotate(-V3R *V3Ratio);
}
vec3 fV3Attach(vec3 V3P, vec3 V3S, vec3 V3R){
	vec3 V3Ratio =vec3(1);
	return fV3Attach(V3P, V3S, V3R, V3Ratio);
}

vec3 fV3Hold(vec3 V3P, vec3 V3S, vec3 V3R, vec3 V3Ratio){
	return V3P *fM3Rotate(V3R *V3Ratio) +V3S;
}

vec3 fV3Hold(vec3 V3P, vec3 V3S, vec3 V3R){
	vec3 V3Ratio =vec3(1);
	return fV3Hold(V3P, V3S, V3R, V3Ratio);
}

//計算直後処理
vec3 fV3Attach_HndR(vec3 V3P){	return fV3Attach(V3P, SS_Default.VP_HndR.xyz, SS_Default.VR_HndR.xyz);}
vec3 fV3Attach_HndL(vec3 V3P){	return fV3Attach(V3P, SS_Default.VP_HndL.xyz, SS_Default.VR_HndL.xyz);}
vec3 fV3Attach_FotR(vec3 V3P){	return fV3Attach(V3P, SS_Default.VP_FotR.xyz, SS_Default.VR_FotR.xyz);}
vec3 fV3Attach_FotL(vec3 V3P){	return fV3Attach(V3P, SS_Default.VP_FotL.xyz, SS_Default.VR_FotL.xyz);}

float fNMin_Muscle(float NP, float nP, inout vec4 VP, inout vec4 VR, inout int ID, vec4 VP_New, vec4 VR_New, int ID_New){
	if(NP >nP){
		ID =ID_New, VP =VP_New, VR =VR_New;
	}
	NP =min(NP, nP);
	return NP;
}

float fNMin_Muscle(float NP, float nP, inout vec4 VP, inout vec4 VR, inout int ID, vec4 VP_New, vec4 VR_New, int ID_New, float nK){
	if(NP >nP){
		ID =ID_New, VP =VP_New, VR =VR_New;
	}
	NP =fNMin(NP, nP, nK);
	return NP;
}

//筋肉部（R050515版）（参考：https://iquilezles.org/articles/distfunctions/）
float fNCapsule(vec4 VP, vec4 VA, vec4 VB){
	float nRadius =VA.w;
	vec3 V3PA =VP.xyz -VA.xyz, V3BA =VB.xyz -VA.xyz;
	float nA =clamp(dot(V3PA, V3BA) /dot(V3BA, V3BA), 0.0, 1.0);
	vec3 V3P =V3PA -V3BA *nA;
	return length(V3P) -nRadius;
}

float fNMusclePart02(vec4 VP, vec4 VA, vec4 VB){
	return fNCapsule(VP, VA, VB);
}

float fNMuscle_Animal01(sskelton SS){
	vec4 VP =SS.VP, VA, VB;
	float NP =1e+6, nK =12.0;

	VA =SS.VP_Body, VB =SS.VP_Shld;
	NP =fNMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_Neck, VB =SS.VP_Head;
	NP =fNMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_ArRU, VB =SS.VP_ArRL;
	NP =fNMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_ArRL, VB =SS.VP_HndR;
	NP =fNMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_ArLU, VB =SS.VP_ArLL;
	NP =fNMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_ArLL, VB =SS.VP_HndL;
	NP =fNMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_LeRU, VB =SS.VP_LeRL;
	NP =fNMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_LeRL, VB =SS.VP_FotR;
	NP =fNMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_LeLU, VB =SS.VP_LeLL;
	NP =fNMin(NP, fNMusclePart02(VP, VA, VB), nK);
	VA =SS.VP_LeLL, VB =SS.VP_FotL;
	NP =fNMin(NP, fNMusclePart02(VP, VA, VB), nK);
	return NP;
}

//小物部
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

float fNAttachment_HeadBunny01(vec4 VP){
	float NP =1e+6, nA =1.0;
	{
		vec3 V3P =VP.xyz;
		float nPP;
		nPP =length(V3P) -1.0 *nA;
		NP =min(NP, nPP);			
		nPP =length(V3P -vec3(0,0,-1) *nA) -0.5 *nA;
		NP =min(NP, nPP);			
		nPP =length(V3P -vec3(0,0.3,-1.4) *nA) -0.2 *nA;
		NP =min(NP, nPP);			
		nPP =length(vec3(abs(V3P.x), V3P.yz) -vec3(0.4,0.5,-0.7) *nA) -0.15 *nA;
		NP =min(NP, nPP);			
	}
	{
		float nPi =1e+6, nR =0.3;
		vec3 V3P =VP.xyz;
		V3P.x =abs(V3P.x);
		V3P -=vec3(0.6,0.6,0.4) *nA;

		V3P *=vec3(0.4,0.5,3);
		V3P.xy =vec2(V3P.x *2.0 -V3P.y, V3P.x *2.0 +V3P.y);
		V3P.yz =vec2(V3P.y +V3P.z *0.2, -V3P.y +V3P.z *0.2);
		if(V3P.y >=0.0)	nPi =length(V3P.zx) -nR *nA;
		if(V3P.y <=0.0)	nPi =length(V3P) -nR *nA;
		V3P.y -=2.0 *nA;
		if(V3P.y >=0.0)	nPi =length(V3P) -nR *nA;
		NP =min(NP, nPi);			

	}
	return NP;
}

//衣装部
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


float fNOutfit_Bunny01(sskelton SS){
	float NP =1e+6;
	vec4 VP =SS.VP;
	VP.xyz *=fM3Rotate(SS.VR_Cntr.xyz);

	{
		vec3 V3P =fV3Attach(VP.xyz, SS.VP_Head.xyz, SS.VR_Head.xyz);
		float nPi;
		nPi =fNAttachment_HeadBunny01(vec4(V3P, VP.w));
		NP =min(NP, nPi);
	}

	{
		vec3 V3P =fV3Attach(VP.xyz, SS.VP_Body.xyz, SS.VR_Body.xyz);
		float nPi;
		nPi =length(V3P -vec3(0,-0.6,1)) -0.4;
		NP =min(NP, nPi);
	}

	{
		vec3 V3P =fV3Attach(VP.xyz, SS.VP_FotR.xyz, SS.VR_FotR.xyz);
		float nPi =1e+6, nR =0.3;
		if(V3P.z <=0.0)	nPi =length(V3P.xy) -nR;
		if(V3P.z >=0.0)	nPi =length(V3P.xyz) -nR;
		V3P.z +=1.25;
		if(V3P.z <=0.0)	nPi =length(V3P.xyz) -nR;
		NP =min(NP, nPi);
	}

	{
		vec3 V3P =fV3Attach(VP.xyz, SS.VP_FotL.xyz, SS.VR_FotL.xyz);
		float nPi =1e+6, nR =0.3;
		if(V3P.z <=0.0)	nPi =length(V3P.xy) -nR;
		if(V3P.z >=0.0)	nPi =length(V3P.xyz) -nR;
		V3P.z +=1.25;
		if(V3P.z <=0.0)	nPi =length(V3P.xyz) -nR;
		NP =min(NP, nPi);
	}

	return NP;
}

//骨格部

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
	SS.VP_HndR =vec4(0,	-1,	0,	0.25);
	SS.VP_HndL =vec4(0,	-1,	0,	0.25);
	SS.VP_FotR =vec4(0,	-1,	0,	0.35);
	SS.VP_FotL =vec4(0,	-1,	0,	0.35);
	return SS;
}

sskelton fSSPSet_Bunny01(sskelton SS){
	SS.VP_Cntr;
	SS.VP_Body =vec4(0,	0,	0,	1);
	SS.VP_Shld =vec4(0,	1.5,	0,	0);
	SS.VP_Neck =vec4(0,	0,	0,	0.7);
	SS.VP_Head =vec4(0,	1.5,	0,	0);
	SS.VP_ArRU =vec4(+0.8,	0,	0,	0.4);
	SS.VP_ArLU =vec4(-0.8,-	0,	0,	0.4);
	SS.VP_ArRL =vec4(0,	-0.9,	0,	0.3);
	SS.VP_ArLL =vec4(0,	-0.9,	0,	0.3);
	SS.VP_LeRU =vec4(+0.6,	0,	0,	0.45);
	SS.VP_LeLU =vec4(-0.6,	0,	0,	0.45);
	SS.VP_LeRL =vec4(0,	-1,	0,	0.4);
	SS.VP_LeLL =vec4(0,	-1,	0,	0.4);
	SS.VP_HndR =vec4(0,	-0.9,	0,	0);
	SS.VP_HndL =vec4(0,	-0.9,	0,	0);
	SS.VP_FotR =vec4(0,	-1,	0,	0);
	SS.VP_FotL =vec4(0,	-1,	0,	0);
	return SS;
}

//関節部
sskelton fSSRSet_Bear01(sskelton SS){
	float nS =sin(SS.VP.w *acos(-1.0)), nSL =sin((SS.VP.w +30.0/180.0)*acos(-1.0));
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

	SS =fSSRChange_Radians(SS);

	SS.VP_Cntr.y =+sin((SS.VP.w -60.0/180.0) *acos(-1.0));
	return SS;
}

sskelton fSSRSet_VolleyBunny01P(sskelton SS){
	float nD =acos(-1.0) /180.0;
	SS.VR_Cntr;
	SS.VR_Body =vec4(-115,	0,	0,	0);
	SS.VR_Shld =vec4(0,	0,	0,	0);
	SS.VR_Neck =vec4(-45,	0,	0,	1);
	SS.VR_Head =vec4(0,	0,	0,	1);
	SS.VR_ArRU =vec4(+30,	0,	-15,	1);
	SS.VR_ArLU =vec4(+30,	0,	+15,	1);
	SS.VR_ArRL =vec4(+15,	0,	0,	1);
	SS.VR_ArLL =vec4(+15,	0,	0,	1);
	SS.VR_LeRU =vec4(+30,	0,	+15,	0);
	SS.VR_LeLU =vec4(+30,	0,	-15,	0);
	SS.VR_LeRL =vec4(-45,	0,	0,	1);
	SS.VR_LeLL =vec4(-45,	0,	0,	1);
	SS.VR_HndR =vec4(0,	0,	0,	1);
	SS.VR_HndL =vec4(0,	0,	0,	1);
	SS.VR_FotR =vec4(-15,	0,	0,	0);
	SS.VR_FotL =vec4(-15,	0,	0,	0);

	SS =fSSRChange_Multiple(SS, nD);

	return SS;
}

sskelton fSSRSet_VolleyBunny01N(sskelton SS){
	float nD =acos(-1.0) /180.0;
	SS.VR_Cntr;
	SS.VR_Body =vec4(-30,	0,	0,	0);
	SS.VR_Shld =vec4(0,	0,	0,	0);
	SS.VR_Neck =vec4(+15,	0,	0,	1);
	SS.VR_Head =vec4(0,	0,	0,	1);
	SS.VR_ArRU =vec4(+120,	0,	-15,	1);
	SS.VR_ArLU =vec4(+120,	0,	+15,	1);
	SS.VR_ArRL =vec4(+15,	0,	0,	1);
	SS.VR_ArLL =vec4(+15,	0,	0,	1);
	SS.VR_LeRU =vec4(-15,	0,	+5,	0);
	SS.VR_LeLU =vec4(-15,	0,	-5,	0);
	SS.VR_LeRL =vec4(-30,	0,	0,	1);
	SS.VR_LeLL =vec4(-30,	0,	0,	1);
	SS.VR_HndR =vec4(0,	0,	0,	1);
	SS.VR_HndL =vec4(0,	0,	0,	1);
	SS.VR_FotR =vec4(-60,	0,	0,	0);
	SS.VR_FotL =vec4(-60,	0,	0,	0);

	SS =fSSRChange_Multiple(SS, nD);

	return SS;
}

//総体部
float fNObject_WalkBear01(vec4 VP){
	sskelton SS;
	VP.y -=3.0;
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


float fNObject_VolleyBunny01(vec4 VP){
	sskelton SS;
	SS.VP =VP;
	SS =fSSPSet_Bunny01( SS);

	sskelton SSP =fSSRSet_VolleyBunny01P( SS), SSN =fSSRSet_VolleyBunny01N( SS);

	SSP.VP_Cntr.z +=1.0;
	SSN.VP_Cntr.y +=1.0;

	SS =fSSChange_Inbetween(SSP, SSN, sin(VP.w *acos(-1.0) *2.0));
	SS =fSSkeltonMake( SS);

	float NP, nPP;
	NP =fNMuscle_Animal01(SS);

	nPP =fNOutfit_Bunny01(SS);
	NP =min(NP, nPP);

	return NP;
}

/*自動車（R050424版）*/
float fNGame_Road00(vec2 V2P){
	float nSpan =2E+1, nHeight =8.0, nRoad, nA =1.0, nT;
	if(false) nT =nTime *0.1;
	for(int I =1; I <=3; I++){
		vec2 V2Pi = V2P *nA /nSpan;
		if(true)	V2Pi *=fM2Rotate(nA +nT);
		nRoad +=abs(dot(sin(V2Pi), vec2(1))) /nA;
		nA *=2.0;
	}
	nRoad =nRoad *nHeight;
	return nRoad;
}

float fNGame_Road01(vec2 V2P){
	float nHeight =fNGame_Road00(V2P) -12.0;
	return nHeight;
}

float fNGame_Road01(vec3 V3P){
	vec2 V2P =V3P.xz;
	return fNGame_Road01(V2P);
}

/*ここまで*/

//簡易レイマーチング機構（R050512版）ここから
void fPreprocess(void){}	//前処理

vec3 fV3Pallet_Color_Default(int ID){
	vec3 V3C =vec3(1);
	if(ID ==  1) V3C =vec3(0.75,	0,	0);
	if(ID ==  2) V3C =vec3(1,	0,	0);
	if(ID ==  3) V3C =vec3(1,	0.75,	0);
	if(ID ==  4) V3C =vec3(1,	1,	0);
	if(ID ==  5) V3C =vec3(0,	1,	0);
	if(ID ==  6) V3C =vec3(0,	0,	1);
	if(ID ==  7) V3C =vec3(1,	0,	1);
	if(ID ==  8) V3C =vec3(0.5);
	if(ID ==  9) V3C =vec3(1);
	if(ID == 10) V3C =vec3(0);
	return V3C;
}

float fNMap(vec3 V3P){
	vec4 VP =vec4(V3P, nTime);
	float NP =1e+6;

	sface SF =fSFSet_Default();

	if(true){
		vec4 VP =VP;
		VP.zx =mod(VP.zx, 32.0) -16.0;
		int iSQ =fISequencer(40,2);
		if(iSQ ==0){	/*バニーズ*/
			vec4 VPi =VP;
			VPi.xz =VPi.zx;
			VPi.y -=2.0;
			VPi.w *=0.25;
			VPi.w +=sign(VPi.z) *0.25;
			VPi.z =abs(VPi.z) -8.0;

			float nPi =fNObject_VolleyBunny01(VPi);

			sface SFi =fSFSet_Default();
			SFi.nDistance =nPi;
			SFi.ID_Object =14;
			SFi.VP =VP;
			SF =fSFMin(SF, SFi);
		}

		if(iSQ ==1){	/*バニーズ*/
			int iMirage =5;
			vec4 VPi =VP;
			VPi.y -=2.0;
			VPi.w *=0.25;
			float nTh =atan(VPi.z, VPi.x), nL =length(VPi.zx);
			float nTh_Mod =mod(nTh, acos(-1.0) *2.0 /float(iMirage)) -acos(-1.0) /float(iMirage), nTh_Dom =nTh -nTh_Mod;
			VPi.zx =vec2(cos(nTh_Mod), sin(nTh_Mod)) *nL;
			VPi.z -=8.0;

			VPi.w +=nTh_Dom /acos(-1.0) /2.0 *float(iMirage);
			float nW_Mod =mod(VPi.w *2.0 +1.0, float(iMirage));

			VPi.w =+0.25;
			if(nW_Mod >0.0 && nW_Mod <2.0)	VPi.w +=nW_Mod /2.0;

			float nPi =fNObject_VolleyBunny01(VPi);

			sface SFi =fSFSet_Default();
			SFi.nDistance =nPi;
			SFi.ID_Object =13;
			SFi.VP =VP;
			SF =fSFMin(SF, SFi);
		}

		if(iSQ ==0){	/*ボール*/
			vec4 VPi =VP.zyxw;
			VPi.y -=2.0;
			VPi.w *=0.25;

			VPi.w =(fract(VPi.w) -0.5 <0.0)? fract(VPi.w) *2.0: 1.0 -(fract(VPi.w) -0.5) *2.0;
			VPi.z +=mix(+5.0, -5.0, VPi.w);
			VPi.y +=pow(VPi.w -0.5, 2.0) *16.0 -6.5 -1.5;

			float nPi =length(VPi.xyz) -1.5;

			VPi.yz *=fM2Rotate((-VPi.w +0.5) *acos(-1.0) *2.0);
			VPi =VPi.xzyw;
//			nPi =fNObject_Zirconium17(VPi);

			sface SFi =fSFSet_Default(nPi);
			SFi.ID_Object =21;
			SFi.ID_Pallet =9;
			SFi.VP =VPi;
			SF =fSFMin(SF, SFi);
			VMisc00 =VPi;
		}

		if(iSQ ==1){	/*ボール*/
			vec4 VPi =VP.zyxw;
			VPi.y -=2.0;
			VPi.w *=0.25;

			if(true){
				VPi.xz *=fM2Rotate(-VPi.w *acos(-1.0) *2.0 /5.0);
			}

			VPi.w =(fract(VPi.w) -0.5 <0.0)? fract(VPi.w) *2.0: 1.0 -(fract(VPi.w) -0.5) *2.0;
			VPi.z +=mix(+5.0, -5.0, VPi.w);
			VPi.y +=pow(VPi.w -0.5, 2.0) *16.0 -6.5 -1.5;

			float nPi =length(VPi.xyz) -1.5;

			VPi.yz *=fM2Rotate((-VPi.w +0.5) *acos(-1.0) *2.0);
			VPi =VPi.xzyw;
//			nPi =fNObject_Zirconium17(VPi);

			sface SFi =fSFSet_Default(nPi);
			SFi.ID_Object =21;
			SFi.ID_Pallet =9;
			SFi.VP =VPi;
			SF =fSFMin(SF, SFi);
			VMisc00 =VPi;
		}
	}

	if(false){

		vec4 VPi =VP;
		VPi.xz +=vec2(1,4) *VPi.w;
		vec2 V2P_Mod =mod(VPi.xz, vec2(24)) -vec2(12), V2P_Dom =VP.xz -V2P_Mod, V2P_DomC =VPi.xz -V2P_Mod;

		VPi.xz =V2P_Mod;
		VPi.y -=fNGame_Road01(V2P_Dom);

		VPi.y -=2.0;
		float nPi =fNObject_WalkBear01(VPi);

		sface SFi =fSFSet_Default(nPi);
		SFi.ID_Object =52;
		SFi.VP =VPi;
		SFi.VMisc00.xz =V2P_DomC;
		SF =fSFMin(SF, SFi);
	}

	if(false){	//地面
		float nPi =VP.y -fNGame_Road01(VP.xz);
		sface SFi =fSFSet_Default(nPi);
		SFi.ID_Object =101;
		SF =fSFMin(SF, SFi);
	}

	if(true){	/*水面*/
		float nPi =VP.y +(sin(VP.x +sin(VP.z *0.5 +VP.w)) +sin(VP.z +sin(VP.x *0.5 +VP.w))) *0.01;
		nPi =abs(nPi) -0.5;
		vec4 VPi =VP;

		sface SFi =fSFSet_Default(nPi);
		SFi.ID_Object =101;
		SFi.VP =VP;
		SF =fSFMin(SF, SFi, 4.0);
	}

	NP =min(NP, SF.nDistance);
	SF_Default =SF;
	return NP;
}

vec4 fVCeilFloor(vec3 V3P){
	vec4 VP =vec4(V3P /V3P.y, nTime), VColor =vec4(1);
	/*天井と床面の色彩を記述*/

	{
		float nC;
		vec3 V3P =abs(normalize(VP.xyz) *fM3Rotate(vec3(1,10,100) /100.0 *VP.w)) -normalize(vec3(1));
		nC =1e-4 *pow(length(V3P),-4.0);
		VColor.rgb =vec3(1) *nC;
	}

	if(V3P.y <0.0){
		float nC;
		vec2 V2P =VP.xz *4.0;
		V2P -=vec2(0.1,1) *VP.w;
		nC =sign(sin(V2P.x) *sin(V2P.y)) *0.3 +0.7;
		VColor.rgb +=vec3(1) *nC *0.75;
	}else{
		float nC;
		for(int I =0; I <3; I++){
			vec2 V2P =(VP.xz +vec2(0.1,1) *VP.w) *pow(2.0, float(I));

			float nC00, nC10, nC01, nC11;
			nC00 =fNRandom(floor(V2P +vec2(0,0)));
			nC10 =fNRandom(floor(V2P +vec2(1,0)));
			nC01 =fNRandom(floor(V2P +vec2(0,1)));
			nC11 =fNRandom(floor(V2P +vec2(1,1)));

			float nC0, nC1;
			nC0 =mix(nC00, nC01, fract(V2P.y));
			nC1 =mix(nC10, nC11, fract(V2P.y));
			nC +=mix(nC0, nC1, fract(V2P.x)) /float(I +1);
		}
		VColor.rgb +=nC *0.75;
		VColor.rb +=0.25 +vec2(1,-1) *0.25 *sin(VP.w *0.1);
	}

	VColor.rgb +=length(VP.xz) *2e-2;

	/*ここまで*/
	return VColor;
}

vec4 fVBack(vec2 V2UV){
	vec4 VP =vec4(V2UV, 0, nTime), VColor;
	/*背景の色彩を記述*/
	VColor =vec4(0.2);
	if(false){	/*おどろおどろ*/
		vec4 VPi =VP;
		vec2 V2P =VPi.xy *4.0;
		for(int I =0; I <3; I++){
			V2P +=sin(V2P.yx *2.0 +VPi.w *float(I +1)) /float(I +1);
		}
		VColor.rgb =sin(vec3(0,1,2) /3.0 +acos(-1.0) *2.0 +V2P.x) *0.2 +0.8;
	}

	/*ここまで*/
	return VColor;
}

vec4 fVFront(vec2 V2UV, vec4 VColor){
	vec4 VP =vec4(V2UV, 0, nTime);
	if(true){
		vec4 VP =VP;
		VP.y -=0.75;
		VP.xyz *=16.0;
		int iSQ =fISequencer(50,5);
		float nC =fNLetters00(VP);
		if(nC <0.0){
			VColor.rgb +=(sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VP.w) *0.3 +0.7) *clamp(1.0 +2.0 *nC, 0.0, 1.0)* (sin(VP.w) *0.5 +0.5);
		}
	}
	if(true){
		vec4 VP =VP;
		VP.xy -=vec2(1,-0.75);
		float nC =fNumber(VP, nTime, vec2(0.05));
		if(nC <0.0)	VColor.rgb =vec3(1,1,0);
	}


	return VColor;
}

vec3 fV3NormalLine(vec3 V3P){	//法線
	float nNL =fNMap(V3P);
	vec2 V2D =vec2(1, 0) /2560.0;
	float nD =1.0 /2560.0;
	vec3 V3NL =vec3(nNL);
	V3NL -=vec3(fNMap(V3P -V2D.xyy),fNMap(V3P -V2D.yxy),fNMap(V3P -V2D.yyx));
	V3NL =normalize(V3NL);
	return V3NL;
}

smarch fSMRayMarch(vec3 V3P_Start, vec3 V3Direction, float nLength, int iDefinition_Limit){	//レイマーチング
	V3Direction =normalize(V3Direction);
	vec3 V3P;
	float nDistance_Min =1e+6, nAdjust =cnMarchStepAdjust_Default, nDistanceLimit =cnMarchStepLimit_Default;
	bool bTouch;
	int iLoop;
	nLength +=0.02;
	for(int I =0; I <ciDefinition; I++){
		V3P =V3P_Start +V3Direction *nLength;
		float nDistance =fNMap(V3P);
		nDistance =min(abs(nDistance) *nAdjust, nDistanceLimit);
		if(nDistance <0.01){
			bTouch =true;
			break;
		}
		if(I >iDefinition_Limit)	break;
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

sface fSFEffect_Before(sface SF, smarch SM, bvec3 bV3RRR){	//特殊効果（基本）
	if(!SM.bTouch)	return SF;
	vec4 VP =vec4(SM.V3P, nTime);
	vec3 V3NL =SM.V3NormalLine;
	vec3 V3P_Muscle =fV3Attach(SF.VP.xyz, SF.VP_Muscle.xyz, SF.VR_Muscle.xyz);
	float nRandom_Misc00 =fNRandom(SF.VMisc00.xyz);
	vec4 VRandom_Misc00 =fVN(nRandom_Misc00);

//色彩、反射率、屈折率変化
	if(SF.ID_Pallet !=0){	//基本
		SF.VColor.rgb =fV3Pallet_Color_Default(SF.ID_Pallet);
	}

	if(SF.ID_Object ==21){
		SF.VColor.rgb =sign(sin(atan(SF.VP.x, SF.VP.z) *8.0)) *0.5 +vec3(0.5);
	}

	if(SF.ID_Object ==13){
		SF.VColor.rgb =sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +atan(SF.VP.x, SF.VP.z) +VP.w *0.2) *0.3 +0.7;
	}

	if(SF.ID_Object ==14){
		SF.VColor.rgb =sin((vec3(0,1,2) /3.0 +sign(SF.VP.x) /4.0) *acos(-1.0) *2.0 +VP.w *0.2) *0.3 +0.7;
	}

	if(SF.ID_Object ==101){
		SF.VColor.rgb =sign(sin(VP.x *0.25) *sin(VP.z *0.25)) *0.2 +vec3(0.8);
	}

	if(SF.ID_Object ==102){
		SF.VColor.rgb =sin(radians(vec3(0,120,240) +60.0 *VP.w)) *0.5 +0.5;
	}
//一般明暗
	if(true){	//縁取り陰
		SF.VColor.rgb *=1.0 -SM.nLoop;
	}

	return SF;
}

sface fSFEffect_After(sface SF, smarch SM, bvec3 bV3RRR){	//特殊効果（応用）
	if(!SM.bTouch)	return SF;
	vec4 VP =vec4(SM.V3P, nTime);
	vec3 V3NL =SM.V3NormalLine;
	vec3 V3P_Muscle;
	V3P_Muscle =fV3Attach(SF.VP.xyz, SF.VP_Muscle.xyz, SF.VR_Muscle.xyz);
	float fNRandom_Misc00 =fNRandom(SF.VMisc00.xyz);

//応用明暗
	vec3 V3P_Light =vec3(1,1,-1) *32.0;

	if(true && (bV3RRR.x)){	//光源陰（太陽）
		SF.VColor.rgb *=dot(SM.V3NormalLine, normalize(V3P_Light))*0.3 +0.7;
	}

//個別明暗

	if(true){
		vec4 VPi =VMisc00;
		float nL = 4.0 /dot(VPi.xyz,VPi.xyz);
		vec3 V3C =sin(radians(vec3(0,120,240) +45.0 *VP.w)) *0.5 +0.5;
		SF.VColor.rgb +=V3C *nL;
	}

	return SF;
}

void fCameraSet(inout vec3 V3P, inout vec3 V3D){	//カメラ制御
	V3P.xy +=VMouse.xy *vec2(+1,-1) *16.0 +vec2(0,8);
	V3P.zy *=fM2Rotate(+VMouse.y);
	V3P.zx *=fM2Rotate(-VMouse.x *8.0);

	V3P.zx +=vec2(2,1)*nTime;	//視点移動

	V3D.zy *=fM2Rotate(+VMouse.y);
	V3D.zx *=fM2Rotate(-VMouse.x *8.0);
}

vec4 fVMain(vec2 V2UV){	//真メイン
	if(cbSetting_Preprocess)	fPreprocess();

	vec3 V3Camera =VP_Camera_Default.xyz, V3Direction =normalize(vec3(V2UV, 1));
	fCameraSet(V3Camera, V3Direction);

	SF_Default =fSFSet_Default();
	sface SF1st, SF2nd_Reflect, SF2nd_Refract;
	SF1st =SF2nd_Reflect =SF2nd_Refract =SF_Default;

	bool bTouch1st, bTouch2nd_Reflect, bTouch2nd_Refract;
	smarch SM1st, SM2nd_Reflect, SM2nd_Refract;

	{	//一段目（実体）
		smarch SM =fSMRayMarch(V3Camera, V3Direction, 0.0, ciDefinition);

		if(SM.bTouch){
			SF1st =SF_Default;
			if(cbSetting_Effect1st_Before)	SF1st =fSFEffect_Before(SF1st, SM, bvec3(true,false,false));
			if(cbSetting_Effect1st_After)		SF1st =fSFEffect_After(SF1st, SM, bvec3(true,false,false));
		}
		SM1st =SM2nd_Reflect =SM2nd_Refract =SM;
	}

	SF2nd_Reflect =SF2nd_Refract =SF1st;

	if(cbSetting_March2nd_Reflect){	//二段目（反射）
		SM2nd_Reflect.V3Direction =reflect(SM2nd_Reflect.V3Direction, SM2nd_Reflect.V3NormalLine);
		smarch SM =fSMRayMarch(SM2nd_Reflect.V3P, SM2nd_Reflect.V3Direction, 0.0, ciDefinition /2);
		if(SM.bTouch){
			SF2nd_Reflect =SF_Default;
			if(cbSetting_Effect2nd_Reflect_Before)	SF2nd_Reflect =fSFEffect_Before(SF2nd_Reflect, SM, bvec3(false,true,false));
			if(cbSetting_Effect2nd_Reflect_After)	SF2nd_Reflect =fSFEffect_After(SF2nd_Reflect, SM, bvec3(false,true,false));
		}
		SM2nd_Reflect =SM;
	}

	if(cbSetting_March2nd_Refract){	//二段目（屈折）
		if(cbSetting_Refrax)	SM2nd_Refract.V3Direction =refract( SM2nd_Refract.V3Direction,+SM2nd_Refract.V3NormalLine, SF2nd_Refract.nRefrax);
		smarch SM =fSMRayMarch(SM2nd_Refract.V3P, SM2nd_Refract.V3Direction, 0.1, ciDefinition);
		if(SM.bTouch){
			{
				smarch SM2nd_RefractPlus =SM;
				if(cbSetting_Refrax)	SM2nd_RefractPlus.V3Direction =refract( SM2nd_RefractPlus.V3Direction,-SM2nd_RefractPlus.V3NormalLine, 1.0 /SF2nd_Refract.nRefrax);
				SM2nd_RefractPlus =fSMRayMarch(SM2nd_RefractPlus.V3P, SM2nd_RefractPlus.V3Direction, 0.1, ciDefinition);
				if(SM2nd_RefractPlus.bTouch)	SM =SM2nd_RefractPlus;
			}
			SF2nd_Refract =SF_Default;
			if(cbSetting_Effect2nd_Refract_Before)	SF2nd_Refract =fSFEffect_Before(SF2nd_Refract, SM, bvec3(false,false,true));
			if(cbSetting_Effect2nd_Refract_After)	SF2nd_Refract =fSFEffect_After(SF2nd_Refract, SM, bvec3(false,false,true));
		}
		SM2nd_Refract =SM;
	}

	vec3 V3RRR =SF1st.V3Real_Reflect_Refract;
	V3RRR /=abs(V3RRR.x) +abs(V3RRR.y) +abs(V3RRR.z);

	vec4 VColor =SF1st.VColor *V3RRR.x +SF2nd_Reflect.VColor *V3RRR.y +SF2nd_Refract.VColor *V3RRR.z;

	if(cbSetting_CeilFloor){ //天井と床

		if(!SM1st.bTouch){
			VColor =fVCeilFloor(SM1st.V3Direction);
		}else{
			vec4 VC, VC_Reflect, VC_Refract;
			vec3 V3D_Reflect, V3D_Refract;

			if(SM2nd_Reflect.bTouch){
				V3D_Reflect =reflect(SM2nd_Reflect.V3Direction, SM2nd_Reflect.V3NormalLine);
			}else{
				V3D_Reflect =reflect(SM1st.V3Direction, SM1st.V3NormalLine);
			}

			if(SM2nd_Refract.bTouch){
				V3D_Refract =refract(SM2nd_Refract.V3Direction,+SM2nd_Refract.V3NormalLine, SF2nd_Refract.nRefrax);
			}else{
				V3D_Refract =refract(SM1st.V3Direction,+SM1st.V3NormalLine, SF1st.nRefrax);
			}

			VC_Reflect =fVCeilFloor(V3D_Reflect);
			VC_Refract =fVCeilFloor(V3D_Refract);

			VC =VC_Reflect *V3RRR.y +VC_Refract *V3RRR.z;
			VColor +=VC *nSetting_CeilFloor_Default;
		}
	}

	if(false){	//RGB飽和防止
		float nRGB_Max =max(max(abs(VColor.r),abs(VColor.g)),abs(VColor.b));
		if(nRGB_Max >1.0)	VColor.rgb /=nRGB_Max;
	}

	if(cbSetting_Back && !SM1st.bTouch)	VColor =fVBack(V2UV);	//背景
	if(cbSetting_Front)	VColor =fVFront(V2UV, VColor);	//手前

	VColor.a =1.0;
	return VColor;
}

void main(void){	//仮メイン
	vec2 V2UV =(gl_FragCoord.xy *2.0 -resolution.xy) /min(resolution.x, resolution.y);
	gl_FragColor =fVMain(V2UV);
}
