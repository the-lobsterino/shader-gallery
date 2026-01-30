//#  Greetz from DK.... thank you ;
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 red = vec3(0.0,0.0,1);
const vec3 white = vec3(1,1,0)*0.8;
vec3 col1;
const float PI = 3.1415926535;
void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0; 
	p.x *= resolution.x/resolution.y; 
	
	p.x += sin(p.y+time*2.0)*.05;
	p.y += sin(p.x*2.0-time*2.0)*.2;
	
	
	
	vec2 uv = (gl_FragCoord.xy*2.-resolution.xy)/resolution.y+1.1;
	
	float w = sin((uv.x + uv.y - time * .5 + sin(1.5 * uv.x + 4.5 * uv.y) * PI * .3) * PI * .6); // fake waviness factor
 
		col1 = vec3(0.80,0.80,0.0);
		col1 = mix(col1, vec3(0.8,0.,0.), smoothstep(.01, .025, uv.y+w*.02));
		 
		col1 += w * .2;
	
	vec3 col = col1; 
	
	if (abs(p.y) < 0.2) col = white+w*0.3;
	if (abs(p.x+0.75) < 0.2) col = white+w*0.3;
	
	//if(abs(p.x) > 1.60) col = col1;
	//if(abs(p.y) > 1.0) col = col1;
	
	gl_FragColor = vec4(col , 1.0); 
}