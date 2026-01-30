/*R050121作例　兎跳び　by ニシタマオ　THE SEA PANTHER*/
/*サンドボックス上での試験用、簡易レイトレシステム、反射・屈折、ぼかし影、カラーパレット機能付（R050121版）*/
/*直近の改修：足首部の計算間違い修正、兎追加*/
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

float nTime =time;
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

vec4 VP_DefaultCamera =vec4(0, 8,-24, 0);
vec4 VP_DefaultLight =vec4(1,1,-1,0) *64.0;
vec4 VC_DefaultLight =vec4(1);

const int ciDefinition =100;
float cnMarchStepAdjust =0.5;
float cnMarchStepLimit =2.0;

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
		{ vec3 V3C =vec3(2.5,2.5,1),  V3D =vec3(5,0,0), V3P;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(2,2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1); VB.xy =vec2(2,-1); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0); VB.xy =vec2(2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,3); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,3); VB.xy =vec2(3,2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(0,2); VB.xy =vec2(0,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0); VB.xy =vec2(-2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1); VB.xy =vec2(2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1); VB.xy =vec2(0,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1); VB.xy =vec2(2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1); VB.xy =vec2(0,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1); VB.xy =vec2(0,-2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,0); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(0,2); VB.xy =vec2(-1,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-2); VB.xy =vec2(-2,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0); VB.xy =vec2(-1,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2); VB.xy =vec2(3,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,0); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-2); VB.xy =vec2(-2,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0); VB.xy =vec2(-1,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2); VB.xy =vec2(3,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,0); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0); VB.xy =vec2(-1,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2); VB.xy =vec2(3,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,0); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2); VB.xy =vec2(3,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,0); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2); VB.xy =vec2(3,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,0); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,0); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(2,2); VB.xy =vec2(-2,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,1); VB.xy =vec2(1.5,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1); VB.xy =vec2(1.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0); VB.xy =vec2(-1.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,0); VB.xy =vec2(-1.5,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1); VB.xy =vec2(1.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0); VB.xy =vec2(-1.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,0); VB.xy =vec2(-1.5,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0); VB.xy =vec2(-1.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,0); VB.xy =vec2(-1.5,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,0); VB.xy =vec2(-1.5,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1.5); VB.xy =vec2(0,-0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-0.5); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-0.5); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,0); VB.xy =vec2(0.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-0.5); VB.xy =vec2(2,-1); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,2); VB.xy =vec2(-1,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,2); VB.xy =vec2(-1,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,1); VB.xy =vec2(-2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,2); VB.xy =vec2(-1,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,1); VB.xy =vec2(-2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,1); VB.xy =vec2(-2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1); VB.xy =vec2(-2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,1); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-1,-1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-1,-1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,0); VB.xy =vec2(-1,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,2); VB.xy =vec2(0.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,0); VB.xy =vec2(-0.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,0); VB.xy =vec2(-0.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,2); VB.xy =vec2(1,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,1.5); VB.xy =vec2(0,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,-0.5); VB.xy =vec2(0,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1.5); VB.xy =vec2(1.5,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-0.5); VB.xy =vec2(1.5,0); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,2); VB.xy =vec2(-1,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,2); VB.xy =vec2(-1,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-2); VB.xy =vec2(1,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,-2); VB.xy =vec2(1,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,2); VB.xy =vec2(-1,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-2); VB.xy =vec2(1,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,-2); VB.xy =vec2(1,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-2); VB.xy =vec2(1,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,-2); VB.xy =vec2(1,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,-2); VB.xy =vec2(1,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,3); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,3); VB.xy =vec2(3,2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D;}

	return NP;
}
/*ここまで*/

/*人体形状生成機能、中割機能付（R041213縮小版）by ニシタマオ*/
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

