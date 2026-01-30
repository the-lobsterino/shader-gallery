#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592653589793238462

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float blend(float a, float b, float x) {
	return smoothstep(0., 1., x) * (b - a) + a;
}

float contrib(vec2 corner, vec2 p) {
	vec2 offset = corner - p;
	float theta = (fract(time / 4.) + rand(corner)) * 2. * PI;
	vec2 gradient = vec2(cos(theta), sin(theta));
	float d = dot(offset, gradient);
	return d;
}

void main( void ) {
float n = 8.;
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * n;
	
	// min/max of y and x for cell to which current frag belongs:
	float cell_x0 = floor(p.x );
	float cell_x1 = cell_x0 + 1. ;
	float cell_y0 = floor(p.y );
	float cell_y1 = cell_y0 + 1. ;
	
	// position of each corner:
	vec2 cornerBL = vec2(cell_x0, cell_y0);
	vec2 cornerTL = vec2(cell_x0, cell_y1);
	vec2 cornerTR = vec2(cell_x1, cell_y1);
	vec2 cornerBR = vec2(cell_x1, cell_y0);
	
	float l = blend(
		blend(
			contrib(cornerTL, p),
			contrib(cornerTR, p),
			fract(p.x)
		),
		blend(
			contrib(cornerBL, p),
			contrib(cornerBR, p),
			fract(p.x)
		),
		1. - fract(p.y)
	);
	
	l = l > 0. ? 1. : 0.;;

	vec3 color = vec3(l);
	
	// just show the cells:
	// vec3 color = vec3(cell_x0, cell_y0, 0);

	gl_FragColor = vec4(color, 1.0 );

}

