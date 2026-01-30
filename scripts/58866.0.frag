///////magnetic field

#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 resolution;
vec2 rotz(in vec2 p, float ang) { return vec2(p.x*cos(ang)-p.y*sin(ang),p.x*sin(ang)+p.y*sin(ang)); }
void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); 
	  float d = 2.*length(p);
	vec3 col = vec3(0); 
	p = rotz(p, time*0.3+(p.x,p.y)*8.0);
	for (int i = 0; i < 18; i++) {
		float dist = abs(p.y + sin(float(i)+time*0.5*p.x)) - 0.1;
		if (dist < 1.0) { col += (1.10-pow(abs(dist), 0.17))*vec3(sin(1.9),2.69*sin(0.1),1.2); }
		p *= 0.89/d; 
		p = rotz(p, 30.0) ;
	}
	col *= 0.6 ; 
	gl_FragColor = vec4( col-d-0.0, 0.0); 
}