/*R050321作例　水上飛行機　by ニシタマオ　THE SEA PANTHER*/
/*サンドボックス上での試験用、簡易レイトレシステム、反射・屈折、ぼかし影、カラーパレット機能付（R050305版）*/
/*直近の改修：パレット彩色機能改善*/
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

float nTime =time *1.0;
vec4 VMouse =vec4((mouse -0.5) *vec2(1,-1), 0, nTime);

const bool cbSetting_March2nd_Reflect =false;
const bool cbSetting_March2nd_Refract =false;
const bool cbSetting_CeilFloor =false;
const float cnSetting_CeilFloor =0.25;
const bool cbSetting_Back =true;
const bool cbSetting_Front =true;
const bool cbSetting_Effect_Before1st =true;
const bool cbSetting_Effect_Before2nd_Reflect =true;
const bool cbSetting_Effect_Before2nd_Refract =true;
const bool cbSetting_Effect1st =true;
const bool cbSetting_Effect2nd_Reflect =true;
const bool cbSetting_Effect2nd_Refract =true;
const bool cbSetting_Effect_After1st =true;
const bool cbSetting_Effect_After2nd_Reflect =true;
const bool cbSetting_Effect_After2nd_Refract =true;
const bool cbSetting_Refrax =true;

vec4 VP_DefaultCamera =vec4(0, 8,-16, 0);
vec4 VP_DefaultLight =vec4(1,1,-1,0) *64.0;
vec4 VC_DefaultLight =vec4(1);

const int ciDefinition =80;
float cnMarchStepAdjust =0.6;
float cnMarchStepLimit =1e+6;

struct sface{
	float nDistance;
	vec4 VColor;
	vec3 V3Real_Reflect_Refract;
	float nRefrax;
	int ID_Object;
	int ID_Pallet;
	vec4 VP;
};

sface SF_Default;

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

sface fSFMin(sface SF0, sface SF1){
	if(SF0.nDistance < SF1.nDistance){
		return SF0;
	}else{
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

int fISequencer(int iCycle, int iSQ, float nTime){
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

	/*線分の形状*/
	NP =length(V3P) -nRadius *0.5;

	return NP;
}

float fNLetters00(vec4 VP){
	float NP =1e+6;
		{ vec3 V3C =vec3(2.5,2.5,1),  V3D =vec3(5,0,0), V3P;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(0,2); VB.xy =vec2(0,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1); VB.xy =vec2(-0.5,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,1); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,1); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1.5); VB.xy =vec2(0.5,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,0.5); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,0.5); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(0,2); VB.xy =vec2(0,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0.5); VB.xy =vec2(1.5,0.5); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,2); VB.xy =vec2(0.5,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,2); VB.xy =vec2(1.5,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0.5); VB.xy =vec2(2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,2); VB.xy =vec2(1.5,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0.5); VB.xy =vec2(2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0.5); VB.xy =vec2(2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0); VB.xy =vec2(1,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,0); VB.xy =vec2(1.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,0); VB.xy =vec2(1.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2); VB.xy =vec2(1.5,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1); VB.xy =vec2(1.5,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,0); VB.xy =vec2(1.5,-0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-1); VB.xy =vec2(1.5,-1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,2); VB.xy =vec2(-0.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,1.5); VB.xy =vec2(-2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,1); VB.xy =vec2(-1.5,-1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-0.5,2); VB.xy =vec2(-2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,1); VB.xy =vec2(-2,-0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,0.5); VB.xy =vec2(-1,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,2); VB.xy =vec2(1.5,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1); VB.xy =vec2(2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1); VB.xy =vec2(1.5,-2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,1); VB.xy =vec2(-0.5,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,2); VB.xy =vec2(-1,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,1); VB.xy =vec2(-2,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,1); VB.xy =vec2(-0.5,-0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,2); VB.xy =vec2(0,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1.5); VB.xy =vec2(0.5,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,1); VB.xy =vec2(0,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0.5); VB.xy =vec2(1,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1.5); VB.xy =vec2(0.5,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,1); VB.xy =vec2(0,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0.5); VB.xy =vec2(1,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,1); VB.xy =vec2(0,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0.5); VB.xy =vec2(1,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0.5); VB.xy =vec2(1,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,2); VB.xy =vec2(1,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,1.5); VB.xy =vec2(1.5,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1); VB.xy =vec2(1,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,0.5); VB.xy =vec2(2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,1.5); VB.xy =vec2(1.5,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1); VB.xy =vec2(1,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,0.5); VB.xy =vec2(2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1); VB.xy =vec2(1,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,0.5); VB.xy =vec2(2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,0.5); VB.xy =vec2(2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0); VB.xy =vec2(2,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,0.5); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-1); VB.xy =vec2(1,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,-0.5); VB.xy =vec2(0,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,-1); VB.xy =vec2(1,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0.5); VB.xy =vec2(2,0); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D;}

	return NP;
}
/*ここまで*/