float fNMuscle_Man01(sskelton SS){
	vec4 VP =SS.VP, VA, VB;
	float NP =1e+6;
	VP.xyz *=fM3Rotate(SS.VR_Cntr.xyz);

	VA =SS.VP_Body, VB =SS.VP_Shld;
	NP =min(NP, fNMusclePart01(VP, VA, VB));
	VA =SS.VP_Neck, VB =SS.VP_Head;
	NP =min(NP, fNMusclePart01(VP, VA, VB));
	VA =SS.VP_ArRU, VB =SS.VP_ArRL;
	NP =min(NP, fNMusclePart01(VP, VA, VB));
	VA =SS.VP_ArRL, VB =SS.VP_HndR;
	NP =min(NP, fNMusclePart01(VP, VA, VB));
	VA =SS.VP_ArLU, VB =SS.VP_ArLL;
	NP =min(NP, fNMusclePart01(VP, VA, VB));
	VA =SS.VP_ArLL, VB =SS.VP_HndL;
	NP =min(NP, fNMusclePart01(VP, VA, VB));
	VA =SS.VP_LeRU, VB =SS.VP_LeRL;
	NP =min(NP, fNMusclePart01(VP, VA, VB));
	VA =SS.VP_LeRL, VB =SS.VP_FotR;
	NP =min(NP, fNMusclePart01(VP, VA, VB));
	VA =SS.VP_LeLU, VB =SS.VP_LeLL;
	NP =min(NP, fNMusclePart01(VP, VA, VB));
	VA =SS.VP_LeLL, VB =SS.VP_FotL;
	NP =min(NP, fNMusclePart01(VP, VA, VB));
	return NP;
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

sskelton fSSPSet_Bunny01(sskelton SS){
	SS.VP_Cntr;
	SS.VP_Body =vec4(0,	0,	0,	1);
	SS.VP_Shld =vec4(0,	1.5,	0,	0);
	SS.VP_Neck =vec4(0,	0,	0,	0.7);
	SS.VP_Head =vec4(0,	1.5,	0,	0);
	SS.VP_ArRU =vec4(+0.8,	0,	0,	0.4);
	SS.VP_ArLU =vec4(-0.8,-	0,	0,	0.4);
	SS.VP_ArRL =vec4(0,	-0.8,	0,	0.3);
	SS.VP_ArLL =vec4(0,	-0.8,	0,	0.3);
	SS.VP_LeRU =vec4(+0.6,	0,	0,	0.45);
	SS.VP_LeLU =vec4(-0.6,	0,	0,	0.45);
	SS.VP_LeRL =vec4(0,	-1,	0,	0.4);
	SS.VP_LeLL =vec4(0,	-1,	0,	0.4);
	SS.VP_HndR =vec4(0,	-0.8,	0,	0);
	SS.VP_HndL =vec4(0,	-0.8,	0,	0);
	SS.VP_FotR =vec4(0,	-1,	0,	0);
	SS.VP_FotL =vec4(0,	-1,	0,	0);
	return SS;
}
/*動作部*/

sskelton fSSRSet_Bunny01(sskelton SS){
	float nD =acos(-1.0) /180.0, nSR =sin(SS.VP.w *acos(-1.0)), nSL =sin((SS.VP.w +30.0/180.0)*acos(-1.0));
	SS.VR_Cntr;
	SS.VR_Body =vec4(-90.0 +15.0 *nSR,	0,	0,		0);
	SS.VR_Shld =vec4(0,			0,	0,		0);
	SS.VR_Neck =vec4(-45.0 +30.0 *nSR,			0,	0,		1);
	SS.VR_Head =vec4(0,			0,	0,		1);
	SS.VR_ArRU =vec4(+30.0 +60.0 *nSR,	0,	+15.0 *nSR,	1);
	SS.VR_ArLU =vec4(+30.0 +60.0 *nSL,	0,	-15.0 *nSL,	1);
	SS.VR_ArRL =vec4(+15.0 +15.0 *nSR,	0,	0,		1);
	SS.VR_ArLL =vec4(+15.0 +15.0 *nSL,	0,	0,		1);
	SS.VR_LeRU =vec4(-15.0 -75.0 *nSR,	0,	+15.0 -15.0 *nSR,	0);
	SS.VR_LeLU =vec4(-15.0 -75.0 *nSL,	0,	-15.0 +15.0 *nSL,	0);
	SS.VR_LeRL =vec4(-30.0 +45.0 *nSR,	0,	0,		1);
	SS.VR_LeLL =vec4(-30.0 +45.0 *nSL,	0,	0,		1);
	SS.VR_HndR =vec4(0,			0,	0,		1);
	SS.VR_HndL =vec4(0,			0,	0,		1);
	SS.VR_FotR =vec4(-30.0 -45.0 *nSR,			0,	0,		1);
	SS.VR_FotL =vec4(-30.0 -45.0 *nSL,			0,	0,		1);

	SS =fSSRChange_Multiple(SS, nD);

	SS.VP_Cntr.y =+sin((SS.VP.w -60.0/180.0) *acos(-1.0));
	return SS;
}
/*手足頭等の末節部*/

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
/*末節部を統合した総体部*/

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

/*全て統合した完成部*/

float fNObject_WalkBunny01(vec4 VP){
	sskelton SS;
	VP.y -=3.0;
	SS.VP =VP;
	SS =fSSPSet_Bunny01( SS);
	SS =fSSRSet_Bunny01( SS);
	SS =fSSkeltonMake( SS);

	float NP =fNSmoothMin(fNMuscle_Animal01(SS), fNOutfit_Bunny01(SS), 12.0);
	return NP;
}

/*ここまで*/

/*個別デモ用関数*/

/*ここまで*/

float fNMap(vec3 V3P){
	vec4 VP =vec4(V3P, nTime);
	float NP =1e+6;

	/*所要の図形の表面距離を記述*/
	sface SF =fSFSet_Default();

	if(true){
		vec4 VPi =VP;
		VPi.xz =VPi.zx;
		VPi.xyz *=fM3Rotate(vec3(VPi.w *0.1));

		float nTh =atan(VPi.y, VPi.z), nL =length(VPi.yz);
		float nTh_Mod =mod(nTh +VPi.w *0.5, acos(-1.0) /2.0) -acos(-1.0) /4.0;
		VPi.yz =vec2(cos(nTh_Mod),sin(nTh_Mod)) *nL;
		VPi.y -=16.0;
		VPi.xy *=fM2Rotate(nTh /2.0);
		VPi.y =abs(VPi.y) -1.0;

		sface SFi;

		SFi =fSFSet_Default(fNObject_WalkBunny01(VPi));

		SFi.ID_Object =11;
		SFi.VP =VPi;
		SF =fSFMin(SF, SFi);
	}

	if(true){
		vec4 VPi =VP;
		VPi.xz =VPi.zx;
		VPi.xyz *=fM3Rotate(vec3(VPi.w *0.1));

		sface SFi;
		vec2 V2Pi =vec2(length(VPi.yz) -16.0, VPi.x);

		float nTh =atan(VPi.y, VPi.z), nL =length(VPi.yz);
		V2Pi *=fM2Rotate(-nTh /2.0);

		float  nPi =length(max(abs(V2Pi) -vec2(0.8,2.0), 0.0)) -0.1;
		SFi =fSFSet_Default(nPi);

		SFi.ID_Object =103;
		SFi.VP =VPi;
		SF =fSFSmoothMin(SF, SFi, 4.0);
	}


	if(false){
		vec4 VPi =VP;
		VPi.xz =mod(VPi.xz, 24.0) -12.0;
		VPi.xz *=fM2Rotate(VPi.y *0.1);
		float nPi =length(max(abs(VPi.xz) -1.0, 0.0)) -0.1;
		sface SFi =fSFSet_Default(nPi);

		SFi.ID_Object =102;
		SFi.VP =VPi;
		SF =fSFMin(SF, SFi);
	}

	if(true){	/*水面*/
		float nPi =VP.y +12.0 +(sin(VP.x +sin(VP.z *0.5 +VP.w)) +sin(VP.z +sin(VP.x *0.5 +VP.w))) *0.05;
		sface SFi =fSFSet_Default();
		SFi.nDistance =nPi;
		SFi.ID_Object =101;
		SFi.VP =VP;
		SF =fSFSmoothMin(SF, SFi, 2.0);
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
	vec4 VP =vec4(V2UV, 0, nTime), VColor =vec4(1);
	/*背景の色彩を記述*/

	VColor.rgb *=0.5;

	/*ここまで*/
	return VColor;
}

vec4 fVFront(vec2 V2UV, vec4 VColor){
	vec4 VP =vec4(V2UV, 0, nTime);

	VP.y -=0.5;
	VP.xyz *=16.0;
	float nC =fNLetters00(VP);
	if(nC <0.0){
		VColor.rgb +=(sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VP.w) *0.3 +0.7) *clamp(1.0 +2.0 *nC, 0.0, 1.0)* (sin(VP.w) *0.5 +0.5);
	}

	return VColor;
}

vec4 fVColorPallet_Default(int ID_Pallet){
	vec4 VColor =vec4(1);
	if(ID_Pallet ==  1) VColor.rgb =vec3(0.75,	0,	0);
	if(ID_Pallet ==  2) VColor.rgb =vec3(1,		0,	0);
	if(ID_Pallet ==  3) VColor.rgb =vec3(1,		0.75,	0);
	if(ID_Pallet ==  4) VColor.rgb =vec3(1,		1,	0);
	if(ID_Pallet ==  5) VColor.rgb =vec3(0,		1,	0);
	if(ID_Pallet ==  6) VColor.rgb =vec3(0,		0,	1);
	if(ID_Pallet ==  7) VColor.rgb =vec3(1,		0,	1);
	if(ID_Pallet ==  8) VColor.rgb =vec3(0.5);
	if(ID_Pallet ==  9) VColor.rgb =vec3(1);
	if(ID_Pallet == 10) VColor.rgb =vec3(0);
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
		VColor =fVColorPallet_Default(SF.ID_Pallet);
		VColor.rgb =VColor.rgb *0.9 +0.1;
	}

	if(SF.ID_Object ==11){
		VColor.rgb =sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VP.w *0.3) *0.1 +0.9;
		V3RRR =sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VP.w *0.1) *0.5 +0.5;
	}

	if(SF.ID_Object ==101)	VColor.rgb =sign(sin(VP.x) *sin(VP.z)) *0.1 +vec3(0.9);
	if(SF.ID_Object ==103)	VColor.rgb =sign(sin(atan(SF.VP.y, SF.VP.z) *8.)) *0.2 +0.8*vec3(1);

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
			SF.VColor.rgb -=nShadow *0.3;
		}
	}
	return SF;
}

void fCameraSet(inout vec3 V3P, inout vec3 V3D){
	V3P.xy +=VMouse.xy *vec2(8,-8);
	V3P.zy *=fM2Rotate(+VMouse.y);
	V3P.zx *=fM2Rotate(-VMouse.x *8.0);

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
