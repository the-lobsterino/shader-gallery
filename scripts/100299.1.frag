#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool pointNearLine(vec2 point, float a, float b, float c){
	if (abs(a*point.x + b*point.y + c)/sqrt(a*a+b*b) < 3.0){
		return true;
	}
	return false;
}

void main( void ) {

	vec2 position = mouse*500.0 + vec2(100.0,-100.0);
	
	vec2 arm = vec2(0.0,100.0);
	mat2 rotMatrix = mat2(vec2(cos(2.0943951),sin(2.0943951)), vec2(-sin(2.0943951),cos(2.0943951)));
	vec2 v1 = position + arm;
	vec2 v2 = position + rotMatrix*arm;
	vec2 v3 = position + rotMatrix*rotMatrix*arm;
	
	float a1 = (v1.y-v2.y);
	float a2 = (v2.y-v3.y);
	float a3 = (v3.y-v1.y);
	
	float b1 = (v2.x-v1.x);
	float b2 = (v3.x-v2.x);
	float b3 = (v1.x-v3.x);
	
	float c1 = v1.x*v2.y - v1.y*v2.x;
	float c2 = v2.x*v3.y - v2.y*v3.x;
	float c3 = v3.x*v1.y - v3.y*v1.x;
	

	vec2 b11 = vec2(b1,-a1);
	vec2 b12 = vec2(v2.x-gl_FragCoord.x, v2.y-gl_FragCoord.y);
	
	vec2 b21 = vec2(b2,-a2);
	vec2 b22 = vec2(v3.x-gl_FragCoord.x, v3.y-gl_FragCoord.y);
	
	vec2 b31 = vec2(b3,-a3);
	vec2 b32 = vec2(v1.x-gl_FragCoord.x, v1.y-gl_FragCoord.y);
	
	vec4 color = vec4(1.0);
	
	if ((pointNearLine(gl_FragCoord.xy, a1,b1,c1) || pointNearLine(gl_FragCoord.xy, a2,b2,c2) || pointNearLine(gl_FragCoord.xy, a3,b3,c3)) &&
	   ( (b11.x*b12.y-b11.y*b12.x <0.0) && (b21.x*b22.y-b21.y*b22.x <0.0) && (b31.x*b32.y-b31.y*b32.x <0.0) )){
		color = vec4(vec3(0.0),1.0);
	};
	

	gl_FragColor = color;

}