/*個別デモ用関数*/

/*飛行機（R050321版）*/

float fNObject_Airplane00(vec4 VP){
	float NP =1e+6, nPi, nE =1.0;
	VP.z *=-1.0;
	vec4 VPi;

	VPi =VP;
	nPi =max(length(VPi.xy) -(1.0 -clamp(VPi.z *0.05 +0.2, 0.0, 1.0))*nE, abs(VPi.z) -4.0 *nE);
	NP =min(NP, nPi);

	VPi =VP;
	VPi.z +=2.0 *nE;
	VPi.y =abs(VPi.y -0.5 *nE) -1.25 *nE;
	nPi =length(max(abs(VPi.xyz) -vec3(4,0.1,1) *nE, 0.0)) -0.1;
	NP =min(NP, nPi);

	VPi =VP;
	VPi.z +=2.0 *nE;
	VPi.xz =abs(VPi.xz) -vec2(3,0.75) *nE;
	VPi.y -=0.5 *nE;
	nPi =max(length(VPi.xz) -0.1 *nE, abs(VPi.y) -1.25 *nE);
	NP =min(NP, nPi);

	VPi =VP;
	VPi.z -=4.0 *nE;
	nPi =length(max(abs(VPi.xyz) -vec3(2,0.1,0.75) *nE, 0.0)) -0.1;
	NP =min(NP, nPi);

	VPi =VP;
	VPi.z -=4.0 *nE;
	nPi =max(length(max(abs(VPi.yxz) -vec3(2,0.1,0.75) *nE, 0.0)) -0.1,-VPi.y);
	NP =min(NP, nPi);

	VPi =VP;
	VPi.z +=4.2 *nE;
	nPi =length(VPi.xyz) -0.4 *nE;
	NP =min(NP, nPi);

	VPi =VP;
	VPi.z +=4.3 *nE;
	VPi.xy *=fM2Rotate(VPi.w *20.0);
	nPi =length(max(abs(VPi.xyz) -vec3(2,0.1 +length(VPi.xy) *0.05,0.1) *nE, 0.0)) -0.1;
	NP =min(NP, nPi);

	return NP;
}

float fNObject_Airplane01(vec4 VP){
	float NP =fNObject_Airplane00(VP), nPi, nE =1.0;
	VP.z *=-1.0;
	vec4 VPi;

	VPi =VP;
	VPi.z +=2.0 *nE;
	VPi.y +=1.5 *nE;
	VPi.x =abs(VPi.x) -1.5 *nE;
	nPi =length(vec2(length(VPi.yz) -0.5 *nE, VPi.x)) -0.3 *nE;
	NP =min(NP, nPi);

	return NP;
}

