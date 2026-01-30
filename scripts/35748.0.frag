//  Trying to modify some old stuff into a tunnel.
//  By @dennishjorth.

#ifdef GL_ES
precision mediump float;
#endif
 
 
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rotate(angle) mat2(cos(angle), sin(-angle), sin(angle), cos(angle))

float hex( vec2 p, vec2 h )
{
	vec2 q = abs(p);
	return max(0.1*q.x-h.y*0.1,max(q.x+q.y*0.57735,q.y*1.1547)-h.x)*0.1;
}


float hix(vec2 p, vec2 h){
	float retur = 1.;
	for(float i = 0.; i <= 8.; i += 1./5.){
		p += -(mouse-.5)*i*0.15;
		p *= rotate(0.051*cos(2./(1.+i)+time));
		p *= 1.1;
		if(hex(p, h) > 0.){
			retur = 1.-retur;
		}
	}
	return retur;
}
 
void main( void )
{

	float radius = 0.75;
	vec2 p =  gl_FragCoord.xy/resolution - vec2(0.50, .50);
	p.y /= resolution.x / resolution.y;
 
	float d = hix(p, vec2(radius));
	float c = 1.5 - smoothstep(0.0, .007, d*1.50);
	
	gl_FragColor = vec4(c);
//	gl_FragColor = vec4(gl_FragCoord.xy, 0.0, 0.0);
 
}
 
