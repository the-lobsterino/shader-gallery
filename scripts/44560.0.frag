#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x/resolution.y;
	vec3 col = vec3(0); 
	
	
	float d = length(p.xy); 
	col = vec3(1,1,1)*1.0/(1.0 + 50.0*abs(d-0.5)-0.5); 
	
	float ang = -time/10.0;
	float ang2 = -time/100.0;
	d = dot(p.xy,vec2(cos(ang),sin(ang)));
	float d2 = dot(p.xy,vec2(sin(ang),-cos(ang)));
	float hand1 = pow(clamp(1.0-length(2.0*p.xy),0.0,d2)*5.0/(1.0 + 50.0*abs(d)-0.5), 5.0);
	col += vec3(1,1,1) * hand1; 
	
	d = dot(p.xy,vec2(cos(ang2),sin(ang2)));
	d2 = dot(p.xy,vec2(sin(ang2),-cos(ang2)));
	float hand2 = pow(clamp(1.0-length(3.0*p.xy),0.0,d2*2.0)*4.0/(1.0 + 50.0*abs(d)-0.5), 5.0); 
	col += vec3(1,1,1)*hand2;
	gl_FragColor = vec4(col, 1.0); 
}