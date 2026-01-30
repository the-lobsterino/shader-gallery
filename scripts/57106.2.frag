#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	//float centered_coord = length(position - vec2(0.5));
	float centered_coord = length(position - vec2(0.5))+sin(time) * cos(1.02*time) * atan(1.01*time);

	float u = 0.9 / centered_coord + 79. * sin(time/2.) * 2.* sin(2.*time/4.);
	float v = atan(position.y - 0.5, position.x - 0.5) * 16.0;
	
	float fade = centered_coord / sin(0.4);
	float gradient = (sin(u) + sin(v))*fade;
	
	vec4 temp_col = vec4( vec3(gradient*4.), 1.0 );

	temp_col.x *= sin(time) + cos(time);
	temp_col.y *= cos(time) + sin(time);
	temp_col.z *= tan(time) + cos(time);
	
	gl_FragColor = temp_col;

}