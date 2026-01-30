#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592653589793238462

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) ;
	
	vec2 grid_res = vec2(8);
	
	// min/max of y and x for cell to which current frag belongs:
	float cell_x0 = floor(p.x * grid_res.x) / grid_res.x;
	float cell_x1 = cell_x0 + 1. / grid_res.x;
	float cell_y0 = floor(p.y * grid_res.y) / grid_res.y;
	float cell_y1 = cell_y0 + 1. / grid_res.y;
	
	// position of each corner:
	vec2 cornerBL = vec2(cell_x0, cell_y0);
	vec2 cornerTL = vec2(cell_x0, cell_y1);
	vec2 cornerTR = vec2(cell_x1, cell_y1);
	vec2 cornerBR = vec2(cell_x1, cell_y0);
	
	// offset vectors:
	vec2 offsetBL = p - cornerBL;
	vec2 offsetTL = p - cornerTL;
	vec2 offsetTR = p - cornerTR;
	vec2 offsetBR = p - cornerBR;
	
	// direction of each corner's gradient:
	float thetaBL = rand(cornerBL) * 2. * PI;
	float thetaTL = rand(cornerTL) * 2. * PI;
	float thetaTR = rand(cornerTR) * 2. * PI;
	float thetaBR = rand(cornerBR) * 2. * PI;
	
	// the gradient vector itself:
	vec2 gradientBL = vec2(cos(thetaBL), sin(thetaBL));
	vec2 gradientTL = vec2(cos(thetaTL), sin(thetaTL));
	vec2 gradientTR = vec2(cos(thetaTR), sin(thetaTR));
	vec2 gradientBR = vec2(cos(thetaBR), sin(thetaBR));
	

	float dotBL = dot(offsetBL, gradientBL);
	float dotTL = dot(offsetTL, gradientTL);
	float dotTR = dot(offsetTR, gradientTR);
	float dotBR = dot(offsetBR, gradientBR);
	
	float minOffset = min(
		min(length(offsetBL), length(offsetTL)), 
		min(length(offsetTR), length(offsetBR))
	);
	
	float weightBL = max(1. - length(offsetBL), 0.);
	float weightTL = max(1. - length(offsetTL), 0.);
	float weightTR = max(1. - length(offsetTR), 0.);
	float weightBR = max(1. - length(offsetBR), 0.);
	
	float l = weightBL * dotBL +
		weightTL * dotTL +
		weightTR * dotTR +
		weightBR * dotBR;

	vec3 color = vec3(l);
	//color = vec3(0, p - cornerBL);
	
	// just show the cells:
	// vec3 color = vec3(cell_x0, cell_y0, 0);

	gl_FragColor = vec4(color, 1.0 );

}

