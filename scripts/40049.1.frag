#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;


bool cmp(float a,  float epsilon)
{
	return (a<epsilon);
}

void main( void ) {
	float v_elements = 7.0;
	float res_ratio = resolution.x / resolution.y;
	float v_divider = v_elements * resolution.y; //number of vertical grid parts
	float h_divider = resolution.x * (v_elements * res_ratio); //horizontal divider for quadratical grid 
	float dist_v = resolution.y / v_divider ; 
	float dist_h = resolution.x / h_divider; //distance between horizontal lines
	vec2 thickness = vec2(4.0)/resolution.xy; //thicknessof lines
	vec2 plot = gl_FragCoord.xy / resolution.xy;
	
	
	if(cmp(mod(plot.x +thickness.x * res_ratio / (res_ratio *2.0), dist_h), thickness.x) || cmp(mod(plot.y-resolution.y+thickness.y/2.0, dist_v),  thickness.y))
	   gl_FragColor = vec4(1.);
		
	else gl_FragColor = vec4(.0);

}