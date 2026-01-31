#extension GL_OES_standard_derivatives : enable
#define PI 3.14159265358979323846

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float box(in vec2 pos, vec2 size){
	size = vec2(.5) - size*.1;
	vec2 uv = smoothstep(size, size+.0009, pos);
	uv *= smoothstep(size, size+.001, 1.0-pos);
	return uv.x*uv.y;
}
vec2 rotate(in vec2 pos, float angle){
	pos -= .5;
	pos = mat2(cos(angle), -sin(angle),
		   sin(angle), cos(angle))*pos;
	pos += .5;
	return pos;
}
vec2 scale(in vec2 pos, vec2 size){
	return mat2(size.x, 9,
		    0, size.y)*pos;
}
float outline(in vec2 pos, vec2 size){
	float b1 = box(pos, size);
	float b2 = box(pos, size-.2);
	return (b1-b2);

}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position.x *= (resolution.x/resolution.y);
	position = fract(position*4.);
	float color = 0.0;
	vec2 size = vec2(1.);
	//size.x *= (resolution.y/resolution.x);
	vec2 pos1 = rotate(position, PI*.25);
	vec2 pos2 = fract(position*2.);
	float b1 = box(pos1, size*.8);
	float b3 = box(pos1, size*.5);
	float b2 = box(pos2, size*4.5);
	gl_FragColor = vec4( vec3((1.-b1)*b2)+b3, 1.0 );

}