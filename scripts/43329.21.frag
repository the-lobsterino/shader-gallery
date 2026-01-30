#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI=3.14159265359;

float f1(float x) {
	return pow(2.0, x*2.)*0.25+0.25;
}

float sing(float x) {
	return sin(x*0.017);
}

float ColorFunc(float x, float y) {
	return (2.-sqrt(sing(x*2.5)+sing(y*2.5)+2.01));
}
 
float ColorR(vec2 v) { 
	return ColorFunc(v.x*0.7+sin(time*0.51)*188., v.y+120.+sin(time*0.751)*288.); 
}

float ColorG(vec2 v) { 
	return ColorFunc(v.x*0.7+sin(sin(150.+time)*1.33)*133., v.y-120.+sin(time*0.33)*250.); 
}

float ColorB(vec2 v) { 
	return ColorFunc(v.x*1.5+sin(time*0.431)*33., v.y*1.5+sin(time*0.231)*233.); 
}

vec3 CalcPoint(float X, float Y) {
  	float X1 = X*8.+sin(time*.1)*100.;
  	float Y1 = Y*8.+sin(time*.1)*100.;
 
  	float R1 = ColorR(vec2(Y1/3.-450., X1/3.-330.));
  	float G1 = ColorG(vec2(X1*0.2, Y1*0.2));
  	float B1 = ColorB(vec2(X1*0.2, Y1*0.2));
  	float B2 = ColorB(vec2(X1*0.2+30., Y1*0.2));
 
  	float R3 = ((ColorR(vec2(R1*G1*G1*200.-100., G1*100.)))/3.0)*B2;
  	float B3 = ((ColorB(vec2(B1*R1*G1*200.-100., G1*100.+120.)))/3.+0.05)*R1;
  	float G3 = ((ColorG(vec2(G1*G1*B1*200.+100., G1*100.)))/3.+0.05)*B1*0.5; 
 
	float s = 2.5;
	float k = -.5;
	float j = 5.;
	float i = 5.;

  	float Rx = abs(R3*1.6 + sing(2500.*(G3 - B3))*0.25 + G3*0.3 + B3*0.2);
  	float Gx = abs(G3*1.5 + sing(2500.*(B3 - R3))*0.25 + R3*0.2 + B3*0.2);
  	float Bx = abs(B3*1.5 + sing(2500.*(R3 - G3))*0.25 + R3*0.2 + G3*0.3);
 
  	float Rr = j*pow(Rx, s)+2.*i*pow(Bx+Gx*1.5, k)*0.15;//Rx*0.75;//Rx > 1.? 2. - Rx: Rx;
  	float Gg = j*pow(Gx, s)+i*pow(Rx*0.5+Bx, k)*0.15;//Gx*0.75;//Gx > 1.? 2. - Gx : Gx;
  	float Bb = j*pow(Bx, s)+i*pow(Rx*0.5+Gx*1.5, k)*0.15;//Bx*0.75;//Bx > 1.? 2. - Bx : Bx;

  	float R = Rr*0.65 + Gg*0.2 + Bb*0.15;
  	float G = Gg*0.55 + Rr*0.2 + Bb*0.2;
  	float B = Bb*0.6 + Rr*0.2 + Gg*0.2;
	
  	return vec3((R+G*0.5+B*0.5)*0.25, (G-R*0.125+B*0.5+0.125)*0.66, (B+R*0.125+G*0.25+0.25)*0.75);
}
 
void main() {
	float x = (gl_FragCoord.x/resolution.x+mouse.x)*240.0-400.;
	float y = (gl_FragCoord.y/resolution.y+mouse.y)*180.0-300.;
	
	vec3 v = CalcPoint(x, y);
	vec3 r = v*0.25-0.25;
	
	if(r.x>0.999) r.x=.999;
	if(r.y>0.999) r.y=0.999;
	if(r.z>0.999) r.z=0.999;
	if(r.x<0.01) r.x=0.01;
	if(r.y<0.01) r.y=0.01;
	if(r.z<0.01) r.z=0.01;
	gl_FragColor=vec4(r*0.95+0.05, 1.0);

}
