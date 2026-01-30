/*R041014作例　by ニシタマオ*/
/*サンドボックス上での試験用、簡易レイトレシステム、二段反射・三段屈折、ぼかし影、カラーパレット機能付（R041014版）*/
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
const bool cbSetting_ShadeByLight2nd_Refract =true;
const bool cbSetting_ShadeBySteps2nd_Refract =false;
const bool cbSetting_CeilFloor1st =false;
const bool cbSetting_CeilFloor2nd_Reflect =false;
const bool cbSetting_CeilFloor2nd_Refract =false;
const bool cbSetting_Effect_Befor1st =true;
const bool cbSetting_Effect_Befor2nd_Reflect =true;
const bool cbSetting_Effect_Befor2nd_Refract =true;
const bool cbSetting_Effect_After1st =true;
const bool cbSetting_Effect_After2nd_Reflect =true;
const bool cbSetting_Effect_After2nd_Refract =true;
const bool cbSetting_Refrax =true;
const bool cbSetting_Shadow =true;

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
	SF.nRefrax =0.8;
	SF.nLeapAfterRefract =0.2;
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

float fNAttachment_HeadBear01(vec4 VP){
	float NP =1e+6, nPP, nA =2.0;
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

	if(true){
		int iSQ =fISequencer(9,9);
		vec4 VPi =VP;
		float nPi =fNAttachment_HeadBear01(VPi);
			sface SFi =fSFSet_Default();
			SFi.nDistance =nPi;
			SFi.ID_Object =2;
			SFi.ID_Pallet =iSQ +1;
			SFt =fSFMin(SFt, SFi);
	}

	if(true){
		int iSQ =fISequencer(30,3);
		for(int I =0; I <3; I++){
			vec4 VPi =VP;
			VPi.xyz *=fM3Rotate(vec3(VPi.w /float(I +1)));
			vec2 V2Pi =vec2(length(VPi.xy) -3.0 *float(I +1) -2.0, VPi.z);
			float nPi;

			V2Pi *=fM2Rotate(atan(VPi.x, VPi.y) *0.5 *float(I));

			nPi =length(max(abs(V2Pi) -0.75, 0.0)) -0.1;
			if(iSQ ==1)	nPi =length(max(abs(vec2(abs(V2Pi.x) -1.0, V2Pi.y)) -0.5, 0.0)) -0.1;
			if(iSQ ==2)	nPi =length(max(abs(abs(V2Pi) -1.0) -0.25, 0.0)) -0.1;

			sface SFi =fSFSet_Default();
			SFi.nDistance =nPi;
			SFi.ID_Object =1;
			SFi.ID_Pallet =I +1;
			SFt =fSFMin(SFt, SFi);
		}
	}

	if(true){	/*水面*/
		vec4 VPi =VP;
		VPi.xz +=vec2(0.1, 1) *VPi.w;
		sface SFi =fSFSet_Default();
		SFi.nDistance = abs(VPi.y +3.5 +sin(VPi.w) +sin(VPi.x +sin(VPi.z +VPi.w)) *sin(VPi.z +sin(VPi.x +VPi.w)) *0.02) -0.5;
		SFi.ID_Object =9;
		SFt =fSFSmoothMin(SFt, SFi, 2.0);
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
			nC0 =nC00 *(1.0 -fract(V2P.y)) +nC01 *fract(V2P.y);
			nC1 =nC10 *(1.0 -fract(V2P.y)) +nC11 *fract(V2P.y);

			nC +=(nC0 *(1.0 -fract(V2P.x)) +nC1 *fract(V2P.x)) /float(I +1);
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
	/*ここまで*/
	return VColor;
}

sface fSFEffect_Befor(sface SF, smarch SM){
	if(!SM.bTouch)	return SF;
	vec4 VColor =SF.VColor;
	vec4 VP =fVPSet(SM.V3P);
	vec3 V3NL =SM.V3NormalLine;

	/*オブジェクト・パレットごとの色彩効果を記述*/
	int ID_Pallet, iBrown =1, iRed =2, iOrange =3, iYellow =4, iGreen =5, iBlue =6, iPurple =7, iGrey =8, iWhite =9, iBlack =10;

	if(true){	/*基本*/
		if(SF.ID_Pallet ==iBrown)	VColor.rgb =vec3(0.75,	0,	0);
		if(SF.ID_Pallet ==iRed)		VColor.rgb =vec3(1,	0,	0);
		if(SF.ID_Pallet ==iOrange)	VColor.rgb =vec3(1,	0.75,	0);
		if(SF.ID_Pallet ==iYellow)	VColor.rgb =vec3(1,	1,	0);
		if(SF.ID_Pallet ==iGreen)	VColor.rgb =vec3(0,	1,	0);
		if(SF.ID_Pallet ==iBlue)	VColor.rgb =vec3(0,	0,	1);
		if(SF.ID_Pallet ==iPurple)	VColor.rgb =vec3(1,	0,	1);
		if(SF.ID_Pallet ==iGrey)	VColor.rgb =vec3(0.75);
		if(SF.ID_Pallet ==iWhite)	VColor.rgb =vec3(1);
		if(SF.ID_Pallet ==iBlack)	VColor.rgb =vec3(0);
		VColor.rgb =VColor.rgb *0.9 +0.1;
	}

	if(SF.ID_Object ==9){
		VColor.rgb =sign(sin(VP.x) *sin(VP.z)) *0.05 +0.95 *vec3(1);
	}


	if(SF.ID_Object ==1){
		VColor.rgb =sin(vec3(0,1,2) /3.0 *acos(-1.0) *2.0 +float(SF.ID_Pallet) +VP.w) *0.2 +0.8;
	}

	/*ここまで*/
	SF.VColor =VColor;
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
			if(cbSetting_Effect_Befor1st)			SF1st =fSFEffect_Befor(SF1st, SM1st);

			vec3 V3NL =SM.V3NormalLine;
			if(cbSetting_ShadeByLight1st)	SF1st.VColor.rgb *=dot(V3NL, normalize(V3P_Light))*0.5 +0.5;
			if(cbSetting_ShadeBySteps1st)	SF1st.VColor.rgb *=1.0 -SM.nLoop;
	
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
			if(cbSetting_Effect_Befor2nd_Reflect)	SF2nd_Reflect =fSFEffect_Befor(SF2nd_Reflect, SM2nd_Reflect);

			vec3 V3NL =SM.V3NormalLine;
			if(cbSetting_ShadeByLight2nd_Reflect)	SF2nd_Reflect.VColor.rgb *=dot(V3NL, normalize(V3P_Light))*0.5 +0.5;
			if(cbSetting_ShadeBySteps2nd_Reflect)	SF2nd_Reflect.VColor.rgb *=1.0 -SM.nLoop;
		}
	}

	if(cbSetting_March2nd_Refract){

		smarch SM =fSMRayMarch(SM2nd_Refract.V3P_Start, SM2nd_Refract.V3Direction, SM2nd_Refract.nLength);

		if(SM.bTouch){
			if(cbSetting_March2nd_RefractPlus){
				SM.V3P_Start = SM.V3P;
				if(cbSetting_Refrax)	SM.V3Direction =refract( SM.V3Direction,-SM.V3NormalLine, 1.0/SF.nRefrax);
				SM =fSMRayMarch(SM.V3P_Start, SM.V3Direction, SM.nLength);
			}

			if(SM.bTouch){
				SF2nd_Refract =SF;
				if(cbSetting_Effect_Befor2nd_Refract)	SF2nd_Refract =fSFEffect_Befor(SF2nd_Refract, SM);
				vec3 V3NL =SM.V3NormalLine;
				if(cbSetting_ShadeByLight2nd_Refract)	SF2nd_Refract.VColor.rgb *=dot(V3NL, normalize(V3P_Light))*0.5 +0.5;
				if(cbSetting_ShadeBySteps2nd_Refract)	SF2nd_Refract.VColor.rgb *=1.0 -SM.nLoop;
			}
		}
		SM2nd_Refract =SM;

	}

	vec3 V3RRR =SF1st.V3Real_Reflect_Refract;

	if(!SM1st.bTouch){
		SF1st.VColor =vec4(1);
		SF2nd_Reflect =SF2nd_Refract =SF1st;
	}

	if(cbSetting_CeilFloor1st){
		if(!SM1st.bTouch){
			SF1st.VColor =fVCeilFloor(SM1st.V3Direction);
			SF2nd_Reflect =SF2nd_Refract =SF1st;
		}else{
			if(!cbSetting_March2nd_Reflect && !cbSetting_March2nd_Refract){	/*二段反射等しない時には背景だけを反射*/
				vec3 V3Direction =reflect(SM1st.V3Direction, SM1st.V3NormalLine);
				vec2 V2RR =V3RRR.xy;
				V2RR /=abs(V2RR.x) +abs(V2RR.y);
				SF1st.VColor =SF1st.VColor *V2RR.x +fVCeilFloor(V3Direction) *V2RR.y;
				SF2nd_Reflect =SF2nd_Refract =SF1st;
			}
		}
	}

	if(cbSetting_CeilFloor2nd_Reflect && SM1st.bTouch && !SM2nd_Reflect.bTouch){
		vec2 V2RR =V3RRR.xy;
		V2RR /=abs(V2RR.x) +abs(V2RR.y);
		SF2nd_Reflect.VColor =SF2nd_Reflect.VColor *V2RR.x +fVCeilFloor(SM2nd_Reflect.V3Direction) *V2RR.y;
	}

	if(cbSetting_CeilFloor2nd_Refract && SM1st.bTouch && !SM2nd_Refract.bTouch){
		vec2 V2RR =V3RRR.xz;
		V2RR /=abs(V2RR.x) +abs(V2RR.y);
		SF2nd_Refract.VColor =SF2nd_Refract.VColor *V2RR.x +fVCeilFloor(SM2nd_Refract.V3Direction) *V2RR.y;
	}

	SF1st.VColor.rgb *=VC_DefaultLight.rgb;
	SF2nd_Reflect.VColor.rgb *=VC_DefaultLight.rgb;
	SF2nd_Refract.VColor.rgb *=VC_DefaultLight.rgb;

	if(cbSetting_Effect_After1st)			SF1st =fSFEffect_After(SF1st, SM1st);
	if(cbSetting_Effect_After2nd_Reflect)	SF2nd_Reflect =fSFEffect_After(SF2nd_Reflect, SM2nd_Reflect);
	if(cbSetting_Effect_After2nd_Refract)	SF2nd_Refract =fSFEffect_After(SF2nd_Refract, SM2nd_Refract);

	V3RRR /=abs(V3RRR.x) +abs(V3RRR.y) +abs(V3RRR.z);
	vec4 VColor =SF1st.VColor *V3RRR.x +SF2nd_Reflect.VColor *V3RRR.y +SF2nd_Refract.VColor *V3RRR.z;

	if(cbSetting_Shadow && SM1st.bTouch)	VColor.rgb -=fNShadow(SM1st.V3P, V3P_Light) *nShadow;

	if(!cbSetting_CeilFloor1st && !SM1st.bTouch)	VColor =fVBack(V2UV);

	VColor.a =1.0;
	gl_FragColor =VColor;
}

void main(void){
	fMain();
}
