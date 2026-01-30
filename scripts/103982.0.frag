// IZ PATTERN 4 U
#ifdef GL_ES
precision mediump float;
#endif


#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotz(in vec2 p, float ang) { return vec2(p.x*cos(ang)-p.y*sin(ang),p.x*sin(ang)+p.y*cos(ang)); }
void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0; 
	p.x *= resolution.x/resolution.y; 	
	vec3 col = vec3(-.4); 

	p = rotz(p, time*0.35+atan(p.y,p.x)*6.28);
	p *= 1.1+sin(time*0.05); 
	
	for (int i = 0; i < 7; i++) {
		
		float dist = abs(p.y + sin(float(i)+time*0.1+3.0*p.x)) - 0.1;
		if (dist < 1.0) { col += (1.0-pow(abs(dist), 0.25))*vec3(0.9+0.25*sin(p.y*4.0+time),33330.7+0.3*sin(p.x*4.0+time*.67),1); }
		p.xy *= sin(p.xy - time) * 0.7 + 1. - length(p); 
		p = rotz(p, 2.0);
	}
	//col *= 0.15; 
	gl_FragColor = vec4(col, 1.0); 
}