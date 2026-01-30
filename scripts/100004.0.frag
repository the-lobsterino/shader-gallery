#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
float scale = 100.0;

vec2 multiply4x2 ( vec4 tr,vec2 chord){
	return vec2(
		chord.x*tr[0]+chord.y*tr[1],
		chord.x*tr[2]+chord.y*tr[3]
	);
}

void main( void ) {
	float btime = time *2.0;
	vec2 position = surfacePosition*scale;
	
	vec4 rotate = vec4(
		sin(btime*1./7.),cos(btime*1./7.),
		cos(time*1./7.),-sin(btime*1./7.)
	);
	vec4 rotate2 = vec4(
		sin(time*1./3.),cos(time*1./3.),
		cos(time*1./3.),-sin(time*1./3.)
	);
	vec4 rotate3 = vec4(
		sin(time*1./5.),cos(time*1./5.),
		cos(time*1./5.),-sin(time*1./5.)
	);
	vec2 project = multiply4x2(rotate,position);

	vec3 color = vec3(0);
	color.r = ceil(sin(multiply4x2(rotate,position).x)*sin(multiply4x2(rotate,position).y));
	color.g = ceil(sin(multiply4x2(rotate2,position).x)*sin(multiply4x2(rotate2,position).y));
	color.b = ceil(sin(multiply4x2(rotate3,position).x)*sin(multiply4x2(rotate3,position).y));

	gl_FragColor = vec4( color.g*color.r,color.b*color.g,color.r*color.b, 1.0 ); 

}