/*R040823作例　by ニシタマオ*/
/*サンドボックス上での試験用、簡易レイトレシステム、二段階反射・屈折機能、ぼかし影機能付（R040823版）*/
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
const bool cbSetting_CeilFloor2nd_Refract =false;
const bool cbSetting_Effect1st =false;
const bool cbSetting_Effect2nd_Reflect =false;
const bool cbSetting_Effect2nd_Refract =false;
const bool cbSetting_Refrax =false;
const bool cbSetting_Shadow =true;

vec4 VDefaultCamera =vec4(0, 0, -18, 0);
vec4 VDefaultLight =vec4(1,1,-1,0) *64.0;
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

vec4 VResolution =vec4(resolution, 0, 0);
float nTime =time;
vec4 VMouse =vec4((mouse -0.5)*vec2(1,-1), 0, 0);

mat3 fM3Rotate(vec3 V3R){
	mat3 M3R =mat3(1,0,0, 0,1,0, 0,0,1);
	M3R *=mat3( cos(V3R.z),-sin(V3R.z), 0, sin(V3R.z), cos(V3R.z), 0, 0, 0, 1);
	M3R *=mat3( 1, 0, 0, 0, cos(V3R.x),-sin(V3R.x), 0, sin(V3R.x), cos(V3R.x));
	M3R *=mat3( cos(V3R.y), 0, sin(V3R.y), 0, 1, 0,-sin(V3R.y), 0, cos(V3R.y));
	return M3R;
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

vec4 fVLissajous(float nP){
	vec4 VCycle =vec4(19,17,13,11);
	VCycle *=acos(-1.0) *2.0;
	vec4 VLS =sin(VCycle *nP);
	return VLS;
}

float fNRandom(vec2 P){	vec4 VSeed =fract(sqrt(vec4(2,3,5,7))); return fract(sin(dot(P.xy ,VSeed.xy)) *VSeed.z +VSeed.w);}

ivec2 fIV2Hanoi32(int iSQ, int ID){
	ivec2 iV2P;

	{
		if(ID ==0)	iV2P =ivec2(0,0);
		if(ID ==1)	iV2P =ivec2(0,1);
	}

	if(iSQ ==1){
		if(ID ==0)	iV2P =ivec2(0,0);
		if(ID ==1)	iV2P =ivec2(1,0);
	}

	if(iSQ ==2){
		if(ID ==0)	iV2P =ivec2(2,0);
		if(ID ==1)	iV2P =ivec2(1,0);
	}

	if(iSQ ==3){
		if(ID ==0)	iV2P =ivec2(2,0);
		if(ID ==1)	iV2P =ivec2(2,1);
	}
	return iV2P;
}

ivec2 fIV2Hanoi33(int iSQ, int ID){
	ivec2 iV2P;

	{
		if(ID ==0)	iV2P =ivec2(0,0);
		if(ID ==1)	iV2P =ivec2(0,1);
		if(ID ==2)	iV2P =ivec2(0,2);
	}

	if(iSQ ==1){
		if(ID ==0)	iV2P =ivec2(0,0);
		if(ID ==1)	iV2P =ivec2(0,1);
		if(ID ==2)	iV2P =ivec2(1,0);
	}

	if(iSQ ==2){
		if(ID ==0)	iV2P =ivec2(0,0);
		if(ID ==1)	iV2P =ivec2(2,0);
		if(ID ==2)	iV2P =ivec2(1,0);
	}

	if(iSQ ==3){
		if(ID ==0)	iV2P =ivec2(0,0);
		if(ID ==1)	iV2P =ivec2(2,0);
		if(ID ==2)	iV2P =ivec2(2,1);
	}

	if(iSQ ==4){
		if(ID ==0)	iV2P =ivec2(1,0);
		if(ID ==1)	iV2P =ivec2(2,0);
		if(ID ==2)	iV2P =ivec2(2,1);
	}

	if(iSQ ==5){
		if(ID ==0)	iV2P =ivec2(1,0);
		if(ID ==1)	iV2P =ivec2(2,0);
		if(ID ==2)	iV2P =ivec2(0,0);
	}

	if(iSQ ==6){
		if(ID ==0)	iV2P =ivec2(1,0);
		if(ID ==1)	iV2P =ivec2(1,1);
		if(ID ==2)	iV2P =ivec2(0,0);
	}

	if(iSQ ==7){
		if(ID ==0)	iV2P =ivec2(1,0);
		if(ID ==1)	iV2P =ivec2(1,1);
		if(ID ==2)	iV2P =ivec2(1,2);
	}

	return iV2P;
}

vec3 fV3Hanoi3(ivec2 iV2P, vec3 V3P0, vec3 V3P1, vec3 V3P2){
	vec3 V3P =V3P0;
	if(iV2P.x ==1) V3P =V3P1;
	if(iV2P.x ==2) V3P =V3P2;
	V3P.z *=float(iV2P.y);
	return V3P;
}

float fNMap(vec3 V3P){
	sface SFo, SFi;
	SFo.VColor =vec4(1), SFo.nDistance =1000000.0, SFo.V3Real_Reflect_Refract =vec3(1), SFo.nRefrax =0.8, SFo.nLeapAfterRefract =1.0;
	SFi =SFo;

	vec4 VP =vec4(V3P, nTime);
	VP.zx *=fM2Rotate(VMouse.x *0.1);
	VP.zy *=fM2Rotate(VMouse.y *1.0 -0.5);
	VP.xy +=VMouse.xy *vec2(+1,-1) *4.0;

	SFi =SFo;
	float NP =1e+6;

/*ここから下に所要の図形の表面距離を、座標vec VPと、距離float NPとの関係で記述*/
	int iSQ =fISequencer(8, 8);

	const int ciDisks =3;
	vec3 V3Tower0 =vec3(+1,0,1), V3Tower1 =vec3(-1,0,1), V3Tower2 =vec3(0,+2,1);
	for(int I =0; I <ciDisks; I++){

		ivec2 iV2P_From =fIV2Hanoi33(iSQ, I);
		vec3 V3P_From =fV3Hanoi3(iV2P_From, V3Tower0, V3Tower1, V3Tower2);

		ivec2 iV2P_To =fIV2Hanoi33(iSQ +1, I);
		vec3 V3P_To =fV3Hanoi3(iV2P_To, V3Tower0, V3Tower1, V3Tower2);

		float nR =0.5 -0.5 *cos(fract(VP.w) *acos(-1.0));

		vec3 V3P =mix(V3P_From, V3P_To, nR);
		V3P =VP.xyz -V3P.xzy *vec3(8,2,8);

		int iSQ1 =fISequencer(8 *3, 3);

		float nPP;
		nPP =max(length(V3P) -float(-I +ciDisks +2), abs(V3P.y) -1.0);
		if(iSQ1 ==1)			nPP =max(length(V3P +vec3(0,I -1,0) *2.0) -3.0, abs(V3P.y) -1.0);
		if(iSQ1 ==2)			nPP =max(length(V3P.xz) -4.0 +(float(I *2) +V3P.y) *0.5, ((I ==ciDisks -1)? -V3P.y -1.0: abs(V3P.y) -1.0));

		if(NP >nPP){
			SFi= SFo;
			SFi.VColor.rgb =sin((vec3(0,1,2) /3.0 +VP.w +VP.y *0.1) *acos(-1.0) *2.0) *0.1 +0.9;
		}

		NP =min(NP, nPP);
	}

	for(int I =0; I <3; I++){
		vec3 V3P =V3Tower0;
		if(I ==1)	V3P =V3Tower1;
		if(I ==2)	V3P =V3Tower2;
		V3P =VP.xyz -V3P.xzy *vec3(8,2,8);
		float nPP =length(max(abs(V3P.zx) -0.5, 0.0)) -0.1;

		if(NP >nPP){
			SFi= SFo;
			SFi.VColor.rgb =sin((vec3(0,1,2) /3.0 +VP.w *0.1 +float(I) /3.0) *acos(-1.0) *2.0) *0.3 +0.7;
		}

		NP =fNSmoothMin(NP, nPP, 4.0);
	}


	{
		vec3 V3P =VP.xyz;

		float nPP =abs(V3P.y +1.0 +sin(V3P.x +sin(V3P.z +VP.w)) *sin(V3P.z +sin(V3P.x +VP.w)) *0.05) -0.05;

		if(NP >nPP){
			SFi= SFo;
			SFi.VColor.rgb =vec3(1) *sign(sin(VP.x) *sin(VP.z)) *0.1 +0.9;
		}

		NP =fNSmoothMin(NP, nPP, 4.0);
	}
/*ここまで*/

	SF =SFi;
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

vec4 fVEffect(vec4 VColor, smarch SM){
	vec4 VP =vec4(SM.V3P, nTime);
	vec3 V3NL =SM.V3NormalLine;
/*特殊効果用、とりあえずダミー*/
	{
		
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

float fNShadow(vec3 V3Position, vec3 V3Light){
	float nShadow =0.0;

	smarch SM =fSMRayMarch(V3Position, normalize(V3Light -V3Position), 1.0);

	nShadow =1.0 -clamp(SM.nDistance_Min, 0.0, 1.0);
	if(SM.bTouch)	nShadow =1.0;
	return nShadow;
}

void fMain(void){
	vec2 V2UV =(gl_FragCoord.xy *2.0 -VResolution.xy) /max(VResolution.x, VResolution.y);
	vec3 V3Camera =VDefaultCamera.xyz, V3Direction =normalize(vec3(V2UV, 1)), V3Light =VDefaultLight.xyz;

	SF.VColor =vec4(1), SF.nDistance =1e+6, SF.V3Real_Reflect_Refract =vec3(1), SF.nRefrax =0.8, SF.nLeapAfterRefract =3.0;

	vec4 VColor, VColor1st, VColor2nd_Reflect, VColor2nd_Refract;
	bool bTouch1st, bTouch2nd_Reflect, bTouch2nd_Refract;
	float nA, nShadow =0.25;

	smarch SM, SM1st, SM2nd_Reflect, SM2nd_Refract;

	{
		SM =fSMRayMarch(V3Camera, V3Direction, 0.0);
		SM1st =SM, SM2nd_Reflect =SM, SM2nd_Refract =SM;

		if(SM.bTouch){
			vec4 VC =SF.VColor;
			if(cbSetting_ShadeByLight1st)	VC.rgb *=dot(SM.V3NormalLine, normalize(V3Light))*0.5 +0.5;
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

	if(cbSetting_March2nd_Reflect){

		SM =fSMRayMarch(SM2nd_Reflect.V3P_Start, SM2nd_Reflect.V3Direction, 0.0);

		if(SM.bTouch){
			vec4 VC =SF.VColor;
			vec3 V3NL =fV3NormalLine(SM.V3P);
			SM.V3NormalLine =V3NL;
			if(cbSetting_ShadeByLight2nd_Reflect)	VC.rgb *=dot(V3NL, normalize(V3Light))*0.5 +0.5;
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
			if(cbSetting_ShadeByLight2nd_Refract)	VC.rgb *=dot(V3NL, normalize(V3Light))*0.5 +0.5;
			if(cbSetting_ShadeBySteps2nd_Refract)	VC.rgb *=1.0 -SM.nLoop;
			VColor2nd_Refract =VC;
		}
		SM2nd_Refract =SM;
	}

	vec3 V3RRR =SF.V3Real_Reflect_Refract;
	V3RRR /=abs(V3RRR.x) +abs(V3RRR.y) +abs(V3RRR.z);

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

	if(cbSetting_Effect1st)	VColor1st =fVEffect(VColor1st, SM1st);
	if(cbSetting_Effect2nd_Reflect)	VColor2nd_Reflect =fVEffect(VColor2nd_Reflect, SM2nd_Reflect);
	if(cbSetting_Effect2nd_Refract)	VColor2nd_Refract =fVEffect(VColor2nd_Refract, SM2nd_Refract);

	VColor =VColor1st *V3RRR.x +VColor2nd_Reflect *V3RRR.y +VColor2nd_Refract *V3RRR.z;

	if(cbSetting_Shadow && SM1st.bTouch)	VColor.rgb -=fNShadow(SM1st.V3P, V3Light) *nShadow;

	if(!cbSetting_CeilFloor1st && !SM1st.bTouch)	VColor.rgb =vec3(0.5);

	VColor.a =1.0;
	gl_FragColor =VColor;
}

void main(void){
	fMain();
}

