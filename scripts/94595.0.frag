/*R041123作例　二酸化ジルコニウム　by ニシタマオ*/
/*サンドボックス上での試験用、簡易レイトレシステム、反射・屈折、ぼかし影、カラーパレット機能付（R041123版）*/
/*直近の改修：屈折機能のバグ取り、モチャモチャ合成機能、フロント表示機能追加、代わりに雑機能の省略*/
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

float nTime =time;
vec4 VMouse =vec4((mouse -0.5) *vec2(1,-1), 0, nTime);

const bool cbSetting_March2nd_Reflect =true;
const bool cbSetting_March2nd_Refract =true;
const bool cbSetting_CeilFloor =false;
const bool cbSetting_Back =false;
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

vec4 VP_DefaultCamera =vec4(0, 0, -24, 0);
vec4 VP_DefaultLight =vec4(1,1,-1,0) *64.0;
vec4 VC_DefaultLight =vec4(1);
const int ciDefinition =100;

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
	float nDistance, nDistanceNext;
	vec4 VColor;
	vec3 V3Real_Reflect_Refract;
	float nRefrax;
	float nFusion;
	int ID_Object, ID_ObjectNext;
	int ID_Pallet, ID_PalletNext;
};

sface SF;

sface fSFSet_Default(void){
	sface SF;
	SF.VColor =vec4(1);
	SF.nDistance =SF.nDistanceNext =1e+6;
	SF.V3Real_Reflect_Refract =vec3(1,0.5,0);
	SF.nRefrax =0.8;
	return SF;
}

sface fSFMin(sface SF0, sface SF1){
	if(SF0.nDistance < SF1.nDistance){
		return SF0;
	}else{
		return SF1;
	}
}

