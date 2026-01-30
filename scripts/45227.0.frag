// Better ray marching example with rotation matrices.
// Peter Capener

#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

#define RenderDistance 6.
#define Epsilon 0.1
// Don't change Epsilon to zero!

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float n){return fract(sin(n) * 35058.996053);}
float noise(float p){
	float fl = floor(p);
	float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
} //rand() and noise() is not mine.

vec3 matrix_times_vector( vec3 row1, vec3 row2, vec3 row3, vec3 vec ) {
	return vec3( row1.x*vec.x + row1.y*vec.y + row1.z*vec.z,
		     row2.x*vec.x + row2.y*vec.y + row2.z*vec.z,
		     row3.x*vec.x + row3.y*vec.y + row3.z*vec.z );
}
vec3 R_x( vec3 vec, float theta ) {
	return matrix_times_vector( vec3(1.0,0.0,0.0), vec3(0.0,cos(theta),-sin(theta)), vec3(0.0,sin(theta),cos(theta)), vec );
}
vec3 R_y( vec3 vec, float theta ) {
	return matrix_times_vector( vec3(cos(theta),0.0,sin(theta)), vec3(0.0,1.0,0.0), vec3(-sin(theta),0.0,cos(theta)), vec );
}
vec3 R_z( vec3 vec, float theta ) {
	return matrix_times_vector( vec3(cos(theta),-sin(theta),0.0), vec3(sin(theta),cos(theta),0.0), vec3(0.0,0.0,1.0), vec );
}
vec3 vecDirize( vec3 dir ) {
	return dir / length(dir);
}
vec3 raymarch( vec3 o, vec3 d, vec2 m ) {
	d = vecDirize( d ) * Epsilon;
	for (float i = 0.0; i < RenderDistance; i += Epsilon) {
		vec3 n_o = R_y( R_z( R_x( R_y( o, m.x*10. ), m.y*10. ), time / 4. ), time / 4. );
		if (abs(n_o.x) < 1. && abs(n_o.y) < 1. && abs(n_o.z) < 1.) {
			return o;
		}
		o += d;
	}
	return vec3(10000.,10000.,10000.);
}

void main( void ) {
	float scale  = min( resolution.y, resolution.x );
	float height = resolution.y / scale;
	float width  = resolution.x / scale;
	vec2  m_pos  = mouse - vec2( .5, .5 );
	vec2  coord  = gl_FragCoord.xy / scale - vec2( width/2., height/2. );
	vec3  rgb    = vec3( 1.0, (sin(time+coord.x)+1.)/2., (cos(time-coord.y)+1.)/2. ) - vec3( 1. / length(coord * 10.) );
	
	vec3 look_dir = vec3( 0.0, 0.0, -1.0 );
	vec3 look_vec = vecDirize( R_x( R_y( look_dir, coord.x+noise(coord.x*20000.)/100. ), coord.y+noise(coord.y*20000.)/100. ) );
	vec3 cam_pos  = look_dir * -5.0;
	
	vec3 hit = raymarch(cam_pos, look_vec, m_pos);
	if ( length(hit) < 9999. ) {
		rgb = vec3( 1.2 - length(hit)/2. );
	}
	
	gl_FragColor = vec4( rgb, 1.0 );
}