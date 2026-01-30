#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float grid(vec2 uv)
{
    return fract(uv.x) > 0.01 ^^ fract(uv.y) > 0.99 ? 1. : 0.9;
}

float circle(float h,float k, float r){
	return distance(pow((gl_FragCoord.x - h),2.0) + pow((gl_FragCoord.y - k),2.0), pow(r,2.0));}



void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.x;
	uv = fract(uv * 10.);
	//float gr = grid(fract(uv * 1000.));
	
	float k = (sin(time) / 2. + .5)  * (cos(time)  / 2.  + .5) * 4.;
	
	float mouseDist = tan(uv.y + k) * tan(uv.x + k) * 1234./circle((sin(time) / 2. + .5) * resolution.x, (cos(time) / 2. + .5) * resolution.y, 100.);
	//mouseDist = smoothstep(0.097, .1, mouseDist);
	
	vec3 color = vec3(mouseDist);
	//color *= gr * vec3(1.);

	//color = mix(color, vec3(1.), mouseDist);

	gl_FragColor = vec4(color, 1.);
}