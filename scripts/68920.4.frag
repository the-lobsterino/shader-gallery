
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv( in vec3 c )
{
 vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
 rgb = rgb*rgb*(3.0-2.0*rgb);
 return c.z * mix( vec3(1.0), rgb, c.y);
}

#define CHS 0.2
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float LR(vec2 p, float d){p.x=abs(p.x);return line2(d,p,vec4(2,-3.25,2,3.25)*CHS);}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float TBLR(vec2 p, float d){return min(d,abs(sdBox2(p,vec2(2,3.25)*CHS)));}
float A(vec2 p,float d){d=LR(p,d);p.y=abs(p.y-1.5*CHS);return line2(d,p,vec4(2,1.75,-2,1.75)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));}
float C(vec2 p,float d){d=TB(p,d);return line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);}
float D(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(2,-1,2,1)*CHS);p.y=abs(p.y);d=line2(d,p,vec4(2,1,1.5,2.75)*CHS);d=line2(d,p,vec4(1.5,2.75,1,3.25)*CHS);return line2(d,p,vec4(1,3.25,-2,3.25)*CHS);} // SUCK MY ARSEHOLE
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float F(vec2 p,float d){d=line2(d,p,vec4(2,3.25,-2,3.25)*CHS);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float G(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(2,2.25,2,3.25)*CHS);d=line2(d,p,vec4(2,-3.25,2,-0.25)*CHS);return line2(d,p,vec4(2,-0.25,0.5,-0.25)*CHS);}
float H(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(-2,-0.25,2,-0.25)*CHS);}
float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);}
float J(vec2 p,float d){d=line2(d,p,vec4(-1.5,-3.25,0,-3.25)*CHS);d=line2(d,p,vec4(0,-3.25,1,-2.25)*CHS);d=line2(d,p,vec4(1,-2.25,1,3.25)*CHS);return line2(d,p,vec4(1,3.25,-1.5,3.25)*CHS);}
float K(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(-2,-0.25,-0.5,-0.25)*CHS);d=line2(d,p,vec4(2,3.25,-0.5,-0.25)*CHS);return line2(d,p,vec4(-0.5,-0.25,2,-3.25)*CHS);}
float L(vec2 p,float d){d=line2(d,p,vec4(2,-3.25,-2,-3.25)*CHS);return line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);}
float M(vec2 p,float d){p.x=abs(p.x);d=line2(d,p,vec4(2,-3.25,2,3.25)*CHS);return line2(d,p,vec4(0,0.75,2,3.25)*CHS);}
float N(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);}
float O(vec2 p,float d){return TBLR(p,d);}
float P(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d,abs(sdBox2(p,vec2(2.0,1.75)*CHS)));}
float Q(vec2 p,float d){d=TBLR(p,d);return line2(d,p,vec4(2,-3.25,0.5,-1.75)*CHS);}
float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));}
float S(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-0.25)*CHS);d=line2(d,p,vec4(-2,-0.25,2,-0.25)*CHS);return line2(d,p,vec4(2,-0.25,2,-3.25)*CHS);}
float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float U(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(2,-3.25,-2,-3.25)*CHS);}
float V(vec2 p,float d){p.x=abs(p.x);return line2(d,p,vec4(0,-3.25,2,3.25)*CHS);}
float W(vec2 p,float d){p.x=abs(p.x);d=line2(d,p,vec4(2,-3.25,2,3.25)*CHS);return line2(d,p,vec4(0,-1.25,2,-3.25)*CHS);}
float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}
float Y(vec2 p,float d){d=line2(d,p,vec4(0,-0.25,0,-3.25)*CHS);p.x=abs(p.x);return line2(d,p,vec4(0,-0.25,2,3.25)*CHS);}
float Z(vec2 p,float d){d=TB(p,d);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}
//float SHAFT(vec2 p,float d, float o){ p.x*=1.3; d=min(d,.11*length(p)); p.y+=.7;d=min(d,.1*length(p));p.y+=.5;d=min(d,.09*length(p));p.y+=.5;d=min(d,.08*length(p)); return d;}
float SHAFT(vec2 p,float d, float o, float f){ p.x*=1.3; p.y+=o; return min(d,f*length(p));}

const float PI  = 3.141592653589793;
const float PI2 = PI * 2.;

float lPolygon(vec2 p,int n){
  float a = atan(p.x,p.y)+PI;
  float r = PI2/float(n);
  return cos(floor(.5+a/r)*r-a)*length(p);
}

mat2 mRotate(float a){
 float c=cos(a);
 float s=sin(a);
 return mat2(c,-s,s,c);
}

float lStarPolygon(vec2 p,int n,float o){
 return (lPolygon(p,n) - lPolygon(p * mRotate(PI2 / float(n) / 2.),n) * o) / (1.-o);
}

float lim(float alpha) {
	// Simple 0.0 - 1.0 limiter
	return min(1.0, max(0.0, alpha));
}

float xpow(float val, float ex) {
	if (val < 0.0) {return .00;}
	return pow(val, ex);
}

