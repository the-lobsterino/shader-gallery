#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;
varying vec2 surfacePosition;

vec3 hsv2rgb(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void)
{
	vec2 uv = surfacePosition * 2.0;
	float zx = uv.x;
	float zy = uv.y;
	float cx = sin(time*0.02);
	float cy = cos(time*-0.04);
	bool escaped = false;
	int lastiter = 0;
	float lastx = 1.0;
	float lasty = 0.0;
	for (int j = 0; j < 256; ++j)
	{
		if (zx*zx+zy*zy >= 4.0 && !escaped)
		{
			lastiter = j;
			lastx = zx;
			lasty = zy;
			escaped = true;
		}
		float ztx = zx*zx - zy*zy;
		float zty = (zx+zy)*(zx+zy) - zx*zx - zy*zy;
		zx = ztx*ztx - zty*zty + cx;
		zy = (ztx+zty)*(ztx+zty) - ztx*ztx - zty*zty + cy;
	}
		
	gl_FragColor = vec4(hsv2rgb(vec3(atan(lasty,lastx)/6.2831853+fract(time*0.15),1.0-float(lastiter)/256.0, 1.0)), 1.0);

}