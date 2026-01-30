#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void){
	vec2 pixel=floor(gl_FragCoord.xy);
	vec2 uv=pixel/resolution;
	float col=mod(pixel.x+pixel.y,2.);
	float p3x=mod(pixel.x,3.);
	gl_FragColor=vec4(p3x==0.?1.:0.,p3x==1.?1.:0.,p3x==2.?1.:0.,1.);
}