/*R040810作例　by ニシタマオ*/
/*サンドボックス上での試験用、２次元式（R040810版）*/
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

vec4 VResolution =vec4(resolution, 0, 0);
float nTime =time;
vec4 VMouse =vec4((mouse -0.5) *2.0, 0, 0);

/*文字列形状生成機能（R040630版）by ニシタマオ*/
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
/*文字の線分のデザインを、ここで変えられる。
	NP =length(max(abs(V3P) -nRadius *0.25, 0.0)) -0.25;
	NP =abs(V3P.x) +abs(V3P.y) +abs(V3P.z) -nRadius;
*/
	NP =length(V3P) -nRadius *0.75;

	return NP;
}

float fNLetters00(vec4 VP){
	float NP =1000000.0;
	{ vec3 V3C =vec3(3.75,3.75,1.5),  V3D =vec3(7.5,0,0), V3P; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1.5);{ VA.xy =vec2(1.5,3); VB.xy =vec2(-1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-3); VB.xy =vec2(-3,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-3,-1.5); VB.xy =vec2(1.5,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1.5); VB.xy =vec2(3,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-3); VB.xy =vec2(-3,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-3,-1.5); VB.xy =vec2(1.5,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1.5); VB.xy =vec2(3,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-3,-1.5); VB.xy =vec2(1.5,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1.5); VB.xy =vec2(3,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1.5); VB.xy =vec2(3,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,3); VB.xy =vec2(-1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1.5);{ VA.xy =vec2(-1.5,3); VB.xy =vec2(-3,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-3,1.5); VB.xy =vec2(1.5,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1.5); VB.xy =vec2(0,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1.5); VB.xy =vec2(0,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,1.5); VB.xy =vec2(3,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,4.5); VB.xy =vec2(3,3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(4.5,4.5); VB.xy =vec2(4.5,3); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1.5);{ VA.xy =vec2(-3,1.5); VB.xy =vec2(3,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-3,0); VB.xy =vec2(3,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,3); VB.xy =vec2(0,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-3); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(3,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-3); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(3,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(3,-1.5); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1.5);{ VA.xy =vec2(-1.5,3); VB.xy =vec2(-1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-3,1.5); VB.xy =vec2(-1.5,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,1.5); VB.xy =vec2(-3,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-3,-3); VB.xy =vec2(1.5,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1.5); VB.xy =vec2(3,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,1.5); VB.xy =vec2(-3,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-3,-3); VB.xy =vec2(1.5,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1.5); VB.xy =vec2(3,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-3,-3); VB.xy =vec2(1.5,1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1.5); VB.xy =vec2(3,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,1.5); VB.xy =vec2(3,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1.5);{ VA.xy =vec2(-1.5,3); VB.xy =vec2(1.5,3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,3); VB.xy =vec2(-3,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-3,0); VB.xy =vec2(3,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,0); VB.xy =vec2(3,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-3); VB.xy =vec2(-1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-3); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(1.5,3); VB.xy =vec2(-3,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-3,0); VB.xy =vec2(3,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,0); VB.xy =vec2(3,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-3); VB.xy =vec2(-1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-3); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-3,0); VB.xy =vec2(3,0); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,0); VB.xy =vec2(3,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-3); VB.xy =vec2(-1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-3); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,0); VB.xy =vec2(3,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-3); VB.xy =vec2(-1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-3); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(3,-3); VB.xy =vec2(-1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-3); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-3); VB.xy =vec2(-1.5,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(-1.5,-1.5); VB.xy =vec2(1.5,-3); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1.5);{ VA.xy =vec2(-3,0); VB.xy =vec2(3,0); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D; {   vec4 VP_Keep =VP;   VP.xyz -=V3P;{ vec4 VA, VB; VA.w =float(1.5);{ VA.xy =vec2(0,3); VB.xy =vec2(0,-1.5); NP =min(NP, fNLL(VP, VA, VB));}{ VA.xy =vec2(0,-3); VB.xy =vec2(0,-3); NP =min(NP, fNLL(VP, VA, VB));}}   VP =VP_Keep; }V3P +=V3D;}
	return NP;
}
/*文字列形状生成機能ここまで*/

vec4 fVColor(vec4 VP){
	vec4 VC =vec4(1);

/*	この下に、座標：VP.xyzw、と色彩：VC.rgbaの関係を記述。ただしVP.zはダミー、VP.wは時間 */

	{
		float nC =sign(sin(atan(VP.x, VP.y) *5.0 +VP.w *4.0 +length(VP.xy) *sin(VP.w) *4.0));
		VC.rgb =vec3(1) *nC;
	}

	{
		vec4 VPI =VP;
		VPI.xy *=mat2( cos(VP.w),-sin(VP.w), sin(VP.w), cos(VP.w));
		VPI.xyz -=vec3(-0.8,0,0) -sin(vec3(1.1,1.3,0) *(VP.xyz +VP.w)) *0.2;
		VPI.xyz *=24.0;
		float nC =fNLetters00(VPI);
		nC =clamp(-nC, 0.0, 1.0);
		if(nC >0.1) VC.rgb =1.2 *nC *(sin((vec3(0,1,2) /3.0 +length(VP.xy) -VP.w) *acos(-1.0) *2.0) *0.2 +0.8);
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

