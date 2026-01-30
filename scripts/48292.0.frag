#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main(void){
	vec2 uv=gl_FragCoord.xy/resolution;
	float m=(sin(time/2.)+1.)/2.,w=.1,o=(uv.y>=.75)||(abs(mix(m,.5,w*2.)-uv.x)<w&&(uv.y<.25))?.5:uv.x;
	gl_FragColor=vec4(vec3(o),1.);
}