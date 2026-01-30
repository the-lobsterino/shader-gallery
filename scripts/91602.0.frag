/*R040918作例　by ニシタマオ*/
/*サンドボックス上での試験用、簡易レイトレシステム、二段階反射・屈折機能、ぼかし影機能付（R040918版、反射機能の改良、屈折機能のバグ取り）*/
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

const bool cbSetting_March2nd_Reflect =true;
const bool cbSetting_March2nd_Refract =true;
const bool cbSetting_ShadeByLight1st =true;
const bool cbSetting_ShadeBySteps1st =false;
const bool cbSetting_ShadeByLight2nd_Reflect =true;
const bool cbSetting_ShadeBySteps2nd_Reflect =false;
const bool cbSetting_ShadeByLight2nd_Refract =false;
const bool cbSetting_ShadeBySteps2nd_Refract =true;
const bool cbSetting_CeilFloor1st =true;
const bool cbSetting_CeilFloor2nd_Reflect =true;
const bool cbSetting_CeilFloor2nd_Refract =true;
const bool cbSetting_Effect1st =true;
const bool cbSetting_Effect2nd_Reflect =false;
const bool cbSetting_Effect2nd_Refract =false;
const bool cbSetting_Refrax =false;
const bool cbSetting_Shadow =true;

vec4 VP_DefaultCamera =vec4(0, 0, -24, 0);
vec4 VP_DefaultLight =vec4(1,1,-1,0) *64.0;
vec4 VC_DefaultLight =vec4(1);
const int ciDefinition =50;

vec4 VResolution =vec4(resolution, 0, 0);
float nTime =time *2.0;
vec4 VMouse =vec4((mouse -0.5)*vec2(1,-1), 0, 0);

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
/*	NP =length(max(abs(V3P) -nRadius *0.25, 0.0)) -0.25;*/
	NP =length(V3P) -nRadius *0.75;
	return NP;
}

float fNLetters00(vec4 VP){
	float NP =1e+6;
	/*REPLACEE_LETTERS00*/
	return NP;
}
/*ここまで*/

/*インタラクティブ機能*/
/*ここまで*/

/*以下、本体機能*/
vec4 fVPSet(vec3 V3P){
	vec4 VP =vec4(V3P, nTime);
	VP.xy +=VMouse.xy *vec2(2,-1) *16.0 +vec2(0,0.5);
	VP.xyz *=fM3Rotate(-VMouse.yx *vec2(0.5) +vec2(0.5,0));
	return VP;
}

float fNMap(vec3 V3P){
	sface SFo =fSFSet_Default(), SFi =SFo;

	vec4 VP =fVPSet(V3P), VC_Light =vec4(1);

	SFi =SFo;
	float NP =1e+6;

	/*図形の表面距離を記述*/
	if(true){
		int iSQ =fISequencer(40, 4);
		vec4 VPi =VP;
		VPi.y +=sin(VPi.w) *12.0 +10.0;
		float nE =4.0;

		vec4 VQ =vec4(VPi.xyz, sin(VP.w));
		VQ.xw *=fM2Rotate(VPi.w *3e-1);
		VQ.yw *=fM2Rotate(VPi.w *2e-1);
		VQ.zw *=fM2Rotate(VPi.w *1e-1);

		VQ +=sin(vec4(7,5,3,1) *0.1 *VP.w);

		float nPi;

		nPi =length(VQ.xyz) -nE;
		if(iSQ ==1)	nPi =length(max(abs(VQ.xyz) -nE, 0.0)) -nE *0.2;
		if(iSQ ==2)	nPi =length(vec2(length(VQ.xy) -nE, VQ.z)) -nE *0.5;

		nPi =abs(nPi) -nE *0.05;
		nPi =max(nPi, abs(VQ.w) -nE);

		if(NP >nPi){
			SFo.nDistance =nPi;
			SFi= SFo;
			SFi.VColor.rgb =sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +VQ.w +VP.w) *0.2 +0.8;
			NP =nPi;
		}
	}


	if(true){	/*水面*/
		vec4 VPi =VP;
		VPi.xyz +=vec3(0.1,0,1) *VPi.w;

		float nPi =abs(VPi.y +12.0 +sin(VPi.x *0.1 +sin(VPi.z *0.05)) *sin(VPi.z *0.1 +sin(VPi.x *0.05)) *2.0) -0.1;

		if(NP >nPi){
			SFo.nDistance =nPi;
			SFi= SFo;
		}
		NP =fNSmoothMin(NP, nPi, 2.0);
	}
	/*ここまで*/

	VC_Light.rgb =vec3(1) *cos(VP.w *0.1) *0.5 +0.5;

	SF =SFi;
	return NP;
}

