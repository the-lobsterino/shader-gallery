#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float Line(vec2 pos,vec2 a,vec2 b)
{
	vec2 ab=b-a;
	vec2 pa=a+clamp(dot(pos-a,ab)/dot(ab,ab),0.0,1.0)*ab;
	return length(pa-pos);	
}
const int Polygen = 50;
const int Gap = 20;
const float OutE= 0.8;
const float InE= 0.5;
const float Pi =3.1415926;
vec2 A[Polygen],B[Polygen];
void main( void ) {
	vec2 position = ( 2.0*gl_FragCoord.xy -resolution.xy)/min(resolution.x, resolution.y );
	for(int i=0;i<Polygen;i++){
	float ang=Pi*2.0/float(Polygen)*float(i)+Pi/2.;
	A[i]=vec2(cos(ang),sin(time))*OutE;	
	}
	float dist=1.0;
	for(int i=0;i<Polygen;i++){
	dist=min(dist,Line(position,A[i],A[i+Gap<Polygen?i+Gap:i+Gap-Polygen]));			
	}
	float color =smoothstep(0.01,0.0,dist);
	gl_FragColor = vec4( vec3( color ), 1.0 );

}