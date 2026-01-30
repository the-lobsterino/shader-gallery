// Created by calmbooks
// http://calmbooks.tumblr.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	
	vec2 vec = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5, 0.5);
	
	float l = length(vec);
	float r = atan(vec.y, vec.x) ;
	float t = time * 10.0;
	float c = 1.0 - sin(l * 70.0 + r + t);
	
	gl_FragColor = vec4( c,c,c, 1.0 );

}