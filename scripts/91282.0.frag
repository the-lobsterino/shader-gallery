/*R040906作例「四次元空間」シリーズ　by ニシタマオ*/
/*サンドボックス上での試験用、簡易レイトレシステム、二段階反射・屈折機能、ぼかし影機能付（R040905版）*/
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

const bool cbSetting_March2nd_Reflect =true;
const bool cbSetting_March2nd_Refract =false;
const bool cbSetting_ShadeByLight1st =true;
const bool cbSetting_ShadeBySteps1st =false;
const bool cbSetting_ShadeByLight2nd_Reflect =true;
const bool cbSetting_ShadeBySteps2nd_Reflect =false;
const bool cbSetting_ShadeByLight2nd_Refract =false;
const bool cbSetting_ShadeBySteps2nd_Refract =true;
const bool cbSetting_CeilFloor1st =false;
const bool cbSetting_CeilFloor2nd_Reflect =false;
const bool cbSetting_CeilFloor2nd_Refract =false;
const bool cbSetting_Effect1st =true;
const bool cbSetting_Effect2nd_Reflect =true;
const bool cbSetting_Effect2nd_Refract =false;
const bool cbSetting_Refrax =false;
const bool cbSetting_Shadow =true;

vec4 VP_DefaultCamera =vec4(0, 0, -12, 0);
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
};

sface SF;

sface fSFSet_Default(void){
	sface SF;
	SF.VColor =vec4(1);
	SF.nDistance =1e+6;
	SF.V3Real_Reflect_Refract =vec3(1);
	SF.nRefrax =0.8;
	SF.nLeapAfterRefract =2.0;
	return SF;
}

vec4 VResolution =vec4(resolution, 0, 0);
float nTime =time *2.0;
vec4 VMouse =vec4((mouse -0.5)*vec2(1,-1), 0, 0);

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

//ゲームキャラ用共通動作ここから

//共通動作ここまで

float fNAttachment_Mobius01(vec4 VP, int iType, int iTwist){
	vec4 VPi =VP;
	float nR0 =4.0, nR1 =1.0;
	float nTh =atan(VPi.x, VPi.y);
	nTh *=float(iTwist) *((iType ==0 || iType ==1)? 0.5:0.25);
	nTh +=VPi.w *0.5;

	vec2 V2P =vec2(length(VPi.xy) -nR0, VPi.z);
	V2P *=fM2Rotate(nTh);

	float nPi =length(max(abs(V2P) -vec2(nR1, nR1 *0.25), 0.0)) -nR1 *0.1;
	if(iType ==1)	nPi =length(vec2(abs(V2P.x) -nR1, V2P.y)) -nR1 *0.5;
	if(iType ==2)	nPi =length(max(abs(V2P) -nR1 *0.75, 0.0)) -nR1 *0.75 *0.1;
	if(iType ==3)	nPi =length(abs(V2P) -nR1 *1.25) -nR1 *0.5;

	return nPi;
}

vec4 fVPSet(vec3 V3P){
	vec4 VP =vec4(V3P, nTime);

	VP.xyz *=fM3Rotate(-VMouse.yx *vec2(1,2) +vec2(0.5,0));
	VP.xy +=VMouse.xy *vec2(+1,-1) *12.0;
	return VP;
}