float fNObject_Airplane02(vec4 VP){
	float NP =fNObject_Airplane00(VP), nPi, nE =1.0;
	VP.z *=-1.0;
	vec4 VPi;

	VPi =VP;
	VPi.z +=2.0 *nE;
	VPi.y +=2.0 *nE;
	VPi.x =abs(VPi.x) -2.0 *nE;
	VPi.z =abs(VPi.z);
	if(VPi.z <= 3.0 *nE){
		VPi.xy =abs(VPi.xy) +0.2 *nE;
		nPi =length(VPi.xy) -0.7 *nE;
	}else{
		VPi.z -=3.0 *nE;
		VPi.xy =abs(VPi.xy) +0.2 *nE;
		nPi =length(VPi.xyz) -0.7 *nE;
	}
	NP =min(NP, nPi);

	VPi =VP;
	VPi.xy =abs(VPi.xy) +vec2(+1,-1) *VPi.yx;
	VPi.xy /=2.0;
	if(VP.y >-2.0 *nE){
		VPi.z =abs(VPi.z +2.0 *nE) -1.0 *nE;
		nPi =length(VPi.xz) -0.2 *nE;
		NP =min(NP, nPi);
	}
	return NP;
}

float fNGame_Road00(vec2 V2P){
	float nHeight;
	nHeight +=sin(V2P.x *1e-1) *2.0;
	nHeight +=sin(V2P.x *13e-3) *5.0;
	nHeight +=sin(V2P.y *15e-2) *2.0;
	nHeight +=sin(V2P.y *17e-3) *5.0;
	return nHeight;
}

vec3 ffV3PGame_Airplane00(float nTime){
	vec3 V3P;
	V3P +=sin(vec3(5,3,1) /5.0 *nTime +vec3(0,1,2)) *vec3(12,8,4);
	V3P +=sin(vec3(1,7,13) /50.0 *nTime +vec3(2,1,0)) *vec3(8);
	return V3P;
}

vec3 ffV3PGame_Airplane01(float nTime){
	vec3 V3P =ffV3PGame_Airplane00(nTime);

	V3P.zx +=vec2(8,0.2) *nTime;	//移動
	V3P.y +=16.0 +fNGame_Road00(V3P.xz);
	return V3P;
}

vec3 ffV3PGame_Airplane02(float nTime){
	vec3 V3P =ffV3PGame_Airplane00(nTime);

	V3P.zx +=vec2(8,0.2) *nTime;	//移動
	V3P.y +=8.0;
	if(V3P.y <0.0)	V3P.y =0.0;
	return V3P;
}

mat3 ffM3RGame_Airplane00(vec3 V3P0, vec3 V3P1, vec3 V3P2, float nDynm){
	float nR =clamp(nDynm, 0.0, 1.0);
	vec3 V3D01 =V3P1 -V3P0;
	vec3 V3D02 =V3P2 -V3P0;
	vec3 V3D12 =V3P2 -V3P1;

	vec3 V3Cross =cross(normalize(V3D01),normalize(V3D12));

	vec3 V3R;
	V3R.y =atan(V3D01.x, V3D01.z);
	V3R.x =atan(V3D01.y, V3D01.z) *0.2;
	V3R.z =clamp(V3Cross.y *nR,-1.0, 1.0) *acos(-1.0) /2.0;

	mat3 M3R =mat3(1,0,0,0,1,0,0,0,1);
	M3R *=fM3RotateY(-V3R.y);
	M3R *=fM3RotateZ(+V3R.z);
	M3R *=fM3RotateX(+V3R.x);

	return M3R;
}

vec3 fV3PGame_Airplane01(vec4 VP){
	vec3 V3P0, V3P1, V3P2;
	float nDT =1.0;
	V3P0 =ffV3PGame_Airplane01(VP.w +nDT *0.0);
	V3P1 =ffV3PGame_Airplane01(VP.w +nDT *1.0);
	V3P2 =ffV3PGame_Airplane01(VP.w +nDT *2.0);
	mat3 M3R =ffM3RGame_Airplane00(V3P0, V3P1, V3P2, 1.0);

	VP.xyz -=V3P0;
	VP.xyz *=M3R;

	return VP.xyz;
}

