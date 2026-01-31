//R050602作例　重力波　by ニシタマオ（Tamao Nishi, the sea panther)
//サンドボックス上での試験用、簡易レイトレシステム、反射・屈折、ぼかし影、カラーパレット機能付（R050525版）
//直近の改修：数字機能追加、関数整理、注釈追加、ロドリゲス回転行列
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

float nTime =time *1.0;
vec4 VMouse =vec4((mouse -0.5) *vec2(1,-1), 0, 0);

const bool cbSetting_March2nd_Reflect =false;	//反射
const bool cbSetting_March2nd_Refract =false;	//屈折
const bool cbSetting_CeilFloor =false;	//床天井
const bool cbSetting_Back =true;	//背景
const bool cbSetting_Front =true;	//手前

const bool cbSetting_Effect1st_Before =true;	//特殊効果（基本）
const bool cbSetting_Effect2nd_Reflect_Before =true;	//同、反射
const bool cbSetting_Effect2nd_Refract_Before =true;	//同、屈折

const bool cbSetting_Effect1st_After =true;	//特殊効果（応用）
const bool cbSetting_Effect2nd_Reflect_After =true;	//同、反射
const bool cbSetting_Effect2nd_Refract_After =true;	//同、屈折

const bool cbSetting_Refrax =true;	//屈折率
const bool cbSetting_Preprocess =false;	//前処理

vec4 VP_Camera_Default =vec4(0, 2,-4, 0);	//視点

const int ciDefinition =100;
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
	SF.nRefrax =0.9;
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
		{ float nE =float(1);  vec3 V3C =vec3(2.5,2.5,1) *nE,  V3D =vec3(5,0,0) *nE, V3P;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(0,2) *nE; VB.xy =vec2(1,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,1) *nE; VB.xy =vec2(0,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1) *nE; VB.xy =vec2(1,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,-1) *nE; VB.xy =vec2(-1,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,1) *nE; VB.xy =vec2(0,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1) *nE; VB.xy =vec2(1,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,-1) *nE; VB.xy =vec2(-1,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1) *nE; VB.xy =vec2(1,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,-1) *nE; VB.xy =vec2(-1,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,-1) *nE; VB.xy =vec2(-1,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0) *nE; VB.xy =vec2(-2,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,0) *nE; VB.xy =vec2(2,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(-2,2) *nE; VB.xy =vec2(-2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1) *nE; VB.xy =vec2(2,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-1) *nE; VB.xy =vec2(2,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(-1.3,0.7) *nE; VB.xy =vec2(1.3,0.7) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.3,0.7) *nE; VB.xy =vec2(0.7,0) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.3,0.7) *nE; VB.xy =vec2(0.7,0) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.7,1.3) *nE; VB.xy =vec2(0,-1.3) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.7,1.3) *nE; VB.xy =vec2(0.7,0.7) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(0,2) *nE; VB.xy =vec2(1,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,1) *nE; VB.xy =vec2(0,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1) *nE; VB.xy =vec2(1,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,-1) *nE; VB.xy =vec2(-1,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,1) *nE; VB.xy =vec2(0,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1) *nE; VB.xy =vec2(1,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,-1) *nE; VB.xy =vec2(-1,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1) *nE; VB.xy =vec2(1,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,-1) *nE; VB.xy =vec2(-1,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,-1) *nE; VB.xy =vec2(-1,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0) *nE; VB.xy =vec2(-2,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,0) *nE; VB.xy =vec2(2,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(-2,2) *nE; VB.xy =vec2(-2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1) *nE; VB.xy =vec2(2,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-1) *nE; VB.xy =vec2(2,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(-1.3,0.7) *nE; VB.xy =vec2(1.3,0.7) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.3,0.7) *nE; VB.xy =vec2(0.7,0) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.3,0.7) *nE; VB.xy =vec2(0.7,0) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.7,1.3) *nE; VB.xy =vec2(0,-1.3) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.7,1.3) *nE; VB.xy =vec2(0.7,0.7) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D;}

	return NP;
}
//文字機能ここまで

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

