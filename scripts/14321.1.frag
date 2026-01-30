#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define atau 0.1592356

vec4 displayComponent(vec4 c, vec4 v);

void main( void ) {

	vec2 uv = vec2(resolution.x/resolution.y, 1.) * (gl_FragCoord.xy/resolution * 2. - 1.);
	
	
	float b = floor(32.*mouse.y);
	float i = floor(32.*mouse.x);
	
	float a = atan(uv.x, uv.y);
	float l = length(uv);
	float f = floor(l*i);
	float fr = abs(fract(.5+l/i)-.5);
	
	a = abs(fract((a+f*b)*atau)-.5)*2.;
	
	float m = mod(f, 2.);
	m = step(m-.5, a)-step(a, .5);
	
	vec4 r = displayComponent(vec4(l, a, f/i, abs(l*a)), vec4(m));
	
	gl_FragColor = r;
}//sphinx


vec4 displayComponent(vec4 c, vec4 v){
	const int s = 4;
	float fs = float(s);
	vec2 div = vec2(fs, fs*fs);
	vec2 p = floor(gl_FragCoord.xy/resolution*div);
	vec2 m = floor(mouse*div);
	
	for(int i = 0; i <= s; i++){
		c = m.x == float(i) ? vec4(c[i]) : c;
	}

	v = m.y == 0. ? c : v;
	v = p.y == 0. ? v * .25 + (p.x / fs) * .25 : v;
	
	return v;
}