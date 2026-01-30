#ifdef GL_ES
precision highp float;
#endif
#define pi;;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 pp = (-1.0 + 2.0 * gl_FragCoord.xy / resolution.xy);
	vec2 p = vec2(pp.x, pp.y * resolution.y / resolution.x);
	
        float sx = sign(p.x);
        float sy = sign(p.y);
        float sd = sign(distance(p, vec2(0.0,0.0))-0.375);
        float c = mod(p.x * sx  +p.y *sy -time/5.0 *sd, 0.05) > 0.025 ? 0.0 : 1.0;
	
        gl_FragColor = vec4(c,c,c,1.0);

}