vec3 fV3PGame_Airplane02(vec4 VP){
	vec3 V3P0, V3P1, V3P2;
	float nDT =1.0;
	V3P0 =ffV3PGame_Airplane02(VP.w +nDT *0.0);
	V3P1 =ffV3PGame_Airplane02(VP.w +nDT *1.0);
	V3P2 =ffV3PGame_Airplane02(VP.w +nDT *2.0);
	float nDynm =clamp(V3P0.y, 0.0, 8.0) /8.0;
	mat3 M3R =ffM3RGame_Airplane00(V3P0, V3P1, V3P2, nDynm);

	VP.xyz -=V3P0;
	VP.xyz *=M3R;

	return VP.xyz;
}

vec3 fV3PGame_Airplane01_Gun01(vec4 VP){
	float nE =1.0;
	vec3 V3P =fV3PGame_Airplane01(VP);
	float nX =V3P.x;
	V3P.x =abs(V3P.x) -2.0 *nE;
	V3P.yz +=vec2(0.75,-3.5) *nE;
	if(V3P.z >-1.0 *nE){	
		V3P.z -=VP.w *16.0 +sign(nX) *2.0;
		V3P.z =mod(V3P.z, 8.0) -4.0;
	}

	return V3P;	
}

/*自動車（R050311版）*/

/*ここまで*/

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

vec3 fV3Pallet_Real_Reflect_Refract_Default(int ID){
	vec3 V3RRR =vec3(1);
	if(ID ==  1) V3RRR =vec3(1,	1,	0);
	if(ID ==  2) V3RRR =vec3(1,	1,	1);
	if(ID ==  3) V3RRR =vec3(2,	1,	0);
	if(ID ==  4) V3RRR =vec3(2,	1,	1);
	if(ID ==  5) V3RRR =vec3(1,	2,	0);
	if(ID ==  6) V3RRR =vec3(1,	2,	1);
	if(ID ==  7) V3RRR =vec3(1,	1,	2);
	if(ID ==  8) V3RRR =vec3(1,	2,	2);
	return V3RRR;
}

float fNMap(vec3 V3P){
	vec4 VP =vec4(V3P, nTime);
	float NP =1e+6;

	/*所要の図形の表面距離を記述*/
	sface SF =fSFSet_Default();

	if(true){	/*飛行機*/
		const int ciAirplaneMax =3;
		for(int I =0; I <ciAirplaneMax; I++){
			vec4 VPi =VP;
			VPi.w +=float(I) *2.0;
//			VPi.xyz =fV3PGame_Airplane01(VPi);
			VPi.xyz =fV3PGame_Airplane02(VPi);
			sface SFi; 
			VPi.y -=2.0;
			SFi =fSFSet_Default(fNObject_Airplane02(VPi));

			SFi.ID_Object =11;
			SFi.ID_Pallet =I +2;
			SFi.VP =VPi;
			SF =fSFMin(SF, SFi);
		}
	}

	if(false){	/*柱*/
		vec4 VPi =VP;
		VPi.xz =mod(VPi.xz, 32.0) -16.0;
		VPi.xz *=fM2Rotate(VPi.y *0.1);
		float nPi =length(max(abs(VPi.xz) -1.0, 0.0)) -0.1;
		sface SFi =fSFSet_Default(nPi);
		SFi.ID_Object =102;
		SFi.VP =VP;
		SF =fSFMin(SF, SFi);
	}

	if(true){	/*水面*/
		float nPi =VP.y +(sin(VP.x +sin(VP.z *0.5 +VP.w)) +sin(VP.z +sin(VP.x *0.5 +VP.w))) *0.05;
		sface SFi =fSFSet_Default(nPi);
		SFi.ID_Object =104;
		SFi.VP =VP;
		SF =fSFSmoothMin(SF, SFi, 4.0);
	}


	NP =min(NP, SF.nDistance);
	SF_Default =SF;
	/*ここまで*/

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

	VP.y +=0.75;
	VP.xyz *=16.0;
	float nC =fNLetters00(VP);
	if(nC <0.0){
		VColor.rgb +=(sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VP.w) *0.3 +0.7) *clamp(1.0 +2.0 *nC, 0.0, 1.0)* (sin(VP.w) *0.5 +0.5);
	}

	return VColor;
}

