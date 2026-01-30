// Lightning
// By: Brandon Fogerty
// bfogerty at gmail dot com 
// xdpixel.com


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float Hash( vec2 p)
{
     vec3 p2 = vec3(p.xy,5.0);
    return fract(sin(dot(p2,vec3(356.1,401.7, 267.4)))*4758.5453123);
}

float noise(in vec2 p)
{
    vec2 i = floor(p);
     vec2 f = fract(p);
     f *= f * (1.0-2.0*f);

    return mix(mix(Hash(i + vec2(0.,0.)), Hash(i + vec2(1.,0.)),f.x),
               mix(Hash(i + vec2(0.,1.)), Hash(i + vec2(1.,1.)),f.x),
               f.y);
}

float fbm(vec2 p)
{
     float v = 0.0;
     v += noise(p*1.0)*.15;
     v += noise(p*2.)*.1;
     v += noise(p*4.)*.1;
     return v+0.1;
}

void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x/resolution.y;
	uv.xy = uv.yx;

	float timeVal = time * 0.0051;
	vec3 finalColor = vec3( 0.0 );
	for( int i=0; i < 3; ++i )
	{
		float indexAsFloat = float(i);
		float amp = 40.0 + (indexAsFloat*5.0);
		float period = 10.0 + (indexAsFloat+2.0);
		float thickness = mix( 0.9, 1.0, noise(uv*10.0) );
		float t = abs( 0.0009 / (cos(uv.x + fbm( uv + timeVal * period )) * amp) * thickness );
		
		finalColor +=  t * vec3( 2.3, 0.5, .5 );
	}
	

	
	for( int i=0; i < 5; ++i )
	{
		float indexAsFloat = float(i);
		float amp = 40.0 + (indexAsFloat*7.0);
		float period = 12.0 + (indexAsFloat+8.0);
		float thickness = mix( 0.7, 1.0, noise(uv*10.0) );
		float t = abs( 0.8 / (sin(uv.x + fbm( uv + timeVal * period )) * amp) * thickness );
		
		finalColor +=  t * vec3( 0.0, 1.0, 0.0 ) * 0.25;
	}
	
	gl_FragColor = vec4( finalColor, 5.0 );

}