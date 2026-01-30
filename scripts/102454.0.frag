/*R050408作例　運否天賦　by ニシタマオ　THE SEA PANTHER*/
/*サンドボックス上での試験用、簡易レイトレシステム、反射・屈折、ぼかし影、カラーパレット機能付（R050408版）*/
/*直近の改修：光源機能修正*/
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

float nTime =time *1.0;
vec4 VMouse =vec4((mouse -0.5) *vec2(1,-1), 0, nTime);

const bool cbSetting_March2nd_Reflect =true;
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
const bool cbSetting_Refrax =false;

vec4 VP_DefaultCamera =vec4(0, 8,-32, 0);

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
	vec4 VMisc00, VMisc01, VMisc02, VMisc03;
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

sface fSFMin(sface SF0, sface SF1, float nK){

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

float fNMin(float nP1, float nP2, float nK){
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

/*文字列形状生成機能（R050403版）by ニシタマオ*/
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
		{ float nE =float(1);  vec3 V3C =vec3(2.5,2.5,1) *nE,  V3D =vec3(5,0,0) *nE, V3P;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(-2,2) *nE; VB.xy =vec2(-1,1.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1) *nE; VB.xy =vec2(-1,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,1) *nE; VB.xy =vec2(-2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2) *nE; VB.xy =vec2(-1,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-1) *nE; VB.xy =vec2(-0.5,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,-2) *nE; VB.xy =vec2(2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,1) *nE; VB.xy =vec2(-2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2) *nE; VB.xy =vec2(-1,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-1) *nE; VB.xy =vec2(-0.5,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,-2) *nE; VB.xy =vec2(2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2) *nE; VB.xy =vec2(-1,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-1) *nE; VB.xy =vec2(-0.5,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,-2) *nE; VB.xy =vec2(2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-1) *nE; VB.xy =vec2(-0.5,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,-2) *nE; VB.xy =vec2(2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,-2) *nE; VB.xy =vec2(2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1.5) *nE; VB.xy =vec2(0,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,2) *nE; VB.xy =vec2(2,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2) *nE; VB.xy =vec2(2,1.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,2) *nE; VB.xy =vec2(2,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2) *nE; VB.xy =vec2(2,1.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2) *nE; VB.xy =vec2(2,1.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,1) *nE; VB.xy =vec2(1.5,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0.5) *nE; VB.xy =vec2(2,0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,0.5) *nE; VB.xy =vec2(2,-0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-0.5) *nE; VB.xy =vec2(0,-0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-0.5) *nE; VB.xy =vec2(0,0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,0.5) *nE; VB.xy =vec2(2,-0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-0.5) *nE; VB.xy =vec2(0,-0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-0.5) *nE; VB.xy =vec2(0,0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-0.5) *nE; VB.xy =vec2(0,-0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-0.5) *nE; VB.xy =vec2(0,0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-0.5) *nE; VB.xy =vec2(0,0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-1) *nE; VB.xy =vec2(2,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,1.5) *nE; VB.xy =vec2(1,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,0) *nE; VB.xy =vec2(1.5,0) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(-2,2) *nE; VB.xy =vec2(2,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-0.5) *nE; VB.xy =vec2(0,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,2) *nE; VB.xy =vec2(2,-0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,2) *nE; VB.xy =vec2(2,-0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,2) *nE; VB.xy =vec2(0,-0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-0.5) *nE; VB.xy =vec2(1.5,-0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-0.5) *nE; VB.xy =vec2(1.5,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-2) *nE; VB.xy =vec2(-1.5,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-2) *nE; VB.xy =vec2(-1.5,-0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-0.5) *nE; VB.xy =vec2(1.5,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-2) *nE; VB.xy =vec2(-1.5,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-2) *nE; VB.xy =vec2(-1.5,-0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-2) *nE; VB.xy =vec2(-1.5,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-2) *nE; VB.xy =vec2(-1.5,-0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-2) *nE; VB.xy =vec2(-1.5,-0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(-2,2) *nE; VB.xy =vec2(2,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,0.5) *nE; VB.xy =vec2(1.5,0.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,2) *nE; VB.xy =vec2(0,0) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0) *nE; VB.xy =vec2(-2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0) *nE; VB.xy =vec2(-2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0) *nE; VB.xy =vec2(2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ float nE =nE;  vec4 VA, VB; VA.w =float(1) *nE;{ VA.xy =vec2(-2,2) *nE; VB.xy =vec2(-1,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,2) *nE; VB.xy =vec2(-1,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-1) *nE; VB.xy =vec2(-2,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-1) *nE; VB.xy =vec2(-2,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,2) *nE; VB.xy =vec2(-1,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-1) *nE; VB.xy =vec2(-2,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-1) *nE; VB.xy =vec2(-2,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-1) *nE; VB.xy =vec2(-2,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-1) *nE; VB.xy =vec2(-2,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-1) *nE; VB.xy =vec2(-2,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1) *nE; VB.xy =vec2(-1,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0) *nE; VB.xy =vec2(-1,0) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-1.5) *nE; VB.xy =vec2(-2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-1.5) *nE; VB.xy =vec2(-1,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,1) *nE; VB.xy =vec2(2,1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,2) *nE; VB.xy =vec2(2,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,2) *nE; VB.xy =vec2(0.5,2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,2) *nE; VB.xy =vec2(2,1.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,0.5) *nE; VB.xy =vec2(0.5,-1.5) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,-0.5) *nE; VB.xy =vec2(-0.5,-2) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,-2) *nE; VB.xy =vec2(1.5,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,-2) *nE; VB.xy =vec2(1.5,-1) *nE; NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,0) *nE; VB.xy =vec2(1,0) *nE; NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D;}

	return NP;
}
/*ここまで*/

