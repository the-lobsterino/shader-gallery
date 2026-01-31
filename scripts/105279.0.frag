#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D bb;

vec4 samplePrevious(vec2 coord) {
	return texture2D(bb, coord);	
}

void main( void ) {
	vec2 pixelSize = 1.0 / resolution.xy;
	vec2 position = gl_FragCoord.xy * pixelSize;

	vec3 cells = vec3(0.0);
	
	vec4 down = samplePrevious(position + vec2(0.0, pixelSize.y));
	
	if (down.r > 0.1) {
		cells = down.rgb;	
	}
	
	if (distance(mouse, position) < 0.01) {
		cells = vec3(1.0);	
	}

	vec3 color = vec3(0.0);

	gl_FragColor = vec4(cells, 1.0 );

}