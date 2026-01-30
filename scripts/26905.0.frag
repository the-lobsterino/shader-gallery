#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const float Tau		= 6.2832;
const float speed	= .02;
const float density	= .04;
const float shape	= .04;

float random( vec2 seed ) {
	return fract(sin(seed.x+seed.y*1e3)*1e5);
}

float Cell(vec2 coord) {
	vec2 cell = fract(coord) * vec2(.5,2.) - vec2(.0,.5);
	return (1.-length(cell*2.-1.))*step(random(floor(coord)),density)*2.;
}

void main( void ) 
{
    float userTime = 0.0;
    vec2 p = (gl_FragCoord.xy / resolution.xy) - vec2(-0.5, 0.375);
	
	
	// Stars
	float a = fract(atan(p.x, p.y) / Tau);
	float d = length(p);
	
	vec2 coord = vec2(pow(d, shape), a)*256.;
	vec2 delta = vec2(-time*speed*256., .5);
	
	float c = 0.;
	for(int i=0; i<3; i++) {
		coord += delta;
		c = max(c, Cell(coord));
	}
	vec4 stars = vec4(c*d);
	
    // Beam
    float sx = 15.0 * -p.x;
    float dy = sx / 15.0;
    float pulseTime = (1. + cos(time * 2.) * 0.25);
    dy += 14.0 / (100.0 * pulseTime * length(p / vec2(1.0 / cos(userTime * 1.5), 2.0) - vec2(p.x, 0.01)));
    vec3 color = vec3(p.x * dy * 0.25 * pulseTime, 0.225 * dy, p.x * dy * 0.48);
    gl_FragColor = vec4(color, 1.0) + stars;
}