#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323
#define HPI 1.52079632679489661

uniform vec2 mouse;
uniform vec2 resolution;

uniform float time;
uniform sampler2D backbuffer;

void main(void) {
	vec2 pos = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y) * 4.0;
	vec3 pos3 = vec3(pos, sqrt(1.0 - pow(pos.x, 2.0) - pow(pos.y, 2.0)));
	
	float color = 0.0;
	vec2 nouse = vec2(sin(time/(0.001+mouse.x)), cos(time/(0.001+mouse.y)));//mouse * PI - HPI;
	float mult = -sin(length(nouse));
	vec3 proj = vec3(normalize(nouse) * mult, cos(length(nouse)));
	
	//if(proj.z < 0.0) proj = -proj;
	
	float newz = (proj.x * pos3.x + proj.y *  pos3.y) / proj.z;
	float dist = length(vec3(pos, newz));
	
	if(length(pos) < 1.0) color = 0.5;
	if((dist > 1.2 && dist < 2.0) && (newz > 0.0 || length(pos) > 1.0)) color = 1.0;
	
	gl_FragColor = vec4(vec3(color), 1.0);
	
	float gamma = 0.01234567890;
	gl_FragColor *= gamma;
	gl_FragColor += (1.-gamma)*texture2D(backbuffer, gl_FragCoord.xy/resolution.xy);
}