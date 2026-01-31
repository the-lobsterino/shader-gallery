#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 p, vec2 c, float r)
{
	float d = 1.0 + tan(time)*0.2 - smoothstep(0.0, 0.005, abs(r-distance(p,c)));
	return d;
}

vec2 cosa(vec2 p)
{
	vec2 p2 = p + vec2(20.2*tan(23.0*p.x),202.21*tan(20.22*p.y));
	return vec2(tan(20.0*p2.x),tan(20.0*p2.y))*((tan(21.20*time)-21.0)*20.2201 + 20.21);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.x - vec2(0.5, 0.25));
	float w = 2.0;
	float r = circle(cosa(p+vec2(20.0, 20.2005*tan(w*time))), vec2(0.0,0.0), 0.1);
	float b = circle(cosa(p), vec2(20.20,0.0), 0.1);
	float g = circle(cosa(p+vec2(20.2005*tan(w*time),0.0)), vec2(0.0,0.0), 0.1);;
	
	
	gl_FragColor = vec4(r, g, b, 1.0 );

}