#ifdef GL_ES
precision mediump float;
#endif

#define BRICKWIDTH 0.25
#define BRICKHEIGHT 0.08
#define MORTARTHICKNESS 0.01
#define BMWIDTH (BRICKWIDTH+MORTARTHICKNESS)
#define BMHEIGHT (BRICKHEIGHT+MORTARTHICKNESS)
#define MWF (MORTARTHICKNESS*0.5/BMWIDTH)
#define MHF (MORTARTHICKNESS*0.5/BMHEIGHT)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float _clamp(float x, float a, float b) {
	if(x < a){
		return a;
	}else if(x >= a && x <= b) {
		return x;
	}else{
		return b;
	}
}

float _bias(float b, float x) {
	return pow(x, log(b)/log(0.5));
}

float _gain(float g, float x) {
	if(x < 0.5){
		return _bias(1.0 - g, 2.0 * x)/2.0;
	}else{
		return 1.0 - _bias(1.0 - g, 2.0 - 2.0 * x)/2.0;
	}
}
float _mod(float a, float b) {
	int n  = int(a/b);
	a -= float(n)*b;
	if (a < 0.0){
		a += b;
	}
	return a;
}
float _gammacorrect(float gamma, float x) {
	return pow(x, 1.0/gamma/2.0);
}

vec3 _mix(vec3 c1, vec3 c2, float f) {
  return (1.0-f) * c1 + (f*c2);
}


void main( void ) {
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	
	float Ka = 1.0;
	float Kd = 1.0;
	vec3 Cbrick = vec3 (0.9, sin(position.x), 0.14);
	vec3 Cmortar = vec3 (0.15, cos(position.x), 0.5);
	vec3 Ct;
	vec3 Ci;

	float ss, tt, sbrick, tbrick, w, h;
	float scoord = position.x;
	float tcoord = position.y;
	float th;
	ss = scoord/BMWIDTH;
	tt = tcoord/BMHEIGHT;
	
	if(_mod(tt*0.5,1.0) > 0.5){
		ss += 0.5;
	}
	
	sbrick = floor(ss);
	tbrick = floor(tt);
	ss -= sbrick;
	tt -= tbrick;
	
	w = step(MWF,ss) - step(1.0-MWF,ss);
	h = step(MHF,tt) - step(1.0-MHF,tt);
	
	Ct = _mix(Cmortar, Cbrick, w*h);
	Ci = Ct;
	
	//float _color = _gain(0.8, position.x);
	
	//gl_FragColor = vec4( _color, 0.0, 0.0, 1.0 );
	
	gl_FragColor = vec4(Ci,1.0);

}