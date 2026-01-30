// By: Brandon Fogerty
// bfogerty at gmail dot com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * resolution.y/resolution.x;
	
	float t = time * 0.1;
	
	// Rotate the uv coordinates.
	float x1 = uv.x;
	float y1 = uv.y;
	uv.x = x1*cos(t) - y1*sin(t);
	uv.y = x1*sin(t) + y1*cos(t);
	
	// Render a line pattern along the x axis
	float zoomFactor = 50.0+(cos(time * 1.0)*0.50 + 0.50)*5.0;
	float x = sin(uv.x * zoomFactor);
	float y = sin(uv.y * zoomFactor);
	float c = sin( cos(tan( cos(x) + tan(y) )) + tan( cos(x) + sin(y) ) );
	gl_FragColor = vec4( c*uv.x, c*uv.y, c*sin(uv.x*uv.y+time), 1.0 );

}