#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
void main( void ) {

	vec2 p = surfacePosition;//( gl_FragCoord.xy / resolution.xy );
	//p.x = p.x * resolution.x/resolution.y - 0.25 * resolution.x/resolution.y;
	vec3 color = vec3(0.0);
	// triangle simplicity
	//float py = p.y - 0.05;
	//if(py < 0.5 && py > 0.4) if(p.x > mix(0.0, 1.0, py) && p.x < mix(1.0, 0.0, py) ) color += vec3(1);
	if(p.y > -0.05 && abs(p.x) < 0.05-p.y) color = vec3(1);
	
	gl_FragColor = vec4(color, 1.0 );

}