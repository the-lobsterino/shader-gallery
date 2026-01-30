/*R040815作例　by ニシタマオ*/
/*サンドボックス上での試行用、２次元式、シーケンサー機能試験（R040815版）*/
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

vec4 VResolution =vec4(resolution, 0, 0);
float nTime =.1*time;
vec4 VMouse =vec4((mouse -0.5) *2.0, 0, 0);

int fISequencer(void){
	int iCycle =939, iTimePerSQ =5;
	int iSQ =int(floor(mod(nTime, float(iCycle)) /float(iTimePerSQ)));
	return iSQ;
}

float fNGoverner(void){
	int iCycle =120;
	float nGV =mod(nTime, float(iCycle)) /float(iCycle);
	return nGV;
}

int iCounter;
int fICounter(void){
	return iCounter++;
}

vec4 fVLissajous(float nLJ){
	vec4 VCycle =vec4(19,17,13,11);
	VCycle *=VCycle.x +VCycle.y +VCycle.z +VCycle.w;
	VCycle *=acos(-1.0) *2.0;
	vec4 VLS =sin(VCycle *nLJ);
	return VLS;
}

float fNRandom(float nIN){
	vec4 VSeed =fract(sqrt(vec4(2,3,5,7)));
	float nRandom =fract(sin(VSeed.x *nIN +VSeed.y));
	return nRandom;
}

float fNRandom(vec2 V2IN){
	vec4 VSeed =fract(sqrt(vec4(2,3,5,7)));
	float nRandom =fract(sin(dot(VSeed.xy, V2IN) +VSeed.z));
	return nRandom;
}

float fNRandom(vec3 V3IN){
	vec4 VSeed =fract(sqrt(vec4(2,3,5,7)));
	float nRandom =fract(sin(dot(VSeed.xyz, V3IN) +VSeed.w));
	return nRandom;
}

float fNRandom(vec4 VIN){
	vec4 VSeed =fract(sqrt(vec4(2,3,5,7)));
	float nRandom =fract(sin(dot(VSeed, VIN)));
	return nRandom;
}

float fNFractal(vec2 V2N, vec2 V2C){
	int iT;
	for(int I =0; I <100; I++){
		if(V2N.x >10.0)	break;
		V2N =vec2(V2N.x *V2N.x -V2N.y *V2N.y +V2C.x, 2.0 *V2N.x *V2N.y +V2C.y);
		iT++;
	}
	return float(iT);
}

vec4 fVColor(vec4 VP){
	vec4 VC =vec4(1);

/*	この下に、座標：VP.xyzw、と色彩：VC.rgbaの関係を記述*/

	{
		float nC;
		int iSQ =fISequencer();

          // 	uncomment to mix them	
		
	//	nC +=sin(VP.x) *sin(VP.y) *sin(VP.w);
		nC +=length(VP.xy)-VP.w;//
	
		nC +=abs(VP.x) -VP.w;
		nC +=abs(VP.y) -VP.w;
	//	nC +=VP.x *VP.y +VP.w;
	//	nC +=atan(VP.x, VP.y) *3.0 +VP.w;
	//	nC +=atan(abs(5.*VP.x), VP.y) *length(.25*VP.xy) -VP.w;//w
	//	nC +=length(VP.xy -vec2(0.5)) *length(VP.xy +vec2(0.5)) +VP.w;
	//	nC +=atan(VP.x +0.5, VP.y) *atan(VP.x -0.5, VP.y) +VP.w;
	//	nC +=atan(VP.x, VP.y) +length(VP.xy) -VP.w;
	//	nC +=atan(VP.x, VP.y) +length(VP.xy) *sin(VP.w);
	//	nC +=(VP.x +sin(VP.y *2.0 +VP.w)) *(VP.y +sin(VP.x *2.0 +VP.w));
	//	nC +=atan(VP.x +0.5, VP.y) *atan(VP.x -0.5, VP.y) +VP.w;
	//	nC +=log(abs(VP.x)) +log(abs(VP.y)) +VP.w;
	//	nC +=tan(VP.x) +tan(VP.y) +VP.w;
	//	nC +=sin(atan(VP.x, VP.y) *3.0 +VP.w) +length(VP.xy) -VP.w;
	//	nC +=length(VP.xy -fVLissajous(VP.w *1e-4).xy);
	//	nC +=fNRandom(floor(VP.xy *16.0)) +VP.w;
	//	nC +=fNFractal(VP.xy, sin(vec2(2,3) *VP.w));
	//	nC +=fNFractal(sin(vec2(2,3) *VP.w), VP.xy);	
		

		nC =sin(nC *16.0);
		VC.rgb =vec3(1) *step(nC, 0.0);
	}
	return VC;
}

void fMain(void){
	vec2 V2UV =(gl_FragCoord.xy *2.0 -VResolution.xy) /max(VResolution.x, VResolution.y);
	vec4 VColor =vec4(1), VP =vec4(V2UV, 0, nTime);

	VColor =fVColor(VP);

	gl_FragColor =VColor;
}

void main(void){
	fMain();
}

