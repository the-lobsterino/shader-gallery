precision mediump float;
uniform vec2 resolution;
void main(void) {
	vec2 uvPos = (gl_FragCoord.xy / resolution.xy);
	uvPos -= 0.5;	// Center the wave
	vec3 color = vec3(0.0);
	float vertColor = 0.0;
	uvPos.y += sin( uvPos.x * 10.0) /  + sin(uvPos.x / 200.0) * 2.0;
	float fTemp = abs(1.0 / uvPos.y / 100.0);
	vertColor += fTemp;
	color += vec3( fTemp*(10.0)/10.0, fTemp/10.0, pow(fTemp,0.99)*1.5 );
	gl_FragColor = vec4(color, 1.0);
}
