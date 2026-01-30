// 110820N Fraktal Art - USS Enterprise - Time Travel

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
	p *= 16.0;
	
	
	
	vec3 s=p;
	float l=0.;
	for (float f=1.0;f<MAX;f+=1.){
		mat3 rot = rotationXY( vec2( time*0.123, time*0.321 ) );
		s *= rot;
		s+=vec3(atan(s.x*s.x-s.y*s.y), atan(1.0*s.x*s.y), 0.) - atan(s);
	       	l+= (s.y) * (s.y);
	}
	gl_FragColor=vec4(vec3(l, l * l/MAX, l*l*l/MAX/MAX),1.0);
}