#extension GL_OES_standard_derivatives : enable
//r33v01v3 2023

precision highp float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
#define speed 2.5//<--derp!

vec3 col = vec3(0.0);

vec3 hsv2rgb_smooth( in vec3 c ){
    	vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	rgb = rgb*rgb*(3.0-2.0*rgb);
	return c.z * mix( vec3(1.0), rgb, c.y);
}


void main( void ) {

	vec2 p = (( gl_FragCoord.xy )-0.5*resolution)/ resolution.y;
	float t = time*0.15;
	p.x -= sin(t)*0.4;
	p.y += cos(t*2.0)*0.2;
	
	float ta = atan( p.y, p.x );
	float tr = length( p);
	
	vec2 pp = vec2( 0.1 / tr + speed * t, ( ta + speed * t ) / 3.1416 );

	vec2 uv;
	float a = atan(pp.y,pp.x)/(2.0*3.1416);
	float r = sqrt(dot(pp,pp))/sqrt(2.0)+t;
	uv.x = r;
	uv.y = a+r;
	
	col = hsv2rgb_smooth(vec3(uv.y,p.y*2.5,0.5));
	
	gl_FragColor = vec4(col, 1.0);

}