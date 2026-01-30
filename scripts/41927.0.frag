#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {

	float opp = gl_FragCoord.x-resolution.x/2.; // Opposite
        float adj = gl_FragCoord.y-resolution.y/2.; // Adjacent
        float r = resolution.y/2.3;      // Radius
        
	float hypSquared = (opp*opp+adj*adj);
	float radiusSquared = r*r;
	
	float rr=0.,gg=0.,bb=0.,aa=1.;
	
	if (hypSquared<radiusSquared)
	{	
		rr=gg=bb=hypSquared/radiusSquared;
		rr+=sin(mod(time,3.142));
		aa=1.;
	}
	
	gl_FragColor=vec4(rr,gg,bb,aa);
	
}