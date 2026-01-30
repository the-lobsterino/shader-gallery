precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

#define t time / 3.
#define X uv.x
#define Y uv.y

const float BLOCK_SIZE = 0.03;

void main(void) {
	
	vec2 uv = (2.*gl_FragCoord.xy - resolution.xy)/ resolution.xy;
	
	vec3 finalColor;
	vec3 backgroundColor = uv.xyx;
	vec3 lineColor;

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 50.0 ) * 0.5;
	backgroundColor = vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 );
	
	
	for (float i = 0.0; i < 10.; i++) {
		Y += (.1 * sin(X + t));
		float lineW = abs(1.0 / (150.0 * Y));
		lineColor += vec3(lineW * 1.9, lineW, lineW * 1.5);
	}
	
	finalColor = backgroundColor + lineColor;
	
	gl_FragColor = vec4(finalColor, 1.0);
}
