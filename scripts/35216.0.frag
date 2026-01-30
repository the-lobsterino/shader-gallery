#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float distline(vec2 p0,vec2 p1,vec2 uv)
{
	vec2 dir = normalize(p1-p0);
	uv = (uv-p0) * mat2(dir.x,dir.y,-dir.y,dir.x);
	return distance(uv,clamp(uv,vec2(0),vec2(distance(p0,p1),20)));   
}


void main( void ) 
{
	vec2 uv = gl_FragCoord.xy;
	gl_FragColor = vec4(distline(vec2(0.0),mouse.xy*resolution.xy,uv));

}