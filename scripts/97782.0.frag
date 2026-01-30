/*R041213作例　サーカス　by ニシタマオ　THE SEA PANTHER*/
/*サンドボックス上での試験用、簡易レイトレシステム、反射・屈折、ぼかし影、カラーパレット機能付（R041209版）*/
/*直近の改修：諸機能をinout文を使って整理*/
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

float nTime =time;
vec4 VMouse =vec4((mouse -0.5) *vec2(1,-1), 0, nTime);

const bool cbSetting_March2nd_Reflect =true;
const bool cbSetting_March2nd_Refract =true;
const bool cbSetting_CeilFloor =false;
const bool cbSetting_Back =true;
const bool cbSetting_Front =false;
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

vec4 VP_DefaultCamera =vec4(0, 8,-20, 0);
vec4 VP_DefaultLight =vec4(1,1,-1,0) *64.0;
vec4 VC_DefaultLight =vec4(1);
const int ciDefinition =50;

struct sface{
	float nDistance, nDistanceNext;
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
		{ vec3 V3C =vec3(2.5,2.5,1),  V3D =vec3(5,0,0), V3P;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x;V3P.x -=V3C.x; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,-2); VB.xy =vec2(-1.5,-1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1); VB.xy =vec2(-1.5,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,2); VB.xy =vec2(1.5,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,2); VB.xy =vec2(1.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1); VB.xy =vec2(-1.5,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,2); VB.xy =vec2(1.5,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,2); VB.xy =vec2(1.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,2); VB.xy =vec2(1.5,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,2); VB.xy =vec2(1.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,2); VB.xy =vec2(1.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,1); VB.xy =vec2(1,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,0); VB.xy =vec2(1,0); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,2); VB.xy =vec2(2,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,2); VB.xy =vec2(-2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0.5); VB.xy =vec2(2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,0.5); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,0.5); VB.xy =vec2(2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,0.5); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,0.5); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,-2); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-2,0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,0.5); VB.xy =vec2(-1,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1,0.5); VB.xy =vec2(1,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-0.5); VB.xy =vec2(1,-0.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-1); VB.xy =vec2(1,-1); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(0,2); VB.xy =vec2(0,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1); VB.xy =vec2(-2,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1.5); VB.xy =vec2(2,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1.5); VB.xy =vec2(2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1.5); VB.xy =vec2(2,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1.5); VB.xy =vec2(2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1.5); VB.xy =vec2(2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,0); VB.xy =vec2(1.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0); VB.xy =vec2(1.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-2); VB.xy =vec2(-1.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-2); VB.xy =vec2(-1.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,0); VB.xy =vec2(1.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-2); VB.xy =vec2(-1.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-2); VB.xy =vec2(-1.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,-2); VB.xy =vec2(-1.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-2); VB.xy =vec2(-1.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-2); VB.xy =vec2(-1.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,1); VB.xy =vec2(0,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1); VB.xy =vec2(1.5,-1); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,2); VB.xy =vec2(-1,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,1); VB.xy =vec2(-1,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,1); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-1,-1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-1); VB.xy =vec2(-0.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,1); VB.xy =vec2(-2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-1,-1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-1); VB.xy =vec2(-0.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-2,-2); VB.xy =vec2(-1,-1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-1); VB.xy =vec2(-0.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1,-1); VB.xy =vec2(-0.5,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-0.5,-2); VB.xy =vec2(2,-2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2); VB.xy =vec2(0.5,2); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,2); VB.xy =vec2(0.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,0); VB.xy =vec2(0,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,2); VB.xy =vec2(0.5,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,0); VB.xy =vec2(0,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,0); VB.xy =vec2(0,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,1); VB.xy =vec2(2,1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1); VB.xy =vec2(0.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,1); VB.xy =vec2(0.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0.5,0.5); VB.xy =vec2(2,-1.5); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1);{ VA.xy =vec2(-2,2); VB.xy =vec2(-2,-1); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(2,2); VB.xy =vec2(1,-2); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D;}

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

