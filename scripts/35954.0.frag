//------------------------------------------------
// Simple 2d Multi Grapher v1.0
//
// if you want to use a better 2d function grapher 
// you can use 'Graph Toy' by Inigo Quilez!
//------------------------------------------------

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
const vec4 color1 = vec4(1.0, 0.7, 0.7, 1.0);
const vec4 color2 = vec4(0.2, 0.2, 0.9, 1.0);
const vec4 color3 = vec4(0.9, 0.0, 0.2, 1.0);
const vec4 color4 = vec4(0.2, 1.0, 0.9, 1.0);
const vec4 color5 = vec4(0.6, 0.5, 0.8, 1.0);

void main( void )
{
	vec2 position = 10.0*(gl_FragCoord.xy / resolution.xy-0.75);
	position.x *= resolution.x / resolution.y;  // Aspect Ratio Correction
	float x = position.x + mouse.x*1.;
	float y = position.y + mouse.y*1.;
	
	float d1 = 0.04, d2 = 0.03;
	gl_FragColor = white;	
	if ((y > -d1)&&((y < d1)))   gl_FragColor = black;
	if ((x > -d1)&&((x < d1)))   gl_FragColor = black;

	if (((fract(x) < d2 || (fract(x) > 1.0 - d2)) && abs(y) < 0.25))   gl_FragColor = black;
	if (((fract(y) < d2 || (fract(y) > 1.0 - d2)) && abs(x) < 0.25))   gl_FragColor = black;

	// functions
	float fx1 = sin(x+time);
	float fx2 = 2.0*smoothstep(-2.,2.,x)-1.;
	float fx3 = x/sqrt(1.0+pow(x,2.0));
	float fx4 = x/sqrt(1.0+pow(x,4.0));
	float fx5 = 2.0*sin(4.*x)/x;
	
        if ((y < fx1+d1)&&((y > fx1-d2))) gl_FragColor = color1;
        if ((y < fx2+d1)&&((y > fx2-d2))) gl_FragColor = color2;
        if ((y < fx3+d1)&&((y > fx3-d2))) gl_FragColor = color3;
        if ((y < fx4+d1)&&((y > fx4-d2))) gl_FragColor = color4;
        if ((y < fx5+d1)&&((y > fx5-d2))) gl_FragColor = color5;
}