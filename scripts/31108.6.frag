#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 resolution;
//This work by Void Chicken is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
bool isc (vec3 v) {
	return length(v-vec3(0, sin(time)*2.0, 100))<3.0;	
}
bool isg(vec3 v) {
	return v.y < -5.0;	
}
vec3 ray2(vec3 ro, vec3 rd) {
	vec3 p=ro;
	for (int i = 0; i < 5120; i++) {
		p+=rd*1.0/10.0;
			
		if (isc(p))
			return vec3(float(i)/512.0);
	}
	return vec3(0);
}
vec4 ray(vec3 ro, vec3 rd) {
	vec3 p=ro;
	for (int i = 0; i < 5120; i++) {
		p+=rd*1.0/10.0;
		if (isc(p))
			return vec4(vec3(float(i)/512.0), 1);
	}
	return vec4(0);
}
void main( void ) {
	vec4 col = vec4(0);
	vec2 uv = gl_FragCoord.xy/resolution;
	float l = length(uv-0.5);
	vec2 puv = (uv+l*(-10.0+mod(time, 100.0)))/l;
	vec4 c = vec4(vec3(mod(puv, 0.5), mod(puv.x, 0.5)),1);
	col = ray(vec3(0, 0, -10.0+mod(time*10.0, 100.0)), vec3(uv-0.5,1));
	col = col*col.w+c*(1.0-col.w);
	gl_FragColor = col;

}