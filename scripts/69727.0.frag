#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - surfacePosition;// * (50.0 + (sin(time)*10.0));
	
	vec2 d = surfacePosition*.1 - surfaceSize*(0.3+0.07*sin(time));
	float t = dot(d,d) - d.y/d.x;
	
	float v = dot(surfacePosition,surfacePosition);

	float color = sin( cos(t*314.1592*v) * cos(position.x*position.y+v+t) );
	
	color = fract( abs(color) + color ) * 2.0 - 1.0;
	
	color = fract( color + dot(color,1.0-color) + cos(time*0.1)*10. );
	
	gl_FragColor = vec4( vec3( sin(color), 0., cos(color) ), 1.0 );

}