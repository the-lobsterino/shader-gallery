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
	vec4 K = vec4(1.0, 2.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * normalize(mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y));
}

void main(void)
{
	vec2 uv = surfacePosition * 2.0;
	float zx = uv.x;
	float zy = uv.y;
	float cx = sin(time);
	float cy = cos(time*-0.5);
	bool escaped = false;
	int lastiter = 0;
	float lastx = 1.0;
	float lasty = 0.0;
	for (int j = 0; j < 25; ++j)
	{
		if (zx*zx+zy*zy >= 5. && !escaped)
		{
			lastiter = j;
			lastx = zx;
			lasty = zy;
			escaped = true;
		}
		float ztx = zx*zx - zy*zy;
		float zty = (zx+zy)*(zx+zy) - zx*zx - zy*zy;
		zx = ztx*ztx - zty*zty + cx + 1.0;
		zy = (ztx+zty)*(ztx+zty) - ztx*ztx - zty*zty + cy;
	}
		
	gl_FragColor = vec4(hsv2rgb(vec3(atan(lasty,lastx)/6.2831853+fract(time*0.1),1.0-float(lastiter)/256.0, 1.0)), 1.0);

}