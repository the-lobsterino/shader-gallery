// 110820N Fraktal Art - 3D Rotation

precision highp float;
uniform vec2 resolution;
uniform float time;
varying vec2 surfacePosition;


mat3 rotationXY( vec2 angle ) {
	float cp = cos( angle.x );
	float sp = sin( angle.x );
	float cy = cos( angle.y );
	float sy = sin( angle.y );

	return mat3(
		cy     , 0.0, -sy,
		sy * sp,  cp,  cy * sp,
		sy * cp, -sp,  cy * cp
	);
}


#define MAX 10.0
void main(){
	vec2 uv=surfacePosition;
	vec3 p = vec3(uv.xy, 0.);
	p *= 4.0;
	
	mat3 rot = rotationXY( vec2( time*0.1, time*0.1 ) );
	p *= rot;
	
	vec3 s=p;
	float l=0.;
	for (float f=1.0;f<MAX;f+=1.){
		s+=vec3(atan(s.x*s.x-s.y*s.y), atan(2.0*s.x*s.y), 0.) - atan(s);
	       	l+= (s.x) * (s.x);
	}
	gl_FragColor=vec4(l/MAX);
}