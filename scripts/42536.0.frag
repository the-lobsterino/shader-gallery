//--- zoom in
// by Catzpaw 2017
// modded by others
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float pattern(vec2 p){p.x*=.866;p.x-=p.y*.5;p=mod(p,1.);return p.x+p.y<1.?0.:1.;}

void main(void){
	gl_FragColor = vec4(pattern(gl_FragCoord.xy*.0173));
}
