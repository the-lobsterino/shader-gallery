#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// drip test --joltz0r

float check (vec2 p, float size) {
	float c = float(int(floor(cos(p.x/size)*10000.0)*ceil(cos(p.y/size)*10000.0)))*0.0001;
	return clamp(c, 0.3, 0.7);
}
void main( void ) {
	
	vec2 p = (( gl_FragCoord.xy / resolution.xy ) - 0.5) * 2.5;
	p.x *= resolution.x/resolution.y;
	vec2 i = p;
	
	float c = 0.0;
        vec2 sc = vec2(sin(time*0.54), cos(time*0.56));
		
	float d = length(p)*10.0;
	float r = atan(p.x, p.y);
	float len = (1.0-length(p*0.5));
	float dist = len*(1.0-sin(pow(d,1.25)+(cos(d-time*2.5)*4.0)));
	float pc = check(p, 0.125);
        i += vec2(dist*0.05)*len;
	float ic = check(i, 0.125);
	float trans = 0.8;

	c = 1.0/((length(p+sc)*pc)+((length(i+sc)*ic*8.0)));
	gl_FragColor = vec4( vec3(c), 1.0 );

}