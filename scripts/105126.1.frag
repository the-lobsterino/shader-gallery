#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
        vec2 center = vec2(.5);
	float color = 1.5;
	float freqX = 75.;
	float freqY = 100.;
	float yOsc = fract(sin(p.x*freqX));
	float xOsc = clamp(sin(p.y*freqY),p.x,p.y) * sin(time*1.5)*2.;
	float circles = tan(distance(p,center) * fract(time)*9.5) * .1;
	
	gl_FragColor = vec4( vec3(circles-xOsc,yOsc*.3+xOsc,pow(circles,-35.)), 1.1 );

}