sskelton fSSPSet_Dora01(sskelton SS){
	SS.VP_Cntr;
	SS.VP_Body =vec4(0,	0,	0,	1);
	SS.VP_Shld =vec4(0,	1,	0,	0);
	SS.VP_Neck =vec4(0,	0.3,	0,	0.1);
	SS.VP_Head =vec4(0,	1.3,	0,	0);
	SS.VP_ArRU =vec4(+1,	0,	0,	0.4);
	SS.VP_ArLU =vec4(-1,	0,	0,	0.4);
	SS.VP_ArRL =vec4(0,	-0.8,	0,	0.3);
	SS.VP_ArLL =vec4(0,	-0.8,	0,	0.3);
	SS.VP_LeRU =vec4(+0.5,	-0.2,	0,	0.45);
	SS.VP_LeLU =vec4(-0.5,	-0.2,	0,	0.45);
	SS.VP_LeRL =vec4(0,	-0.8,	0,	0.4);
	SS.VP_LeLL =vec4(0,	-0.8,	0,	0.4);
	SS.VP_HndR =vec4(0,	-0.8,	0,	0);
	SS.VP_HndL =vec4(0,	-0.8,	0,	0);
	SS.VP_FotR =vec4(0,	-0.8,	0,	0);
	SS.VP_FotL =vec4(0,	-0.8,	0,	0);
	return SS;
}
/*動作部*/
sskelton fSSRSet_Salt01P(sskelton SS){
	float nD =acos(-1.0) /180.0;
	SS.VR_Cntr;
	SS.VR_Body =vec4(-30,	0,	0,	0);
	SS.VR_Shld =vec4(0,	0,	0,	0);
	SS.VR_Neck =vec4(-60,	0,	0,	1);
	SS.VR_Head =vec4(0,	0,	0,	1);
	SS.VR_ArRU =vec4(+60,	0,	+15,	1);
	SS.VR_ArLU =vec4(+60,	0,	-15,	1);
	SS.VR_ArRL =vec4(+60,	0,	-30,	1);
	SS.VR_ArLL =vec4(+60,	0,	+30,	1);
	SS.VR_LeRU =vec4(+60,	0,	0,	0);
	SS.VR_LeLU =vec4(+60,	0,	0,	0);
	SS.VR_LeRL =vec4(0,	0,	0,	-0.75);
	SS.VR_LeLL =vec4(0,	0,	0,	-0.75);
	SS.VR_HndR =vec4(0,	0,	0,	1);
	SS.VR_HndL =vec4(0,	0,	0,	1);
	SS.VR_FotR =vec4(0,	0,	0,	1);
	SS.VR_FotL =vec4(0,	0,	0,	1);

	SS =fSSRChange_Multiple(SS, nD);

	return SS;
}

