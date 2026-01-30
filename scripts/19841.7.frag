#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float asd(vec2 p)
{
	return smoothstep(0.9, 0.85, fract(sin(dot(p,p)/10.0))*fract(cos(dot(p,p))) * (time+100.0)*10.0 / 5.0);
}

void main( void ) {
	vec2 uv = (2.0 * ( gl_FragCoord.xy / resolution.xy ) - 1.0) * vec2(resolution.x/resolution.y, 1.0);
	
	vec2 p = vec2(sin(time), cos(time)) - uv;
	float color = smoothstep(0.5, 0.53, dot(p,p) * (sin(pow(time*2.0,sin(time * 200.0)))+5.0) * 10.0);
	vec3 a = vec3(1.0, 0.2, 0.5) * asd(uv * vec2(sin(time*0.5),cos(time*0.5))*0.5 + 5.0);
	vec3 b = vec3(0.2, 1.0, 0.5) * asd(uv * vec2(cos(time*-1.0),sin(time*-1.0))*0.5 + 5.0);
	vec3 c = vec3(0.5, 0.2, 1.0) * asd(uv * 2.0 + 5.0 + time/5.0);
	gl_FragColor = vec4( (c + a + b), 1.0 );

}