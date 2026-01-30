#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 ma() {
       vec2 m = vec2(0.0, 0.0);
	float r = sin(time*0.1);
	m.x = cos(time *2.0*1.0)*r;
	m.y = sin(time*2.0*1.0)*r;
	return m;
}
vec3 drawcircle(vec2 p, vec2 center, float r, vec3 color) {
	float d = distance(center, p) ;
	float c = 1.0 - smoothstep(0.2, 0.21, d);
	vec3 result = color*c;
	return result;
	
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) ;
        p = p * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;
	
	vec3 color = vec3(0.0);
	vec3 ca =  drawcircle(p, ma(), 0.1, vec3(1.0, 1.0, 0.0));
	vec3 cb =  drawcircle(p, ma(), 0.2, vec3(1.0, 0.0, 0.0));
	color = ca + cb; 
	gl_FragColor = vec4( color, 1.0 );

}