#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.1415926

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 origin = vec2(1.0,0.5);
	vec2 position = ( gl_FragCoord.xy / resolution.yy ) - origin;
        float th = degrees(atan(position.y , position.x));
	float rot = fract(time* 0.006*((th/180.0)*0.5+0.5));
	float d = distance(position,vec2(0,0));
	float fact = 1.0/exp(d*.9)*fract(rot*12.0)*5.0;
	

	//gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 1.0 ) * 0.75 ),  1.00);
	if (d>0.05)
	if (d>fact*0.15)
		gl_FragColor = vec4(1,0,0,1);
	else 
		gl_FragColor = vec4(fact,fact,0,1);
}