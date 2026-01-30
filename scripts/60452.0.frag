#define PI 3.14159265359
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec3 hsv(float h, float s, float v)
{
  return mix(vec3(1.0),clamp((abs(fract(
    h+vec3(3.0, 2.0, 1.0)/3.0)*6.0-3.0)-1.0), 0.0, 1.0),s)*v;
}

float shape(vec2 p)
{
    return abs(p.x*3.0)+abs(p.y*3.)-sin(time)*10.0;
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec2 pos = uv*2.0-1.0;
	pos.x *= resolution.x/resolution.y;
	pos.x = dot(pos,pos);
	pos = pos*pos;
	pos = pos*cos(0.00005)+vec2(pos.y,-pos.x)*sin(0.00005);
	pos.x += 1.0;
	pos.y += 1.0;
	pos.x += sin(time+pos.x+pos.x)*0.4;
	pos = mod(pos*3.0, 3.0)-1.5;
	uv -= vec2(0.5);
	pos = rotate2d( sin(0.0)*PI ) * pos;
	uv += vec2(0.5);
	float c= 0.2/abs(sin(0.3*shape(3.0*pos)));
	vec3 col = hsv(fract(0.1*time),1.0,1.0);
	gl_FragColor = vec4(col*c,1.0);
}