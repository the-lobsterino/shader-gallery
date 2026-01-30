#ifdef GL_ES
precision mediump float;
#endif

//i love fractals

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D tx;
void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 p = ( uv ) * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;
	vec2 m = mouse * 2.0 - 1.0;
	const float ITER = 80.0;
	float c = 0.0;	
	for(float i = 0.0; i < ITER; i++)
	{
		c += smoothstep(0.15, 0.0, length(p*vec2(sin(p.x*i+time*2.5), cos(p.y*i))));	
	}
	c/= ITER;
	c*=0.9;
	gl_FragColor = vec4( pow(vec3( c ), vec3(1.35,1.05,0.8))*5.0, 1.0 );
	gl_FragColor = vec4(gl_FragColor.xyz*0.8 + texture2D(tx, uv-vec2(m.x*0.01,m.y*0.01)).xxy*0.8, 1.0);

}