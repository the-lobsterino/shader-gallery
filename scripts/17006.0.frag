#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy;
	float x = position.x;
	float y = position.y;
	
	float r=0., g=0., b=0.;
	
	//r = cos(sin(((x+sin(time))/8.)) + sin((y*sin(time/8.))/8.) * sin(y))/4.;
	//g = cos(sin(((x*1.1+sin(time))/8.)) + sin((y*1.3*sin(time/8.))/8.) * sin(y))/4.;
	//b = cos(sin(((x*1.2+sin(time))/8.)) + sin((y*1.4*sin(time/8.))/8.) * sin(y))/4.;
	
	r = ((sin((x)/8.) * sin(time)) + (sin((y)/8.)) - sin(time));
	g = (sin((x)/8.) + (sin((y)/8.))*sin(time));
	b = (sin((x)/8.) + sin((y)/8.)) + sin(time);
	
	//r = sin(x/8.) * sin(time);
	
	gl_FragColor = vec4(r, g, b, 1.);

}