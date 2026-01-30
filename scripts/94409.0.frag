/*R041116作例　飛行機シリーズ　by ニシタマオ*/
/*サンドボックス上での試験用、簡易レイトレシステム、反射・屈折、ぼかし影、カラーパレット機能付（R041116版）*/
/*直近の改修：レイマーチの誤差縮小、機能整理*/
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

float nTime =time;
vec4 VMouse =vec4((mouse -0.5) *vec2(1,-1), 0, nTime);

const bool cbSetting_March2nd_Reflect =false;
const bool cbSetting_March2nd_Refract =false;
const bool cbSetting_CeilFloor =false;
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
const bool cbSetting_March2nd_RefractPlus =true;

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
	float nDistance;
	vec4 VColor;
	vec3 V3Real_Reflect_Refract;
	float nRefrax;
	float nLeapAfterRefract;
	int ID_Object;
	int ID_Pallet;
};

sface SF;

sface fSFSet_Default(void){
	sface SF;
	SF.VColor =vec4(1);
	SF.nDistance =1e+6;
	SF.V3Real_Reflect_Refract =vec3(1);
	SF.nRefrax =0.9;
	SF.nLeapAfterRefract =(cbSetting_March2nd_RefractPlus)? 0.1: 2.0;
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
	float nP0 =SF0.nDistance, nP1 =SF1.nDistance;
	sface SF;
	SF =fSFMin(SF0, SF1);
	float nH =exp(-nP0 *nK) +exp(-nP1 *nK);
	nH = -log(nH) /nK;
	SF.nDistance =nH;
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
	/*REPLACEE_LETTERS00*/
	return NP;
}
/*ここまで*/

/*飛行機*/
float fNObject_Airplane01(vec4 VP){
	float NP =1e+6, nPi, nE =1.0;
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

	VPi =VP;
	VPi.z +=2.0 *nE;
	VPi.y +=1.5 *nE;
	VPi.x =abs(VPi.x) -1.5 *nE;
	nPi =length(vec2(length(VPi.yz) -0.5 *nE, VPi.x)) -0.3 *nE;
	NP =min(NP, nPi);


	return NP;
}

vec3 fV3PGame_Airplane01(float nTime, float nSeed){
	vec3 V3P;
	vec4 VRandom =fVN(fNRandom(nSeed));
	vec3 V3W =VRandom.xyz -0.5;
	V3W =normalize(V3W +sign(V3W) *0.1) *vec3(2,1,2);


	V3P +=sin(V3W *nTime) *vec3(12,6,12);
	V3P.y -=6.0;
	return V3P;
}

mat3 fM3Rotate_Airplane01(float nTime, float nSeed){
	float nDTime =1e-1;
	vec3 V3P0 =fV3PGame_Airplane01(nTime +nDTime *0.0, nSeed);
	vec3 V3P1 =fV3PGame_Airplane01(nTime +nDTime *1.0, nSeed);
	vec3 V3P2 =fV3PGame_Airplane01(nTime +nDTime *2.0, nSeed);

	vec3 V3D01 =V3P1 -V3P0;
	vec3 V3D02 =V3P2 -V3P0;
	vec3 V3A =V3D02 -normalize(V3D01) *length(V3D02);

	float nRY =atan(V3D01.x, V3D01.z);
	float nRX =atan(V3D01.y, V3D01.z);
	float nRZ =atan(V3A.x, V3A.z);

	mat3 M3R =mat3(1,0,0,0,1,0,0,0,1);
	M3R *=fM3RotateY(-nRY);
	M3R *=fM3RotateX(+nRX *0.1);
	M3R *=fM3RotateZ(-nRZ *0.4 *sign(V3D01.z));

	return M3R;
}

vec4 fVAirplane01(vec4 VP, float nSeed){
	VP.xyz +=fV3PGame_Airplane01(VP.w, nSeed);
	VP.xyz *=fM3Rotate_Airplane01(VP.w, nSeed);
	return VP;
}

vec4 fVGun_Airplane01(vec4 VP, float nSeed){
	float nE =1.0;
	VP =fVAirplane01(VP, nSeed);
	VP.w +=sign(VP.x) *0.5;
	VP.x =abs(VP.x) -2.0 *nE;
	VP.y +=0.75 *nE;
	VP.z +=3.0 *nE;

	float nZ =VP.z +VP.w *20.0;
	float nZ_Mod =mod(nZ, 8.0) -4.0;
	if(VP.z <0.0)	VP.z =nZ_Mod;
	return VP;
}

/*ここまで*/

vec4 fVPSet(vec3 V3P){
	vec4 VP =vec4(V3P, nTime);
	/*座標系とマウス操作の関係等を記述、不要なら省いても可*/
	VP.xyz *=fM3Rotate(-VMouse.yx *2.0);

	return VP;
}

