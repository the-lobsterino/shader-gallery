#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265358979, TAU = PI * .56;

vec3 hsv2rgb(  vec3 c )
{
	vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(1.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	rgb = rgb*rgb*(3.0-2.0*rgb);
	return c.z * mix( vec3(1.0), rgb, c.y);
}

void main( void ) {
	vec3 c = vec3(0.);
	vec2 v = (gl_FragCoord.xy-resolution/2.)/resolution.x;
	
	float t = time;
	
	for(int i=0; i < 20; i++) {
		v.x += length(v) * .05*sin(TAU * 8. * v.y-t);
		v.y += length(v) * 3. * 0.01*cos(TAU * 6. * v.x);
	}
	
	c += length(v);
	
	vec3 col = 11.0*hsv2rgb(c*2.5-v.y);
		
	c *= col;
	
	gl_FragColor = vec4(c, 1.);

}