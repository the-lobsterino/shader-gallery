#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//does this thing have a name?

void main( void ) {
	
	vec2 m = mouse-.5;
	m *= 2.;
	
	
	float s = 2.;
	
	
	vec2 uv = gl_FragCoord.xy/resolution.xy * s - .5 * s;
	uv.x *= resolution.x/resolution.y;
	
	
	float r = .001;
	for (int i = 0; i < 7; i++){
		vec4 v = vec4(0.);
		float t = float(i);
	
		v.x = fract(distance(resolution.x, uv.x))-.5;
		v.x *= v.x;
		v.x = fract(v.x);
		t = v.x;
		v.y = fract(distance(resolution.y, uv.y))-.5;
		v.y *= v.y;
		v.y = fract(v.y);
		r /= (v.x+v.y)*2.;
		uv += abs(uv+r);
	}
	
	
	gl_FragColor = vec4(1.) * r*.25; //sphinx
}