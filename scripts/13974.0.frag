#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float msin(float x) {
	return (sin(x) + 1.0) / 2.0;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	vec3 height, color;
	
	height[0] = msin(p.x * 7.0 + time*12.0) * (1.0 - p.x) + (p.x/2.0);
	height[1] = msin(p.x * 14.0 + time*8.0) * (1.0 - p.x) + (p.x/2.0);
	height[2] = msin(p.x * 21.0 + time*4.0) * (1.0 - p.x) + (p.x/2.0);
	
	color.x = 1.0 - pow(abs(height[0] - p.y), 0.05);
	color.y = 1.0 - pow(abs(height[1] - p.y), 0.05);
	color.z = 1.0 - pow(abs(height[2] - p.y), 0.05);
	

	gl_FragColor = vec4(color, 1.3 );

}