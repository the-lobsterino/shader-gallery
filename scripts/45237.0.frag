#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 closestPointOnLine(vec2 point, vec2 start, vec2 end) {
    vec2 a = point - start;
    vec2 b = end - start;
    float len = distance(a, b);
    return start + clamp(dot(a, b) / dot(b, b), 0.0, 1.0) * b;
}

vec3 part(vec2 start, vec2 end, vec2 uv, vec3 color){
	vec2 point = closestPointOnLine(uv, start, end);
	float onlinecoef = 1.0 - smoothstep(0.01, 0.012, distance(point, uv));
	return onlinecoef * color;
}

mat3 digitarray[10];

mat3 getmat3(int d){
	#define hatewebgl(a) if(d==a)return digitarray[a]
	hatewebgl(0);
	hatewebgl(1);
	hatewebgl(2);
	hatewebgl(3);
	hatewebgl(4);
	hatewebgl(5);
	hatewebgl(6);
	hatewebgl(7);
	hatewebgl(8);
	hatewebgl(9);
}

vec3 digit(int d, vec2 position, vec2 offset){
	mat3 colordef = getmat3(d);
	offset -= vec2(0.3, -0.2);
	vec3 color = vec3(0.0);
	color += part(vec2(-0.4, -0.4)+offset, vec2(-0.4, -0.22)+offset, position, vec3(1.0) * colordef[0][0]);
	color += part(vec2(-0.4, -0.18)+offset, vec2(-0.4, -0.0)+offset, position, vec3(1.0) * colordef[0][1]);
	
	color += part(vec2(-0.2, -0.4)+offset, vec2(-0.2, -0.22)+offset, position, vec3(1.0) * colordef[0][2]);
	color += part(vec2(-0.2, -0.18)+offset, vec2(-0.2, -0.0)+offset, position, vec3(1.0) * colordef[1][0]);
	 
	
	color += part(vec2(-0.37, -0.4)+offset, vec2(-0.23, -0.4)+offset, position, vec3(1.0) * colordef[2][0]);
	color += part(vec2(-0.37, -0.2)+offset, vec2(-0.23, -0.2)+offset, position, vec3(1.0) * colordef[2][1]);
	color += part(vec2(-0.37, -0.0)+offset, vec2(-0.23, -0.0)+offset, position, vec3(1.0) * colordef[2][2]);
	return color;
}

varying vec2 surfacePosition;
void main( void ) {
	digitarray[0] = mat3(1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0);
	digitarray[1] = mat3(0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0);
	digitarray[2] = mat3(1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0);
	digitarray[3] = mat3(0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0);
	
	digitarray[4] = mat3(0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0);
	digitarray[5] = mat3(0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0);
	digitarray[6] = mat3(1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0);
	
	digitarray[7] = mat3(0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0);
	digitarray[8] = mat3(1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);
	digitarray[9] = mat3(0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);

	vec2 position = surfacePosition.xy;

	vec3 color = vec3(0.0);
	color += digit(2, position, vec2(0.0));
	color += digit(1, position, vec2(0.3, 0.0));
	color += digit(3, position, vec2(0.6, 0.0));
	color += digit(7, position, vec2(0.9, 0.0));
	
	gl_FragColor = vec4(color, 1.0 );

}