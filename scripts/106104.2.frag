#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float rand(vec2 co)
{
	return fract(sin(dot(co.xy ,vec2(2.8,.233))) * .5453);
}
void main( void ) {

	vec2 position = 8.*gl_FragCoord.xy/resolution.y-vec2((resolution.x/resolution.y)/2.0,0.5);
	float th = atan(position.y, position.x) / (2.0 * 3.1415926) + 10.0;
	float dd = length(position);
	float d = 0.5 / dd + time;
if(time>2. && time <10.)position.x+=time*1.;
	if(time>20. && time <29.)position.x+=time*-1.;
	if(time>40. && time <59.)position+=time*-1.;
	if(time>60. && time <89.)position.y+=time*-2.;
	vec3 uv2 = vec3(th + d, th - d, th + sin(d*d-1.));
uv2=(position.xyx);
	float aa = rand(vec2(2134.))*0.5 + cos(uv2.x * 3.1415926 * 2.0) * 0.3;	float bb = 0.5 + cos(uv2.y * 3.1415926 * 8.0) * 0.3;
	float cc = 0.5 + cos(uv2.z * 3.1415926 * 6.0) * 0.5;	float fd = abs(sin(time*2.0));
	vec3 color2 = mix(vec3(1.0, 0.8, 1.0-fd), vec3(0.5*fd, 0, 0), pow(aa, sin(time*0.2))) * 3.;
	color2 += mix(vec3(0.8, 0.9, 1.0), vec3(0.1, 0.1, 0.2),  pow(bb, 0.1)) * 0.75;	color2 += mix(vec3(0.9, 0.8, 1.0), vec3(0.1, 0.2, 0.2),  pow(cc, 0.1)) * 0.75;
	position+=sin(time*.05);
float value = sin(1.0+.7-distance(position,vec2(0,position.y*.7))*.9*sin(time*.10))*0.25-sin(time*0.1);
vec2 uv=-position;
float a = 0.5 + cos(uv.x * 3.1415926 * 2.0) * time*0.5;	float b = 0.5 + cos(uv.y * 3.1415926 * 2.0) * 0.5;
float c = 0.5 + cos(uv.y * 3.1415926 * 6.0) * 0.5;
gl_FragColor += 10.1*vec4(0.1*a-value*sin(time*c/a*b)*cos(a*value)+b-c*c*1.,.6*position.y*a*a*-c+b/a*c*3.14/360.+b-c*value,value, 2.0 );
gl_FragColor -= 9.5*vec4(color2*uv.y*uv.x*a*b*c,1.0);
}