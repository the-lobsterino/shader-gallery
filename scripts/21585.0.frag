//Twister thing

precision highp float;

uniform float time;
uniform vec2 touch;
uniform vec2 resolution;

float pi = atan(1.0)*4.0;
float pi2 = atan(1.0)*8.0;

vec3 pattern(vec2 uv)
{
	float checker = float(sin(uv.x*pi*4.0) * sin(uv.y*pi*8.0) > 0.0) * 0.5 + 0.5;
	float edges = 1.0 - abs(0.5 - uv.x)*2.0;
	edges = (edges*0.5+0.5)*smoothstep(0.1,0.2,edges);
	return vec3(checker * edges);
}

vec4 scanLine(float x0,float x1,vec2 uv)
{
	vec3 texture = pattern(vec2((uv.x - x0)/(x1-x0),uv.y));
	float clip = float(x1 > x0 && uv.x > x0 && uv.x < x1);
	return vec4(texture*clip,clip);
}

void main( void )
{
	vec2 res = vec2(resolution.x/resolution.y,1.0);
	vec2 uv = (gl_FragCoord.xy/resolution.y) - res/2.0;

	uv.x -= sin(uv.y * 3.0 +time)*0.2;

	float ang = time + uv.y*sin(time)*4.0;

	float size = 0.25;
	float x0 = cos(ang + pi2 * 0.00) * size;
	float x1 = cos(ang + pi2 * 0.25) * size;
	float x2 = cos(ang + pi2 * 0.50) * size;
	float x3 = cos(ang + pi2 * 0.75) * size;

	vec4 col = vec4(0.0);

	col += scanLine(x0,x1,uv) * vec4(1,0,0,1);
	col += scanLine(x1,x2,uv) * vec4(0,1,0,1);
	col += scanLine(x2,x3,uv) * vec4(0,0,1,1);
	col += scanLine(x3,x0,uv) * vec4(1,1,0,1);

        col.rgb += mix(vec3(0.1),vec3(0.01),uv.y)*sign(1.0-col.a);

	gl_FragColor = vec4( col.rgb, 1.0 );
}
