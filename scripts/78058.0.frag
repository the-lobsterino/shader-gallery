precision mediump float;
uniform float time;
uniform vec2 resolution;

void main( void ) {	
	vec3 Color = vec3(0.0, 0.3, 0.9);
	float col = -0.25;
	vec2 a = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution, resolution.y);
	for(float i=0.0;i<50.0;i++)
	{
	  float si = sin(time * i * 0.25)/0.95;
	  float co = cos(time + i * 0.05)*0.5;
	  col += 0.01 / abs(length(a + vec2(si , co * si )) - 0.1);
	}
	gl_FragColor = vec4(vec3(Color * col), 1.0);
}