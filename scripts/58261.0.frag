#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float PI = 3.1415926535897932384626433832795;
// visualization of gradation with dither pattern created by bayer-matrix

float bayer( int iter, vec2 rc )
{
	float sum = 0.0;
	for( int i=0; i<4; ++i )
	{
		if ( i >= iter ) break;
		vec2 bsize = vec2(pow(2.0,4.+ float(i+1)));
		vec2 t = mod(rc, bsize) / bsize;
		int idx = int(dot(floor(t*2.0), vec2(2.0,1.0)));
		float b = 0.0;
		if ( idx == 0 ) { b = 0.0; } else if ( idx==1 ) { b = 2.0; } else if ( idx==2 ) { b = 3.0; } else { b = 1.0; }
		sum += b * pow(4.0, float(iter-i-1));
	}
	float phi = pow(4.0, float(iter))+1.0;
	return (sum+1.0) / phi;
}

void main( void )
{
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 m = vec2(1.,0);

	float r = mod(time * 10.0, 60.0) / 60.0;
	
	float alpha = r * clamp(m.x*2.0-0.5, 0.0, 1.0);
	float threshold = bayer( int(mix(1.0, 5.0, 1.0-m.y)), gl_FragCoord.xy*8.-vec2(0.5) );
	float p = step(threshold, alpha);
	
	if (p<=0.)
	{
		discard;
	}
	
	gl_FragColor = 1.-vec4(vec3(sin(PI * r)*p, gl_FragCoord.x / resolution.x*p, (gl_FragCoord.y / resolution.y)) , 1);
	gl_FragColor.a =1.0;

}