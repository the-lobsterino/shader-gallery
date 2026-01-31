#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float iTime;
uniform vec2 iResolution;

vec2 random2(vec2 p){
    return fract(sin(vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3))))*43758.5453);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - .5 * iResolution.xy) / iResolution.y - .5;
	
	float time = iTime * 0.1;
	
	float xOffset = sin(uv.y * 10.0 + time * 2.0);
	float yOffset = cos(uv.x * 10.0 + time * 2.0);
	
	vec2 distortedUV = vec2(uv.x + xOffset * 0.05, uv.y + yOffset * 0.05);
	
	float distortion = sin(distortedUV.x * 30.0 + time * 5.0) * sin(distortedUV.y * 30.0 + time * 5.0) * 0.1;
	
	vec3 baseColor = vec3(0.8, 0.8, 0.8);
	vec3 finalColor = mix(baseColor, vec3(0.1, 0.4, 1.0), distortion);
	
	// 增加随机性
	vec2 randomOffset = random2(gl_FragCoord.xy) * 0.01;
	finalColor = mix(finalColor, baseColor, length(randomOffset));
	
	gl_FragColor = vec4(finalColor, 1.0);
}