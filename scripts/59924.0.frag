//Gumming the green bean
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float smoothDist(in float left, in float right, in float am, in float x){
	return smoothstep(left, left + am, x) - smoothstep(right - am, right, x);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.x) - vec2(.25,.25);	
	float zz = uv.x;
	uv.x = dot(uv,uv);
	vec2 uvb = uv;
	uv.y = abs(uv.y);
	
	uv.y += 0.005 * (1.0 + cos(time * 3.2));
	uv.y = max(0.3* 0.2, uv.y);
	uv.x /= uv.y;
	
	
	uv.x += time;
	
	
	float color;// = mod(floor(uv.x) + floor(uv.y * 2.0), 2.0)+0.5;	
	//color =  1.0-clamp((sin(uv.x * PI )) *10. *(1.-abs(zz))  + .5, 0., 1.);
	color = fract((uv.x*0.5) ) ;	
	color = smoothDist(0.2,0.8,0.1,color);
	vec3 col = mix(vec3(0.0,0.79,0.2), vec3(0.25,0.9,0.25),color)*1.8;
	float dist = sqrt(uv.y) * 1.0;
	col *=  max(0.1, min(1.0, dist *dist* 3.3));
	
	gl_FragColor = vec4( col,1.0 );

}