// Skid Refragmenter, thatotherguy 2015
// more hax

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buf;

const float num = 24.0;
const float zoom = 0.99;
const float fade = 0.97;


void main(void)
{
	vec2 position = (gl_FragCoord.xy / resolution.xy - 0.5) * vec2(resolution.x / resolution.y, 1.0);
	vec2 texel = gl_FragCoord.xy / resolution;
	float c = 1.0;
	for (float i = 1.0; i <= num; ++i)
	{
		vec2 skew = vec2(cos(time*0.03),sin(time*0.03))*0.2+0.7;
		float a = i / num;
		float t = (time+77.)*sin(i*num)*0.3;
		float r = smoothstep(a, a + (cos(t * skew.y)*0.5+0.5) * skew.x, length(position));
		float seg = r * smoothstep(0.005, 0.0001, dot(position, vec2(cos(t),sin(t))));
		c = abs(c - seg);
	}
	float next = max(texture2D(buf, (texel-0.5)*zoom+0.5).a * fade, c);
	vec3 col = 0.01/(abs(next-0.6)) * vec3(1.0,0.001,0.001)
			+ 0.01/(abs(next-0.85)) * vec3(0.001,0.001,1.0);
	gl_FragColor = vec4(col, next);
	
	//composition debug view
	//gl_FragColor = vec4(next);
	//sweeps debug view
	//gl_FragColor = vec4(c);
	//both
	//gl_FragColor = vec4(texel.x < mouse.x ? next : c);
}