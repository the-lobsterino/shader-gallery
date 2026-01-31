#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// cosine based palette, 4 vec3 params
vec3 palette( in float t )
{
	
	vec3 a = vec3(0.5,0.5,0.5);
	vec3 b = vec3(0.2,1.2,0.3);
	vec3 c = vec3(1.0,0.2,0.9);
	vec3 d = vec3(0.252,0.45,0.529);
	
    	return a + b*cos( 6.28318*(c*t+d) );
}

void main( void ) {
	vec2 uv = 2.*(gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;
	vec2 uv0 = uv;
	vec3 finalColor = vec3(0.0); 
	
	for(float i = 0.0; i < 3.0; i++) {
	
	uv = fract(uv * 1.5) - 0.5;
	
	float d = length(uv) * exp(-length(uv0)); 
	 
	vec3 color = palette(length(uv0) + i * .4 + time * .5);
	
	d = sin(d * 3.0 + time)*.750;
	d = abs(d);
	
	d = pow(0.01 / d, 1.); 
	
	finalColor += color * d;
		
	}
vec3 col=vec3(0.5,0.1,1.9);
	gl_FragColor = vec4(mix(uv.y*col.xyz,finalColor.yxz,uv.y),uv.y);

}