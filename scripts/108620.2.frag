#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

highp float col_dist(vec2 a, vec2 b, vec2 off) {
	return clamp(pow(1.0-distance(a+off, b ), 100.0 * 0.3), 0.0, 1.0);
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 src_pos = mouse;
	
	vec2 r_off = vec2(cos(time), sin(time))*0.01;
	vec2 g_off = vec2(cos(time*0.25), sin(time*0.25))*0.0075;
	vec2 b_off = vec2(cos(time*1.33), sin(time*1.33))*0.005;

	vec3 color = vec3(0,0,0);
	
	highp float r_dist = col_dist(position, src_pos, r_off);
	highp float g_dist = col_dist(position, src_pos, g_off);
	highp float b_dist = col_dist(position, src_pos, b_off);
	color.r = r_dist*(1.0-pow(sin(time), 2.0));
	color.g = g_dist*(1.0-pow(sin(time*0.86), 2.0));
	color.b = b_dist*(1.0-pow(sin(time*1.25), 2.0));
	

	gl_FragColor = vec4( color, 1.0 );

}