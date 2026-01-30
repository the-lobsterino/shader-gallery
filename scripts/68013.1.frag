// the shat is pure #2
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p.x += sin(time*1.1+p.y*3.0)*0.07;
	p.y = dot(p,p*p+(1.5+sin(p.x*3.0+time*0.7)));
	p.y = mod(p.y,1.0);
	p.y = abs(p.y-0.5);
	float v = p.x * (1.0 - p.x) / p.y * (1.1+sin(sin(time*0.45+p.x*7.)+time*2.1)- p.y);
	v +=sin(time*0.6+p.x*0.8);
	vec3 col = vec3(v*0.15,v*0.44,v*0.42)*sin((0.1+p.x*p.y)*4.8);
	gl_FragColor = vec4(col.xyz*0.7,1.0);
}