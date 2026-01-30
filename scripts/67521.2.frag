// N090920N Fractal waves simplified & colorized

#ifdef GL_ES
precision highp float;
#endif

vec2 uv;

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3 hsv2rgb_smooth( in vec3 c )
{
    	vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing	
	return c.z * mix( vec3(1.0), rgb, c.y);
}

vec3 render_text(vec2 uv) 
{	
	float _d =  1.0-length(uv);
	vec3 ch_color = hsv2rgb_smooth(vec3(time*0.4+uv.y*0.1,0.5,1.0));
	vec3 bg_color = vec3(_d*0.4, _d*0.2, _d*0.1);
	return ch_color; // * bg_color; // color.b;
}


#define MAX_ITERATION 12.
vec3 mandelbrot(vec2 c)
{
	vec2 z = c;
	vec3 count = vec3(0.0);
	float t = time*0.2;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		vec3 rt = render_text(z);
		count += rt;

		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) - count.x*z ; // - z*cos(t)+c*sin(t);
		if (length(z) > 6.0) break;
		
	}

	return count/MAX_ITERATION;
}

void main( void ) {
	vec2 uv = surfacePosition;
	uv *= 8.;		
	vec3 mb = mandelbrot(uv);
	gl_FragColor = vec4(mb, 1.0);
}