sface fSFSmoothMin(sface SF0, sface SF1, float nK){

	sface SF, SFNext;
	if(SF0.nDistance < SF1.nDistance){
		SF =SF0, SFNext =SF1;
	}else{
		SF =SF1, SFNext =SF0;
	}

	float nP0 =SF.nDistance, nP1 =SFNext.nDistance;
	float nH =exp(-nP0 *nK) +exp(-nP1 *nK);
	float nP =-log(nH) /nK;

	SF.nDistance = nP;

	if(nP1 <SF.nDistanceNext){
		SF.nDistanceNext =nP1;
		SF.nFusion =abs(nP -nP0) /(abs(nP -nP0) +abs(nP -nP1));
		SF.ID_ObjectNext =SFNext.ID_Object;
		SF.ID_PalletNext =SFNext.ID_Pallet;

	}

	if(false){	/*色彩、反射・屈折率モチャモチャ合成*/
		float nP0a =abs(nP -nP0), nP1a =abs(nP -nP1), nRatio =nP0a /(nP0a +nP1a);
		SF.VColor =mix(SF0.VColor, SF1.VColor, nRatio);
		SF.V3Real_Reflect_Refract =mix(normalize(SF0.V3Real_Reflect_Refract), normalize(SF1.V3Real_Reflect_Refract), nRatio);
		SF.nRefrax =mix(SF0.nRefrax, SF1.nRefrax, nRatio);
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
	{ vec3 V3C =vec3(1.875,1.875,0.75),  V3D =vec3(3.75,0,0), V3P;V3P.y +=V3C.y;V3P.y +=V3C.y;V3P.x -=V3C.x;V3P.x -=V3C.x; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(0.75);{ VA.xy =vec2(-1.125,1.5); VB.xy =vec2(1.125,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(0.75);{ VA.xy =vec2(-1.5,1.5); VB.xy =vec2(-0.375,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,0.75); VB.xy =vec2(-0.375,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.375,0.75); VB.xy =vec2(-0.375,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.375,-1.5); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(-1.5,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.375,0.75); VB.xy =vec2(-0.375,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.375,-1.5); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(-1.5,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.375,-1.5); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(-1.5,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(-1.5,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.125,1.5); VB.xy =vec2(-1.125,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.125,0); VB.xy =vec2(-1.5,-0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.125,0); VB.xy =vec2(-1.5,-0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.75,1.5); VB.xy =vec2(-0.75,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.75,0); VB.xy =vec2(-0.375,-0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.75,0); VB.xy =vec2(-0.375,-0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-0.75); VB.xy =vec2(-0.375,-0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.75,1.5); VB.xy =vec2(0.75,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.75,1.5); VB.xy =vec2(0,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0.75); VB.xy =vec2(1.5,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0.75); VB.xy =vec2(1.125,1.125); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.75,1.5); VB.xy =vec2(0,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0.75); VB.xy =vec2(1.5,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0.75); VB.xy =vec2(1.125,1.125); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0.75); VB.xy =vec2(1.5,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0.75); VB.xy =vec2(1.125,1.125); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0.75); VB.xy =vec2(1.125,1.125); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.375,0.75); VB.xy =vec2(0.375,0.375); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.375,0.375); VB.xy =vec2(0,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.375,0.375); VB.xy =vec2(0,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.125,0.75); VB.xy =vec2(1.125,0.375); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.125,0.375); VB.xy =vec2(1.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.125,0.375); VB.xy =vec2(1.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-0.75); VB.xy =vec2(0.75,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.75,0); VB.xy =vec2(1.125,-0.375); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.125,-0.375); VB.xy =vec2(0,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.75,0); VB.xy =vec2(1.125,-0.375); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.125,-0.375); VB.xy =vec2(0,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.125,-0.375); VB.xy =vec2(0,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.375,-0.375); VB.xy =vec2(1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(0.75);{ VA.xy =vec2(-0.375,1.5); VB.xy =vec2(-1.5,-0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.75,0.75); VB.xy =vec2(-0.75,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.375,1.5); VB.xy =vec2(0.375,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.375,-1.5); VB.xy =vec2(1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.375,-1.5); VB.xy =vec2(1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0.75); VB.xy =vec2(0.375,0); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D;V3P =vec3(0);V3P.y -=V3C.y;V3P.y -=V3C.y;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(0.75);{ VA.xy =vec2(1.5,1.5); VB.xy =vec2(-0.75,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,1.5); VB.xy =vec2(0,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,0.75); VB.xy =vec2(0,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,2.25); VB.xy =vec2(1.5,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2.25,2.25); VB.xy =vec2(2.25,1.5); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(0.75);{ VA.xy =vec2(-0.75,1.5); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1.5); VB.xy =vec2(0,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-1.5); VB.xy =vec2(1.5,-0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-1.5); VB.xy =vec2(1.5,-0.75); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(0.75);{ VA.xy =vec2(-1.5,1.5); VB.xy =vec2(1.5,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1.5); VB.xy =vec2(1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-1.5); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1.5); VB.xy =vec2(1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-1.5); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-1.5); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(0.75);{ VA.xy =vec2(-0.75,1.5); VB.xy =vec2(0.75,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(0.75);{ VA.xy =vec2(0,1.5); VB.xy =vec2(0,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,0); VB.xy =vec2(-1.5,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,0.75); VB.xy =vec2(1.5,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0.75); VB.xy =vec2(0,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,0.75); VB.xy =vec2(1.5,0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0.75); VB.xy =vec2(0,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0.75); VB.xy =vec2(0,-1.5); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(0.75);{ VA.xy =vec2(-0.75,1.5); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(0.75,-0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(0.75,-0.75); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.75,0); VB.xy =vec2(1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D;}
	return NP;
}
/*ここまで*/

/*個別デモ用関数*/
float fNObject_Zirconium17(vec4 VP){
	float NP =1e+6, nE =6.0;
	const int ciCut =2;

	NP =min(NP, length(VP.xyz) -1.0 *nE);
	NP =max(NP,-VP.z -0.7 *nE);

	for(int I =0; I <ciCut; I++){
		vec4 VPi =VP;

		VPi.xy *=fM2Rotate(float(I) /float(ciCut) *acos(-1.0));

		NP =max(NP, abs(VPi.x) +VPi.z -1.0 *nE);
		NP =max(NP, abs(VPi.x) *2.00 -VPi.z -2.00 *nE);
		NP =max(NP, abs(VPi.x) *0.65 -VPi.z -0.90 *nE);

		VPi.xy *=fM2Rotate(0.5 /float(ciCut) *acos(-1.0));

		NP =max(NP, abs(VPi.x) +VPi.z -1.0 *nE);
		NP =max(NP, abs(VPi.x) *1.30 -VPi.z -1.40 *nE);
		NP =max(NP, abs(VPi.x) *0.45 -VPi.z -0.83 *nE);
	}
	NP =NP *0.75 +(length(VP.xyz) -1.0 *nE) *0.25;
	return NP;
}
/*ここまで*/

vec4 fVPSet(vec3 V3P){
	vec4 VP =vec4(V3P, nTime);
	/*座標系とマウス操作の関係等を記述*/
	VP.xyz *=fM3Rotate(-VMouse.yx *2.0);

	return VP;
}

float fNMap(vec3 V3P){
	vec4 VP =fVPSet(V3P);
	float NP =1e+6;

	/*所要の図形の表面距離を記述*/
	sface SFt =fSFSet_Default();

	if(true){	/*二酸化ジルコニウム*/
		vec4 VPi =VP;
		VPi.xyz *=fM3Rotate(vec3(VPi.w));
		float nPi =fNObject_Zirconium17(VPi);

		sface SFi =fSFSet_Default();
		SFi.ID_Object =11;
		SFi.nDistance = nPi;
		SFt =fSFMin(SFt, SFi);
	}

	if(true){
		vec4 VPi =VP;
		VPi.yzx +=sin(+vec3(7,5,3) *0.1 *VPi.w) *12.0;
		VPi.yzx *=fM3Rotate(vec3(VPi.w));
		float nPi =length(max(abs(VPi.xyz) -2.0, 0.0)) -0.1;
		sface SFi =fSFSet_Default();
		SFi.nDistance = nPi;
		SFi.ID_Object =12;
		SFt =fSFSmoothMin(SFt, SFi, 1.0);
	}

	if(true){
		vec4 VPi =VP;
		VPi.yzx +=sin(-vec3(7,3,7) *0.1 *VPi.w) *8.0;
		VPi.yzx *=fM3Rotate(vec3(VPi.w));
		float nPi =length(vec2(length(VPi.xy) -2.0, VPi.z)) -1.0;
		sface SFi =fSFSet_Default();
		SFi.ID_Object =13;
		SFi.nDistance = nPi;
		SFt =fSFSmoothMin(SFt, SFi, 1.0);
	}

	if(true){	/*柱*/
		vec4 VPi =VP;
		VPi.xz =abs(VPi.xz) -12.0;
		sface SFi =fSFSet_Default();
		SFi.nDistance = length(max(abs(VPi.xz) -2.0, 0.0)) -0.1;
		SFi.ID_Object =102;
		SFt =fSFMin(SFt, SFi);
 	}

	if(true){	/*水面*/
		vec4 VPi =VP;
		VPi.xz +=vec2(0.1, 1) *VPi.w;
		sface SFi =fSFSet_Default();
		SFi.nDistance = abs(VPi.y +8.0 +sin(VPi.x +sin(VPi.z +VPi.w)) *sin(VPi.z +sin(VPi.x +VPi.w)) *0.02) -0.5;
		SFi.ID_Object =101;
		SFt =fSFSmoothMin(SFt, SFi, 4.0);
 	}

	NP =min(NP, SFt.nDistance);

	/*ここまで*/

	SF =SFt;
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
	vec4 VP =vec4(V2UV, 0, nTime), VColor =vec4(1);
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
	/*背景の色彩を記述*/

	VColor =clamp(VColor, 0.0, 1.0);
	if(true){	/*タイトル*/
		vec4 VPi =VP;
		VPi.xy *=12.0 +sin(vec2(2,3) *VPi.w +VPi.xy *8.0) *0.5;
		VPi.xy *=fM2Rotate(sin(VPi.w) *0.1);
		float nL =fNLetters00(VPi);
		vec3 V3C;
		if(nL <0.0){
			V3C =(sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VP.w *3.0) *0.5 +0.5)* clamp(1.0 -nL *nL, 0.0, 1.0);
		}
		V3C *= sin(VP.w *0.5) *0.5 -0.5;
		VColor.rgb +=V3C;
	}

	/*ここまで*/
	return VColor;
}

sface fSFEffect_Before(sface SF, smarch SM){
	if(!SM.bTouch)	return SF;
	vec4 VColor =SF.VColor;
	vec3 V3RRR =SF.V3Real_Reflect_Refract;
	vec4 VP =fVPSet(SM.V3P);
	vec3 V3NL =SM.V3NormalLine;

	/*オブジェクト・パレットごとの色彩効果を記述*/

	if(true){	/*基本*/
		if(SF.ID_Pallet == 1) VColor.rgb =vec3(0.75,	0,	0);
		if(SF.ID_Pallet == 2) VColor.rgb =vec3(1,		0,	0);
		if(SF.ID_Pallet == 3) VColor.rgb =vec3(1,		0.75,	0);
		if(SF.ID_Pallet == 4) VColor.rgb =vec3(1,		1,	0);
		if(SF.ID_Pallet == 5) VColor.rgb =vec3(0,		1,	0);
		if(SF.ID_Pallet == 6) VColor.rgb =vec3(0,		0,	1);
		if(SF.ID_Pallet == 7) VColor.rgb =vec3(1,		0,	1);
		if(SF.ID_Pallet == 8) VColor.rgb =vec3(0.75);
		if(SF.ID_Pallet == 9) VColor.rgb =vec3(1);
		if(SF.ID_Pallet ==10) VColor.rgb =vec3(0);
		VColor.rgb =VColor.rgb *0.9 +0.1;
	}

	{	/*もちゃもちゃ合成、パレット利用*/
		vec3 V3C, V3CNext, V3R =SF.V3Real_Reflect_Refract, V3RNext =SF.V3Real_Reflect_Refract;
		if(SF.ID_Object ==11){
			V3C =sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 *sin(VP.x +sin(VP.y +VP.w)) *sin(VP.y +sin(VP.z +VP.w)) *sin(VP.z +sin(VP.y +VP.w)));
			V3R =vec3(1,2,3);
		}
		if(SF.ID_Object ==12)	V3C =vec3(1,0,0);
		if(SF.ID_Object ==13)	V3C =vec3(0,0,1);
		V3CNext =V3C;
		if(SF.ID_ObjectNext ==11){
			V3CNext =sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 *sin(VP.x +sin(VP.y +VP.w)) *sin(VP.y +sin(VP.z +VP.w)) *sin(VP.z +sin(VP.y +VP.w)));
			V3RNext =vec3(1,2,3);
		}
		if(SF.ID_ObjectNext ==12)	V3CNext =vec3(1,0,0);
		if(SF.ID_ObjectNext ==13)	V3CNext =vec3(0,0,1);

		VColor.rgb =mix(V3C, V3CNext, SF.nFusion);
		VColor.rgb =VColor.rgb *0.2 +0.8;
		VColor.a =1.0;
		V3RRR =mix(normalize(V3R), normalize(V3RNext), SF.nFusion);
	}

	if(SF.ID_Object ==101)		VColor.rgb =sign(sin(VP.x) *sin(VP.z)) *0.1 +vec3(1);
	if(SF.ID_Object ==102)		VColor.rgb =sin((vec3(0,1,2) /3.0 +(sign(VP.x) +sign(VP.z)) /8.0) *acos(-1.0) *2.0 +VP.w) *0.2 +0.8;

	/*ここまで*/
	SF.VColor =VColor;
	SF.V3Real_Reflect_Refract =V3RRR;
	return SF;
}

sface fSFEffect_After(sface SF, smarch SM){
	if(!SM.bTouch)	return SF;
	vec4 VColor =SF.VColor;
	vec4 VP =fVPSet(SM.V3P);
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

smarch fSMRayMarch(vec3 V3P_Start, vec3 V3Direction, float nLength){
	V3Direction =normalize(V3Direction);
	vec3 V3P;
	float nDistance_Min =1e+6, nAdjust =0.5, nDistanceMax =2.0;
	bool bTouch;
	int iLoop;
	nLength +=0.02;
	for(int I =0; I <ciDefinition; I++){
		V3P =V3P_Start +V3Direction *nLength;
		float nDistance =fNMap(V3P);
		nDistance =min(abs(nDistance) *nAdjust, nDistanceMax);
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

sface fSFEffect(sface SF, smarch SM, vec3 V3P_Light){

	if(true){	/*光源シェーディング*/
		SF.VColor.rgb *=dot(SM.V3NormalLine, normalize(V3P_Light))*0.5 +0.5;
	}

	if(false){	/*縁取シェーディング*/
		SF.VColor.rgb *=1.0 -SM.nLoop;
	}

	if(true){	/*影*/
		if(SM.bTouch){
			float nShadow;
			smarch SM_Shadow =fSMRayMarch(SM.V3P, normalize(V3P_Light -SM.V3P), 1.0);
			nShadow =1.0 -clamp(SM_Shadow.nDistance_Min, 0.0, 1.0);
			if(SM_Shadow.bTouch)	nShadow =1.0;
			SF.VColor.rgb -=nShadow *0.25;
		}
	}
	return SF;
}

vec4 fVMain(vec2 V2UV){
	vec3 V3Camera =VP_DefaultCamera.xyz, V3Direction =normalize(vec3(V2UV, 1)), V3P_Light =VP_DefaultLight.xyz;

	SF =fSFSet_Default();
	sface SF1st, SF2nd_Reflect, SF2nd_Refract;
	SF1st =SF2nd_Reflect =SF2nd_Refract =SF;

	bool bTouch1st, bTouch2nd_Reflect, bTouch2nd_Refract;
	smarch SM1st, SM2nd_Reflect, SM2nd_Refract;

	{
		smarch SM =fSMRayMarch(V3Camera, V3Direction, 0.0);
		SM1st =SM2nd_Reflect =SM2nd_Refract =SM;

		if(SM1st.bTouch){
			SF1st =SF;
			if(cbSetting_Effect_Before1st)			SF1st =fSFEffect_Before(SF1st, SM1st);
			if(cbSetting_Effect1st)	SF1st =fSFEffect(SF1st, SM1st, V3P_Light);
		}
	}

	SF2nd_Reflect =SF2nd_Refract =SF1st;

	if(cbSetting_March2nd_Reflect){
		SM2nd_Reflect.V3Direction =reflect(SM2nd_Reflect.V3Direction, SM2nd_Reflect.V3NormalLine);
		SM2nd_Reflect.V3P_Start =SM2nd_Reflect.V3P;
		smarch SM =fSMRayMarch(SM2nd_Reflect.V3P_Start, SM2nd_Reflect.V3Direction, 0.0);
		if(SM.bTouch){
			SF2nd_Reflect =SF;
			if(cbSetting_Effect_Before2nd_Reflect)	SF2nd_Reflect =fSFEffect_Before(SF2nd_Reflect, SM);
			if(cbSetting_Effect2nd_Reflect)	SF2nd_Reflect =fSFEffect(SF2nd_Reflect, SM, V3P_Light);
		}
		SM2nd_Reflect =SM;
	}

	if(cbSetting_March2nd_Refract){
		if(cbSetting_Refrax)	SM2nd_Refract.V3Direction =refract( SM2nd_Refract.V3Direction,+SM2nd_Refract.V3NormalLine, SF.nRefrax);
		SM2nd_Refract.V3P_Start =SM2nd_Refract.V3P;
		smarch SM =fSMRayMarch(SM2nd_Refract.V3P_Start, SM2nd_Refract.V3Direction, 0.1);
		if(SM.bTouch){
			{
				smarch SM2nd_RefractPlus =SM;
				if(cbSetting_Refrax)	SM2nd_RefractPlus.V3Direction =refract( SM2nd_RefractPlus.V3Direction,-SM2nd_RefractPlus.V3NormalLine, 1.0 /SF.nRefrax);
				SM2nd_RefractPlus.V3P_Start = SM2nd_RefractPlus.V3P;
				SM2nd_RefractPlus =fSMRayMarch(SM2nd_RefractPlus.V3P_Start, SM2nd_RefractPlus.V3Direction, 0.1);
				if(SM2nd_RefractPlus.bTouch){
					SM =SM2nd_RefractPlus;
				}
			}
			SF2nd_Refract =SF;
			if(cbSetting_Effect_Before2nd_Refract)	SF2nd_Refract =fSFEffect_Before(SF2nd_Refract, SM);
			if(cbSetting_Effect2nd_Refract)	SF2nd_Refract =fSFEffect(SF2nd_Refract, SM, V3P_Light);
		}
		SM2nd_Refract =SM;
	}

	vec3 V3RRR =SF1st.V3Real_Reflect_Refract;

	if(cbSetting_CeilFloor){
		if(!SM1st.bTouch){
			SF1st.VColor =fVCeilFloor(SM1st.V3Direction);
			SF2nd_Reflect =SF2nd_Refract =SF1st;
		}else{
			vec3 V3Direction =reflect(SM1st.V3Direction, SM1st.V3NormalLine);
			vec2 V2RR =V3RRR.xy;
			V2RR /=abs(V2RR.x) +abs(V2RR.y);
			SF1st.VColor =SF1st.VColor *V2RR.x +fVCeilFloor(V3Direction) *V2RR.y;
		}
	}

	SF1st.VColor.rgb *=VC_DefaultLight.rgb;
	SF2nd_Reflect.VColor.rgb *=VC_DefaultLight.rgb;
	SF2nd_Refract.VColor.rgb *=VC_DefaultLight.rgb;

	if(cbSetting_Effect_After1st)			SF1st =fSFEffect_After(SF1st, SM1st);
	if(cbSetting_Effect_After2nd_Reflect)	SF2nd_Reflect =fSFEffect_After(SF2nd_Reflect, SM2nd_Reflect);
	if(cbSetting_Effect_After2nd_Refract)	SF2nd_Refract =fSFEffect_After(SF2nd_Refract, SM2nd_Refract);

	V3RRR =normalize(V3RRR);
	vec4 VColor =SF1st.VColor *V3RRR.x +SF2nd_Reflect.VColor *V3RRR.y +SF2nd_Refract.VColor *V3RRR.z;

	if(cbSetting_Back && !SM1st.bTouch)	VColor =fVBack(V2UV);
	if(cbSetting_Front)	VColor =fVFront(V2UV, VColor);

	VColor.a =1.0;
	return VColor;
}

void main(void){
	vec2 V2UV =(gl_FragCoord.xy *2.0 -resolution.xy) /max(resolution.x, resolution.y);
	gl_FragColor =fVMain(V2UV);
}

