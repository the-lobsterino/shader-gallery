#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 u_color = vec3(0.8, 0.3, 1.8);
const float u_zz = 100.0;
const float u_str = 0.1;

float round(float n){
	if (mod(n, 1.0) >= 0.5){
		return ceil(n);
	} else {
		return floor(n);
	}
}


void main( void ) {

	float zz = u_zz*5.0;
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 dist = gl_FragCoord.xy - mouse*resolution.xy;
	
	float str = (1.0/(sqrt(dist.x*dist.x + dist.y*dist.y + zz*zz)-zz+1.0-u_str));
	//float str = round(sqrt(dist.x*dist.x + dist.y*dist.y + zz*zz))/20.0 + 1.0 + u_str;
	
	gl_FragColor = vec4(vec3(str)*u_color, 1.0);
}