float fNMap(vec3 V3P){
	sface SFo =fSFSet_Default(), SFi =SFo;

	vec4 VP =fVPSet(V3P), VC_Light =vec4(1);

	SFi =SFo;
	float NP =1e+6;

/*ここから下に所要の図形の表面距離を、座標vec VPと、距離float NPとの関係で記述*/
	int iSQ_Type =fISequencer(100, 5);

	if(true){	/*四次元回転*/
		vec4 VD0 =vec4(VP.xyz, 0), VD1 =VD0;
		VD0.x +=6.0, VD1.x -=6.0;

		VD0.xyz *=fM3Rotate(VMouse.yx *8.0);	
		VD1.xyz *=fM3Rotate(VMouse.yx *8.0);	

		VD1.xw *=fM2Rotate(VP.w *1.1);
		VD1.yw *=fM2Rotate(VP.w *1.0);
		VD1.zw *=fM2Rotate(VP.w *0.7);

		float nP0, nP1;

		{
			nP0 =max(length(VD0.xyz) -2.0, abs(VD0.w) -2.0);
			nP1 =max(length(VD1.xyz) -2.0, abs(VD1.w) -2.0);
		}

		if(iSQ_Type ==1){
			nP0 =length(max(abs(VD0.xyzw) -2.0, 0.0)) -0.1;
			nP1 =length(max(abs(VD1.xyzw) -2.0, 0.0)) -0.1;
		}

		if(iSQ_Type ==2){
			nP0 =length(vec2(length(VD0.xyz) -2.0, VD0.w)) -1.0;
			nP1 =length(vec2(length(VD1.xyz) -2.0, VD1.w)) -1.0;
		}

		if(iSQ_Type ==3){
			nP0 =length(vec2(length(vec2(length(VD0.xy) -2.0, VD0.z)) -1.0, VD0.w)) -0.5;
			nP1 =length(vec2(length(vec2(length(VD1.xy) -2.0, VD1.z)) -1.0, VD1.w)) -0.5;
		}

		if(iSQ_Type ==4){
			nP0 =length(VD0.xyzw) -2.0;
			nP0 =max(nP0,-(length(VD0.xw) -0.5));
			nP0 =max(nP0,-(length(VD0.yw) -0.5));
			nP0 =max(nP0,-(length(VD0.zw) -0.5));
			nP1 =length(VD1.xyzw) -2.0;
			nP1 =max(nP1,-(length(VD1.xw) -0.5));
			nP1 =max(nP1,-(length(VD1.yw) -0.5));
			nP1 =max(nP1,-(length(VD1.zw) -0.5));
		}

		if(NP >nP0){
			SFi= SFo;
			SFi.VColor.rgb =vec3(1,0.5,0.5) *(sign(sin(VD0.w *8.0 +VP.w *4.0)) *0.2 +0.8);
		}
		NP =min(NP, nP0);
		if(NP >nP1){
			SFi= SFo;
			SFi.VColor.rgb =vec3(0.5,1,0.5) *(sign(sin(VD1.w *8.0 +VP.w *4.0)) *0.2 +0.8);
		}
		NP =min(NP, nP1);				
	}


	if(true){	/*水面*/
		vec4 VPi =VP;
		VPi.xyz +=vec3(0,0,4) *VPi.w;
		float nPi =abs(VPi.y +4.0 +sin(VPi.x +sin(VPi.z +VPi.w)) *sin(VPi.z +sin(VPi.x +VPi.w)) *0.05) -0.1;

		if(NP >nPi){
			SFi= SFo;
			SFi.VColor.rgb =vec3(1) *sign(sin(VPi.x) *sin(VPi.z)) *0.1 +0.9;
		}
		NP =fNSmoothMin(NP, nPi, 2.0);
	}


/*ここまで*/

	SF =SFi;
	VC_DefaultLight =VC_Light;
	return NP;
}

vec4 fVCeilFloor(vec3 V3P){
	vec4 VP =vec4(V3P /V3P.y, nTime), VC =vec4(1);
	{
		float nC;
		vec3 V3P =abs(normalize(VP.xyz) *fM3Rotate(vec3(1,10,100) /100.0 *VP.w)) -normalize(vec3(1));
		nC =1e-4 *pow(length(V3P),-4.0);
		VC.rgb =vec3(1) *nC;
	}
	return VC;
}

vec4 fVBack(vec2 V2UV){
	vec4 VP =vec4(V2UV *4.0, 0, nTime);

	vec4 VC =vec4(1);

	return VC;
}

