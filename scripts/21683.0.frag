//first try here!
//@511534

precision mediump float;


uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 surfacePosition = ( gl_FragCoord.xy / resolution.xy-1.1 ) ;
	
	float x = distance(surfacePosition, vec2(0.0,0.0));
	float z = distance(surfacePosition, vec2(0.9,0.2));
	float y = 1.2 - distance(surfacePosition, vec2(0.8,0.9));
	x = mod(x*1.005 + tan(time), 0.5 + step(time,9.0));
	z = mod(z*0.2 + tan(cos(time*9.)), 0.5 + step(time*0.1,1.1));
	gl_FragColor = vec4(z,x * 0.2,0.9,0.0) + vec4(z,y * 1.9,0.7,10.2);
	

	
	float color = 0.0;
	color += sin( surfacePosition.x * cos( time / 50.0 ) * 40.0 ) + cos( surfacePosition.y * cos( time / 15.0 ) * 10.0 );
	color += sin( surfacePosition.y * sin( time / 5.5 ) * 5.5 ) + cos( surfacePosition.x * sin( time / 10.0 ) * 90.0 );
	color += sin( surfacePosition.x * sin( time / 5.0 ) * 10.0 ) + sin( surfacePosition.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 9.0 ) * 0.7;

	gl_FragColor = vec4(z,x * 5.5,0.0,0.9) + vec4(z,y * 1.1,0.6,0.1);
}