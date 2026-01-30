\
	
	
	OQerfighfrbklcadbsof
	
	
	
	
	
	
	
	
	
	
	
	
uniform float time;
uniform vec2 ;
uniform vec2 resolution;

void main( void ) {
	vec2 s = (gl_FragCoord.xy - resolution.xy / 2.);	
	float ang = atan(s.y, s.x) + time * 0.2;
	vec2 dir = normalize(s);
	
	vec2 circle = dir * min(resolution.x, resolution.y) / 4.;
	vec2 desl = dir * 20. * cos(3.*ang);
	vec2 p = circle + desl * cos(4. * time); 
	float d = distance(p, s);
	
	vec3 color = vec3(step(d, 1.));
	gl_FragColor = vec4(color, 1.0);

}