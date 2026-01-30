#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  resolution;
uniform float time;
uniform sampler2D backbuffer;

#define PIXELSIZE 3.0

const int num_x = 5;
const int num_y = 5;
float w = resolution.x;
float h = resolution.y;
 
vec4 draw_ball(int i, int j) {
	float t = time;
	float x = w/5.0 * (1.0 + cos(1.5 * t + float(3*i+4*j)));
	float y = h/2.0 * (1.0 + sin(2.3 * t + float(3*i+4*j)));
	float size = 3.0 - 2.0 * sin(t);
	vec2 pos = vec2(x, y);
	float dist = length(gl_FragCoord.xy - pos);
	float intensity = pow(size/dist, 2.0);
	vec4 color = vec4(0.0);
	color.r = 0.5 + cos(t*float(i));
	color.g = 0.5 + sin(t*float(j));
	color.b = 0.5 + sin(float(j));
	return color*intensity;
}

// from http://tips.hecomi.com/entry/20130323/1364046980
void func1() {
	vec4 color = vec4(0.0);
	for (int i = 0; i < num_x; ++i) {
		for (int j = 0; j < num_y; ++j) {
			color += draw_ball(i, j);
		}
	}
	vec2 texPos = vec2(gl_FragCoord.xy/resolution);
	vec4 shadow = texture2D(backbuffer, texPos)*0.7;
	gl_FragColor = color + shadow;
}

// from https://www.shadertoy.com/view/XsfGDl
void func2() {
	vec2 cor;
	
	cor.x =  gl_FragCoord.x/PIXELSIZE;
	cor.y = (gl_FragCoord.y+PIXELSIZE*1.5*mod(floor(cor.x),2.0))/(PIXELSIZE*3.0);
	
	vec2 ico = floor( cor );
	vec2 fco = fract( cor );
	
	vec3 pix = step( 1.5, mod( vec3(0.0,1.0,2.0) + ico.x, 3.0 ) );
	vec3 ima = texture2D( backbuffer,PIXELSIZE*ico*vec2(1.0,3.0)/resolution.xy ).xyz;
	
	vec3 col = pix*dot( pix, ima );

	col *= step( abs(fco.x-0.5), 0.4 );
	col *= step( abs(fco.y-0.5), 0.4 );
	
	col *= 1.2;
	gl_FragColor += vec4( col, 1.0 );
}

void main() {
	func1();
	func2();
}