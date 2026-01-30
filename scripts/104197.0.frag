
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define res resolution
vec2 m = mouse*res;

vec3 hueShift( float h ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }

float sphere(vec2 p, float r) {
	return length(p) - r;
}

float box(vec2 p, vec2 sides) {
	vec2 p1 = abs(p) - sides;
	return max(p1.x, p1.y);
}

vec2 opRotate(vec2 p, float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return vec2(
		c * p.x - s * p.y,
		c * p.y + s * p.x
	);
}

vec2 opTranslate(vec2 p, vec2 dp) {
	return p + dp;	
}

vec2 opRepeat(vec2 p, vec2 repeat) {
	return mod(p, repeat);	
}

float sdf(vec2 p) {
	p = opTranslate(p, vec2(0, time*5.));
	vec2 rep2 = vec2(0, 11);
	p = opRepeat(p, rep2);
	p = opTranslate(p, -.5 * rep2);
	p = opRotate(p, time);
	float b = box(p, vec2(2., 0.3));
	float b2 = box(p, vec2(.3, 2.));
	float s = sphere(p, 1.);
	return max(min(b, b2), s);
}

void main( void ) {
	float maxd = max(resolution.y, resolution.x);
	vec2 pos = (gl_FragCoord.xy - resolution.xy / 2.) / (maxd / 12.); 
	       m = (           m.xy - res.xy        / 2.) / (maxd / 12.);
	pos.x -= m.x;
	float dist = sdf(pos);
	
	//gl_FragColor = vec4(vec3(1. - (.5 * cos(abs(dist) * 100.) + .5)), 1.);
	/*if (abs(dist) < 0.003) {
		gl_FragColor = vec4(1.);	
	}*/
	if (abs(dist) > 0.00) {
		vec3 c = vec3((0.1*mouse.y+0.05)/(pow(abs(dist),0.6)));
		c *= vec3( 2.,.5,2.22*mouse.x);
		c *= hueShift( mouse.x/1. );
		//c *= hueShift( time/2. );
		c = 1. - exp( -c );
		gl_FragColor = vec4( c, 1. );
	}
}  


/// ändrom3da tweak