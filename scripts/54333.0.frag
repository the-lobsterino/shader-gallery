#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pow(float n, const int p){
	float res = 1.0;
	for(int i = 0; i >= 0; i++){
		if(i >= p) break;
		res *= n;
	}
	return res;
}
float getDensity(vec3 metaball, vec2 position, bool precise){
	float res = pow(metaball.z,2) / (pow(metaball.x - position.x,2) + pow(metaball.y - position.y,2));
	if(precise) if(res != 1.0) res = 0.0;
	return res;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 mb1 = vec3(0.3,0.5,0.1);
	vec3 mb2 = vec3(sin(time)*0.5+0.5,0.5,0.1);
	vec4 res = vec4(0.0,0.0,0.0,0.0);
	float density = getDensity(mb1, position, false) + getDensity(mb2, position,false);
	gl_FragColor = vec4(density,density,density,1);
}