sskelton fSSRSet_Salt01N(sskelton SS){
	float nD =acos(-1.0) /180.0, nS =sin(SS.VP.w *acos(-1.0) *2.0 *5.0);
	SS.VR_Cntr;
	SS.VR_Body =vec4(0,	0,	0,	0);
	SS.VR_Shld =vec4(0,	0,	0,	0);
	SS.VR_Neck =vec4(0,	0,	0,	1);
	SS.VR_Head =vec4(0,	0,	0,	1);
	SS.VR_ArRU =vec4(0,	0,	+90.0 +30.0 *nS,	1);
	SS.VR_ArLU =vec4(0,	0,	-90.0 +30.0 *nS,	1);
	SS.VR_ArRL =vec4(0,	0,	0,	1);
	SS.VR_ArLL =vec4(0,	0,	0,	1);
	SS.VR_LeRU =vec4(+30.0 *nS,	0,	+15,	0);
	SS.VR_LeLU =vec4(-30.0 *nS,	0,	-15,	0);
	SS.VR_LeRL =vec4(0,	0,	0,	1);
	SS.VR_LeLL =vec4(0,	0,	0,	1);
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

sface fSFAttachment_HeadDora01(vec4 VP){
	int iBrown =1, iRed =2, iOrange =3, iYellow =4, iGreen =5, iBlue =6, iPurple =7, iGrey =8, iWhite =9, iBlack =10;
	float nSize =1.5;
	sface SF =fSFSet_Default();
	{
		sface SFi =fSFSet_Default();

		vec4 VC;
		vec3 V3RRR;
		float nL;
		vec2 V2P;

		vec3 V3P =VP.xyz;
		SFi.nDistance =length(V3P) -1.0 *nSize;

		int ID_Pallet =iBlue;

		V2P =VP.xy -vec2(0,-0.3) *nSize;
		nL =length(V2P) -0.8 *nSize;
		ID_Pallet=(nL >0.0)? ID_Pallet:		iWhite; 
		
		V2P =VP.xy;
		V2P.x =abs(V2P.x);
		V2P -=vec2(0.2,0.5) *nSize;
		V2P.y *=0.75;
		nL =length(V2P) -0.2 *nSize;
		ID_Pallet=(nL >0.0)? ID_Pallet:		iWhite; 

		V2P =VP.xy;
		V2P.x =abs(V2P.x);
		V2P -=vec2(0.15,0.4) *nSize;
		nL =length(V2P) -0.075 *nSize;
		ID_Pallet=(nL >0.0)? ID_Pallet:		iBlack; 


		nL =length(V3P) -0.9 *nSize;
		ID_Pallet=(nL >0.0)? ID_Pallet:		iRed; 

		nL =-V3P.z;
		ID_Pallet=(nL >0.0)? ID_Pallet:		iBlue; 

		SFi.ID_Pallet =ID_Pallet;
		SF =fSFMin(SF, SFi);
	}

	{
		vec3 V3P =VP.xyz -vec3(0,-0.2,-1.4) *nSize;
		float nPi =max(length(V3P) -0.85 *nSize, V3P.y);
		SF.nDistance =max(SF.nDistance,-nPi);
	}

	{
		vec3 V3P =VP.xyz -vec3(0,0,-1.2) *nSize;
		sface SFi =fSFSet_Default();

		SFi.nDistance =length(V3P) -0.2 *nSize;
		SFi.ID_Pallet =iRed;
		SF =fSFMin(SF, SFi);
	}
	return SF;
}

sface fSFAttachment_NeckDora01(vec4 VP){
	int iBrown =1, iRed =2, iOrange =3, iYellow =4, iGreen =5, iBlue =6, iPurple =7, iGrey =8, iWhite =9;
	float nSize =1.5;

	sface SF =fSFSet_Default();
	{
		vec3 V3P =VP.xyz;
		sface SFi =fSFSet_Default();
		SFi.nDistance =length(vec2(length(V3P.zx) -0.7 *nSize, V3P.y)) -0.15 *nSize;
		SFi.ID_Pallet =iRed;
		SF =fSFMin(SF, SFi);			
	}

	{
		vec3 V3P =VP.xyz -vec3(0,-0.2,-0.9) *nSize;
		sface SFi =fSFSet_Default();

		SFi.nDistance =length(V3P) -0.2 *nSize;
		SFi.ID_Pallet =iYellow;
		SF =fSFMin(SF, SFi);			
	}
	return SF;
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

sface fSFOutfit_Dora01(sskelton SS){
	int iBrown =1, iRed =2, iOrange =3, iYellow =4, iGreen =5, iBlue =6, iPurple =7, iGrey =8, iWhite =9;
	sface SF =fSFSet_Default();
	vec4 VP =SS.VP;
	VP.xyz *=fM3Rotate(SS.VR_Cntr.xyz);

	{
		vec4 VPi =VP;
		VPi.xyz =fV3Attach(VPi.xyz, SS.VP_Head.xyz, SS.VR_Head.xyz);
		sface SFi =fSFAttachment_HeadDora01(VPi);
		SF =fSFMin(SF, SFi);
	}

	{
		vec4 VPi =VP;
		VPi.xyz =fV3Attach(VPi.xyz, SS.VP_Neck.xyz, SS.VR_Neck.xyz);
		sface SFi =fSFAttachment_NeckDora01(VPi);
		SF =fSFMin(SF, SFi);
	}

	{
		vec3 V3P =fV3Attach(VP.xyz, SS.VP_Body.xyz, SS.VR_Body.xyz);
		sface SFi =fSFSet_Default();
		SFi.nDistance =length(V3P -vec3(0,-0.6,1)) -0.4;
		SFi.ID_Pallet =iRed;
		SF =fSFMin(SF, SFi);
	}

	{
		vec3 V3P =fV3Attach(VP.xyz, SS.VP_HndR.xyz, SS.VR_HndR.xyz);
		sface SFi =fSFSet_Default();
		SFi.nDistance =length(V3P) -0.5;
		SFi.ID_Pallet =iWhite;
		SF =fSFMin(SF, SFi);
	}

	{
		vec3 V3P =fV3Attach(VP.xyz, SS.VP_HndL.xyz, SS.VR_HndL.xyz);
		sface SFi =fSFSet_Default();
		SFi.nDistance =length(V3P) -0.5;
		SFi.ID_Pallet =iWhite;
		SF =fSFMin(SF, SFi);
	}

	{
		vec3 V3P =fV3Attach(VP.xyz, SS.VP_FotR.xyz, SS.VR_FotR.xyz);
		sface SFi =fSFSet_Default();
		SFi.nDistance =max(length(V3P) -0.6,-V3P.y -0.4);
		SFi.ID_Pallet =iWhite;
		SF =fSFMin(SF, SFi);
	}

	{
		vec3 V3P =fV3Attach(VP.xyz, SS.VP_FotL.xyz, SS.VR_FotL.xyz);
		sface SFi =fSFSet_Default();
		SFi.nDistance =max(length(V3P) -0.6,-V3P.y -0.4);
		SFi.ID_Pallet =iWhite;
		SF =fSFMin(SF, SFi);
	}

	return SF;
}

/*全て統合した完成部*/
float fNObject_SaltBear01(vec4 VP, vec4 VSalt){
	sskelton SS;
	VP.w *=0.25;

	float nW =mod(VP.w, 1.0) *2.0;
	VP.y -=2.0 +(1.0 -(nW -1.0)*(nW -1.0)) *VSalt.w;

	VP.xyz *=fM3Rotate(nW *acos(-1.0) *VSalt.xyz);

	SS.VP =VP;

	SS =fSSPSet_Bear01( SS);
	SS =fSSChange_Inbetween(fSSRSet_Salt01P( SS), SS, cos(VP.w *acos(-1.0) *2.0));
	SS =fSSkeltonMake( SS);

	float NP =min(fNMuscle_Animal01(SS), fNOutfit_Bear01(SS));
	return NP;
}

sface fSFObject_SaltDora01(vec4 VP, vec4 VSalt){
	VP.w *=0.25;
	float nW =mod(VP.w, 1.0) *2.0;
	VP.y -=2.0 +(1.0 -(nW -1.0)*(nW -1.0)) *VSalt.w;
	VP.xyz *=fM3Rotate(nW *acos(-1.0) *VSalt.xyz);

	sskelton SS;
	SS.VP =VP;
	SS =fSSPSet_Dora01( SS);
	SS =fSSChange_Inbetween(fSSRSet_Salt01P( SS), fSSRSet_Salt01N( SS), cos(VP.w *acos(-1.0) *2.0));
	SS =fSSkeltonMake( SS);

	int ID_Pallet, iBrown =1, iRed =2, iOrange =3, iYellow =4, iGreen =5, iBlue =6, iPurple =7, iGrey =8, iWhite =9;
	{
		vec3 V3P;
		vec2 V2P;
		float nL;

		ID_Pallet =iBlue;

		V3P =fV3Attach(VP.xyz, SS.VP_Body.xyz, SS.VR_Body.xyz);
		V2P =V3P.xy -vec2(0,0.3);
		nL =length(V2P) -0.8;
		if(nL <0.0)	ID_Pallet =iWhite;

		nL =max(length(V2P) -0.6, V2P.y);
		if(nL <0.0)	ID_Pallet =iGrey;

		nL =-V3P.z;
		if(nL <0.0)	ID_Pallet =iBlue;
	}

	sface SF_Muscle =fSFSet_Default();
	SF_Muscle.nDistance =fNMuscle_Animal01(SS);
	SF_Muscle.ID_Pallet =ID_Pallet;

	sface SF_Outfit =fSFOutfit_Dora01(SS);

	sface SF =fSFMin(SF_Muscle, SF_Outfit);
	return SF;
}
/*ここまで*/

/*個別デモ用関数*/

/*レンズ（R041209版）*/
float fNObject_Lens01(vec4 VP){
	float nSize =4.0;
	VP.z =abs(VP.z) +nSize;
	return length(VP.xyz) -nSize *1.5;
}

float fNObject_Lens02(vec4 VP){
	float nSize =4.0, NP =1e+6;
	NP =max(length(VP.xy) -nSize *1.0, abs(VP.z) -nSize *0.5);
	VP.z =abs(VP.z) -nSize *1.5;
	NP =max(NP,-length(VP.xyz) +nSize *1.4);
	return NP;
}
/*ここまで*/

float fNMap(vec3 V3P){
	vec4 VP =vec4(V3P, nTime);
	float NP =1e+6;

	/*所要の図形の表面距離を記述*/
	sface SF =fSFSet_Default();

	if(true){
		int iSQyz =fISequencer(24, 3);
		int iSQzx =fISequencer(24 *3, 3);

		vec4 VPi =VP;
		float nPi =fNObject_SaltBear01(VPi, vec4(iSQyz -1,iSQzx, 0, 12));
		sface SFi =fSFSet_Default();
		SFi.nDistance =nPi;
		SFi.ID_Object =11;
		SFi.VP =VPi;
		SF =fSFMin(SF, SFi);
	}

	if(false){
		int iSQyz =fISequencer(24, 3);
		int iSQzx =fISequencer(24 *3, 3);

		vec4 VPi =VP;
		sface SFi =fSFObject_SaltDora01(VPi, vec4(iSQyz -1,iSQzx, 0, 12));
		SFi.ID_Object =12;
		SFi.VP =VPi;
		SF =fSFMin(SF, SFi);
	}

	if(true){
		vec4 VPi =VP.zyxw;
		VPi.yz +=vec2(-4, 12);
		sface SFi =fSFSet_Default();
		SFi.nDistance =fNObject_Lens01(VPi);
		SFi.VP =VPi;
		SFi.V3Real_Reflect_Refract =vec3(0,1,2);
		SFi.ID_Object =201;
		SF =fSFMin(SF, SFi);
	}

	if(true){
		vec4 VPi =VP.zyxw;
		VPi.yz +=vec2(-4,-12);
		sface SFi =fSFSet_Default();
		SFi.nDistance =fNObject_Lens02(VPi);
		SFi.VP =VPi;
		SFi.V3Real_Reflect_Refract =vec3(0,1,2);
		SFi.ID_Object =201;
		SF =fSFMin(SF, SFi);
	}

	if(true){
		vec4 VPi =VP;
		VPi.xz =abs(VPi.xz) -8.0;
		float nPi =length(VPi.xz) -2.0;

		sface SFi =fSFSet_Default();
		SFi.nDistance =nPi;
		SFi.VP =VPi;
		SFi.ID_Object =102;
		SF =fSFMin(SF, SFi);
	}

	if(true){	/*水面*/
		float nPi =VP.y +(sin(VP.x +sin(VP.z *0.5 +VP.w)) +sin(VP.z +sin(VP.x *0.5 +VP.w))) *0.05;
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
	vec4 VP =vec4(V2UV, 0, nTime), VColor =vec4(0.5);
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

	if(SF.ID_Object ==11){
		VColor.rgb =sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VP.w *0.3) *0.3 +0.7;
		V3RRR =sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VP.w *0.1) *0.5 +0.5;
	}

	if(SF.ID_Object ==12){
		V3RRR =vec3(1,1,0);
		if(SF.ID_Pallet ==9)	V3RRR =vec3(1,0,0);
		if(SF.ID_Pallet ==6)	V3RRR =vec3(1,1,2);
		if(SF.ID_Pallet ==4)	V3RRR =vec3(1,2,0);
	}

	if(SF.ID_Object ==101)	VColor.rgb =mix(sign(sin(VP.x) *sin(VP.z)), 1.0, 0.8) *vec3(1);
	if(SF.ID_Object ==102)	VColor.rgb =mix(sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +(VP.x +VP.y +VP.z) *0.1 +VP.w), vec3(1), 0.8);

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
	float nDistance_Min =1e+6, nAdjust =0.75, nDistanceMax =4.0;
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

	V3RRR /=abs(V3RRR.x) +abs(V3RRR.y) +abs(V3RRR.z);
	vec4 VColor =SF1st.VColor *V3RRR.x +SF2nd_Reflect.VColor *V3RRR.y +SF2nd_Refract.VColor *V3RRR.z;

	if(cbSetting_Back && !SM1st.bTouch)	VColor =fVBack(V2UV);
	if(cbSetting_Front)	VColor =fVFront(V2UV, VColor);

	VColor.a =1.0;
	return VColor;
}

void main(void){
	vec2 V2UV =(gl_FragCoord.xy *2.0 -resolution.xy) /min(resolution.x, resolution.y);
	gl_FragColor =fVMain(V2UV);
}
