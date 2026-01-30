#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision highp float;
#endif

////////////////////////////////// S       A       Y               O       T ///////////////////////////////////////////////////////////////
//////////////////////////////////     H       K              S        R     ///////////////////////////////////////////////////////////////


const float LAYERS = 8.;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float rand(vec2 co)  // http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
{
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy ,vec2(a,b));
    float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

vec4 startScreen() {
	float n = rand(gl_FragCoord.xy + time);
	n -= mod(n, 1. / floor(LAYERS));
	return vec2(n, 1.).xxxy;
}

float getState() {
	return mod(time * 13., 1.);
}

vec4 get(int offX, int offY) {
	if (floor(getState() * 2.) == 0.) {int temp = offX;offX = -offY;offY = temp;}
	if (floor(getState() * 4.) == 0.) offX *= -1;
	return texture2D(backbuffer, clamp((gl_FragCoord.xy + vec2(float(offX), float(offY))) / resolution, vec2(0.), vec2(1.)));
}

void main( void ) {
	vec4 col = get(0, 0);
	
	if (mod(gl_FragCoord.x + gl_FragCoord.y + mod(floor(getState() * 4.), 2.), 2.) < 1.) {
		if (get(0, 1).r > col.r) col.rgb = get(0, 1).rgb;
	} else {
		if (get(0, -1).r < col.r) col.rgb = get(0, -1).rgb;
	}
	
	if (texture2D(backbuffer, vec2(0.)).a < 0.1 || length(mouse * resolution) < 10.) {col = startScreen();}
	gl_FragColor = col;
	if (length(gl_FragCoord - .5) < 1.) gl_FragColor = vec2(1., 1.).xxxy;
}