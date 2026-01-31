#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	position.x *- 2.0;
	position.x -= 1.0;
	position.y *- 2.0;
	position.y -= 1.0;
	
	float stripeHeight = 0.05;
	float stripeWidth = 0.05;
	float stripeProportion = (sin(time) / 2.0 + 0.5);
	float stripeLevelX = stripeProportion * stripeHeight;
	float stripeLevelY = stripeProportion * stripeWidth;

	float pixelVal = 0.0;
	
	if (mod(position.y, stripeHeight) < stripeLevelY) {
		pixelVal += 0.5;
	}
	
	if (mod(position.x, stripeWidth) < stripeLevelX) {
		pixelVal += 0.5;
	}
	
	gl_FragColor = vec4(vec3(pixelVal), 1.0);
}