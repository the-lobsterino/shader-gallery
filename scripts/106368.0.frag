
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 iwdf(vec2 p, vec2 t, vec3 c)
{
	vec2 d = ( p - t );
	float ds = dot(d, d);
	float w = 1.0 / pow(distance(p,t), 3.0);
	
	return vec4(c * w, w);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;

	vec4 c = vec4(0);
	
	
	c += iwdf(p, vec2(cos(time*0.7), sin(time*1.7)) * 0.3 + 0.5, vec3(1.0, 0.0, 0.));
	c += iwdf(p, vec2(cos(time*0.9), sin(time*0.9)) * 0.2 + 0.5, vec3(0., 1.0, 0.));
	c += iwdf(p, vec2(cos(time*0.6), sin(time*1.2)) * 0.1 + 0.5, vec3(0., 0.0, 1.0));
	
	c += iwdf(p, vec2(cos(time*1.0), sin(time*1.4)) * 0.3 + 0.5, vec3(1.0, .5, 0.));
	c += iwdf(p, vec2(cos(time*0.5), sin(time*1.2)) * 0.2 + 0.5, vec3(0., 1.0, 0.5));
	c += iwdf(p, vec2(cos(time*0.9), sin(time*1.6)) * 0.1 + 0.5, vec3(0.5, 0.0, 1.0));
	c += iwdf(p, mouse, vec3(1., 1., 1.));
	
	float a = c.w;
	c /= c.w;
	
	c.a = smoothstep(pow(a, 1./3.), 0.0, 3.0);

	gl_FragColor = c;

}