sface fSFObject_Dice02(vec4 VP){
	float nPi, nE =5.0, nEE =nE *0.5, nEye =nE *0.15, nK =4.0;
	vec4 VPi =VP;

	sface SF =fSFSet_Default(), SFi;

/*一天*/
	VPi =VP;
	VPi.z +=nE;
	nPi =length(VPi.xyz) -nEye *2.0;
	SFi =fSFSet_Default(nPi);
	SFi.ID_Pallet =2;
	SF =fSFMin(SF, SFi);

/*地六*/
	VPi =VP;
	VPi.z -=nE;
	VPi.x =abs(VPi.x) -nEE;
	nPi =length(VPi.xyz) -nEye;
	SFi =fSFSet_Default(nPi);
	SFi.ID_Pallet =8;
	SF =fSFMin(SF, SFi);
	VPi.y =abs(VPi.y) -nEE;
	nPi =length(VPi.xyz) -nEye;
	SFi =fSFSet_Default(nPi);
	SFi.ID_Pallet =8;
	SF =fSFMin(SF, SFi);

/*東二*/
	VPi =VP;
	VPi.x +=nE;
	VPi.yz +=vec2(+1,-1) *VPi.zy;
	VPi.yz /=1.4;
	VPi.y =abs(VPi.y) -nEE;
	nPi =length(VPi.xyz) -nEye;
	SFi =fSFSet_Default(nPi);
	SFi.ID_Pallet =4;
	SF =fSFMin(SF, SFi);

/*西五*/
	VPi =VP;
	VPi.x -=nE;
	nPi =length(VPi.xyz) -nEye;
	SFi =fSFSet_Default(nPi);
	SFi.ID_Pallet =7;
	SF =fSFMin(SF, SFi);
	VPi.yz =abs(VPi.yz) -nEE;
	nPi =length(VPi.xyz) -nEye;
	SFi =fSFSet_Default(nPi);
	SFi.ID_Pallet =7;
	SF =fSFMin(SF, SFi);

/*南三*/
	VPi =VP;
	VPi.y +=nE;
	nPi =length(VPi.xyz) -nEye;
	SFi =fSFSet_Default(nPi);
	SFi.ID_Pallet =5;
	SF =fSFMin(SF, SFi);
	VPi.zx +=vec2(+1,-1) *VPi.xz;
	VPi.zx /=1.4;
	VPi.z =abs(VPi.z) -nEE;
	nPi =length(VPi.xyz) -nEye;
	SFi =fSFSet_Default(nPi);
	SFi.ID_Pallet =5;
	SF =fSFMin(SF, SFi);

/*北四*/
	VPi =VP;
	VPi.y -=nE;
	VPi.zx =abs(VPi.zx) -nEE;
	nPi =length(VPi.xyz) -nEye;
	SFi =fSFSet_Default(nPi);
	SFi.ID_Pallet =6;
	SF =fSFMin(SF, SFi);


	VPi =VP;
	nPi =length(max(abs(VPi.xyz) -0.9 *nE, 0.0)) -0.1 *nE;
	SFi =fSFSet_Default(-nPi);
	SFi.ID_Pallet =9;
	SF =fSFMin(SF,SFi, nK);

//	return -NP;
	SF.nDistance *=-1.0;
	return SF;
}


