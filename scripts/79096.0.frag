#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float spike(float x) {
	x = mod(x, 2.0);
	
	if (x < 1.0)
		return x * x;
	
	x = 2.0 - x;
	
	return x * x;
}

void main( void ) {
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );

	//float y = spike(uv.x * 10.0 + time*0.3) * 0.05 * (sin(uv.x*10.0 + time*1.5)*0.5+1.0);
	float y = spike(uv.x * 2.0);
	
	float v = 0.0;
	
	if (uv.y < y) {
		v = 1.0;
	}
	
	
	gl_FragColor = vec4( vec3(v), 1.0 );

}