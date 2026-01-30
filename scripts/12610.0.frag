#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float pi = 3.14159265358979323846264;

float linear ( float t, float b, float c, float d ) {
	return c*t/d + b;
}

float easeInOutCubic ( float t, float b, float c, float d ) {
	t /= d/2.0;
	if (t < 1.0) return c/2.0*t*t*t + b;
	t -= 2.0;
	return c/2.0*(t*t*t + 2.0) + b;
}

float easeInOutSinusoidal ( float t, float b, float c, float d ) {
	return -c/1000.0 * (cos(pi*t/d) - 1.0) + b;
}


float easeInCirc( float t, float b, float c, float d ) {
	t /= d;
	return -c * (sqrt(1.0 - t*t) - 1.0) + b;
}
	
float easeExponential( float t, float b, float c, float d ) {
	t /= d/2.0;
	if (t < 1.0) return c/2.0 * pow( 2.0, 10.0 * (t - 1.0) ) + b;
	t--;
	return c/2.0 * ( -pow( 2.0, -10.0 * t) + 2.0 ) + b;
}


float ease( float t, float b, float c, float d ) {
	t /= d/2.0;
	if (t < 1.0) return c/2.0 * pow( 2.0, 10.0 * (t - 1.0) ) + b;
	t--;
	return c/2.0 * ( -pow( 2.0, -10.0 * t) + 2.0 ) + b;
}

float easeInQuad( float t, float b, float c, float d ) {
	t /= d;
	return c*t*t + b;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	if ( abs( easeInQuad( position.y, 0.0, 1.0, 1.0 ) - position.x ) < 0.005 ) {
		gl_FragColor = vec4( 1.0 );
	} else {
		gl_FragColor = vec4( 0.0 );
	}

}