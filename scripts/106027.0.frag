#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
#define time (time/3.)

void main(void)
{
    float t = time;
    vec2  u = ( gl_FragCoord.xy + gl_FragCoord.xy - resolution ) / resolution.y;
    vec2 mm = (2.*(mouse*resolution) - resolution )/resolution.y;
	//u -= mm;
	u *= 2.99*dot(u-mm,u-mm);
	float w = .3,
    r = ceil(u.x/w+.8*t)+ceil(u.y/w+.8*t),
    m = mod(r, 9.),
    v = m > 1. ? u.x : u.y,
    b = step(fract(v/w), .5);
    vec3 c = vec3( b )*5.;
	float f = 1.257978976;
	//if ( mod( time, f ) < f/2. ) c = 1. - c;
    gl_FragColor =vec4(c, 1.); //ändrom3da4twistiii
	
}  