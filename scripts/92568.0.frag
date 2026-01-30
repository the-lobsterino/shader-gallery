//RETRO PIXEL SHADER <--- LOL
// BY juha soderqvist (alias JUHAX.COM)
//SPEEDHEAD of BYTERAPERS
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main(void) {
vec2 p=gl_FragCoord.xy;
vec2 res = resolution.xy;
	
p=p*2.5;
p=p-res;

float pix = sin(.004*time*(length(floor((4.*p.xy - res)/res.y * 20.))));
pix*=length(floor(4.*res.x));



gl_FragColor = vec4( pix,pix,pix,1.);
}