
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float f(vec2 p) {
	float r = 100.0;
	int x = int(floor(p.x*r));
	int y = int(floor(p.y*r));
	int z = x * (x+7537) * (x+72642730) * (x-27628456) * y * int(time*100.0);
	int d = int(r);
	int e = z / d;
	return float(z - e*d)/r;
}
void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	gl_FragColor = vec4( vec3(f(p)), 1.0 );

}