sface fSFEffect_Before(sface SF, smarch SM){
	if(!SM.bTouch)	return SF;
	vec4 VColor =SF.VColor;
	vec3 V3RRR =SF.V3Real_Reflect_Refract;
	vec4 VP =vec4(SM.V3P, nTime);
	vec3 V3NL =SM.V3NormalLine;

	/*オブジェクト・パレットごとの色彩効果を記述*/

	if(SF.ID_Pallet !=0){	/*基本*/
		VColor.rgb =fV3Pallet_Color_Default(SF.ID_Pallet);
	}

	if(SF.ID_Object ==11)		VColor.rgb =VColor.rgb *0.6 +0.4;
	if(SF.ID_Object ==12)		VColor.rgb =VColor.rgb *0.6 +0.4;
	if(SF.ID_Object ==31)	VColor.rgb =vec3(1,1,0) *fM3Rotate(vec3(VP.w)) *0.2 +0.8;

	if(SF.ID_Object ==101)	VColor.rgb =sign(sin(VP.x) *sin(VP.z)) *0.1 +vec3(0.9);
	if(SF.ID_Object ==104)	VColor.rgb =vec3(0,0,1) *0.2 +0.8;

	/*ここまで*/
	SF.VColor =VColor;
	SF.V3Real_Reflect_Refract =V3RRR;
	return SF;
}

