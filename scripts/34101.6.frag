//Why is the thumbnail black?
//length(x,y) <-> sqrt(pow(x,2.)+pow(y,2.)) <-> sqrt(x*x + y*y)
#ifdef GL_ES
precision highp float;
#endif
#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main(){
	vec2 uv=( gl_FragCoord.xy/resolution.xy)*50.;
	float color=sin(length(uv*sqrt(mouse.yx))+time*2.)+1.;
	gl_FragColor=vec4(0,color/2.,0,0);
}