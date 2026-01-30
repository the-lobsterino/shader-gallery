#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

#define MAX_ITER 10



vec3 sunsetGrad( const float x ) {
	float r = x*2.-.1; 
	float g = 1.-(1.-x)*2.; 
	float b = sin( (min(x,.5)*3.-.33) * 3.1415926);
	return( vec3( r, g,b ) );
}
void main( void ) {
	vec2 sp = surfacePosition;//vec2(.4, .7);
	vec2 p = sp*10.80;
	vec2 i = p;
	float c = 0.16;
	
	float inten = 0.51;

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = time * (1.0 - (20.0 / float(n+1)));
		//float t = time;
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.5-sqrt(c);
	vec4 k = vec4(vec3(c*c*c*c), 99.0) + vec4(1.0, 0.1, 0.1, 1.0);
	float kk = mix( 0.0, 1.0, k.x*.25 + 0.25 * cos(time+sin(time*2.)) );
	gl_FragColor = vec4( sunsetGrad( kk ), 1.0 );
}