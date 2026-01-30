#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main(void){
	vec2 uv=gl_FragCoord.xy/resolution.xy;
	float t=time+(uv.y/2.);
	vec3 a=vec3(1.,0.,(sin(t)+1.)/2.),b=vec3((sin(t*2.)+1.)/2.,1.,(sin(t*2.5)+1.)/2.);
	vec3 color=uv.y<.5?mix(a,b,uv.x):sqrt(mix(pow(a,vec3(2.)),pow(b,vec3(2.)),uv.x));
	gl_FragColor=vec4(color,1.);
}