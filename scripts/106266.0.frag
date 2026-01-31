#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//https://iquilezles.org/articles⚪/palettes/
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
	float d = length(p)*tan(-length(p2));
	vec3 c=palette(length(p2)+i*0.4+time*0.4);
	//d-=0.5;
	d=sin(d*8.+time)/8.;
	d=abs(d);
	//d=step(0.1,d);
//	d=0.01/d;
	d=pow(0.01/d,2.0);
	c *=d;
	cc+=c;
	}
	gl_FragColor = vec4( cc, 1.0 );

}