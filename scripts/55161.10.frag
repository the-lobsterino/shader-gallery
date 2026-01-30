#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float mapValueToRange(float value, float oldMin, float oldMax, float newMin, float newMax){
	float oldRange = oldMax - oldMin;
	float newRange = newMax - newMin;
	return (value - oldMin) * newRange / oldRange + newMin;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float rainAngle = 0.07;
	
	float rows = 100.0;
	float columns = 15.0;
	float speed = 1.0;
	
	float currentRow = floor(position.x * rows);
	
	float y = mapValueToRange(mod((-time * speed + fract(sin(currentRow * 42.0)) - position.y) * columns, columns), 0.0, 1.0, 0.0, 2.0);
	float x = mapValueToRange(mod( position.x * rows, 1.0), 0.0, 1.0, -0.5, 0.5);
	
	float color = 1.0;
	
	float sqrt4MinusXSquared = sqrt(4.0 - pow(y,2.0));
	float rainDropCurve = sqrt4MinusXSquared - log((sqrt4MinusXSquared + 2.0) / y);
	if( x > (rainDropCurve) * -1.0)
	if( x < (rainDropCurve))
	gl_FragColor = vec4( 0.2, 0.4, 1.0, 1.0);

}

	