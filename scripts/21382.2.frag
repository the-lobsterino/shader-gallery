#ifdef GL_ES
precision mediump float;
#endif

// e#21358.0
//Changed so it's just the colors

//simplified and recomplicated again

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define TAU 6.2831853
#define COLOR_STEP TAU/3.
#define RPM 33.33

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float ramp(float angle, float offset)
{
	return .5+.5*cos(angle+offset*COLOR_STEP);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy -vec2(.5)) * vec2(1.0, resolution.y/resolution.x);
	float angle = atan(uv.y, uv.x);
	float rate = time * (RPM / 60.);
	float a1 = angle / TAU + rate;
	float a2 = angle + TAU * rate;
	vec3 color1 = hsv2rgb(vec3(a1,1.0,1.0));
	vec3 color2 = vec3(ramp(a2, 0.), ramp(a2, 2.), ramp(a2, 4.));
	gl_FragColor = vec4(step(mouse.x-0.5,uv.x) * color1 +
			    step(uv.x,mouse.x-0.5) * color2, 1.0 );

}