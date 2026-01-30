#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 3.0*( gl_FragCoord.xy / resolution.xy ) -1.0;
	p.x *= resolution.x/resolution.y;
	vec3 col = vec3(0); 
	
	
	p.x = mod(p.x+2.0+0.5*time, 4.0)-2.0;
	p.y = -abs(p.y)+0.8;
	
	float d = abs(p.y+0.5*smoothstep(0.0,2.0,p.x-mouse.x*0.0+0.0)-0.5*smoothstep(0.0,2.0,p.x+2.0));
	//if (d < 0.0025) col = vec3(1); 
	col = vec3(1,1,1)*6.0/(4.0+200.0*d);
	gl_FragColor = vec4(col, 1.0); 
}