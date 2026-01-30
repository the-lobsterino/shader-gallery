#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define clamp01(x) clamp(x, 0.0, 1.0)

vec3 hueToRGB(float hue)
{
   float p = fract(hue) * 3.0;

   vec3 rgb = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), clamp01(p));
        rgb = mix(rgb, vec3(0.0, 0.0, 1.0), clamp01(p - 1.0));
        rgb = mix(rgb, vec3(1.0, 0.0, 0.0), clamp01(p - 2.0));
	rgb *= (1.0 - rgb) + 1.0;
	
   return rgb;
}

void main( void ) {
	vec2 pos = gl_FragCoord.xy/resolution.xy;
	
	vec3 color = hueToRGB(distance(pos,vec2(atan(time), sin(time))));
	color *= 1. + abs(sin(time));
	color += hueToRGB(distance(1. / pos,vec2(sin(time), atan(time)))) / 8.;
	color += pos.x;
	gl_FragColor = vec4(color,1.0 );

}