#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 color = vec4(1.0,0.0,0.0,1.0);

//	Adapted from https://glsl.io/transition/d71472a550601b96d69d

 
bool inHeart (vec2 p, vec2 center, float size) {
	if (size == 0.0) return false;
	vec2 o = (p-center)/(1.6*size);
	return pow(o.x*o.x+o.y*o.y-0.3, 3.0) < o.x*o.x*pow(o.y, 3.0);
}

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	float m = inHeart(p, vec2(0.5, 0.4), 0.25) ? 1.0 : 0.0;
	gl_FragColor = mix(vec4(0.0), color, m);
}