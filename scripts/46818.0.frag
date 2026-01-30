#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 resolution;
const int nJunk = 2*2*2*2*2;
vec3 junk[nJunk];
float junkAxis = floor(sqrt(float(nJunk)));
void main( void ) {
	gl_FragColor = vec4( .5 );
	vec2 P = gl_FragCoord.xy/resolution;
	int nthCell = int(junkAxis)*int(floor(P.y*junkAxis)) + int(floor(P.x*junkAxis));
	for(int x = 0; x < nJunk; x++){
		// that's some nice memory you have there
		//if(int(mod(float(x)+gl_FragCoord.y+gl_FragCoord.x*resolution.y, float(nJunk))) == x) gl_FragColor.xyz = junk[x];
		if(x == nthCell) gl_FragColor.xyz = junk[x];
	}
	gl_FragColor.xyz = fract(gl_FragColor.xyz);
	gl_FragColor.w = 1.;
	
}



// random memory is (insecurly) rendered on:
//	- Latest version of Chrome OS on an Intel Core i5-3427U // HD Graphics 4000
//	- Android 5.0.1 on an NVIDIA Tegra K1 Denver


// random memory is (securly) NOT rendered on:
//	- Windows 7 (latest nv drivers) on Nvidia 880M