void main( void ) {

    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y), uv = p*4.0 + vec2(1.,-2.8);			
	
	float _d = W(uv,1.0), _d2=_d;
	uv.x -= 1.1;
	_d = A(uv,_d);
	uv.x -= 1.1;
	_d = P(uv,_d);
	uv.x -= 1.1;	
	_d = 1.-smoothstep(0.0,0.05,_d-0.55*CHS);
		
	uv -= (mouse-.64)*vec2(16.,12.);	
	_d2 = SHAFT(uv,_d2,0.,.11);
	_d2 = SHAFT(uv,_d2,0.7,.1);
	_d2 = SHAFT(uv,_d2,1.6,.095);
	_d2 = SHAFT(uv,_d2,2.4,.09);
	_d2-=_d2*SHAFT(uv,_d2,-1.,.87)/2.;
	_d2 = 1.-smoothstep(0.0,0.004,_d2-0.11);
	_d2 -=(smoothstep(0.89,0.9,SHAFT(uv,_d2,-2.,.47)))/2.;
	
	
	vec2 position = (gl_FragCoord.yx / resolution.x - vec2(.232,.5))*2.;
	position.yx+=mouse/20.-.021;

	// Config variables
	float mouthEdge = 0.2; // abs X coord where mouth corners are
	float lipWidth = 0.0752; // Width of lips
	
	float openSize;
	
	float ms=length(mouse-.5)*3.;
	if (ms<1.35) openSize=clamp(1.-ms,0.,1.); // how much the mouth is open 
	else openSize =max(0.,1.-ms)-1.5; // how much the mouth is open 
	float cornerPull = 0.;//mouse.y / 2.0 - .40; // +/- pull at the corners for smile/frown
	vec3 LipColor = vec3(0.986, 0.02, 0.2);
	vec3 MouthColor = vec3(0.99, 0.337, 0.3431);
	
	// Base skin color
	gl_FragColor = vec4(0.7, 0.5, 0.4, 1.0);
	
	// Define edges
	float cpv = cornerPull * 0.1 * (1.0 - cos(abs(position.x) / mouthEdge)); // corner pull value, accounting for X coord
	float osv = openSize * 0.047 * cos(3.1415 * 0.47 * abs(position.x) / mouthEdge);
	float mouthT = cpv + osv; // Y coord of edge of top lip
	float mouthB = cpv - osv; // Y coord of edge of bottom lip
	float mouthFade = max(0.1, min(1.0, (abs(position.x) - (mouthEdge * 0.94)) * 30.0)); // Fade based on X coord past mouthEdge
	
	// Draw inner mouth
	float im = lim((position.y - mouthT) * 100.0);
	im = lim(im + lim((position.y - mouthB) * -100.0));
	im = lim(im + mouthFade); // Visibility between lips
	vec3 innerMouth = MouthColor * (0.5-position.y * 20.0); // Roof of mouth
	if (im < 1.0) {
		// Draw tongle
		float tongue = cos( position.y * 1.0 ) -.96;
		innerMouth = mix(MouthColor * 1.0, innerMouth, lim((-position.x + tongue) * 330.0));
		
		// Draw teeth/cum
		if(mouse.y<.5)
		for (int t=0; t<5; t++) {
			float tx = (float(t) + 1.) * 0.036;
			tx = lim(abs(-(position.x) - tx-.03321*abs(mod(time,1.))-.1) * 100.0 - 1.0);
			float tu = lim((-position.y - 0.024 - float(t) * 0.002) * 100.0);
			innerMouth = mix(vec3(04.97 - 0.2 * float(t)), innerMouth, lim(tx + tu));
			
			//float tb = lim((position.y + 0.035 + openSize * 0.02 + float(t) * 0.002) * 100.0);
			//innerMouth = mix(vec3(0.97 - 0.25 * float(t)), innerMouth, lim(tx + tb));
		}
	}
	gl_FragColor.rgb = mix(innerMouth, gl_FragColor.rgb, im);
	
	// Draw lower lip
	float BLip = lipWidth * sin(3.1415 * 0.5 * (1.10 - (position.x) / mouthEdge)) * (.9+.35*sin(1.28+3.1415 * (1.10 - (position.x) / mouthEdge)));
	BLip = lim((abs(position.y - mouthB + BLip) - BLip) * 300.0);
	gl_FragColor.rgb = mix(LipColor * min(1.0, 0.6 + mouthFade + 5.0*abs(position.y - mouthB)), gl_FragColor.rgb, lim(BLip+mouthFade));

	// Draw upper lip
	float TLip = lipWidth * sin(3.1415 * 0.5 * (1.10 - (position.x) / mouthEdge))* (.9+.4*sin(1.28+3.1415 * (1.10 - (position.x) / mouthEdge)));
	TLip = lim((abs(position.y - mouthT - TLip) - TLip) * 300.0) ;

	float openlegs=clamp(2.*sin(time/3.),0.,1.);//abs(sin(time));// //
	
	gl_FragColor.rgb = mix(LipColor * 0.80 *min(1.0, 0.6 + mouthFade + 5.0*abs(position.y - mouthT)), gl_FragColor.rgb, lim(TLip+mouthFade)) * step(sin(position.x-.47+cos(position.y*(1.+3.*openlegs*openlegs))),.7)   * (1.-.5*abs(.6+cos(position.x*1.5+2.*cos(position.y*2.*openlegs))));
	
	if(abs(position.y)<.622) gl_FragColor.rgb *= (1.-step(sin(position.x/1.13+.2317+.2*pow(.1+sin(abs(5.2*position.y)),.4425)),.051));//arse
	else gl_FragColor.rgb *=  (1.-step(-.215*(openlegs)+sin(((.9-openlegs)+.25)*position.x-.247+cos(abs(position.y*(1.1+mouse.x/20.)))),.2517)) * abs(1.25-sin(sin(position.x-.64)+1.)); //legs
	
	gl_FragColor+=_d+_d2/3.;
}