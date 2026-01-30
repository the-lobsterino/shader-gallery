#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define RADIUS 0.2

float linify(float value, float thickness)
{
	return abs(thickness/value);
}

float circlify(vec2 pos, vec2 center, float radius)
{
	float x = pos.x - center.x;
	float y = pos.y - center.y;
	float circleEquation = x*x + y*y - 0.7*radius*radius*abs(sin(x*y*100.0));
	return linify(circleEquation, 0.05*radius);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy )*2. -1.;
	p.x *= resolution.x/resolution.y;
	
	vec3 finalColor = vec3(0.);
	
	vec3 color = vec3(0.1, 0.1, 0.2);
	vec3 color1 = vec3(0.2, 0.1, 0.1);
	vec3 color2 = vec3(0.1, 0.2, 0.1);
	
	//finalColor += color * linify(0.01,0.05);
	
	finalColor += color * circlify(p, vec2(0.,0.), RADIUS+0.1);
	finalColor += color1 * circlify(p, vec2(0.5,0.2), RADIUS);
	finalColor += color2 * circlify(p, vec2(-0.6,-0.2), RADIUS);

	gl_FragColor = vec4( finalColor, 1.0 );

}