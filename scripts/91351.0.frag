#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 originalUv = ( gl_FragCoord.xy / resolution.xy );
	
	// calc uv dist from center
	vec2 uv = vec2(gl_FragCoord.xy/resolution.xy);
	float lengthFromCenter = distance(uv*2.0-1.0, vec2(0.0, 0.0));
	lengthFromCenter = lengthFromCenter * lengthFromCenter;
	
	// create fish eye uv
	float fisheyeUv = lengthFromCenter * 0.6;
	fisheyeUv = smoothstep(0.5, 1.0, fisheyeUv);
	vec2 direction = vec2((step(originalUv.x, 0.5)*2.0)-1.0, (step(originalUv.y, 0.5)*2.0)-1.0);

	
	// apply fisheye
	uv += fisheyeUv*(0.1*direction);
	
	vec3 result = vec3( 1.0, 1.0, 1.0 );
	
	// test
	vec2 checkUv = fract(uv*10.0);
	checkUv = step(checkUv, vec2(0.5));
	vec3 check = vec3(checkUv, 1.0);
	
	result = check;
	
	




	float vignette = lengthFromCenter * 0.5;
	vignette = smoothstep(0.2, 1.0, vignette);
	vignette = 1.0 - vignette;
	
	// scanline1
	float lineStrength = 0.5;
	vec2 scanline = mod(gl_FragCoord.xy, vec2(2.0, 2.0));
	scanline = 1.0-step(scanline, vec2(1.0, 1.0));
	scanline += 1.0 - clamp(lineStrength, 0.0, 1.0);
	scanline = max(vec2(0.0, 0.0), min(scanline, vec2(1.0)));
	
	// apply scanline
	result *= scanline.x;
	result *= scanline.y;
	
	// apply vignette 
	result *= vignette;

	// display vignette only
	//result = vec3(vignette);
	
	// display fisheyeUv only
	//result = vec3(fisheyeUv);
	
	// display uv
	//result = vec3(uv, 1.0);
	
	// display scanline
	//result = vec3(scanline.x, 0.0, 0.0);
	
	vec2 closeUv = fract(originalUv*2.0);
//	result = vec3(closeUv, 1.0);
	//result = vec3(direction.x, 0.0, 0.0);
	
	
	gl_FragColor = vec4(result, 1.0);
			    

}