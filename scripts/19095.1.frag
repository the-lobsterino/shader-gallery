#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.1415926535897932384626433832795
#define N 13.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float post_process(float color) {
	float m = mod(color*5.0, 5.0);
	/*
	if (m >=2.0)
		color = 1.0;
	else if (m >= 1.0 && m < 2.0)
		color = 0.5;
	else
		color = .0;
*/
	highp int index = int(m);
	color = float(index);
	return color;
}
vec3 swr(vec3 p)
{
	vec3 col = vec3(sin(p)*0.5+0.5);
	for(int i=1; i<6; i++)
	{
		float ii = float(i);
		col.xyz=(sin((col.zxy+col.yzx)*ii)*0.5+0.5)*(sin((col.zxy*col.yzx)*ii)*0.5+0.5);
		col = mix(cos(p*ii+col*3.14)*0.5+0.5,col,sin(p.z)*0.4+0.5);
	}
	
	
	 return col;
}
void main( void ) {

	// This is a reimplementation of this thing:
	// http://mainisusuallyafunction.blogspot.no/2011/10/quasicrystals-as-sums-of-waves-in-plane.html
	
	vec2 p = ( gl_FragCoord.xy ) / 2.0 + mouse * resolution*0.7;

	p += 414132.;
	p *= .01;
	float r = 0.0;
	float g = 0.0;
	float b = 0.0;

	for (float i = 0.0; i < N; ++i) {
		float a = i * (2.0 * M_PI / N);
		float t = cos((p.x * cos(a) + p.y * sin(a)) + time ) / 2.0;
		r += t + 0.5 + 0.2 * i;
		g += t + 1.0 + 0.4 * i;
		b += t + 1.5 + 0.6 * i;
	}
	
	r = post_process(r);
	g = post_process(g);
	b = post_process(b);
	vec3 c = swr(vec3(g,g,g)+swr(vec3(g,g,g)));

	gl_FragColor = vec4( c, 1.0 );

}
