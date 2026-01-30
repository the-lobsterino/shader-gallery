#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 pattern( void ) {
	
	vec2 co = vec2(gl_FragCoord.x*cos(time),gl_FragCoord.y*sin(time)); // for random
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * vec2(resolution.x/resolution.y,1.0);
	
	float n = 25.0; // number of shapes vertically
	vec2 k = fract( uv * n ) - 0.5;
	float roundness = 5.0;
	float c = 1.-roundness*dot(k,k);
	
//	c += max(c,uv.x-uv.y); // oversaturation gradient
	
	c = clamp( c, 0.0, 1.0 );
	
	uv *= 0.1;
	
	float b = ( sin( (uv.y - 0.5) * (uv.y - 0.5) * n + time*0.1 * floor(uv.x*n) ) );
	
//	c += abs(b) * 0.1; // brightness adjustment
	c += b + ( sin( (uv.x - 0.5) * (uv.y - 0.5) * n + time * floor(uv.x*n) ) ); // brightness adjustment
	
	vec3 col = vec3( c );
	
	return vec4( col, 1.0 );
}
vec4 pattern2( void ) {
	
	vec2 co = vec2(gl_FragCoord.x*cos(time),gl_FragCoord.y*sin(time)); // for random
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * vec2(resolution.x/resolution.y,1.0);
	
	float n = 150.0; // number of shapes vertically
	vec2 k = fract( uv * n ) - 0.5;
	float roundness = 5.0;
	float c = 1.-roundness*dot(k,k);
	
//	c += max(c,uv.x-uv.y); // oversaturation gradient
	
	c = clamp( c, 0.0, 1.0 );
	
	uv *= 0.1;
	
	float b = ( sin( (uv.y - 0.5) * (uv.y - 0.5) * n + time*0.1 * floor(uv.x*n) ) );
	
//	c += abs(b) * 0.1; // brightness adjustment
	c += b + ( sin( (uv.x - 0.5) * (uv.y - 0.5) * n + time * floor(uv.x*n) ) ); // brightness adjustment
	
	vec3 col = vec3( c );
	
	return vec4( col, 1.0 ) * pattern();
}

float hf( float h )
{
	// Uncommening the following fixes the shader for an unknown reason.
	// return h;
	return clamp((abs(fract(h) * 6. -3.) -2.), 0.0, 1.);
}

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	p -= 0.5;
	p += (p) * (1.-length(p));
		
	vec3 color1 = vec3(hf(p.y+time/4.), hf((p.y+.33)+time/4.), hf((p.y+.66)+time/4.));
	

	// Divide screen into 3 horizontal stripes.
	// Commenting out either if (#27 or #28) fixes the shader for an unknown reason.
	vec3 color = 1. / color1 * pattern().xyz + pattern2().zyx;
	 
	vec3 color2 = clamp(color,0.0,1.0);
	
	// It should be either color1, color2 or color3, but it's
	// black on Alex for an unknown reason.
	gl_FragColor = vec4(step(vec3(1.0),color)-(1.-color2), 1.0);
}
