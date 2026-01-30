/*R041129作例　空襲しリーズ　by ニシタマオ*/
/*サンドボックス上での試験用、簡易レイトレシステム、廉価ＰＣ用軽量版（R041127版）*/
/*直近の改修：視線回転追加（図形回転廃止）*/
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

float nTime =time;
vec4 VMouse =vec4((mouse -0.5) *vec2(1,-1), 0, nTime);

const bool cbSetting_Effect_Before =true;
const bool cbSetting_Effect =true;

vec4 VP_DefaultCamera =vec4(0,0,-32, 0);
vec4 VP_DefaultLight =vec4(1,1,-1,0) *64.0;
const int ciDefinition =100;

struct scamera{
	vec3 V3Position;
	vec3 V3Direction;
};

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

/*個別デモの専用機能　飛行機（R041130版）*/
float fNObject_Airplane01(vec4 VP){
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
	V3W =normalize(V3W +sign(V3W) *0.1) *vec3(2,1,1) *0.5;

	V3P +=sin(V3W *nTime) *vec3(16,8,4);
	V3P.y +=16.0;
	V3P.zx +=vec2(8,1) *nTime -vec2(8,0);	//移動
	return V3P;
}

mat3 fM3RGame_Airplane01(float nTime, float nSeed){
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

vec4 fVGame_Airplane01(vec4 VP, float nSeed){
	VP.xyz -=fV3PGame_Airplane01(VP.w, nSeed);
	VP.xyz *=fM3RGame_Airplane01(VP.w, nSeed);
	return VP;
}

vec4 fVGame_Gun_Airplane01(vec4 VP, float nSeed){
	float nE =1.0;
	VP =fVGame_Airplane01(VP, nSeed);
	VP.w +=sign(VP.x) *0.5;
	VP.x =abs(VP.x) -2.0 *nE;
	VP.y +=0.75 *nE;
	VP.z -=3.0 *nE;

	float nZ =VP.z -VP.w *20.0;
	float nZ_Mod =mod(nZ, 8.0) -4.0;
	if(VP.z >0.0)	VP.z =nZ_Mod;
	return VP;
}

/*個別デモの専用機能　自動車（R041119版）*/
float fNGame_Road01(vec2 V2P){
	vec3 V3E =vec3(0.11,0.13,1);
	float nHeight =sin(V2P.x *V3E.x +sin(V2P.y *V3E.y *2.0)) *V3E.z +sin(V2P.y *V3E.x +sin(V2P.x *V3E.y *2.0)) *V3E.z -8.0;
	return nHeight;

}

vec3 fV3PGame_Car01(float nTime, float nSeed){
	vec4 VRandom =fVN(fNRandom(nSeed));
	vec2 V2W =VRandom.xy -0.5;
	V2W =normalize(V2W +sign(V2W) *0.2) *0.2;

	vec3 V3P;
	V3P.xz =sin(V2W *nTime) *16.0;
	V3P.zx +=vec2(8,1) *nTime +vec2(8,0);	//移動
	V3P.y =fNGame_Road01(V3P.xz);
	return V3P;
}

mat3 fM3RGame_Car01(float nTime, float nSeed){
	float nDTime =1e-1;
	mat3 M3R =mat3(1,0,0,0,1,0,0,0,1);

	vec3 V3P0 =fV3PGame_Car01(nTime +nDTime *0.0, nSeed);
	vec3 V3P1 =fV3PGame_Car01(nTime +nDTime *1.0, nSeed);
	vec3 V3D01 =V3P1 -V3P0;
	float nR_XZ =atan(V3D01.x, V3D01.z);

	float nY00 =fNGame_Road01(V3P0.xz);
	float nY01 =fNGame_Road01(V3P0.xz +vec2(0,1) *0.01);
	float nY10 =fNGame_Road01(V3P0.xz +vec2(1,0) *0.01);
	float nR_YX =nY10 -nY00;
	float nR_YZ =nY01 -nY00;
	M3R *=fM3RotateZ(-nR_YX *100.0);
	M3R *=fM3RotateX(+nR_YZ *100.0);
	M3R *=fM3RotateY(-nR_XZ);

	return M3R;
}

vec4 fVGame_Car01(vec4 VP, float nSeed){
	VP.xyz -=fV3PGame_Car01(VP.w, nSeed);
	VP.xyz *=fM3RGame_Car01(VP.w, nSeed);
	return VP;
}

sface fSFObject_Car01(vec4 VP){
	sface SF =fSFSet_Default();
	float NP =1e+6, nSpeed =50.0;
	{
		vec4 VPi =VP;
		VPi.y -=2.0;
		float nPi =length(max(abs(VPi.xyz) -vec3(2,1,4), 0.0)) -0.1;
		VPi.yz -=vec2(1,2.5);
		nPi =min(nPi, length(max(abs(VPi.xyz) -vec3(2,1,1), 0.0)) -0.1);
		sface SFi =fSFSet_Default();
		SFi.nDistance =nPi;
		SFi.ID_Pallet =9;
		SF =fSFMin(SF, SFi);
	}

	{
		vec4 VPi =VP;
		VPi.y -=1.0;
		float nSignZ =sign(VPi.z);
		VPi.xz =abs(VPi.xz) -vec2(2,3);
		float nTh =atan(VPi.y, VPi.z) *8.0 +VP.w *nSignZ *nSpeed;
		float nPi =max(length(VPi.yz) -1.0 +sin(nTh) *0.1, abs(VPi.x) -1.0);
		sface SFi =fSFSet_Default();
		SFi.nDistance =nPi;
		SFi.ID_Pallet =10;
		SF =fSFMin(SF, SFi);
	}
	return SF;
}
/*個別デモの専用機能ここまで*/

/*主機能ここから*/

float fNMap(vec3 V3P){
	vec4 VP =vec4(V3P, nTime);
	float NP =1e+6;

	/*所要の図形の表面距離を記述*/
	sface SF =fSFSet_Default();
	const int ciAirplanes =3, ciCars =3;
	int iSQ =fISequencer(60, 2);

	if(true){	/*飛行機*/
		for(int I =0; I <ciAirplanes; I++){
			vec4 VPi =fVGame_Airplane01(VP, float(I));
			float nPi;
			nPi =fNObject_Airplane01(VPi);
			sface SFi =fSFSet_Default();
			SFi.nDistance =nPi;
			SFi.VP =VPi;
			SFi.ID_Object =11;
			SFi.ID_Pallet =I +1;
			SF =fSFMin(SF, SFi);
		}
	}

	if(true){	/*自動車*/
		for(int I =0; I <ciCars; I++){
			vec4 VPi =fVGame_Car01(VP, float(I));
			sface SFi =fSFSet_Default();
			SFi =fSFObject_Car01(VPi);

			if(SFi.ID_Pallet ==9)	SFi.ID_Pallet =I +4;
			SF =fSFMin(SF, SFi);
		}
	}
	if(true){
		if(iSQ ==1){	/*機関銃*/
			for(int I =0; I <ciAirplanes; I++){
				vec4 VPi =fVGame_Gun_Airplane01(VP, float(I));
				float nPi =length(VPi.xyz) -0.25;
				sface SFi =fSFSet_Default();
				SFi.nDistance =nPi;
				SF =fSFMin(SF, SFi);
			}
		}
	}

	if(false){	/*水面*/
		float nPi =VP.y +4.0 +(sin(VP.x +sin(VP.z *0.5 +VP.w)) +sin(VP.z +sin(VP.x *0.5 +VP.w))) *0.05;
		sface SFi =fSFSet_Default();
		SFi.nDistance =nPi;
		SFi.ID_Object =101;
		SF =fSFSmoothMin(SF, SFi, 2.0);
	}

	if(true){	/*柱*/
		vec4 VPi =VP;
		VPi.xz =mod(VPi.xz, 32.0) -16.0;
		float nPi =length(VPi.xz) -2.0;
		sface SFi =fSFSet_Default();
		SFi.nDistance =nPi;
		SF =fSFMin(SF, SFi);
	}

	if(true){	/*地面*/
		float nPi =VP.y -fNGame_Road01(VP.xz);
		sface SFi =fSFSet_Default();
		SFi.nDistance =nPi;
		SFi.ID_Object =102;
		SF =fSFSmoothMin(SF, SFi, 2.0);
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

sface fSFEffect_Before(smarch SM, sface SF){
	if(!SM.bTouch)	return SF;
	vec4 VColor =SF.VColor;
	vec4 VP =vec4(SM.V3P, nTime);
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

	if(ID_Object ==102)	VColor.rgb =sign(sin(VP.x) *sin(VP.z)) *0.1 +vec3(1);
	/*ここまで*/
	SF.VColor =VColor;
	return SF;
}

sface fSFEffect(smarch SM, sface SF, vec3 V3P_Light){
	vec4 VP =vec4(SM.V3P, nTime);
	vec4 VColor =SF.VColor;

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

	if(true){	//機関銃
		int iSQ =fISequencer(60, 2);
		if(iSQ ==1 && SF.ID_Object != 11){
			for(int I =0; I <3; I++){
				vec4 VPi =fVGame_Gun_Airplane01(VP, float(I));
				float nL =length(VPi.xyz);
				VColor.rg +=vec2(1,0.1) /nL /nL;
			}
		}
	}
	SF.VColor =VColor;
	return SF;
}

scamera fSCSet(vec2 V2UV){
	scamera SC;
	vec3 V3P =VP_DefaultCamera.xyz;
	V3P.xy +=VMouse.xy *vec2(8,-8);
	V3P.zy *=fM2Rotate(+VMouse.y);
	V3P.zx *=fM2Rotate(-VMouse.x *4.0);

	V3P.zx +=vec2(8,1) *nTime;	//移動

	SC.V3Position =V3P;

	vec3 V3D =normalize(vec3(V2UV, 1));
	V3D.zy *=fM2Rotate(+VMouse.y);
	V3D.zx *=fM2Rotate(-VMouse.x *4.0);
	SC.V3Direction =V3D;
	return SC;
}

vec4 fVMain(vec2 V2UV){
	scamera SC =fSCSet(V2UV);
	vec3 V3Camera =SC.V3Position, V3Direction =SC.V3Direction, V3P_Light =VP_DefaultLight.xyz;
	SF_Default =fSFSet_Default();

	vec4 VColor =vec4(1);

	{
		smarch SM =fSMRayMarch(V3Camera, V3Direction, 0.0);

		sface SF =SF_Default;

		if(SM.bTouch){
			if(cbSetting_Effect_Before)	SF =fSFEffect_Before(SM, SF);
			if(cbSetting_Effect)	SF =fSFEffect(SM, SF, V3P_Light);
			VColor =SF.VColor;
		}else{
			VColor =vec4(0);
		}
	}

	VColor.a =1.0;
	return VColor;
}

void main(void){
	vec2 V2UV =(gl_FragCoord.xy *2.0 -resolution.xy) /max(resolution.x, resolution.y);
	gl_FragColor =fVMain(V2UV);
}

