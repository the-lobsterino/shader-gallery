#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(vec2 pos) {
    return fract(sin(dot(pos.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 pos) {
    vec2 i = floor(pos);
    vec2 f = fract(pos);
    float a = random(i + vec2(0.0, 0.0));
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + time / 4.0;

	float color = 0.0;
	float color2 = 0.0;
	float color3 = 0.0;
	color += noise(position);
	color2 += sin(time) * noise(position);
	color3 += random(position);

	
	

	gl_FragColor = vec4( color,color2,color3,random(position));

}