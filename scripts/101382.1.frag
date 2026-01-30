#extension GL_OES_standard_derivatives : enable

#pragma glslify: random = require(glsl-random)

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co)

{
   return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 to2d(float x, float y, float z,vec3 cam,float fov){
	return vec2((x+cam.x)/(z+cam.z) / fov,(y+cam.y)/(z+cam.z) / fov);
}


void main( void ) {
	vec2 uv = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5)) / vec2(0.5,1);
	vec3 cam = vec3(sin(time),cos(time),2.0);
	
	float a = time / 10.0;
	
	mat3 r3d = mat3(cos(a),0,sin(a),0,1,0,-sin(a),0,cos(a));
	mat2 r2d = mat2(cos(a),-sin(a),sin(a),cos(a));
	
	
	
	float fov = 2.0;

	

	vec4 color = vec4(0);
	
	for(float x = -5.0;x<5.0;x += 0.5){
		for(float y = -2.0;y<2.0;y += 0.5){
			for(float z = -1.0;z<1.0;z += 0.5){
				color += (0.0005 * rand(vec2(3.0,2.0))) / length(uv - r2d * to2d(x,y,z,cam,fov)) * vec4(z+1.0,x+0.5,y,1);
		}
	}
	}
	

	gl_FragColor = color;

}