sface fSFEffect_After(sface SF, smarch SM){
	if(!SM.bTouch)	return SF;
	vec4 VColor =SF.VColor;
	vec4 VP =vec4(SM.V3P, nTime);
	vec3 V3NL =SM.V3NormalLine;

	/*オブジェクト・パレットごとの色彩効果を記述*/
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
	SF.VColor =VColor;
	return SF;
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

smarch fSMRayMarch(vec3 V3P_Start, vec3 V3Direction, float nLength, int iDefinition_Limit){
	V3Direction =normalize(V3Direction);
	vec3 V3P;
	float nDistance_Min =1e+6, nAdjust =cnMarchStepAdjust, nDistanceLimit =cnMarchStepLimit;
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

sface fSFEffect(sface SF, smarch SM, vec3 V3P_Light){

	if(true){	/*光源シェーディング*/
		SF.VColor.rgb *=dot(SM.V3NormalLine, normalize(V3P_Light))*0.5 +0.5;
	}

	if(false){	/*縁取シェーディング*/
		SF.VColor.rgb *=1.0 -SM.nLoop;
	}

	if(false){	/*影*/
		if(SM.bTouch){
			float nShadow;
			smarch SM_Shadow =fSMRayMarch(SM.V3P, normalize(V3P_Light -SM.V3P), 1.0, ciDefinition /4);
			nShadow =1.0 -clamp(SM_Shadow.nDistance_Min, 0.0, 1.0);
			if(SM_Shadow.bTouch)	nShadow =1.0;
			SF.VColor.rgb -=nShadow *0.25;
		}
	}
	return SF;
}

void fCameraSet(inout vec3 V3P, inout vec3 V3D){
	V3P.xy +=VMouse.xy *vec2(+1,-1) *16.0 +vec2(0,8);
	V3P.zy *=fM2Rotate(+VMouse.y);
	V3P.zx *=fM2Rotate(-VMouse.x *8.0);

	V3P.zx +=vec2(8,0.2) *nTime;

	V3D.zy *=fM2Rotate(+VMouse.y);
	V3D.zx *=fM2Rotate(-VMouse.x *8.0);
}

vec4 fVMain(vec2 V2UV){
	vec3 V3Camera =VP_DefaultCamera.xyz, V3Direction =normalize(vec3(V2UV, 1)), V3P_Light =VP_DefaultLight.xyz;
	fCameraSet(V3Camera, V3Direction);

	SF_Default =fSFSet_Default();
	sface SF1st, SF2nd_Reflect, SF2nd_Refract;
	SF1st =SF2nd_Reflect =SF2nd_Refract =SF_Default;

	bool bTouch1st, bTouch2nd_Reflect, bTouch2nd_Refract;
	smarch SM1st, SM2nd_Reflect, SM2nd_Refract;

	{
		smarch SM =fSMRayMarch(V3Camera, V3Direction, 0.0, ciDefinition);
		SM1st =SM2nd_Reflect =SM2nd_Refract =SM;

		if(SM1st.bTouch){
			SF1st =SF_Default;
			if(cbSetting_Effect_Before1st)			SF1st =fSFEffect_Before(SF1st, SM1st);
			if(cbSetting_Effect1st)	SF1st =fSFEffect(SF1st, SM1st, V3P_Light);
		}
	}

	SF2nd_Reflect =SF2nd_Refract =SF1st;

	if(cbSetting_March2nd_Reflect){
		SM2nd_Reflect.V3Direction =reflect(SM2nd_Reflect.V3Direction, SM2nd_Reflect.V3NormalLine);
		smarch SM =fSMRayMarch(SM2nd_Reflect.V3P, SM2nd_Reflect.V3Direction, 0.0, ciDefinition /2);
		if(SM.bTouch){
			SF2nd_Reflect =SF_Default;
			if(cbSetting_Effect_Before2nd_Reflect)	SF2nd_Reflect =fSFEffect_Before(SF2nd_Reflect, SM);
			if(cbSetting_Effect2nd_Reflect)	SF2nd_Reflect =fSFEffect(SF2nd_Reflect, SM, V3P_Light);
		}
		SM2nd_Reflect =SM;
	}

	if(cbSetting_March2nd_Refract){
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
			if(cbSetting_Effect_Before2nd_Refract)	SF2nd_Refract =fSFEffect_Before(SF2nd_Refract, SM);
			if(cbSetting_Effect2nd_Refract)	SF2nd_Refract =fSFEffect(SF2nd_Refract, SM, V3P_Light);
		}
		SM2nd_Refract =SM;
	}

	vec3 V3RRR =SF1st.V3Real_Reflect_Refract;
	V3RRR /=abs(V3RRR.x) +abs(V3RRR.y) +abs(V3RRR.z);

	SF1st.VColor.rgb *=VC_DefaultLight.rgb;
	SF2nd_Reflect.VColor.rgb *=VC_DefaultLight.rgb;
	SF2nd_Refract.VColor.rgb *=VC_DefaultLight.rgb;

	if(cbSetting_Effect_After1st)			SF1st =fSFEffect_After(SF1st, SM1st);
	if(cbSetting_Effect_After2nd_Reflect)	SF2nd_Reflect =fSFEffect_After(SF2nd_Reflect, SM2nd_Reflect);
	if(cbSetting_Effect_After2nd_Refract)	SF2nd_Refract =fSFEffect_After(SF2nd_Refract, SM2nd_Refract);

	vec4 VColor =SF1st.VColor *V3RRR.x +SF2nd_Reflect.VColor *V3RRR.y +SF2nd_Refract.VColor *V3RRR.z;

	if(cbSetting_CeilFloor){

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
			VColor +=VC *cnSetting_CeilFloor;
		}
	}


	if(cbSetting_Back && !SM1st.bTouch)	VColor =fVBack(V2UV);
	if(cbSetting_Front)	VColor =fVFront(V2UV, VColor);

	VColor.a =1.0;
	return VColor;
}

void main(void){
	vec2 V2UV =(gl_FragCoord.xy *2.0 -resolution.xy) /min(resolution.x, resolution.y);
	gl_FragColor =fVMain(V2UV);
}
