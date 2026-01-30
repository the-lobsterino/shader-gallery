#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	float mx = max(resolution.x, resolution.y);
	vec2 uv = gl_FragCoord.xy/mx;
	vec2 m = mouse.xy/mx;
	
	vec3 background=vec3( uv, 0.25 + 0.5 * (time) );
	
	vec3 hole = vec3(sin(1.5-distance(uv,vec2(m.y,m.x))*0.8));

	gl_FragColor = vec4(mix(background,hole,-0.5),1.0);
}