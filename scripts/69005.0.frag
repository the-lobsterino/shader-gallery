#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
	vec2 st = gl_FragCoord.xy/resolution.y;
	vec3 color = vec3(1.);
	
	vec2 pos = vec2(1.,0.5)-st;
	float r = length(pos)*2.9;
	float a = atan(pos.y,pos.x);	
	float f = smoothstep(-0.5,1., cos(a*15.+time*6.))*0.2+0.5;
			
	color = vec3( 1.-smoothstep(f,f+0.1,r) );
	
	gl_FragColor = vec4(color, 1.0);
}