/*表面でこぼこ*/
float fNSurfaceEffect_Dimple01(vec4 VP, float nDimpleSpan, float nDimpleSize){
	vec4 VPi =VP;
	VPi.xyz /=nDimpleSpan;
	float nDimple =sin(VPi.x) *sin(VPi.y) *sin(VPi.z);
	nDimple *=nDimpleSize;
	return nDimple;	
}

float fNSurfaceEffect_Dimple02(vec4 VP, float nDimpleSpan, float nDimpleSize){
	vec4 VPi =VP;
	VPi.xyz =mod(VPi.xyz, nDimpleSpan *2.0) -nDimpleSpan;
	VPi.xyz =abs(VPi.xyz);
	VPi.xyz *=4.0 /nDimpleSpan;
	VPi.xyz -=2.0;
	VPi.xyz =clamp(VPi.xyz,-1.0,+1.0);

	float nDimple =VPi.x *VPi.y *VPi.z;
	nDimple *=nDimpleSize;
	return nDimple;	
}

float fNSurfaceEffect_Dimple03(vec4 VP, float nDimpleSpan, float nDimpleSize){
	vec4 VPi =VP;
	VPi.xyz /=nDimpleSpan;
	for(int I =0; I <3; I++){
		VPi.xyz +=sin(VPi.yzx *float(I +1) *0.5 +VPi.w) /float(I +1);
	}
	VPi.xyz =sin(VPi.xyz);
	float nDimple =VPi.x*VPi.y*VPi.z;
	nDimple *=nDimpleSize;
	return nDimple;	
}

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

	if(true){
		vec4 VPi =VP;
		vec2 V2P =VPi.xz;

		float nW_Mod =(mod(VPi.w, 1.0) -1.0/2.0) *2.0;
		VPi.y +=(nW_Mod *nW_Mod -1.0) *30.0;

		vec2 V2R =vec2(1,1);
		VPi.zx +=vec2(cos(V2R.x *VPi.w),sin(V2R.x *VPi.w)) *10.0;
		VPi.xy *=fM2Rotate(-sin(V2R.x *VPi.w) *4.0);
		VPi.yz *=fM2Rotate(-cos(V2R.y *VPi.w) /1.4 *4.0);

		sface SFi;
		SFi =fSFObject_Dice02(VPi);

		int iSQ =fISequencer(30,3);

		float nPi;
		if(iSQ ==0)	nPi =fNSurfaceEffect_Dimple01(VPi, 0.5, 1e-1 *(-cos(VPi.w *0.1) *0.5 +0.5));
		if(iSQ ==1)	nPi =fNSurfaceEffect_Dimple02(VPi, 0.5, 3e-2 *(-cos(VPi.w *0.1) *0.5 +0.5));
		if(iSQ ==2)	nPi =fNSurfaceEffect_Dimple03(VPi, 0.5, 1e-1 *(-cos(VPi.w *0.1) *0.5 +0.5));
		SFi.nDistance +=nPi;

		SFi.ID_Object =42;
		SFi.VP =VPi;
		SF =fSFMin(SF, SFi);
	}

	if(true){	/*柱*/
		vec4 VPi =VP;
		vec2 V2P =VPi.xz;
		VPi.xz =abs(VPi.xz) -14.0;
		float nPi =length(max(abs(VPi.xz) -1.0, 0.0)) -0.1;

		sface SFi =fSFSet_Default(nPi);
		SFi.ID_Object =102;
		SFi.VP =VPi;
		SF =fSFMin(SF, SFi);
	}

	if(true){	/*水面*/
		float nPi =VP.y +(sin(VP.x +sin(VP.z *0.5 +VP.w)) +sin(VP.z +sin(VP.x *0.5 +VP.w))) *0.01;
		nPi =abs(nPi) -0.5;
		vec4 VPi =VP;
		sface SFi =fSFSet_Default(nPi);
		SFi.ID_Object =101;
		SFi.VP =VP;
		SF =fSFMin(SF, SFi);
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

	if(SF.ID_Object ==101){
		VColor.rgb =sign(sin(VP.x) *sin(VP.z)) *0.1 +vec3(0.9);
		V3RRR =vec3(1,2,3);
	}

	if(SF.ID_Object ==102){
		VColor.rgb =vec3(1,0,0) *fM3Rotate(vec3(VP.w +sign(VP.x) *1.0 +sign(VP.z) *2.0)) *0.4 +0.6;
		V3RRR =vec3(1,2,3);
	}

	if(SF.ID_Object ==42 && SF.ID_Pallet ==9){
		int iSQx =fISequencer(8, 2);
		int iSQy =fISequencer(16, 2);

		vec2 V2S;
		V2S.x =atan(SF.VP.x, SF.VP.y) +VP.w *0.13;
		V2S.y =atan(length(SF.VP.xy), SF.VP.z) +VP.w *0.11;

		V2S *=8.0;
		float nC;

		nC =1.0;
		if(iSQx ==1)	nC *=sin(V2S.x);
		if(iSQy ==1)	nC *=sin(V2S.y);
		nC =0.5 -sign(nC) *0.5;
		vec3 V3C =sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VP.w) *0.2 +0.8;
		VColor.rgb =1.0 -V3C *nC *0.5;
	}

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

