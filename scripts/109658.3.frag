#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float rand(vec2 co){
    return fract(sin(dot(floor(co.xy) ,vec2(0,1)+tan(time*0.0001)))*500.0);
}

void main( void ) {

	float t = atan(fract(time*2e-1)*2.0-1.0);
	vec2 sp = surfacePosition;
	vec2 position = gl_FragCoord.xy - (mouse*resolution);
	position*=sp;
	float color = rand(position.xy*(0.25 + asin(sin(t))*11.1));
	
	//if (color < 0.5) color = 0.0; else color = 1.0;
	color = (floor(color * 4.0) + 0.0)/4.0;
		
	gl_FragColor = vec4( color, sin(position.x*position.y*t*2.0), cos(color+t*3.0), 1 );

}