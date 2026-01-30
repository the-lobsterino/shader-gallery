#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 get_tex(in vec2 p)
{
	if (mod(p.x*4.0+time+p.y*3.0,1.0)>0.5) return vec3(1);
	
	return vec3(0); 
}
void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x/resolution.y;
	vec3 col =vec3(0);
	float r = sqrt(1.0 - p.x*p.x-p.y*p.y);
	
	
	if (r < 1.0) {
		p *= 2.0;
		col = get_tex(vec2(p.x*(1.0-r*0.4),p.y));	
	}
	else {
		col = get_tex(p.xy); 
	}
	//col = vec3(1)*r;
	gl_FragColor = vec4(col, 1.0); 
}