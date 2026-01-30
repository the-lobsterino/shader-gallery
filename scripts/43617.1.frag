#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
const float max_iter = 1000.;
const float scalar = max_iter/13.;

vec2 CplxSqr(vec2 z){
	return vec2 (z.x*z.x-z.y*z.y,2.*z.x*z.y);
}
void main( void ) {
	vec2 pos = ((gl_FragCoord.xy / resolution.xy)*2.)-1.;
	pos.x *= resolution.x/resolution.y;
	//pos *= 1.2;
	vec2 temp = vec2(0.);
	float i = 0.;
	float y;
	vec4 color = vec4(0.);
	for(float i = 0.;i < max_iter;i++){
		temp = CplxSqr(temp)+pos;
		if(length(temp) > 2.){
			y = i*scalar/max_iter;
			color = vec4(y,1./1.4*log2(y),1./y,1.);
			break;}	
	}
	color = vec4(vec3(color),1.);
	gl_FragColor = color;

}