#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float numScanlines;

void main( void ) {
	float scanlines = 525.0;
	float Pi = 3.1415926;
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	float frequency = 2.0 * Pi * resolution.y / scanlines;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	float lineNum = gl_FragCoord.y / scanlines;
	float period = 1.0 / (2.0 * Pi * frequency);
	float vertical_intensity = (sin(gl_FragCoord.y * frequency) + 1.0) / 2.0;
	
	float pixelsPerLine = 520.0;
	float horizontalFrequency=  2.0 * Pi * resolution.x/pixelsPerLine;
	float horizontalIntensity = (sin(gl_FragCoord.x * horizontalFrequency) + 1.0) / 2.0;
	vec4 col = vec4(vec3(position.x , position.y, 0.1) * vertical_intensity * horizontalIntensity , 1.0);
	int line = int(gl_FragCoord.y) / int(scanlines);
	if (gl_FragCoord.y < scanlines + 2.0 &&  1.0 + sin(time * 10.0) > 0.5) {
		col.x = position.x - 20.0;
	}
	
	gl_FragColor = vec4(col.x, col.y, col.z, col.w) * color;

}