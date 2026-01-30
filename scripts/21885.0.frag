#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec2 pattern(vec2 p) {
	
	float a = atan(p.x,p.y);
	float r = length(0.5*abs(p)/fract(a));
	
	return vec2(fract(a*01.+cos(time*0.1)*4.0), sin(r*2.+sin(time*0.1)*4.0));
}

void main( void ) {

	vec2 p = surfacePosition * 1.0;
	vec3 col = vec3(0.0);
	
	for (int i=0; i<4; i++)
		p.xy = pattern(p);
	
	col.xy = p.xy;
	col.z = min(step(abs(p.x),0.5), step(abs(p.y),0.5));
	
	gl_FragColor = vec4( col, 1.0 );

}