float fNMap(vec3 V3P){
	vec4 VP =fVPSet(V3P);
	float NP =1e+6;

	/*所要の図形の表面距離を記述*/
	sface SFt =fSFSet_Default();
	int iSQ =fISequencer(60, 2);

	if(true){	/*飛行機*/
		for(int I =0; I <2; I++){
			vec4 VPi =fVAirplane01(VP, float(I));
			float nPi =fNObject_Airplane01(VPi);
			sface SFi =fSFSet_Default();
			SFi.nDistance = nPi;
			SFi.ID_Object =11;
			SFi.ID_Pallet =I +1;
			SFt =fSFMin(SFt, SFi);
		}
	}

	if(iSQ ==1){	/*機関銃*/
		for(int I =0; I <2; I++){
			vec4 VPi =fVGun_Airplane01(VP, float(I));
			float nPi =length(VPi.xyz) -0.25;
			sface SFi =fSFSet_Default();
			SFi.nDistance = nPi;
			SFi.ID_Object =21;
			SFt =fSFMin(SFt, SFi);
		}
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

	if(true){	/*おどろおどろ*/
		vec4 VPi =VP;
		vec2 V2P =VPi.xy *4.0;
		for(int I =0; I <3; I++){
			V2P +=sin(V2P.yx *2.0 +VPi.w *float(I +1)) /float(I +1);
		}
		VColor.rgb =sin(vec3(0,1,2) /3.0 +acos(-1.0) *2.0 +V2P.x) *0.2 +0.8;
	}

	if(true){	/*タイトル*/
		vec4 VPi =VP;
		VPi.xy *=12.0 +sin(vec2(2,3) *VPi.w +VPi.xy *8.0);
		VPi.xy *=fM2Rotate(sin(VPi.w) *0.2);
		float nL =fNLetters00(VPi);
		if(nL <0.0)	VColor.rgb = vec3(clamp(0.0, 1.0, -nL *2.0));
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

	if(SF.ID_Object ==101)		VColor.rgb =sign(sin(VP.x) *sin(VP.z)) *0.1 +vec3(1);
	if(SF.ID_Object ==102)		VColor.rgb =sin((vec3(0,1,2) /3.0 +(sign(VP.x) +sign(VP.z)) /8.0) *acos(-1.0) *2.0 +VP.w) *0.2 +0.8;

	if(SF.ID_Object ==11){
		VColor.rgb =sin((vec3(0,1,2) /3.0 +float(SF.ID_Pallet) /10.0)*acos(-1.0) *2.0 +VP.w *0.1) *0.2 +0.8;
		V3RRR =vec3(1,2,0);
	}

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

	int iSQ =fISequencer(60, 2);
	if(iSQ ==1){
		for(int I =0; I <2; I++){
			vec4 VPi =fVGun_Airplane01(VP, float(I));
			float nL =length(VPi.xyz);
			VColor.rgb +=vec3(1,0.4,0.1) /nL /nL;
		}
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
	float nDistance_Min =1e+6, nAdjust =0.75;
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
	float nA, nShadow =0.25;

	smarch SM1st, SM2nd_Reflect, SM2nd_Refract;

	{
		smarch SM =fSMRayMarch(V3Camera, V3Direction, 0.0);
		SM1st =SM2nd_Reflect =SM2nd_Refract =SM;

		if(SM.bTouch){
			SF1st =SF;
			if(cbSetting_Effect_Before1st)			SF1st =fSFEffect_Before(SF1st, SM1st);
			if(cbSetting_Effect1st)	SF1st =fSFEffect(SF1st, SM1st, V3P_Light);
	
			SM2nd_Reflect.V3Direction =reflect(SM.V3Direction, SM.V3NormalLine);
			SM2nd_Reflect.V3P_Start =SM.V3P;
			SM2nd_Reflect.nLength =0.0;

			SM2nd_Refract.V3Direction =SM.V3Direction;
			if(cbSetting_Refrax)	SM2nd_Refract.V3Direction =refract( SM.V3Direction, SM.V3NormalLine, SF.nRefrax);
			SM2nd_Refract.V3P_Start =SM.V3P;
			SM2nd_Refract.nLength =SF.nLeapAfterRefract;
		}
	}

	SF2nd_Reflect =SF2nd_Refract =SF1st;

	if(cbSetting_March2nd_Reflect){

		smarch SM =fSMRayMarch(SM2nd_Reflect.V3P_Start, SM2nd_Reflect.V3Direction, SM2nd_Reflect.nLength);
		SM2nd_Reflect =SM;

		if(SM.bTouch){
			SF2nd_Reflect =SF;
			if(cbSetting_Effect_Before2nd_Reflect)	SF2nd_Reflect =fSFEffect_Before(SF2nd_Reflect, SM2nd_Reflect);
			if(cbSetting_Effect2nd_Reflect)	SF2nd_Reflect =fSFEffect(SF2nd_Reflect, SM2nd_Reflect, V3P_Light);
		}
	}

	if(cbSetting_March2nd_Refract){

		smarch SM =fSMRayMarch(SM2nd_Refract.V3P_Start, SM2nd_Refract.V3Direction, SM2nd_Refract.nLength);

		if(SM.bTouch){
			if(cbSetting_March2nd_RefractPlus){

				SM.V3P_Start = SM.V3P;
				if(cbSetting_Refrax)	SM.V3Direction =refract( SM.V3Direction,-SM.V3NormalLine, 1.0 /SF.nRefrax);
				SM =fSMRayMarch(SM.V3P_Start, SM.V3Direction, SM.nLength);
			}

			if(SM.bTouch){
				SF2nd_Refract =SF;
				if(cbSetting_Effect_Before2nd_Refract)	SF2nd_Refract =fSFEffect_Before(SF2nd_Refract, SM);
				if(cbSetting_Effect2nd_Refract)	SF2nd_Refract =fSFEffect(SF2nd_Refract, SM, V3P_Light);
			}
		}
		SM2nd_Refract =SM;

	}

	vec3 V3RRR =SF1st.V3Real_Reflect_Refract;

	if(!SM1st.bTouch){
		SF1st.VColor =vec4(1);
		SF2nd_Reflect =SF2nd_Refract =SF1st;
	}

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

	if(!cbSetting_CeilFloor && !SM1st.bTouch)	VColor =fVBack(V2UV);

	VColor.a =1.0;
	return VColor;
}

void main(void){
	vec2 V2UV =(gl_FragCoord.xy *2.0 -resolution.xy) /max(resolution.x, resolution.y);
	gl_FragColor =fVMain(V2UV);
}

