#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float iSphere(in vec3 ro, in vec3 rd){
	float r = 1.0;
	float b = 2.0*dot(rd,rd);
	float c = dot(ro,ro)-r*r;
	float h = b*b-4.0*c;
	if(h<0.0) return -1.0;
	float t = (-b - sqrt(h))/2.0;
	return t;
}

float intersect(in vec3 ro, in vec3 rd){
	float t = iSphere(ro, rd);
	return t;
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy/resolution.xy;
	
	vec3 ro = vec3( 0.0, 1.0, 4.0);
	vec3 rd = normalize( vec3(-1.0+2.0*uv, -1.0) );
	
	float id = intersect(ro, rd);
	
	vec3 col = vec3(0.0);
	if(id>0.0){
		col = vec3(1.0);
	}
	
	gl_FragColor = vec4(col, 1.0);
}