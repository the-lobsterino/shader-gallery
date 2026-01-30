#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float createLine (vec2 p, float waveAmplitude, float waveSpeed, float waveScale, float lineWidth) {
	float wave = p.y + sin(p.x * waveAmplitude + time * waveSpeed) * waveScale;
	float line = abs(lineWidth / wave);
	return line;
}

vec3 createRGB (float baseR, float baseG, float baseB) {
	float r = baseR / 255.0;
	float g = baseG / 255.0;
	float b = baseB / 255.0;
	vec3 rgb = vec3(r, g, b);
	return rgb;
}

void main( void ) {
	
	vec2 position                  = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 normalizePosition = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	float line1 = createLine(normalizePosition, 0.55, 0.59, 0.52, 0.075);
	float line2 = createLine(normalizePosition, 0.54, 0.57, 0.54, 0.075);
	float line3 = createLine(normalizePosition, 0.53, 0.55, 0.56, 0.075);
	float line4 = createLine(normalizePosition, 0.52, 0.53, 0.58, 0.075);
	float line   = line1 * line2 / line3 / line4;
	vec3 lineColor = createRGB(51.0, 8.0, 103.0);
	
	vec3 dist = vec3(line) * lineColor;

	gl_FragColor = vec4(dist, 1.0);

}