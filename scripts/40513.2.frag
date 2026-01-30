#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//Simple 3D effect using the y component of the clipspace position for the depth.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = acos(0.0) * 2.0;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),sin(_angle),
                sin(_angle),-cos(_angle));
}

vec2 getWorldSpacePosition(vec2 uv, out float depth){
	
	float rotationAngle = radians(time * 45.0 / 2.0);
	float height = 1.0;
	
	uv.y += 0.5;
	depth = uv.y * height - height;
	depth += 1.0;
	uv = (uv * 2.0 - 1.0) / (1.0 - depth);
	uv = rotate2d(rotationAngle) * uv;
	uv = (cos(uv * 2.0 * pi) * 0.5 + 0.5);

	
	return uv;
}

vec3 getColor(vec2 uv, float depth){
	vec3 color = vec3(uv.y + uv.x);
	color = floor(color) * sqrt(1.0 - depth - 0.05);
	
	return color;
}

void main( void ) {
	
	float depth = 0.0;
	vec2 uv = getWorldSpacePosition( gl_FragCoord.xy / resolution.x, depth);
	
	vec3 color = getColor(uv, depth);
	
	gl_FragColor = vec4(color, 1.0);

}