vec4 fVCeilFloor(vec3 V3P){
	vec4 VP =vec4(V3P /V3P.y, nTime), VColor =vec4(1);

	/*天井・床面の色彩を記述*/
	vec4 VC;
	if(true){
		float nC;
		vec4 VPi =VP;
		VPi.xyz *= fM3Rotate(vec3(1,10,100) *0.01 *VPi.w);
		VPi.xyz =normalize(VPi.xyz);
		vec3 V3P =abs(VPi.xyz) -normalize(vec3(1));
		nC =1e-4 *pow(length(V3P),-4.0);
		VC.rgb +=vec3(1) *nC;
	}

	if(true){
		if(V3P.y <=0.0){
			vec2 V2P =VP.xz;
			V2P.y =abs(V2P.y);
			V2P.xy +=VP.w *2.0 /vec2(100, 10);

			float nC;
			nC =sign(sin(V2P.x) *sin(V2P.y)) *0.2 +0.8;
			nC -=abs(VP.z) *1e-1;
			nC =clamp(nC, 0.0, 1.0);
			VC.rgb +=vec3(1) *nC;
		}else{
			vec2 V2P =VP.xz;
			V2P.y =abs(V2P.y);

			const int ciJ =2;
			for(int J =0; J <ciJ; J++){
				V2P.xy += VP.w *2.0 /((J ==0)? vec2(100, 10): vec2(10, 100));

				float nC;
				vec4 VCi;
				for(int I =0; I <3; I++){
					vec2 V2Pi =V2P *pow(2.0, float(I +1));
					vec4 VCi00 =fVN(fNRandom(floor(V2Pi) +vec2(0,0))), VCi10 =fVN(fNRandom(floor(V2Pi) +vec2(1,0))), VCi01 =fVN(fNRandom(floor(V2Pi) +vec2(0,1))), VCi11 =fVN(fNRandom(floor(V2Pi) +vec2(1,1)));
					float nFrX =fract(V2Pi.x), nFrY =fract(V2Pi.y);
					vec4 VCi0 =mix(VCi00, VCi01, nFrY), VCi1 =mix(VCi10, VCi11, nFrY); 
					VCi +=mix(VCi0, VCi1, nFrX) /float(I +1);
				}
//				VCi =VCi *0.3 +0.7;
				VCi -=abs(VP.z) *1e-1;
				VCi =clamp(VCi, 0.0, 1.0);

				if(false){
					VC.rgb +=VCi.rgb /float(ciJ);
				}else{
					VC.rgb +=VCi.w /float(ciJ);
				}

			}

		}

	}
	VColor =VC;
	/*ここまで*/

	return VColor;
}

vec4 fVBack(vec2 V2UV){
	vec4 VP =vec4(V2UV *4.0, 0, nTime), VC =vec4(1);
	/*背景の色彩を記述*/
	/*ここまで*/
	return VC;
}

vec4 fVEffect(vec4 VColor, smarch SM){
	if(!SM.bTouch)	return VColor;
	vec4 VP =fVPSet(SM.V3P);
	vec3 V3NL =SM.V3NormalLine;

	/*特殊効果の色彩を記述*/
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

		SM =fSMRayMarch(SM2nd_Refract.V3P_Start, SM2nd_Refract.V3Direction, SF.nLeapAfterRefract);

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

	if(cbSetting_CeilFloor1st){
		if(!SM1st.bTouch){
			VColor1st =fVCeilFloor(SM1st.V3Direction);
			VColor2nd_Reflect =VColor2nd_Refract =VColor1st;
		}else{
			if(!cbSetting_March2nd_Reflect && !cbSetting_March2nd_Refract){	/*二段反射等しない時には背景だけを反射*/
				vec3 V3Direction =reflect(SM1st.V3Direction, SM1st.V3NormalLine);
				vec2 V2RR =V3RRR.xy;
				V2RR /=abs(V2RR.x) +abs(V2RR.y);
				VColor1st =VColor1st *V2RR.x +fVCeilFloor(V3Direction) *V2RR.y;
				VColor2nd_Reflect =VColor2nd_Refract =VColor1st;
			}
		}
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