vec3 fV3RGame_Road00(vec2 V2P00){
	float nD =1.0;
	vec2 V2P10 =V2P00 +vec2(nD,0),  V2P01 =V2P00 +vec2(0,nD);
	float N00 =fNGame_Road00(V2P00), N10 =fNGame_Road00(V2P10), N01 =fNGame_Road00(V2P01);
	float D10 =(N10 -N00) /nD, D01 =(N01 -N01) /nD;
	vec3 V3R;
	V3R.z =D10, V3R.x =D01;
	return -V3R;
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

	float nGravityWave;

	if(true){	//ブラックホール
		vec4 VPi =VP;
		VPi.xyz +=vec3(1,3,2) *VPi.w;
		VPi.xyz =mod(VPi.xyz, 24.0) -12.0;
		float nPi =length(VPi.xyz) -2.0;
		sface SFi =fSFSet_Default(nPi);
		SFi.ID_Pallet =201;
		SFi.VP =VPi;
		SF =fSFMin(SF, SFi);

		VMisc00 =VPi;
		nGravityWave =sin(length(VPi.xyz) *5.0 -VPi.w *5.0) /dot(VPi.xyz,VPi.xyz);
		nGravityWave =clamp(nGravityWave,-1.0,+1.0);
	}

	if(true){	//柱
		vec4 VPi =VP;
		VPi.xz =mod(VPi.xz, 16.0) -8.0;
		float nPi =length(VPi.xz) -1.0;
		sface SFi =fSFSet_Default(nPi +nGravityWave);
		SFi.ID_Pallet =101;
		SF =fSFMin(SF, SFi);
	}

	if(true){	//地面
		float nPi =VP.y -fNGame_Road01(VP.xz);
		sface SFi =fSFSet_Default(nPi +nGravityWave);
		SFi.ID_Pallet =101;
		SF =fSFMin(SF, SFi);
	}

	if(true){	/*水面*/
		float nPi =VP.y +(sin(VP.x +sin(VP.z *0.5 +VP.w)) +sin(VP.z +sin(VP.x *0.5 +VP.w))) *0.01;
		nPi =abs(nPi) -0.5;
		vec4 VPi =VP;

//		VPi.xz =mod(VPi.xz, 4.0) -2.0;
//		nPi =max(nPi,-max(abs(VPi.x) -1.2, abs(VPi.z) -1.2));

		sface SFi =fSFSet_Default(nPi +nGravityWave);
		SFi.ID_Pallet =102;
		SFi.VP =VP;
		SF =fSFMin(SF, SFi);
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
	VColor =vec4(0.5);
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
	float nRandom_Misc00 =fNRandom(SF.VMisc00.xyz);
	vec4 VRandom_Misc00 =fVN(nRandom_Misc00);

//色彩、反射率、屈折率変化
	if(SF.ID_Pallet !=0){	//基本
		SF.VColor.rgb =fV3Pallet_Color_Default(SF.ID_Pallet);
	}

	if(SF.ID_Pallet ==101){
		SF.VColor.rgb =sign(sin(VP.x *0.25) *sin(VP.z *0.25) *cos(VP.y *0.25)) *0.2 +vec3(0.8);
		SF.V3Real_Reflect_Refract =vec3(1,0.5,0);
	}

	if(SF.ID_Pallet ==102){
		SF.VColor.rgb =sin(radians(vec3(0,120,240) +60.0 *VP.w)) *0.5 +0.5;
	}

	if(SF.ID_Pallet ==201){
		vec3 V3P =SF.VP.xyz;
		for(int I =1; I <10; I++)	V3P +=sin(V3P.yzx *float(I) +VP.w) /float(I);
		SF.VColor.rgb =sin(V3P) *0.5 +0.5;
	}
//一般明暗
	if(true && !bV3RRR.x){	//縁取り陰
		SF.VColor.rgb *=1.0 -SM.nLoop;
	}

	return SF;
}

sface fSFEffect_After(sface SF, smarch SM, bvec3 bV3RRR){	//特殊効果（応用）
	if(!SM.bTouch)	return SF;
	vec4 VP =vec4(SM.V3P, nTime);
	vec3 V3NL =SM.V3NormalLine;
	float fNRandom_Misc00 =fNRandom(SF.VMisc00.xyz);

//応用明暗
	vec3 V3P_Light =vec3(1,1,-2) *32.0;

	if(true && bV3RRR.x){	//光源陰（太陽）
		SF.VColor.rgb *=dot(SM.V3NormalLine, normalize(V3P_Light))*0.4 +0.6;
	}

	if(true && bV3RRR.x){	//影（太陽）
		if(SM.bTouch){
			float nShadow;
			smarch SM_Shadow =fSMRayMarch(SM.V3P, normalize(V3P_Light), 1.0, ciDefinition /4);
			nShadow =1.0 -clamp(SM_Shadow.nDistance_Min, 0.0, 1.0);
			if(SM_Shadow.bTouch)	nShadow =1.0;
			SF.VColor.rgb -=nShadow *0.25;
		}
	}

	return SF;
}

void fCameraSet(inout vec3 V3P, inout vec3 V3D){	//カメラ制御
	V3P.xy +=VMouse.xy *vec2(+1,-1) *16.0 +vec2(0,8);
	V3P.zy *=fM2Rotate(+VMouse.y);
	V3P.zx *=fM2Rotate(-VMouse.x *8.0);

	V3P.zx +=vec2(4,1)*nTime;	//視点移動

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

	VColor.a =1.5;
	return VColor;
}

void main(void){	//仮メイン
	vec2 V2UV =(gl_FragCoord.xy *2.0 -resolution.xy) /min(resolution.x, resolution.y);
	gl_FragColor =fVMain(V2UV);
}
