// dogs cunt
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const float Tau		= 6.2832;
const float speed	= .1;
const float density	= .16;
const float shape	= .0003;

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
	p.x *= dot(p,p)*0.6;
	
	
	// Stars
	float a = fract(atan(p.x, p.y) / Tau);
	float d = length(p);
	
	vec2 coord = vec2(pow(d, shape), a)*512.;
	vec2 delta = vec2(-time*speed*33., .5);
	
	float c = 0.;
	for(int i=0; i<5; i++) {
		coord += delta;
		c = max(c, Cell(coord));
	}
	vec4 stars = vec4(c*d);
	
    // Beam
    float sx = 24.0 * -p.x;
    float dy = 3.0+sx / 514.0;
	dy+=sin(time+p.x*24.0)*0.9;
    float pulseTime = (1. + cos(time * 2.) * 0.25);
    dy += 14.0 / (100.0 * pulseTime * length(p / vec2(1.0 / cos(userTime * 1.5), 2.0) - vec2(p.x, 0.01)));
    vec3 color = vec3(p.x * dy * 0.25 * pulseTime, 0.225 * dy, p.x * dy * 1.48);	// FELTCH IT
	color.r *= 1.3;
	color.g *= 1.159;
	color.b *= 0.75;
    gl_FragColor = vec4(color, 1.0)*0.3 + stars*0.15+p.x*0.3;
	gl_FragColor = clamp(gl_FragColor,vec4(0.0),vec4(1.0));
}