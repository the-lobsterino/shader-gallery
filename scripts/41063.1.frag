#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec4 blackColor = vec4(0, 0, 0, 0);
	
	//pink
	vec2 point1 = vec2(resolution.x * 0.5, resolution.y * -0.4);
	vec4 point1Color = vec4(219.0 / 255.0, 130.0 / 255.0, 160.0 / 255.0, 1);
	float point1Strength = 0.7;
	float dstPoint1 = sqrt((point1.x - gl_FragCoord.x) * (point1.x - gl_FragCoord.x) + (point1.y - gl_FragCoord.y) * (point1.y - gl_FragCoord.y));
	vec4 point1Output = mix(point1Color, blackColor, (dstPoint1 / resolution.x) * 1.0 / point1Strength);
	
	//blue
	vec2 point2 = vec2(resolution.x * 0.2, resolution.y * 0.3);
	vec4 point2Color = vec4(37.0 / 255.0, 60.0 / 255.0, 120.0 / 255.0, 1.0);
	float point2Strength = 0.5;
	float dstPoint2 = sqrt((point2.x - gl_FragCoord.x) * (point2.x - gl_FragCoord.x) + (point2.y - gl_FragCoord.y) * (point2.y - gl_FragCoord.y));
	vec4 point2Output = mix(point2Color, blackColor, (dstPoint2 / resolution.x) * 1.0 / point2Strength);
	
	//purple
	vec2 point3 = vec2(resolution.x * 0.8, resolution.y * 0.6);
	vec4 point3Color = vec4(219.0 / 255.0, 130.0 / 255.0, 231.0 / 255.0, 1);
	float point3Strength = 0.5;
	float dstPoint3 = sqrt((point3.x - gl_FragCoord.x) * (point3.x - gl_FragCoord.x) + (point3.y - gl_FragCoord.y) * (point3.y - gl_FragCoord.y));
	vec4 point3Output = mix(point3Color, blackColor, (dstPoint3 / resolution.x) * 1.0 / point3Strength);
	
	gl_FragColor = point1Output;
	//gl_FragColor = point2Output;
	
	vec4 firstMix = mix(point1Output, point2Output, 1.0 - point1Output.a);
	gl_FragColor = mix(point3Output, firstMix, 1.0 - point3Output.a);
	//gl_FragColor = point1Output + point2Output;
	
}