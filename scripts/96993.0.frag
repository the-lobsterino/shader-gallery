#extension GL_OES_standard_derivatives : enable


precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float generateWave(vec2 generator, vec2 uv, float time){
	return max(0.0, 1.0 - 100.0 * abs(distance(generator, uv) - (mod(time, 2.0))));
}


vec3 generatePoint(vec2 point, vec2 generator, vec2 uv, float time){
	float distanceToGenerator = distance(point, generator);
	float distanceToWave = distance(point, point + normalize(generator - point) * mod(time, 2.0));
	float highlightCoeff = max(0.0, 1.0 - 10.0 * abs(distanceToWave - distanceToGenerator));
	float result = max(0.0, 1.0 - 100.0 * distance(point, uv));
	return vec3(result, 0.0, 0.0) + vec3(0.0, result * highlightCoeff, 0.0);
}

void main( void ) {

	vec2 position = (  gl_FragCoord.xy / resolution.xy );
	
	float t = time * 0.3;

	vec3 color = generateWave(vec2(0.3, 0.3), position, t)
		+ generatePoint(vec2(0.5, 0.5), vec2(0.3, 0.3), position, t)
		+ generatePoint(vec2(0.2, 0.5), vec2(0.3, 0.3), position, t)
		+ generatePoint(vec2(0.5, 0.3), vec2(0.3, 0.3), position, t)
		+ generatePoint(vec2(0.9, 0.57), vec2(0.3, 0.3), position, t);

	gl_FragColor = vec4(color, 1.0 );

}