#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



//////////////////////////GRADE/////////////////////////////////////////
vec4 grade( void ) {
	
	
	//vec3 v = vec3(1,0,0);
	//vec3 d = vec3(1);

	vec2 p =gl_FragCoord.xy / resolution.xy;
		
	vec3 col = vec3(abs((p.y-0.5)*-3.*cos(time)));
	vec3 invrt =  1.0 - col;
	return vec4(invrt,1.);

}

///////////////////////////TRI///////////////////////////////

float rand(vec2 uv)
{
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 uv2tri(vec2 uv)
{
    float sx = uv.x - uv.y / 2.0; // skewed x
    float sxf = fract(sx);
    float offs = step(fract(1.0 - uv.y), sxf);
    return vec2(floor(sx) * 2.0 + sxf + offs, uv.y);
}

float tri(vec2 uv)
{
    float sp = 1.2 + 3.3 * rand(floor(uv2tri(uv)));
    return max(0.0, sin(sp * time));
}

vec4 tri()
{
    vec2 uv = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y;

    float t1 = time / 2.0;
    float t2 = t1 + 0.5;

    float c1 = tri(uv * (2.0 + 4.0 * fract(t1)) + floor(t1));
    float c2 = tri(uv * (2.0 + 4.0 * fract(t2)) + floor(t2));

    return vec4(mix(c1, c2, abs(1.0 - 2.0 * fract(t1))));
}

/////////////////////////MAIN//////////////////////////////////////////

void main()
{
	gl_FragColor = grade() * (tri()*vec4(1.,0.,1.,1.));
}