vec4 fVEffect(vec4 VColor, smarch SM){
	if(!SM.bTouch)	return VColor;
	vec4 VP =fVPSet(SM.V3P);
	vec3 V3NL =SM.V3NormalLine;
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

	return VColor;
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
		float nDistance =fNMap(V3P);
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

float fNShadow(vec3 V3Position, vec3 V3P_Light){
	float nShadow =0.0;

	smarch SM =fSMRayMarch(V3Position, normalize(V3P_Light -V3Position), 1.0);

	nShadow =1.0 -clamp(SM.nDistance_Min, 0.0, 1.0);
	if(SM.bTouch)	nShadow =1.0;
	return nShadow;
}

void fMain(void){
	vec2 V2UV =(gl_FragCoord.xy *2.0 -VResolution.xy) /max(VResolution.x, VResolution.y);
	vec3 V3Camera =VP_DefaultCamera.xyz, V3Direction =normalize(vec3(V2UV, 1)), V3P_Light =VP_DefaultLight.xyz;

	SF =fSFSet_Default();

	vec4 VColor, VColor1st, VColor2nd_Reflect, VColor2nd_Refract;
	bool bTouch1st, bTouch2nd_Reflect, bTouch2nd_Refract;
	float nA, nShadow =0.25;

	smarch SM, SM1st, SM2nd_Reflect, SM2nd_Refract;

	{
		SM =fSMRayMarch(V3Camera, V3Direction, 0.0);
		SM1st =SM, SM2nd_Reflect =SM, SM2nd_Refract =SM;

		if(SM.bTouch){
			vec4 VC =SF.VColor;
			if(cbSetting_ShadeByLight1st)	VC.rgb *=dot(SM.V3NormalLine, normalize(V3P_Light))*0.5 +0.5;
			if(cbSetting_ShadeBySteps1st)	VC.rgb *=1.0 -SM.nLoop;
			VColor1st =VC;
	
			SM2nd_Reflect.V3Direction =reflect(SM.V3Direction, SM.V3NormalLine);
			SM2nd_Reflect.V3P_Start =SM.V3P;
			SM2nd_Reflect.nLength =0.0;

			SM2nd_Refract.V3Direction =SM.V3Direction;
			if(cbSetting_Refrax)	SM2nd_Refract.V3Direction =refract( SM.V3Direction, SM.V3NormalLine, SF.nRefrax);
			SM2nd_Refract.V3P_Start =SM.V3P;
			SM2nd_Refract.nLength =SF.nLeapAfterRefract;
		}
		SM1st =SM;
	}

	VColor2nd_Reflect =VColor1st;
	VColor2nd_Refract =VColor1st;
	sface SF1st =SF;

	if(cbSetting_March2nd_Reflect){

		SM =fSMRayMarch(SM2nd_Reflect.V3P_Start, SM2nd_Reflect.V3Direction, 0.0);

		if(SM.bTouch){
			vec4 VC =SF.VColor;
			vec3 V3NL =fV3NormalLine(SM.V3P);
			SM.V3NormalLine =V3NL;
			if(cbSetting_ShadeByLight2nd_Reflect)	VC.rgb *=dot(V3NL, normalize(V3P_Light))*0.5 +0.5;
			if(cbSetting_ShadeBySteps2nd_Reflect)	VC.rgb *=1.0 -SM.nLoop;
			VColor2nd_Reflect =VC;
		}
		SM2nd_Reflect =SM;

	}

	if(cbSetting_March2nd_Refract){

		SM =fSMRayMarch(SM2nd_Refract.V3P_Start, SM2nd_Refract.V3Direction, 1.0);

		if(SM.bTouch){
			vec4 VC =SF.VColor;
			vec3 V3NL =fV3NormalLine(SM.V3P);
			if(cbSetting_ShadeByLight2nd_Refract)	VC.rgb *=dot(V3NL, normalize(V3P_Light))*0.5 +0.5;
			if(cbSetting_ShadeBySteps2nd_Refract)	VC.rgb *=1.0 -SM.nLoop;
			VColor2nd_Refract =VC;
		}
		SM2nd_Refract =SM;
	}

	vec3 V3RRR =SF1st.V3Real_Reflect_Refract;

	if(!SM1st.bTouch){
		VColor1st =vec4(1);
		VColor2nd_Reflect =VColor1st;
		VColor2nd_Refract =VColor1st;
	}

	if(cbSetting_CeilFloor1st && !SM1st.bTouch){
		VColor1st =fVCeilFloor(SM1st.V3Direction);
		VColor2nd_Reflect =VColor1st;
		VColor2nd_Refract =VColor1st;
	}

	if(cbSetting_CeilFloor2nd_Reflect && SM1st.bTouch && !SM2nd_Reflect.bTouch){
		vec2 V2RR =V3RRR.xy;
		V2RR /=abs(V2RR.x) +abs(V2RR.y);
		VColor2nd_Reflect =VColor2nd_Reflect *V2RR.x +fVCeilFloor(SM2nd_Reflect.V3Direction) *V2RR.y;
	}

	if(cbSetting_CeilFloor2nd_Refract && SM1st.bTouch && !SM2nd_Refract.bTouch){
		vec2 V2RR =V3RRR.xz;
		V2RR /=abs(V2RR.x) +abs(V2RR.y);
		VColor2nd_Refract =VColor2nd_Refract *V2RR.x +fVCeilFloor(SM2nd_Refract.V3Direction) *V2RR.y;
	}

	VColor1st.rgb *=VC_DefaultLight.rgb;
	VColor2nd_Reflect.rgb *=VC_DefaultLight.rgb;
	VColor2nd_Refract.rgb *=VC_DefaultLight.rgb;

	if(cbSetting_Effect1st)	VColor1st =fVEffect(VColor1st, SM1st);
	if(cbSetting_Effect2nd_Reflect)	VColor2nd_Reflect =fVEffect(VColor2nd_Reflect, SM2nd_Reflect);
	if(cbSetting_Effect2nd_Refract)	VColor2nd_Refract =fVEffect(VColor2nd_Refract, SM2nd_Refract);

	V3RRR /=abs(V3RRR.x) +abs(V3RRR.y) +abs(V3RRR.z);
	VColor =VColor1st *V3RRR.x +VColor2nd_Reflect *V3RRR.y +VColor2nd_Refract *V3RRR.z;

	if(cbSetting_Shadow && SM1st.bTouch)	VColor.rgb -=fNShadow(SM1st.V3P, V3P_Light) *nShadow;

	if(!cbSetting_CeilFloor1st && !SM1st.bTouch)	VColor =fVBack(V2UV);

	VColor.a =1.0;
	gl_FragColor =VColor;
}

void main(void){
	fMain();
}

