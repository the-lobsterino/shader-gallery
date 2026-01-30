#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec4 clearColor = vec4(0,0,0,0);
const vec4 backgroundColor = vec4(0,0,0,1);

const vec4 point1Color = vec4(219.0 / 255.0, 130.0 / 255.0, 231.0 / 255.0, 1);
const float point1Expand = 0.2;
vec2 point1Center = vec2(resolution.x * 0.7, resolution.y * 0.4);
float point1Radius = resolution.y * 0.6;

const vec4 point2Color = vec4(0, 144.0 / 255.0, 227.0 / 255.0, 1);
const float point2Expand = 0.2;
vec2 point2Center = vec2(resolution.x * 0.2, resolution.y * 0.4);
float point2Radius = resolution.y * 0.6;

void main( void ) {
	
	
	vec2 point1dst = (gl_FragCoord.xy - point1Center) / point1Radius;
	float point1Amount = sqrt(abs(cos(time))*dot(abs(sin(time))*point1dst, point1dst));
	
	vec2 point2dst = (gl_FragCoord.xy - point2Center) / point2Radius;
	float point2Amount = sqrt(abs(sin(time))*dot(abs(sin(time))*point2dst, point2dst));
	
	vec4 output1 = mix(point1Color, clearColor, (point1Amount - point1Expand) / (1.0 - point1Expand));	
	vec4 output2 = mix(point2Color, clearColor, (point2Amount - point2Expand) / (1.0 - point2Expand));	
	
	gl_FragColor = mix(output1, output2, 0.5);
	
}