sface fSFEffect(sface SF, smarch SM){
	vec3 V3P_Light =vec3(1,1,-1) *32.0;

	if(false){	/*縁取シェーディング*/
		SF.VColor.rgb *=1.0 -SM.nLoop;
	}

	if(true){	/*光源シェーディング１*/
		SF.VColor.rgb *=dot(SM.V3NormalLine, normalize(V3P_Light))*0.5 +0.5;
	}

	if(false){	/*光源シェーディング２*/
		float nC =dot(SM.V3NormalLine, normalize(V3P_Light -SM.V3P))*0.5 +0.5;
		nC *=pow(length(V3P_Light -SM.V3P), -1e-2);
		SF.VColor.rgb *=nC;
	}

	if(true){	/*影１*/
		if(SM.bTouch){
			float nShadow;
			smarch SM_Shadow =fSMRayMarch(SM.V3P, normalize(V3P_Light), 1.0, ciDefinition /4);
			nShadow =1.0 -clamp(SM_Shadow.nDistance_Min, 0.0, 1.0);
			if(SM_Shadow.bTouch)	nShadow =1.0;
			SF.VColor.rgb -=nShadow *0.25;
		}
	}

	if(false){	/*影２*/
		if(SM.bTouch){
			float nShadow;
			vec3 V3P;
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

	V3D.zy *=fM2Rotate(+VMouse.y);
	V3D.zx *=fM2Rotate(-VMouse.x *8.0);
}

vec4 fVMain(vec2 V2UV){
	vec3 V3Camera =VP_DefaultCamera.xyz, V3Direction =normalize(vec3(V2UV, 1));
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
			if(cbSetting_Effect1st)	SF1st =fSFEffect(SF1st, SM1st);
		}
	}

	SF2nd_Reflect =SF2nd_Refract =SF1st;

	if(cbSetting_March2nd_Reflect){
		SM2nd_Reflect.V3Direction =reflect(SM2nd_Reflect.V3Direction, SM2nd_Reflect.V3NormalLine);
		smarch SM =fSMRayMarch(SM2nd_Reflect.V3P, SM2nd_Reflect.V3Direction, 0.0, ciDefinition /2);
		if(SM.bTouch){
			SF2nd_Reflect =SF_Default;
			if(cbSetting_Effect_Before2nd_Reflect)	SF2nd_Reflect =fSFEffect_Before(SF2nd_Reflect, SM);
			if(cbSetting_Effect2nd_Reflect)	SF2nd_Reflect =fSFEffect(SF2nd_Reflect, SM);
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
			if(cbSetting_Effect2nd_Refract)	SF2nd_Refract =fSFEffect(SF2nd_Refract, SM);
		}
		SM2nd_Refract =SM;
	}

	vec3 V3RRR =SF1st.V3Real_Reflect_Refract;
	V3RRR /=abs(V3RRR.x) +abs(V3RRR.y) +abs(V3RRR.z);

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
