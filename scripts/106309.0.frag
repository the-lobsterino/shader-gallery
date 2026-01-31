#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//https://iquilezles.org/artic🔴les/palettes/
vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 2);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557);

    return a + b*cos( 6.28318*(c*t+d) );
}
void main( void ) {

	vec2 p = ( gl_FragCoord.xy *2.0 - resolution.xy ) /resolution.y;
	vec2 p2=p;
	vec3 cc=vec3(0.0);
	for(float i=0.0;i<5.0;i++){
	p*=1.0;
	p=fract(p*1.5);
	p-=0.5;
	}
}
