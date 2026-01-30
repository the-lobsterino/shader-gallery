#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	vec2 position = -1.0 + 2.0 * p;
	position.x *= resolution.x / resolution.y;
	
	vec2 posSph1 = position;
	posSph1.x += sin(time) * 0.5;
	posSph1.y += cos(time) * 0.3;
	
	vec2 posSph2 = position;
	posSph2.x += cos(time) * 0.5;
	posSph2.y += sin(time) * 0.3;
	
	vec3 col = vec3(0.0);
	
	float r = sqrt (dot(posSph1, posSph1));
	float r2 = sqrt (dot (posSph2 + vec2(-1.0, 0.05), posSph2 + vec2(-1.0, 0.05)));
	
	float st = 1.0;
	float m = mix(.5, .3, abs(sin(time*0.15)));
	if (r < m)
	{
		col = vec3(1.0 - position.y, clamp(0.6 - position.y, 0.2, 1.0), 0.0);
		st = smoothstep (.95 *  m, .2 * m, r);
	}
	
	if (r2 < m)
	{
		col = vec3( 1.0 - position.y, 0.0, position.y);
		st = smoothstep (.95 *  m, .2 * m, r2);
	}
	
	gl_FragColor = vec4(col * 5.0 * st, 1.0 );

}