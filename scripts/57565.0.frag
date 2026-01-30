#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 center = mouse;
	
	vec2 size = vec2(0.2, 0.1);
	float radius = 0.025;
	float radiusWidth = 0.0025;
	float blendRadius = 0.2;
	
	vec2 dist = max(abs(center - position) - size, vec2(0.0));
	
	float distance = sqrt(dist.x * dist.x + dist.y * dist.y);
	
	float inner = radius - radiusWidth;
	float outer = radius + radiusWidth;
	float blendOuter = radius + radiusWidth + blendRadius;

	if (distance <= inner) {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	} else if (distance <= outer) {
		gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
	} else if (distance <= blendOuter) {
		float a = (blendOuter - distance) / blendRadius;
		gl_FragColor = vec4(a / 2.0, a, a, 1.0);
	}

}