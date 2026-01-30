#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution.xy*2.-1.;
	vec2 uv2=uv;
	uv2*=1.+pow(length(uv*uv*uv*uv),4.)*.07;
	vec3 color = vec3(0.8 + 0.2*uv.y);
		
	vec3 rain=vec3(0.);
	color=mix(rain,color,clamp(time*1.5-.5,0.,1.));
	color*=1.-pow(length(uv2*uv2*uv2*uv2)*1.1,6.);
	uv2.y *= resolution.y / 360.0;
	color.r*=(.5+abs(.5-mod(uv2.y     ,.021)/.021)*.5)*1.5;
	color.g*=(.5+abs(.5-mod(uv2.y+.007,.021)/.021)*1.5)*1.5;
	color.b*=(.5+abs(.5-mod(uv2.y+.014,.021)/.021)*.5)*1.5;
	color*=.9+rain*.35;

	color *= sqrt(1.5-0.5*length(uv));

	gl_FragColor = vec4(color,1.0);
}