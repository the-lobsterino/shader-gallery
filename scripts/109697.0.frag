#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float line(vec2 begin, vec2 end, vec2 position, float size){
	vec3 dir = normalize(vec3(end.x-begin.x, end.y-begin.y, 0.0));
	
	float l = length(cross(dir, vec3(position.xy-begin.xy, 0.0)))/length(dir);
	return step(1.0-size, 1.0-l);
}

void main( void ) {

	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 position = gl_FragCoord.xy / resolution.xy;

	vec2 begin = mouse;//vec2(cos(time), sin(time));
	float color = line(begin, vec2(0.5, 1.0), position, abs(cos(time))*0.02+0.01);
	float color2 = line(begin, vec2(0.0, 0.0), position, abs(cos(1.0-time))*0.02+0.01);
	float color3 = line(begin, vec2(1.0, 0.0), position, abs(sin(time))*0.02+0.01);

	gl_FragColor = vec4( vec3( color, color2, color3 ), 1.0 );

}