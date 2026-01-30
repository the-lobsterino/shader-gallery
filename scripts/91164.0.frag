// ändrom3da
#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 resolution;
#define TAU 6.2831853071

#define tw(a) sin(a*time)*0.5 + 0.5

#define mask0 vec3(1.0, 1.0, 1.0);
#define mask1 vec3(0.5, 0.6, 0.7);

void main( void ) {

	float tw = tw(1.);
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec3 color;
	
	
	
	color.x = fract(0.0+((position.x + (((tw*(1200./9.))/4.)*tan((1./7.)*time))*abs(position.y+(1./5.)*time)) + (7.00/9.)*time /1.) * TAU * 5.) * .5 + .4;
        color.y = fract(0.0+((position.x + (((tw*(2400./9.))/4.)*tan((1./7.)*time))*abs(position.y+(1./5.)*time)) + (7.25/9.)*time /1.) * TAU * 5.) * .5 + .4;
	color.z = fract(0.0+((position.x + (((tw*(3600./9.))/4.)*tan((1./7.)*time))*abs(position.y+(1./5.)*time)) + (7.50/9.)*time /1.) * TAU * 5.) * .5 + .4;
	
	
	vec3 mask = mask0;
	color *= mask;
	
	gl_FragColor = vec4( color , 0.8 );

}