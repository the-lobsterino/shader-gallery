#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float hash( float n )
{
    return fract(sin(n)*43758.5453);
}

float noise(vec3 x)
{
    // The noise function returns a value in the range -1.0f -> 1.0f

    vec3 p = floor(x);
    vec3 f = fract(x);

    f       = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;

    return mix(mix(mix( hash(n+0.0), hash(n+1.0),f.x),
                   mix( hash(n+57.0), hash(n+58.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 clr;
	
	vec3 m = vec3(sin(0.01 * position.x * time), 
		      cos(-0.0125 * position.y * time - position.x), 
		      tan(0.008 * position.x + time * sin(-0.0153*position.y+9.0)));
	
	clr.r = 0.7*noise(vec3(-4.0+position.x * m.x, -25.0+-15.0+position.y * 5.1, 5.0+0.3*time));
	clr.g = 0.5*noise(vec3(-1.0+position.y * m.y, 115.0+position.y * 3.1, 9.0+0.2*time));
	clr.b = 0.7*noise(vec3(-3.2+position.x*position.x * m.z, 57.0+position.y-position.x * 2.1, -6.0+0.24*time));
	
	gl_FragColor = vec4(clr, 1.0);

}