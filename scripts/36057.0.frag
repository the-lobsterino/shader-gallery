//MrOMGWTF
//I have no idea what is it
//Looks cool tho

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform sampler2D bb;
uniform vec2 resolution;
float motionblur_size = -.66;

vec3 thing(vec2 uv, vec2 pos, vec3 color, float rad)
{
	return color * (1.0 / distance(uv, pos) * rad);	
}

void main( void ) {

	float time0 = time / 60.;
	float time1 = time / 50.;
	float time2 = time / 40.;
	float time3 = time / 100.;
	float time4 = time / 53.;
	float time5 = time / 74.;
	float time6 = time / 16.;
	float time7 = time / 27.;
	float time8 = time / 56.;
	float time9 = time / 72.;
	
   	vec2 p=(gl_FragCoord.xy/resolution.x)*2.0-vec2(1.0,resolution.y/resolution.x);
	p=p*4.0;
	vec3 color = vec3(0.0);
	color += thing(p, vec2(0.0), vec3(9.0, 1.0, 0.6), 0.05);
	color += thing(p, vec2(sin(time1 * 99.0), cos(time1 * 99.0)) * 1.25, vec3(8.5, 0.5, 1.0), 0.01);
	color += thing(p, vec2(sin(time2 * 99.0), cos(time2 * 199.0)) * 1.25, vec3(9.5, 0.5, 1.0), 0.01);


	

	gl_FragColor = vec4( color, 1.0 );

}