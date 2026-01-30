/*R041023作例　by ニシタマオ*/
/*サンドボックス上での試験用、簡易レイトレシステム、反射・屈折、ぼかし影、カラーパレット機能付（R041023版）*/
/*直近の改修：特殊効果を整理*/
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

vec4 VResolution =vec4(resolution, 0, 0);
float nTime =time *2.0;
vec4 VMouse =vec4((mouse -0.5)*vec2(1,-1), 0, 0);

const bool cbSetting_March2nd_Reflect =true;
const bool cbSetting_March2nd_Refract =true;
const bool cbSetting_CeilFloor =true;
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

vec4 VP_DefaultCamera =vec4(0, 0, -20, 0);
vec4 VP_DefaultLight =vec4(1,1,-1,0) *64.0;
vec4 VC_DefaultLight =vec4(1);
const int ciDefinition =50;

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

mat3 fM3Rotate(vec3 V3R){
	mat3 M3R =mat3(1,0,0, 0,1,0, 0,0,1);
	M3R *=mat3( cos(V3R.z),-sin(V3R.z), 0, sin(V3R.z), cos(V3R.z), 0, 0, 0, 1);
	M3R *=mat3( 1, 0, 0, 0, cos(V3R.x),-sin(V3R.x), 0, sin(V3R.x), cos(V3R.x));
	M3R *=mat3( cos(V3R.y), 0, sin(V3R.y), 0, 1, 0,-sin(V3R.y), 0, cos(V3R.y));
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

/*インタラクティブ機能、ドライブゲーム*/
float fNGame_RoadY(vec2 V2P){
	float nSpeed =8.0, nZ =nSpeed *nTime, nY =2.0;
	V2P +=vec2(0.1, 1) *nZ;
	nY +=sin(V2P.y *acos(-1.0) *1e-1 *1.1) *0.5;
	nY +=sin(V2P.y *acos(-1.0) *1e-2 *2.3) *2.0;
	nY +=sin(V2P.y *acos(-1.0) *1e-3 *3.7) *4.0;

	nY +=sin(V2P.x *acos(-1.0) *1e-1 *1.9) *0.5;
	nY +=sin(V2P.x *acos(-1.0) *1e-2 *4.3) *2.0;
	nY +=sin(V2P.x *acos(-1.0) *1e-3 *4.7) *4.0;
	return nY;
}

vec2 fV2Game_MyCar(void){
	return VMouse.xy *vec2(+1,-1) *48.0;

}

vec2 fV2Game_SenileCar01(float nTime){
	float nTime_Mod =nTime, nTime_Dom =nTime_Mod;
	nTime_Mod =mod(nTime_Mod, 8.0), nTime_Dom -=nTime_Mod;

	vec4 VRandom =fVN(fNRandom(nTime_Dom));
	vec2 V2Car =vec2((VRandom.x -0.5) *16.0 +(VRandom.y -0.5) *4.0 *nTime_Mod, -nTime_Mod *24.0 +128.0);
	return V2Car;
}

vec4 fVGame_Car(vec4 VP, vec2 V2P_Car){
	vec2 V2P_Car10, V2P_Car01;
	V2P_Car10 =V2P_Car01 =V2P_Car;
	V2P_Car10.x +=1.0, V2P_Car01.y +=1.0; 
	float nY =fNGame_RoadY(V2P_Car), nY10 =fNGame_RoadY(V2P_Car10), nY01 =fNGame_RoadY(V2P_Car01);
	vec2 V2R =(vec2(nY10, nY01) -nY) *vec2(-1,1);

	vec4 VPi =VP;
	VPi.xz -=V2P_Car;
	VPi.y -=nY;

	VPi.yz *=fM2Rotate(V2R.y);
	VPi.xy *=fM2Rotate(V2R.x);
	return VPi;
}

sface fSFCar(vec4 VP){
	float nSpeed =acos(-1.0) *2.0 *1.0;
	sface SF =fSFSet_Default();
	{
		sface SFi =fSFSet_Default();
		vec4 VPi =VP;
		VPi.y -=2.0;
		float nPi =length(max(abs(VPi.xyz) -vec3(2,1,4), 0.0)) -0.1;
		VPi.yz -=vec2(1,2.5);
		nPi =min(nPi, length(max(abs(VPi.xyz) -vec3(2,1,1), 0.0)) -0.1);
		SFi.nDistance =nPi;
		SFi.ID_Pallet =11;
		SF =fSFMin(SF, SFi);
	}

	{
		sface SFi =fSFSet_Default();
		vec4 VPi =VP;
		VPi.y -=1.0;
		float nSignZ =sign(VPi.z);
		VPi.xz =abs(VPi.xz) -vec2(2,3);
		float nTh =atan(VPi.y, VPi.z) *8.0 +VP.w *nSignZ *nSpeed;
		float nPi =max(length(VPi.yz) -1.0 +sin(nTh) *0.1, abs(VPi.x) -1.0);
		SFi.nDistance =nPi;
		SFi.ID_Pallet =12;
		SF =fSFMin(SF, SFi);
	}
	return SF;
}

float fNGame_Day(){
	return sin(nTime *0.1) *0.5 +0.5;
}
/*ここまで*/

vec4 fVPSet(vec3 V3P){
	vec4 VP =vec4(V3P, nTime);
	/*座標系とマウス操作の関係等を記述、不要なら省いても可*/
	VP.xyz *=fM3Rotate(-VMouse.yx *vec2(1,2) +vec2(0.5,0));
	return VP;
}

float fNMap(vec3 V3P){
	vec4 VP =fVPSet(V3P);
	float NP =1e+6;

	/*所要の図形の表面距離を記述*/
	sface SFt =fSFSet_Default();

	if(false){	/*水面*/
		vec4 VPi =VP;
		VPi.xz +=vec2(0.1, 1) *VPi.w;
		sface SFi =fSFSet_Default();
		SFi.nDistance = abs(VPi.y +3.5 +sin(VPi.x +sin(VPi.z +VPi.w)) *sin(VPi.z +sin(VPi.x +VPi.w)) *0.02) -0.5;
		SFi.ID_Object =9;
		SFt =fSFSmoothMin(SFt, SFi, 2.0);
 	}

	if(true){	/*ドライブゲーム*/
		float nSpeed =8.0, nZ =nSpeed *VP.w, nY =+8.0;

		if(true){	/*マイカー*/	
			vec4 VPi =VP;
			VPi.y +=nY;
			VPi =fVGame_Car(VPi, fV2Game_MyCar());
			sface SFi = fSFCar(VPi);
			SFi.ID_Object =21;
			SFt =fSFMin(SFt, SFi);
		}

		if(true){	/*ジャマカー*/	
			vec4 VPi =VP;
			VPi.y +=nY;
			VPi =fVGame_Car(VPi, fV2Game_SenileCar01(VPi.w));
			VPi.z *=-1.0;
			sface SFi = fSFCar(VPi);
			SFi.ID_Object =22;
			SFt =fSFMin(SFt, SFi);
		}

		if(true){	/*路面*/	
			vec4 VPi =VP;
			VPi.y +=nY;
			VPi.y -=fNGame_RoadY(VPi.xz);
			sface SFi =fSFSet_Default();
			SFi.nDistance = abs(VPi.y) -0.1;
			SFi.ID_Object =19;
			SFt =fSFMin(SFt, SFi);
		}

		if(true){	/*壁面*/	
			vec4 VPi =VP;
			VPi.y +=nY;
			VPi.x =VPi.x +sin(VPi.z *0.1 +nZ *0.1) *4.0 -16.0;
			VPi.y -=fNGame_RoadY(VPi.xz);

			float nPi =length(max(abs(VPi.xy) -vec2(0.5,6), 0.0)) -0.1;

			sface SFi =fSFSet_Default();
			SFi.nDistance = nPi;
			SFi.ID_Object =12;
			SFt =fSFSmoothMin(SFt, SFi, 2.0);
		}

		if(true){	/*壁面*/	
			vec4 VPi =VP;
			VPi.y +=nY;
			VPi.x =VPi.x +sin(VPi.z *0.1 +nZ *0.1) *4.0 +16.0;
			VPi.y -=fNGame_RoadY(VPi.xz);

			float nPi =length(max(abs(VPi.xy) -vec2(0.5,6), 0.0)) -0.1;

			sface SFi =fSFSet_Default();
			SFi.nDistance = nPi;
			SFi.ID_Object =12;
			SFt =fSFSmoothMin(SFt, SFi, 2.0);
		}

		if(true){	/*門構*/	
			vec4 VPi =VP;
			VPi.y +=nY;
			VPi.z =mod(VPi.z +nZ, 32.0) -16.0;

			float nPi =length(vec2(length(VPi.xy) -30.0, VPi.z)) -1.0;

			sface SFi =fSFSet_Default();
			SFi.nDistance = nPi;
			SFi.ID_Object =13;
			SFi.ID_Pallet =4;
			SFt =fSFSmoothMin(SFt, SFi, 2.0);
		}


		if(true){	/*水面*/
			vec4 VPi =VP;
			VPi.xz +=vec2(0, 1) *nZ;
			sface SFi =fSFSet_Default();
			SFi.nDistance = abs(VPi.y +3.5 +sin(VPi.x +sin(VPi.z +VPi.w)) *sin(VPi.z +sin(VPi.x +VPi.w)) *0.05) -0.1;
			SFi.ID_Object =9;
			SFt =fSFSmoothMin(SFt, SFi, 2.0);
 		}
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

	if(true){	/*ドライブゲーム*/
		VColor.rgb *= fNGame_Day();
	}

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
		VColor.rgb =vec3(1) *(sin(V2P.x) *0.5 +0.5);
	}

	if(true){	/*タイトル*/
		vec4 VPi =VP;
		VPi.xy *=8.0;
		float nL =fNLetters00(VPi);
		if(nL <0.0)	VColor.rgb = vec3(clamp(0.0, 1.0, -nL *3.0));
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

	if(SF.ID_Object ==9){
		VColor.rgb =sign(sin(VP.x) *sin(VP.z)) *0.05 +0.95 *vec3(1);
	}

	if(true){	/*	ドライブゲーム*/
		V3RRR =vec3(1,1,0);
		if(SF.ID_Object ==9){
			VColor.rgb =vec3(0.5,0.5,1);
			V3RRR =vec3(1,2,2);
		}
		if(SF.ID_Object ==12){
			V3RRR =vec3(1,0.5,0);
			float nSpeed =8.0, nZ =nSpeed *VP.w;
			vec4 VPi =VP;
			VPi.xz +=vec2(0,1) *nZ;
			VColor.rgb =vec3(1) *sign(sin(VPi.z *2.0)) *0.2 +0.8;
		}
		if(SF.ID_Object ==19){
			float nSpeed =8.0, nZ =nSpeed *VP.w;
			vec4 VPi =VP;
			VPi.xz +=vec2(0,1) *nZ;
			VColor.rgb =vec3(1) *sign(sin(VPi.x) *sin(VPi.z)) *0.3 +0.7;
		}
		if(SF.ID_Object ==21){
			if(SF.ID_Pallet ==11)	VColor.rgb =vec3(0,1,0);
			if(SF.ID_Pallet ==12)	VColor.rgb =vec3(0.25);
		}
		if(SF.ID_Object ==22){
			if(SF.ID_Pallet ==11)	VColor.rgb =vec3(1,0,0);
			if(SF.ID_Pallet ==12)	VColor.rgb =vec3(0.25);
		}

		VC_DefaultLight.rgb = vec3(fNGame_Day() *0.9 +0.1);
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
	if(true){	/*ドライブゲーム*/
		if(fNGame_Day() <0.4){
			float nY =+8.0;
			vec4 VPi =VP;
			VPi.y +=nY;
			VPi =fVGame_Car(VPi, fV2Game_MyCar());
			VPi.x =abs(VPi.x) -1.5;
			float nC =(VPi.z <0.0)? 0.0: 0.2 *VPi.z /length(VPi.xy);
			VColor.rgb +=clamp(nC, 0.0, 1.5);
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
	float nDistance_Min =1e+6;
	bool bTouch;
	int iLoop;
	nLength +=0.02;
	for(int I =0; I <ciDefinition; I++){
		V3P =V3P_Start +V3Direction *nLength;
		float nDistance =abs(fNMap(V3P));
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

void fMain(void){
	vec2 V2UV =(gl_FragCoord.xy *2.0 -VResolution.xy) /max(VResolution.x, VResolution.y);
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
				if(cbSetting_Effect2nd_Refract)	SF2nd_Refract =fSFEffect(SF2nd_Refract, SM2nd_Refract, V3P_Light);
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
	gl_FragColor =VColor;
}

void main(void){
	fMain();
}
