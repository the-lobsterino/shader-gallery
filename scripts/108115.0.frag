#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int numOctaves = 7;

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}

float fbm( in vec2 x, in float H )
{    
    float G = exp2(-H);
    float f = 1.0;
    float a = 1.0;
    float t = 0.0;
    for( int i=0; i<numOctaves; i++ )
    {
        t += a*noise(f*x);
        f *= 2.0;
        a *= G;
    }
    return t;
}

float fbm1(in vec2 p)
{
    return fbm(p,1.0);
}

float pattern( in vec2 p )
{
    vec2 q = vec2( fbm1( p + vec2(0.0,0.0) ),
                   fbm1( p + vec2(5.2,1.3) ) );

    //vec2 r = q;
    vec2 r = vec2( fbm1( p + 4.0*q + vec2(1.7,9.2) ),
                   fbm1( p + 4.0*q + vec2(8.3,2.8) ) );

    return fbm1( p + 4.0*r );
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	//position = (position + vec2(sin(time)/2.0 + cos(time)/2.5, sin(time))/15.0 + sin(time / 100.0)) * 4.0;
	position = position * 1.;

	float color = pattern(position)/2.;
	

	gl_FragColor = vec4( vec3(color), 1.0 );

}