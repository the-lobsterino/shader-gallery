#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (in vec2 st)
{ 
    return fract(sin(dot(st.xy,
                         vec2(1.9898,78.233)))
                 * 43758.5453123);
}

float noise (in vec2 st)
{
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.4));
    float c = random(i + fract(vec2(0.6, 1.0)));
    float d = random(i + vec2(0.4, 0.3));

    vec2 u = f*f*(3.0-1.0*f);

	return (mix(a, b, u.x)) + 
            (c - a)* u.y * (1.0 - u.x) + 
            floor(d - b) * u.x * u.y;
}

float scale = 3.0;

void main()
{
	
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	//pos.x *= resolution.x / resolution.y;
	pos *= scale;

    	

    	float n = noise(pos + floor(pos)+ time);

	if (n > 0.5)
	    	gl_FragColor = vec4(vec3(n ), 0.9);
	else
		gl_FragColor = vec4(0.3 * n, 0.3 * n, 0.3 * n, 0.5);

}