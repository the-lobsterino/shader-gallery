#define PI 3.14159265359
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float segm( float a, float b, float c, float x )
{
    return smoothstep(a-c,a,x) - smoothstep(b,b+c,x);
}


vec3 hsv(float h, float s, float v)
{
  return mix(vec3(1.0),clamp((abs(fract(
    h+vec3(3.0, 2.0, 1.0)/3.0)*6.0-3.0)-1.0), 0.0, 1.0),s)*v;
}

float shape(vec2 p)
{
  return clamp(1.-(length(p-0.5)-0.5)*resolution.y,0.,1.)  -  clamp(1.-(length(p-0.5)-0.4)*resolution.y,0.,1.);
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec2 pos = uv*2.0-1.0;
	pos.x *= resolution.x/resolution.y;
	pos = pos*cos(0.00005)+vec2(pos.y,-pos.x)*sin(0.00005);
	pos.x += 1.0;
	pos.y += 1.0;
	pos = mod(pos*7.0, 2.0)-1.0;
	float c = 0.01/abs(sin(0.2*shape((1.0+abs(sin(time)*4.0))*pos)));
	vec3 col = hsv(fract(0.1*time),0.0,1.0);
	gl_FragColor = vec4(1.0-(vec3(1.0)-col*c),1.0);
}