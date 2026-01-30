#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

float hash( float n )
{
    return fract(sin(n)*43458.5453);
}

float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);

    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*57.0;

    return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
               mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
}

float fbm( vec2 p )
{
    float f = 0.0;

    f += 0.50000*noise( p ); p = m*p*2.02;
    f += 0.25000*noise( p ); p = m*p*2.03;
    f += 0.12500*noise( p ); p = m*p*2.01;
    f += 0.06250*noise( p ); p = m*p*2.04;
    f += 0.03125*noise( p );

    return f/0.984375;
}

float length2( vec2 p )
{
    vec2 q = p*p*p*p;
    return pow( q.x + q.y, 1.0/4.0 );
}


void main( void ) {

	vec2 pos=(gl_FragCoord.xy/resolution.xy)*2.0-1.0;
	pos.x*=resolution.x/resolution.y;
	
	float ft = fract(time*-1.0);
	vec2 p1 = pos*(2.+ft);
	vec2 p2 = pos*(1.+ft);
	
	p1+=hash(floor(time));
	p2+=hash(floor(time-1.));
	
	float f=mix(fbm(p1),fbm(p2),ft);
	
	
	
	
	gl_FragColor=vec4(vec3(f)*.5+.5,1.);

}