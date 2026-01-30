#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 normalizeUV(vec2 uv) { return vec2(uv.x*resolution.x / resolution.y, uv.y); }

float Circle(vec2 uv, float r, float blur, vec2 displacement) {
	uv -= displacement;
	uv = normalizeUV(uv);
	float d = length(uv);
	
	float c = smoothstep(r, r-blur, d);
	
	return c;
}

float Smiley(vec2 uv, float r) {

	float mask = Circle(uv, r, .01, vec2(0));
	
	mask -= Circle(uv, r/4., .01, vec2(r/4.,r/4.));
	mask -= Circle(uv, r/4., .01, vec2(-r/4.,r/4.));
	
	float mouth = Circle(uv, r*.75, .01, vec2(0, -r/8.));
	
	mouth -= Circle(uv, r*.75, .01, vec2(0., r/4. - r/8.));
	
	if (mask == 1.) mask -= mouth;
	
	return mask;
}

void main( )
{
	vec3 color = vec3(1.,0,1.);
	
	float r = .1;
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv.y -= 1. - r;
	uv.x -= r/2.;
	
	float c = 0.;
	
	bool row = false;
	for (float y = 0.; y < 1.; y += 1./5.) 
	{
		for (float x = 0.; x > -1.1; x -= 0.7/10.) // Very Dangerous
		{
			if (row) c += Smiley(vec2(uv.x+x+mod(-time/10.,.1),uv.y+y), r);
			else c += Smiley(vec2(uv.x+x+mod(time/10.,.1),uv.y+y), r);
		}
		row = !row;
	}
	
    	vec3 col = color * c;
 
	gl_FragColor = vec4(col,1.);
}