#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
bool gradient = true;
float angle = 0.5; 

vec2 rotate2D(vec2 _st, float _angle)
{
	
	_st = mat2(cos(_angle), -sin(_angle), 
		   sin(_angle), cos(_angle)) * _st;
	return _st;
}


void main( void ) {

     	
	vec2 uv = gl_FragCoord.xy / resolution.xy; 
	
	uv = rotate2D(uv, 3.14 * angle);
		
        float t = sin(6.28 * time / 10.0);
		
	float c1 = mix(0.0, 1.0, step(uv[1]*0.5, t));
	float c2 = mix(1.0, 0.0, sin(t + uv[0]));
	
	float result = mix(c1, c2, float(gradient)); 
	gl_FragColor = vec4(vec3(result, result, result),1.0);
	

}