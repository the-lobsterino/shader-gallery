#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define PI 3.14159265359

#define SCALE 3.
#define CORNER 22.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {

	vec2 position = ((gl_FragCoord.xy / resolution.xy ) - 0.5);
	position.x *= resolution.x / resolution.y;
	
	
	float s = sin(time*0.1), c = cos(time*0.1);
	mat2 rot = mat2( c, s, -s, c);
	position *= rot;
	
	
	//vec2 mousePos = vec2(-1., 1.) * 0.7;
	vec2 mousePos = vec2(sin(time)*0.2,cos(time)*0.2);//mouse-0.5;
	vec3 light = vec3((mousePos - position), 0.5);

	vec3 normal = normalize(vec3(tan(position.x * PI * SCALE), tan(position.y * PI * SCALE), CORNER));
	
	float bright = dot(normal, normalize(light));
	//bright = pow(bright, 1.);
	//bright *= step(length(position), 1.);
	
	vec3 color = vec3(0.125,0.025,0.125)* bright;
	
	vec3 heif = normalize(light + vec3(0., 0., 1.));
	
	vec3 spec = vec3(pow(dot(heif, normal), 128.));
	
	color += spec * 0.55;

	//gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	gl_FragColor = max(vec4(0.), vec4(color, 1.));
	
	for (float i = 0.; i < 1.; i++) {
		float y = position.y;
		float col = (0.125) / abs((y * 6. - sin(((position.x + time * 0.1) * 2. + i)*PI)));
		float mul = 0.5 + 0.5 * (sin(PI * (i + (-time*0.5 + position.x * 6.) * 0.5)));
		col *= mul;
		float hue = i / 2.;
		gl_FragColor.rgb += hsv2rgb(vec3(hue, 1. - mul*0.5, col));
	}

}