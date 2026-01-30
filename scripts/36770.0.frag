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

void main( void ) {
	
	vec2 co = vec2(gl_FragCoord.x*cos(time),gl_FragCoord.y*sin(time)); // for random
	
	float a = resolution.x/resolution.y;
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * vec2(a,1.0);
	
	float n = 5.0; // number of shapes vertically
	vec2 grid =floor(uv*n);
	
	vec2 k = fract( uv * n ) - 0.5;
	float roundness = 5.0;
	float c = 1.-roundness*dot(k,k);
	
	float total = (n * floor(n * a));
	float tile = (grid.y * n + grid.x);
	
	c *= ((tile/total) > rand(co)) ? 0.0 : 1.0;
	
	vec3 v = vec3( c );
	
	gl_FragColor = vec4( v, 1.0 );
}
