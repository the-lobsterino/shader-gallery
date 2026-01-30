precision mediump float;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;

// ehh. colors
void main(void){
	vec2 p = surfacePosition;//gl_FragCoord.xy / resolution.xy;
	vec4 dmin = vec4(1000.);
	vec2 z = (-1.0 + 2.0*p)*vec2(1.7,1.0);
	vec2 d = surfaceSize*(.5-mouse);
	for( int i=0; i<512; i++ ){
		z = d+vec2(z.x*z.x-z.y*z.y,2.0*z.x*z.y);
		dmin=min(dmin,vec4(abs(z.y+0.5*sin(z.x)),abs(1.0+z.x+0.5*sin(z.y)),dot(z,z),length(fract(z)-0.5)));}	
	vec3 color = vec3( mix(vec3(dot(dmin.rgb, -dmin.gba)), dmin.rgb, 1.0-dmin.a) );
	gl_FragColor = vec4(color,1.0);}

// Created by inigo quilez - iq/2013 // glslsandbox mod by Robert Schütze - trirop/2015
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.