#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 drawCircle(vec2 pos,float radius){
	vec4 color = vec4(0.,0.,0.,0.);
	
	float sharpness = .001;
	
	float lhs = pow(gl_FragCoord.x-pos.x,2.)+pow(gl_FragCoord.y-pos.y,2.);
	float rhs = radius;
	color.r = exp(-abs(rhs-lhs)*sharpness);
	color.g = exp(-abs(rhs-lhs)*sharpness/2.);
	color.b = exp(-abs(rhs-lhs)*sharpness/3.);
	
	return color;
}

void main( void ) {

	//vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec4 color = vec4(0.,0.,0.,0.);
	vec2 pos1 = resolution/2.;
	vec2 pos2 = vec2(resolution.x/2.,0.);
	color+=drawCircle(pos1+pos2/2.,10000.);
	color+=drawCircle(pos1-pos2/2.,10000.);
	
	gl_FragColor = color;
}

















