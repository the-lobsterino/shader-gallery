#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 s2w(vec2 screen) {
	return (screen / resolution.y - vec2(resolution.x/resolution.y * 0.5, 0.5)) * 10.0;
}

vec4 grid(vec3 pos) {
	float grid_ratio = 0.1;
	vec3 grid_frac = mod(pos + grid_ratio/2., 1.);  // ändrom3da4twist
	float grid = float((grid_frac.x > grid_ratio) && (grid_frac.y > grid_ratio) && (grid_frac.z > grid_ratio));
	float pos_viz = length(pos.yz) * 0.05;

	return vec4(vec3(grid*0.2 + pos_viz), 1.0);
}

void main( void ) {
	// lorentz tensor
	mat3 nu = mat3(-1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
	
	// observer velocity
	vec2 obsv_v = vec2(0.2, 0.1);
	float obsv_gamma = pow(1.0 - dot(obsv_v, obsv_v), -0.5);
	vec3 obsv_V = obsv_gamma * vec3(1, obsv_v);
	
	vec3 obsv_pos = vec3(time, s2w(mouse * resolution));
	vec2 pix_pos = s2w(gl_FragCoord.xy);
	
	vec2 pix_x = pix_pos - obsv_pos.yz;
	vec3 pix_X = vec3(-sqrt(dot(pix_x, pix_x)) + obsv_pos.x, pix_x);

	gl_FragColor = grid(pix_X);


}