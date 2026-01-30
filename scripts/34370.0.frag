// co3moz - dot notation

precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 aspect = resolution.xy / min(resolution.x, resolution.y);
	vec2 position = gl_FragCoord.xy / resolution.xy * aspect;
	vec2 center = 0.5 * aspect;
	vec3 color = vec3(0.0);

	vec2 super = center * 100.0 - position * 100.0 + vec2(0.0, time * 10.0);
	if(length(step(sin(super), vec2(0.5))) < 1.0) color = vec3(1.0);
	
	for(float i = 0.0; i<10.0; i+=2.0) 
		if(length(step(sin(super + (mouse - position / aspect) * i), vec2(0.5))) < 1.0) 
			color = vec3(1.0 - length(mouse * aspect - position) * 2.0 + i * 0.01);
	
	gl_FragColor = vec4(color, 1.0);
}