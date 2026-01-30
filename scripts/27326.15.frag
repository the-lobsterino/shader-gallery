#ifdef GL_ES
precision highp float;
#endif

#define lightpos (resolution / 2.0);
#define lightradius (resolution.y / 2.0)
#define lightintensity 1.0
#define lightcolor vec4(1.0, 1.0, 1.0, 1.0)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 diff = gl_FragCoord.xy - lightpos;
	float dist = length(diff);
	float dim =  1.0 - (dist / lightradius);
	gl_FragColor = vec4(dim, dim, dim, dim) * lightcolor * lightintensity * (sin(time)/3.0 + (2.0/3.0));
}