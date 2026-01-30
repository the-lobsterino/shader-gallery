precision mediump float;

uniform float resolution;
uniform float time;

float fZF 	= 11.11111;
float fZN	= 1.000001;
float h1 	= 40.00004;
float h2 	= 90.90909;
vec3 r		= vec3(1.0, 0.0, 0.0);
mat4 id		= mat4(1.0,0.0,0.0,0.0,
		       0.0,1.0,0.0,0.0,
		       0.0,0.0,1.0,0.0,
		       0.0,0.0,0.0,1.0);
void main() {
	vec4 	pos 	= 	vec4( vec3( gl_FragCoord.xy, time), 1.0);
	mat4 	m 	= 	mat4(pos.x,pos.y,0.0,0.0,
		       		0.0,0.0,0.0,0.0,
		       		0.0,0.0,0.0,0.0,
		       		0.0,0.0,0.0,0.0);
	vec3 	peek 	= 	mix(pos.x, pos.y, pos.z) + vec3(pos.x, pos.y, pos.z);
	gl_FragColor	=	vec4( peek, 1.0) * vec4( pos.x, pos.y, pos.z, 0.0);//* (id * vec4( peek, pos.w)));
	gl_FragColor.a	=	1.0;
}