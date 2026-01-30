#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	vec3 Lab = vec3(p.x * 100.0, p.y * 200.0 - 100.0, sin(time * 0.5) * 101.0 - 6.63);
	if(Lab.x > 100.0) Lab.x = 200.0 - Lab.x;
	float Fy = (Lab.x + 16.0) / 116.0;
	float Fx = Fy + Lab.y / 500.0;
	float Fz = Fy - Lab.z / 200.0;
	float E = 216.0 / 24389.0;
	float K = 24289.0 / 27.0;
	
	vec3 XYZ = vec3(Fx * Fx * Fx, Fy * Fy * Fy, Fz * Fz * Fz);
	if(XYZ.x <= E) XYZ.x = (Lab.x + Lab.y * 116.0 / 500.0) / K;
	if(Lab.x <= 216.0 / 27.0) XYZ.y = Lab.x / K;
	if(XYZ.z <= E) XYZ.z = (Lab.x - Lab.z * 116.0 / 200.0) / K;
	XYZ = vec3(XYZ.x * 0.9504, XYZ.y, XYZ.z * 1.0888);
	mat3 M = mat3(3.2404542, -0.9692660, 0.0556434, -1.5371385, 1.8760108, -0.2040259, -0.4985314, 0.0415560, 1.0572252);
	
	vec3 Grey = M * vec3(XYZ.y * 0.9504, XYZ.y, XYZ.y * 1.0888);
	vec3 RGB = M * XYZ;
	
	if(RGB.x > 1.0 || RGB.y > 1.0 || RGB.z > 1.0 || RGB.x < 0.0 || RGB.y < 0.0 || RGB.z < 0.0) RGB = Grey;
	
	gl_FragColor = vec4(RGB, 1.0);
}